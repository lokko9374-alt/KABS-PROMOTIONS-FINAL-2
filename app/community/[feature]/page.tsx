'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Card from '@/components/Card'
import Button from '@/components/Button'

type FeatureKey = 'connect' | 'stories' | 'discussions' | 'meetups' | 'resources' | 'exclusive'

type Config = {
  key: FeatureKey
  title: string
  subtitle: string
  badge: string
  icon: string
  hero: string
  benefits: string[]
  sections: Array<{ title: string; desc: string; items: string[] }>
  form: {
    title: string
    desc: string
    fields: Array<{ name: string; label: string; placeholder: string; type?: 'text' | 'email' | 'textarea' }>
    primaryCta: string
  }
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function makeId() {
  return Math.random().toString(16).slice(2, 8).toUpperCase()
}

export default function CommunityFeaturePage({ params }: { params: { feature: string } }) {
  const prefersReducedMotion = useReducedMotion()

  const data = useMemo<Record<FeatureKey, Config>>(
    () => ({
      connect: {
        key: 'connect',
        title: 'Connect & Network',
        subtitle: 'Meet the right people. Build relationships. Unlock opportunities.',
        badge: 'NETWORK',
        icon: '👥',
        hero:
          'A premium space to connect with diaspora professionals, creatives, founders and families — by city, interest and purpose. Designed for safety, quality, and real outcomes.',
        benefits: ['Curated community', 'City hubs', 'Verified profiles (optional)'],
        sections: [
          {
            title: 'Member Directory',
            desc: 'Browse and connect by city, country and interests.',
            items: ['Search + filters', 'Profiles with socials & niche', 'Save favourites (future)'],
          },
          {
            title: 'Collaboration Board',
            desc: 'Post opportunities and find collaborators.',
            items: ['Projects', 'Event support', 'Media partnerships'],
          },
          {
            title: 'Safety & Quality',
            desc: 'A community is only as good as its standards.',
            items: ['Clear rules', 'Reporting tools', 'Moderation workflow'],
          },
        ],
        form: {
          title: 'Request Access',
          desc: 'Submit your details and we’ll contact you with the next steps.',
          fields: [
            { name: 'name', label: 'Full Name', placeholder: 'Your full name' },
            { name: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
            { name: 'city', label: 'City / Country', placeholder: 'Kampala, Uganda' },
            { name: 'about', label: 'What are you looking to connect for?', placeholder: 'Networking, business, community…', type: 'textarea' },
          ],
          primaryCta: 'Submit Request',
        },
      },

      stories: {
        key: 'stories',
        title: 'Share Your Story',
        subtitle: 'Milestones. Wins. Lessons. The journey.',
        badge: 'STORIES',
        icon: '📖',
        hero:
          'Publish stories that inspire — career wins, cultural journeys, business breakthroughs and community spotlights. Crafted to look great and read well.',
        benefits: ['Featured spotlights', 'Categories & tags', 'Share-ready layouts'],
        sections: [
          { title: 'Story Types', desc: 'Structured formats that help you write clearly.', items: ['Journey story', 'Spotlight', 'Lessons learned'] },
          { title: 'Visibility', desc: 'Choose who sees your story.', items: ['Public', 'Members-only', 'Featured (curated)'] },
          { title: 'Quality', desc: 'Respectful culture and high-signal feed.', items: ['Guidelines', 'Moderation', 'Reporting'] },
        ],
        form: {
          title: 'Submit a Story',
          desc: 'Share a short draft and we can polish it later.',
          fields: [
            { name: 'name', label: 'Your Name', placeholder: 'Your name' },
            { name: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
            { name: 'title', label: 'Story Title', placeholder: 'A short, strong title' },
            { name: 'story', label: 'Your Story Draft', placeholder: 'Write your story here…', type: 'textarea' },
          ],
          primaryCta: 'Submit Story',
        },
      },

      discussions: {
        key: 'discussions',
        title: 'Join Discussions',
        subtitle: 'High-signal conversations that actually help.',
        badge: 'FORUMS',
        icon: '💬',
        hero:
          'Ask questions, share insights, and grow together. Conversations are structured, searchable, and moderated for quality.',
        benefits: ['Topic channels', 'Pinned resources', 'Search + tags'],
        sections: [
          { title: 'Topic Channels', desc: 'Find your lane quickly.', items: ['Jobs & opportunities', 'Business & growth', 'Culture & lifestyle'] },
          { title: 'Thread Quality', desc: 'We prioritise clarity and usefulness.', items: ['Pinned threads', 'Best answers', 'Trending topics'] },
          { title: 'Safety', desc: 'Respect and standards are enforced.', items: ['Community rules', 'Moderation', 'Reports'] },
        ],
        form: {
          title: 'Start a Topic',
          desc: 'Post a topic — we’ll route it to the best channel.',
          fields: [
            { name: 'name', label: 'Your Name', placeholder: 'Your name' },
            { name: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
            { name: 'topic', label: 'Topic Title', placeholder: 'What do you want to discuss?' },
            { name: 'details', label: 'Details', placeholder: 'Add context so people can help…', type: 'textarea' },
          ],
          primaryCta: 'Post Topic',
        },
      },

      meetups: {
        key: 'meetups',
        title: 'Events & Meetups',
        subtitle: 'Go from online to real life.',
        badge: 'MEETUPS',
        icon: '🎉',
        hero:
          'Discover local and virtual meetups. RSVP, connect, and build community in real life — with tools that keep the experience clean and organized.',
        benefits: ['Event discovery', 'RSVP reminders', 'Host tools'],
        sections: [
          { title: 'Discover', desc: 'Find events by city and interest.', items: ['Local events', 'Virtual events', 'Community gatherings'] },
          { title: 'RSVP', desc: 'Simple RSVP flows and reminders.', items: ['Confirmations', 'Updates', 'Calendar integration (future)'] },
          { title: 'Host', desc: 'Organiser tools built-in.', items: ['Host requests', 'Guidelines', 'Attendee management'] },
        ],
        form: {
          title: 'Request to Host an Event',
          desc: 'Send the event details and we’ll follow up.',
          fields: [
            { name: 'name', label: 'Your Name', placeholder: 'Your name' },
            { name: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
            { name: 'event', label: 'Event Name', placeholder: 'Name of the event' },
            { name: 'details', label: 'Event Details', placeholder: 'Date, venue, audience, goal…', type: 'textarea' },
          ],
          primaryCta: 'Send Request',
        },
      },

      resources: {
        key: 'resources',
        title: 'Resources & Support',
        subtitle: 'Guides, mentorship and community support.',
        badge: 'SUPPORT',
        icon: '🤝',
        hero:
          'Access curated resources and mentorship pathways — plus support requests to help people move forward with clarity.',
        benefits: ['Resource library', 'Mentorship pathways', 'Support requests'],
        sections: [
          { title: 'Library', desc: 'Curated content that saves time.', items: ['Templates', 'Guides', 'Trusted links'] },
          { title: 'Mentorship', desc: 'Structured pathways (expandable).', items: ['Mentor categories', 'Office hours (future)', 'Matching (future)'] },
          { title: 'Support', desc: 'Ask for help and get routed properly.', items: ['Support form', 'Volunteer routing', 'Follow-up tracking'] },
        ],
        form: {
          title: 'Request Support',
          desc: 'Submit a request and we’ll respond.',
          fields: [
            { name: 'name', label: 'Your Name', placeholder: 'Your name' },
            { name: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
            { name: 'request', label: 'What do you need help with?', placeholder: 'Tell us what you need…', type: 'textarea' },
          ],
          primaryCta: 'Send Request',
        },
      },

      exclusive: {
        key: 'exclusive',
        title: 'Exclusive Content',
        subtitle: 'Premium perks, early access, priority invitations.',
        badge: 'PERKS',
        icon: '⭐',
        hero:
          'A premium layer for loyal supporters: early drops, behind-the-scenes content, and priority invites — designed to feel truly VIP.',
        benefits: ['Early access', 'VIP drops', 'Partner perks'],
        sections: [
          { title: 'Perks', desc: 'Benefits designed to be felt.', items: ['Priority invites', 'Partner discounts', 'Exclusive drops'] },
          { title: 'Behind the Scenes', desc: 'Closer access to the journey.', items: ['Updates', 'Creator notes', 'Member-only content'] },
          { title: 'Premium Experience', desc: 'Designed to feel clean and special.', items: ['VIP lane (future)', 'Members-only', 'Priority support'] },
        ],
        form: {
          title: 'Membership Interest',
          desc: 'Tell us what you want access to.',
          fields: [
            { name: 'name', label: 'Your Name', placeholder: 'Your name' },
            { name: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email' },
            { name: 'interest', label: 'What perks are you interested in?', placeholder: 'Early invites, BTS, VIP…', type: 'textarea' },
          ],
          primaryCta: 'Submit',
        },
      },
    }),
    []
  ) as any

  const key = (params.feature || '') as FeatureKey
  const cfg = data[key]

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ ref: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formState, setFormState] = useState<Record<string, string>>({})

  if (!cfg) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Page not found</h1>
          <p className="text-text-muted mb-6">That community section doesn’t exist.</p>
          <Link href="/community">
            <Button variant="primary">Back to Community</Button>
          </Link>
        </div>
      </div>
    )
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/community/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: cfg.key,
          payload: formState,
        }),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || 'Request failed.')
      }

      const j = await res.json()
      setSuccess({ ref: j.ref || makeId() })
      setFormState({})
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
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
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-6">
            <Link href="/community" className="text-text-muted hover:text-accent-gold transition-colors text-sm">
              ← Back to Community
            </Link>
          </motion.div>

          {/* HERO */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-10">
            <div className="glass-effect glow-effect rounded-3xl overflow-hidden">
              <div className="relative p-8 sm:p-10">
                <div className="absolute inset-0 glossy-overlay pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{cfg.icon}</span>
                      <span className="px-3 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                        {cfg.badge}
                      </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold">
                      <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                        {cfg.title}
                      </span>
                    </h1>

                    <p className="text-lg text-text-muted max-w-2xl">{cfg.hero}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-text-muted pt-2">
                      {cfg.benefits.map((b) => (
                        <span key={b} className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link href="#form" className="w-full">
                      <Button variant="primary" className="w-full">
                        {cfg.form.primaryCta}
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Talk to Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECTIONS */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {cfg.sections.map((s) => (
              <motion.div
                key={s.title}
                whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
                className="group"
              >
                <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.28)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
                  <div className="p-6 space-y-3 relative z-10">
                    <h2 className="text-xl font-bold group-hover:text-accent-gold transition-colors">{s.title}</h2>
                    <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
                    <ul className="pt-2 space-y-2 text-sm text-text-muted">
                      {s.items.map((i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-accent-gold mt-0.5">•</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* FORM */}
          <motion.section id="form" initial="initial" animate="animate" variants={fadeInUp} className="max-w-4xl mx-auto mt-12">
            <div className="glass-effect glow-effect rounded-3xl overflow-hidden">
              <div className="relative p-8 sm:p-10">
                <div className="absolute inset-0 glossy-overlay pointer-events-none" />

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold">{cfg.form.title}</h2>
                    <p className="text-text-muted mt-2">{cfg.form.desc}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cfg.form.fields.map((f) => {
                        const value = formState[f.name] || ''
                        const isTextArea = f.type === 'textarea'

                        return (
                          <div key={f.name} className={cn(isTextArea && 'md:col-span-2')}>
                            <label className="text-sm text-text-muted">{f.label}</label>
                            {isTextArea ? (
                              <textarea
                                value={value}
                                onChange={(e) => setFormState((p) => ({ ...p, [f.name]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="mt-2 w-full min-h-[120px] px-4 py-3 rounded-2xl bg-background/50 border border-border/50 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all"
                              />
                            ) : (
                              <input
                                value={value}
                                onChange={(e) => setFormState((p) => ({ ...p, [f.name]: e.target.value }))}
                                type={f.type || 'text'}
                                placeholder={f.placeholder}
                                className="mt-2 w-full px-4 py-3 rounded-2xl bg-background/50 border border-border/50 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all"
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {error && <div className="text-red-300 text-sm">{error}</div>}

                    <AnimatePresence>
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="rounded-2xl border border-accent-gold/40 bg-accent-gold/10 p-4"
                        >
                          <div className="font-semibold text-accent-gold">Submitted successfully</div>
                          <div className="text-sm text-text-muted mt-1">
                            Reference: <span className="text-text-primary font-mono">{success.ref}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button variant="primary" className="w-full" disabled={loading}>
                      {loading ? 'Submitting…' : cfg.form.primaryCta}
                    </Button>

                    <div className="text-xs text-text-muted text-center">
                      By submitting, you agree to be contacted about your request.
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="mt-12 text-center text-xs text-text-muted">
            Next step: connect this form to Supabase so submissions are saved permanently and viewable in an admin dashboard.
          </div>
        </div>
      </div>
    </>
  )
}
