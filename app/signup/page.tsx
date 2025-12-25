'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    setLoading(false)
    if (error) return setError(error.message)

    // Depending on Supabase email confirmation setting:
    // if confirmation OFF => user is logged in immediately
    router.push('/community/hubs')
  }

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card glow className="p-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-accent-gold to-accent-orange bg-clip-text text-transparent">
              Create Account
            </span>
          </h1>
          <p className="text-text-muted mb-6">Join the diaspora hubs and start chatting.</p>

          {error && <div className="text-red-300 text-sm mb-4">{error}</div>}

          <form onSubmit={signUp} className="space-y-4">
            <input
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text-primary"
              placeholder="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text-primary"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <input
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-text-primary"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />

            <Button variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Sign up'}
            </Button>
          </form>

          <div className="text-sm text-text-muted mt-6 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-gold hover:underline">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
