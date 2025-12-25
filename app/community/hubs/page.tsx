'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import Card from '@/components/Card'
import Button from '@/components/Button'

type Hub = {
  id: string
  name: string
  country: string
  description: string
}

export default function HubsPage() {
  const [userReady, setUserReady] = useState(false)
  const [hubs, setHubs] = useState<Hub[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) {
        window.location.href = '/login'
        return
      }
      setUserReady(true)

      const { data, error } = await supabase
        .from('community_hubs')
        .select('id,name,country,description')
        .order('country', { ascending: true })

      if (error) setError(error.message)
      else setHubs((data || []) as Hub[])
    }

    run()
  }, [])

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
                Diaspora Hubs
              </span>
            </h1>
            <p className="text-text-muted mt-2">Pick a community and start chatting like WhatsApp groups.</p>
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

        {!userReady ? (
          <div className="text-text-muted">Loading…</div>
        ) : error ? (
          <div className="text-red-300">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hubs.map((hub) => (
              <Card key={hub.id} glow>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-accent-gold">{hub.name}</div>
                    <span className="text-xs px-3 py-1 rounded-full bg-accent-gold/15 border border-accent-gold/25 text-accent-gold">
                      {hub.country}
                    </span>
                  </div>
                  <p className="text-text-muted">{hub.description}</p>
                  <Link href={`/community/hubs/${hub.id}`} className="block">
                    <Button variant="primary" className="w-full">
                      Enter Chat
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
