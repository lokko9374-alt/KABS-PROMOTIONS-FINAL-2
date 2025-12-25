'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Card from '@/components/Card'
import Button from '@/components/Button'

type Feature = {
  key: string
  title: string
  description: string
  icon: string
  tag: string
  href: string
  bullets: string[]
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function Community() {
  const prefersReducedMotion = useReducedMotion()

  const features: Feature[] = useMemo(
    () => [
      {
        key: 'connect',
        title: 'Connect & Network',
        description:
          'Meet diaspora professionals, creatives, founders and families — by city, niche and shared interests.',
        icon: '👥',
        tag: 'Network',
        href: '/community/connect',
        bullets: ['Member directory', 'City hubs', 'Collaboration board'],
      },
      {
        key: 'stories',
        title: 'Share Your Story',
        description:
          'Publish milestones, wins, lessons and journeys — built to look great on web and social.',
        icon: '📖',
        tag: 'Stories',
        href: '/community/stories',
        bullets: ['Featured spotlights', 'Categories & tags', 'Media-friendly posts'],
      },
      {
        key: 'discussions',
        title: 'Join Discussions',
        description:
          'High-signal conversations on culture, work, life and growth — respectful and well moderated.',
        icon: '💬',
        tag: 'Forums',
        href: '/community/discussions',
        bullets: ['Topic channels', 'Pinned resources', 'Searchable threads'],
      },
      {
        key: 'meetups',
        title: 'Events & Meetups',
        description:
          'Discover local and virtual events, RSVP, and connect in real life. Request to host meetups.',
        icon: '🎉',
        tag: 'Meetups',
        href: '/community/meetups',
        bullets: ['Event listings', 'RSVP reminders', 'Host tools'],
      },
      {
        key: 'resources',
        title: 'Resources & Support',
        description:
          'Curated resources, mentorship pathways and support — designed to help you move faster.',
        icon: '🤝',
        tag: 'Support',
        href: '/community/resources',
        bullets: ['Resource library', 'Mentorship pathways', 'Support requests'],
      },
      {
        key: 'exclusive',
        title: 'Exclusive Content',
        description:
          'Premium perks, early access, behind-the-scenes drops and priority invitations.',
        icon: '⭐',
        tag: 'Perks',
        href: '/community/exclusive',
        bullets: ['Early drops', 'VIP lounge', 'Partner perks'],
      },
    ],
    []
  )

  const fadeInUp = {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .glass-effect {
            background: rgba(11, 18, 32, 0.7);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .glossy-overlay {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.1) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 100%
            );
          }
          .glow-effect {
            box-shadow: 0 0 30px rgba(245, 179, 1, 0.2),
                        0 0 60px rgba(245, 179, 1, 0.1),
                        inset 0 0 30px rgba(255, 255, 255, 0.05);
          }
        `,
        }}
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              A premium diaspora space for connection, conversations, culture, and real opportunities — built with safety and quality in mind.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-text-muted">
              <span className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">✅ Moderated spaces</span>
              <span className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">⭐ Featured spotlights</span>
              <span className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">🎉 Events & meetups</span>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-0 overflow-hidden">
                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.3)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

                      <div className="p-6 space-y-4 relative z-10">
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-4xl leading-none">{feature.icon}</div>
                          <span className="px-3 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                            {feature.tag}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-gold transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
                        </div>

                        <ul className="space-y-2 text-sm text-text-muted">
                          {feature.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-2">
                              <span className="text-accent-gold">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2">
                          <Link href={feature.href} className="w-full">
                            <Button variant="primary" className="w-full text-sm">
                              Explore
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="max-w-4xl mx-auto">
            <div className="glass-effect rounded-3xl overflow-hidden glow-effect">
              <div className="relative p-8 sm:p-10 text-center">
                <div className="absolute inset-0 glossy-overlay pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <span className="px-3 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                    COMMUNITY MEMBERSHIP
                  </span>

                  <h2 className="text-3xl sm:text-4xl font-bold">
                    Join the <span className="text-accent-gold">KABS</span> community
                  </h2>

                  <p className="text-lg text-text-muted max-w-2xl mx-auto">
                    Apply for access and be part of a trusted network built for diaspora excellence, growth, and culture.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/community/connect" className="w-full sm:w-auto">
                      <Button variant="primary" className="w-full sm:w-auto">
                        Get Started
                      </Button>
                    </Link>
                    <Link href="/chat" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Ask Kabs
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}
