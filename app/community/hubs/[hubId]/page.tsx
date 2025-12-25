'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import Card from '@/components/Card'
import Button from '@/components/Button'

type MessageRow = {
  id: number
  hub_id: string
  user_id: string
  user_name: string
  message: string
  created_at: string
}

export default function HubChatPage({ params }: { params: { hubId: string } }) {
  const hubId = params.hubId
  const [me, setMe] = useState<{ id: string; name: string } | null>(null)
  const [hubName, setHubName] = useState<string>('Community')
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const sorted = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }, [messages])

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) {
        window.location.href = '/login'
        return
      }

      const displayName =
        (auth.user.user_metadata?.name as string) ||
        auth.user.email?.split('@')[0] ||
        'Member'

      setMe({ id: auth.user.id, name: displayName })

      const { data: hub } = await supabase
        .from('community_hubs')
        .select('name')
        .eq('id', hubId)
        .single()

      if (hub?.name) setHubName(hub.name)

      const { data: initial, error } = await supabase
        .from('community_messages')
        .select('*')
        .eq('hub_id', hubId)
        .order('created_at', { ascending: true })
        .limit(200)

      if (error) setError(error.message)
      setMessages((initial || []) as MessageRow[])

      // Realtime subscription (new message inserts)
      const channel = supabase
        .channel(`hub:${hubId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'community_messages', filter: `hub_id=eq.${hubId}` },
          (payload) => {
            const row = payload.new as MessageRow
            setMessages((prev) => {
              if (prev.some((m) => m.id === row.id)) return prev
              return [...prev, row]
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    init()
  }, [hubId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sorted.length])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me) return
    if (!text.trim()) return

    const msg = text.trim()
    setText('')

    const { error } = await supabase.from('community_messages').insert({
      hub_id: hubId,
      user_id: me.id,
      user_name: me.name,
      message: msg,
    })

    if (error) {
      setError(error.message)
      setText(msg)
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/community/hubs" className="text-sm text-text-muted hover:text-accent-gold transition-colors">
              ← Back to Hubs
            </Link>
            <h1 className="text-3xl font-bold mt-2 text-accent-gold">{hubName}</h1>
            <p className="text-text-muted text-sm">Real-time group chat • logged-in members only</p>
          </div>

          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
          >
            Logout
          </Button>
        </div>

        <Card className="h-[680px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-4">
            {error && <div className="text-red-300 text-sm mb-2">{error}</div>}

            {sorted.map((m) => {
              const mine = me?.id === m.user_id
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 border ${
                      mine
                        ? 'bg-accent-gold text-background border-accent-gold/30'
                        : 'bg-card text-text-primary border-border'
                    }`}
                  >
                    {!mine && (
                      <div className="text-xs text-text-muted mb-1">
                        {m.user_name}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">{m.message}</div>
                    <div className={`text-[10px] mt-2 ${mine ? 'text-background/70' : 'text-text-muted'}`}>
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )
            })}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2 pt-3 border-t border-border">
            <input
              className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-gold transition-colors"
              placeholder="Write a message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" variant="primary">
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
