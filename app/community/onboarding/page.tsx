'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/Button'

export default function CommunityOnboarding() {
  return (
    <div className="min-h-screen py-12 px-6 relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
              Community Onboarding
            </span>
          </h1>
          <p className="text-text-muted text-lg">
            This is a placeholder onboarding page. Replace with sign-up, membership, or profile setup later.
          </p>
        </motion.div>

        <div className="rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl p-8 space-y-6">
          <div className="rounded-2xl bg-background/50 border border-border/50 p-5">
            <div className="font-bold mb-1">Step 1 (placeholder)</div>
            <div className="text-text-muted text-sm">Collect user details, interests, city, and goals.</div>
          </div>

          <div className="rounded-2xl bg-background/50 border border-border/50 p-5">
            <div className="font-bold mb-1">Step 2 (placeholder)</div>
            <div className="text-text-muted text-sm">Choose community preferences: topics, alerts, meetups.</div>
          </div>

          <div className="rounded-2xl bg-background/50 border border-border/50 p-5">
            <div className="font-bold mb-1">Step 3 (placeholder)</div>
            <div className="text-text-muted text-sm">Confirm rules + privacy settings.</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary">Continue (placeholder)</Button>
            <Link href="/community">
              <Button variant="outline">Back to Community</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
