'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { notFound, useParams } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Card from '@/components/Card'
import Button from '@/components/Button'

type FeatureKey = 'network' | 'stories' | 'forums' | 'meetups' | 'support' | 'perks'

type CommunityGroup = {
  id: string
  name: string
  country: string
  city?: string
  description: string
  members: number
  featured?: boolean
  tags: string[]
}

type ContentBlock = {
  title: string
  description: string
  placeholderContent: string
}

type Step = {
  title: string
  description: string
  placeholderTip?: string
}

type FeatureConfig = {
  key: FeatureKey
  title: string
  subtitle: string
  icon: string
  tag: string
  heroBadge?: string
  overview: ContentBlock
  blocks: ContentBlock[]
  steps: Step[]
  benefits: string[]
  ctas: {
    primary: { label: string; href: string }
    secondary: { label: string; href: string }
  }
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const GROUPS: CommunityGroup[] = [
  {
    id: 'ug-diaspora',
    name: 'Uganda Community',
    country: 'Uganda',
    city: 'Kampala',
    description: 'Local updates, meetups, opportunities, and culture.',
    members: 1240,
    featured: true,
    tags: ['Kampala', 'Opportunities', 'Events'],
  },
  {
    id: 'usa-diaspora',
    name: 'USA Diaspora',
    country: 'USA',
    city: 'Multiple',
    description: 'Diaspora stories, jobs, events, and support across the US.',
    members: 3820,
    featured: true,
    tags: ['Jobs', 'Meetups', 'Support'],
  },
  {
    id: 'canada-diaspora',
    name: 'Canada Diaspora',
    country: 'Canada',
    city: 'Toronto',
    description: 'Community, connections, and newcomer resources.',
    members: 1580,
    tags: ['Newcomers', 'Toronto', 'Networking'],
  },
  {
    id: 'uae-diaspora',
    name: 'UAE Diaspora',
    country: 'UAE',
    city: 'Dubai',
    description: 'Networking, social events, and diaspora lifestyle.',
    members: 940,
    featured: true,
    tags: ['Dubai', 'Business', 'Events'],
  },
  {
    id: 'saudi-diaspora',
    name: 'Saudi Diaspora',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    description: 'Support, events, and community life in KSA.',
    members: 760,
    tags: ['Riyadh', 'Support', 'Community'],
  },
]

const FEATURE_CONFIG: Record<FeatureKey, FeatureConfig> = {
  network: {
    key: 'network',
    title: 'Connect & Network',
    subtitle: 'Build real connections that turn into opportunities.',
    icon: '👥',
    tag: 'Network',
    heroBadge: 'MEET PEOPLE WHO MOVE LIKE YOU',
    overview: {
      title: 'What this space is for',
      description:
        'This section is built like a WhatsApp-style community hub — organized, searchable, and easy to grow as your audience expands.',
      placeholderContent:
        'Replace this overview with your real mission statement for networking (what you allow, what you don’t allow, and what success looks like).',
    },
    blocks: [
      {
        title: 'Member Directory (Placeholder)',
        description: 'A place to highlight members, businesses, and creators.',
        placeholderContent:
          'Add a future directory here: name, city, skills, business type, and a “Contact” button.',
      },
      {
        title: 'Introduce Yourself (Placeholder)',
        description: 'Help new members break the ice and get welcomed.',
        placeholderContent:
          'Add a welcome template: Name • City • What you do • What you’re looking for.',
      },
      {
        title: 'Opportunities (Placeholder)',
        description: 'Jobs, gigs, collaborations, and volunteering.',
        placeholderContent:
          'Add categories: Jobs • Freelance • Collabs • Volunteering • Mentorship.',
      },
    ],
    steps: [
      {
        title: 'Join a region group',
        description: 'Pick a community (USA, Canada, UAE, Saudi, Uganda) and join in seconds.',
        placeholderTip: 'Later: require login to post, and keep browsing open to everyone.',
      },
      {
        title: 'Post an intro',
        description: 'Tell people who you are, what you do, and what you’re seeking.',
        placeholderTip: 'Later: create an “Intro Wizard” that generates a perfect intro post.',
      },
      {
        title: 'Connect with members',
        description: 'DM or comment to move conversations forward.',
        placeholderTip: 'Later: add verified profiles + business pages.',
      },
    ],
    benefits: [
      '✅ Fast connections (no noise)',
      '⭐ Featured member highlights',
      '🤝 Mentorship and accountability circles',
      '🎉 Local meetups and events',
    ],
    ctas: {
      primary: { label: 'Explore Groups', href: '/community' },
      secondary: { label: 'Back to Community', href: '/community' },
    },
  },

  stories: {
    key: 'stories',
    title: 'Share Your Story',
    subtitle: 'Celebrate wins, document journeys, and inspire others.',
    icon: '📖',
    tag: 'Stories',
    heroBadge: 'TURN YOUR JOURNEY INTO IMPACT',
    overview: {
      title: 'What this space is for',
      description:
        'A story hub where you can publish diaspora journeys, achievements, and lessons — with categories and featured posts.',
      placeholderContent:
        'Replace this with your editorial vision: what kind of stories you want (business, migration, faith, family, education, etc.).',
    },
    blocks: [
      {
        title: 'Featured Stories (Placeholder)',
        description: 'Highlight powerful stories weekly.',
        placeholderContent:
          'Add a “Featured Story” card layout here with author, country, and a cover image.',
      },
      {
        title: 'Submit a Story (Placeholder)',
        description: 'A simple form to submit written stories or video links.',
        placeholderContent:
          'Add fields: Title, Category, Story body, Country, Image, Video link.',
      },
      {
        title: 'Story Categories (Placeholder)',
        description: 'Keep content easy to browse.',
        placeholderContent:
          'Add categories: Business • Culture • Faith • Education • Family • Community.',
      },
    ],
    steps: [
      { title: 'Pick a category', description: 'Choose where your story fits best.' },
      { title: 'Write or upload', description: 'Post text, images, or a video link.' },
      { title: 'Get featured', description: 'Top stories appear on the homepage and newsletters.' },
    ],
    benefits: ['✨ Inspire others', '📌 Build credibility', '🎥 Add video stories', '🧡 Community recognition'],
    ctas: {
      primary: { label: 'Explore Groups', href: '/community' },
      secondary: { label: 'Back to Community', href: '/community' },
    },
  },

  forums: {
    key: 'forums',
    title: 'Join Discussions',
    subtitle: 'Forums that feel like WhatsApp groups — but organized.',
    icon: '💬',
    tag: 'Forums',
    heroBadge: 'ASK. ANSWER. BUILD TOGETHER.',
    overview: {
      title: 'What this space is for',
      description:
        'A discussion zone with topics, pinned posts, and searchable threads — so information doesn’t get lost.',
      placeholderContent:
        'Replace this with your moderation approach and the main topics you want to prioritize.',
    },
    blocks: [
      {
        title: 'Popular Topics (Placeholder)',
        description: 'Help people jump into what’s trending.',
        placeholderContent:
          'Add topics: Immigration • Jobs • Business • Events • Culture • Faith • Relationships.',
      },
      {
        title: 'Pinned Resources (Placeholder)',
        description: 'Keep important info at the top.',
        placeholderContent:
          'Add pinned links: rules, community guide, contact support, verified partners.',
      },
      {
        title: 'Weekly Q&A (Placeholder)',
        description: 'A scheduled AMA (Ask Me Anything).',
        placeholderContent:
          'Add a “Weekly Q&A” module where Kabs answers top questions and highlights best posts.',
      },
    ],
    steps: [
      { title: 'Pick a topic', description: 'Choose a forum category.' },
      { title: 'Post a question', description: 'Ask clearly and include your location/country.' },
      { title: 'Engage', description: 'Reply, react, and save helpful answers.' },
    ],
    benefits: ['🔎 Searchable threads', '📌 Pinned posts', '✅ Verified answers later', '🧠 Learn faster'],
    ctas: {
      primary: { label: 'Explore Groups', href: '/community' },
      secondary: { label: 'Back to Community', href: '/community' },
    },
  },

  meetups: {
    key: 'meetups',
    title: 'Events & Meetups',
    subtitle: 'Find and host meetups in your city or online.',
    icon: '🎉',
    tag: 'Meetups',
    heroBadge: 'MEET IN REAL LIFE',
    overview: {
      title: 'What this space is for',
      description:
        'A dedicated hub for local meetups and virtual events — with RSVP and announcements.',
      placeholderContent:
        'Replace with your event policy: what you host, partner events, safety rules, and ticketing.',
    },
    blocks: [
      {
        title: 'Upcoming Events (Placeholder)',
        description: 'A clean list of upcoming meetups.',
        placeholderContent:
          'Add event cards: Date, Location, Host, Link to RSVP, and highlights.',
      },
      {
        title: 'Host an Event (Placeholder)',
        description: 'Let organizers submit events.',
        placeholderContent:
          'Add a form: Title, Date, City, Venue/Zoom, Ticket link, description.',
      },
      {
        title: 'Local Chapters (Placeholder)',
        description: 'City-based organizing teams.',
        placeholderContent:
          'Add chapters: Kampala • Dubai • Toronto • Minneapolis • Riyadh, etc.',
      },
    ],
    steps: [
      { title: 'Browse events', description: 'Filter by country and city.' },
      { title: 'RSVP', description: 'Get reminders and updates.' },
      { title: 'Share photos', description: 'Post highlights to build energy.' },
    ],
    benefits: ['📍 City-based meetups', '🗓️ Event reminders later', '🎟️ Ticket links', '📸 Post-event highlights'],
    ctas: {
      primary: { label: 'Explore Groups', href: '/community' },
      secondary: { label: 'Back to Community', href: '/community' },
    },
  },

  support: {
    key: 'support',
    title: 'Resources & Support',
    subtitle: 'Guides, help, and mentorship — all in one place.',
    icon: '🤝',
    tag: 'Support',
    heroBadge: 'YOU’RE NOT ALONE',
    overview: {
      title: 'What this space is for',
      description:
        'A resources hub for newcomers and diaspora members — templates, referrals, and mentorship opportunities.',
      placeholderContent:
        'Replace with your main support areas: relocation, jobs, mental health, legal referrals, etc.',
    },
    blocks: [
      {
        title: 'Resource Library (Placeholder)',
        description: 'Documents, links, and templates.',
        placeholderContent:
          'Add: CV templates, interview prep, business registration guides, visa resources.',
      },
      {
        title: 'Mentorship (Placeholder)',
        description: 'Connect mentees to mentors.',
        placeholderContent:
          'Add a matching form: industry, city, availability, goals.',
      },
      {
        title: 'Partner Directory (Placeholder)',
        description: 'Trusted businesses and services.',
        placeholderContent:
          'Add verified partners: lawyers, tax advisors, travel agents, housing, etc.',
      },
    ],
    steps: [
      { title: 'Search resources', description: 'Find what you need fast.' },
      { title: 'Request help', description: 'Submit a support request form.' },
      { title: 'Get matched', description: 'Connect with someone who can help.' },
    ],
    benefits: ['📚 Organized library', '🧩 Mentorship matching later', '✅ Verified partners later', '🛟 Help requests'],
    ctas: {
      primary: { label: 'Explore Groups', href: '/community' },
      secondary: { label: 'Back to Community', href: '/community' },
    },
  },

  perks: {
    key: 'perks',
    title: 'Exclusive Content',
    subtitle: 'Perks, early access, and member-only drops.',
    icon: '⭐',
    tag: 'Perks',
    heroBadge: 'MEMBERS GET MORE',
    overview: {
      title: 'What this space is for',
      description:
        'A premium section for early access content, discounts, tickets, and private live sessions.',
      placeholderContent:
        'Replace with your real perk model: what’s free, what’s paid, and what members get.',
    },
    blocks: [
      {
        title: 'Member Drops (Placeholder)',
        description: 'Exclusive content releases.',
        placeholderContent:
          'Add: early videos, unreleased interviews, behind-the-scenes photos, discounts.',
      },
      {
        title: 'Private Events (Placeholder)',
        description: 'Invite-only Zoom or private meetups.',
        placeholderContent:
          'Add: member-only lives, private Q&A, creator sessions.',
      },
      {
        title: 'Discounts (Placeholder)',
        description: 'Partner discounts and offers.',
        placeholderContent:
          'Add: promo codes, affiliate perks, partner deals.',
      },
    ],
    steps: [
      { title: 'Join membership', description: 'Unlock exclusive benefits.' },
      { title: 'Access content', description: 'See premium posts and early releases.' },
      { title: 'Get perks', description: 'Enjoy discounts and special invites.' },
    ],
    benefits: ['🎬 Early access', '🎟️ Private invites', '💸 Discounts', '🔥 VIP drops'],
    ctas: {
      primary: { label: 'Explore Groups', href: '/community' },
      secondary: { label: 'Back to Community', href: '/community' },
    },
  },
}

const FEATURES_ORDER: Array<{ key: FeatureKey; href: string }> = [
  { key: 'network', href: '/community/network' },
  { key: 'stories', href: '/community/stories' },
  { key: 'forums', href: '/community/forums' },
  { key: 'meetups', href: '/community/meetups' },
  { key: 'support', href: '/community/support' },
  { key: 'perks', href: '/community/perks' },
]

export default function CommunityFeaturePage() {
  const prefersReducedMotion = useReducedMotion()
  const params = useParams<{ feature: string }>()
  const feature = (params?.feature || '') as FeatureKey

  const cfg = FEATURE_CONFIG[feature]
  if (!cfg) return notFound()

  const groupsByCountry = useMemo(() => {
    const map = new Map<string, CommunityGroup[]>()
    for (const g of GROUPS) {
      const arr = map.get(g.country) ?? []
      arr.push(g)
      map.set(g.country, arr)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 28 },
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
          {/* Top Nav */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <Link href="/community" className="text-text-muted hover:text-accent-gold transition-colors text-sm">
                ← Back to Community
              </Link>

              <div className="flex flex-wrap gap-2">
                {FEATURES_ORDER.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                      key === cfg.key
                        ? 'glass-effect text-accent-gold border-2 border-accent-gold/50 glow-effect'
                        : 'bg-card/50 border border-border/50 text-text-muted hover:border-accent-gold/30 hover:text-text-primary'
                    )}
                  >
                    {FEATURE_CONFIG[key].tag}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                {cfg.heroBadge || 'COMMUNITY'}
              </span>
              <span className="px-3 py-1 rounded-full bg-card/50 text-text-muted text-xs font-medium border border-border/50">
                {cfg.tag}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-3">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                {cfg.title}
              </span>
            </h1>

            <p className="text-xl text-text-muted max-w-2xl mx-auto">{cfg.subtitle}</p>
          </motion.div>

          {/* Overview */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-12">
            <div className="glass-effect rounded-3xl overflow-hidden glow-effect">
              <div className="relative p-8 sm:p-10">
                <div className="absolute inset-0 glossy-overlay pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl leading-none">{cfg.icon}</div>
                      <div>
                        <h2 className="text-3xl font-bold">{cfg.overview.title}</h2>
                        <p className="text-text-muted">{cfg.overview.description}</p>
                      </div>
                    </div>

                    <Card className="bg-background/40 border border-border/50">
                      <div className="space-y-2">
                        <p className="text-sm text-text-muted">Client-ready copy (edit anytime):</p>
                        <p className="text-text-primary leading-relaxed">{cfg.overview.placeholderContent}</p>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl bg-background/40 border border-border/50 p-5">
                      <div className="text-sm text-text-muted">Quick actions</div>
                      <div className="mt-3 grid gap-3">
                        <Button variant="primary" href={cfg.ctas.primary.href} className="w-full">
                          {cfg.ctas.primary.label}
                        </Button>
                        <Button variant="outline" href={cfg.ctas.secondary.href} className="w-full">
                          {cfg.ctas.secondary.label}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-background/40 border border-border/50 p-5">
                      <div className="text-sm text-text-muted">What you can customize</div>
                      <ul className="mt-3 space-y-2 text-sm text-text-muted">
                        <li>• Headlines, descriptions, and benefits</li>
                        <li>• Groups and countries</li>
                        <li>• Steps and onboarding flow</li>
                        <li>• Calls-to-action and buttons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Detail Blocks */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cfg.blocks.map((block) => (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
                  className="group"
                >
                  <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.28)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

                    <div className="p-6 space-y-4 relative z-10">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-gold transition-colors">
                          {block.title}
                        </h3>
                        <p className="text-text-muted text-sm">{block.description}</p>
                      </div>

                      <Card className="bg-background/40 border border-border/50">
                        <div className="space-y-2">
                          <p className="text-xs text-text-muted">Placeholder (edit anytime):</p>
                          <p className="text-text-primary text-sm leading-relaxed">{block.placeholderContent}</p>
                        </div>
                      </Card>

                      <Button variant="outline" className="w-full text-sm">
                        Edit Content Later
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Steps + Benefits */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-effect rounded-3xl p-7 glow-effect">
                <h3 className="text-3xl font-bold mb-6">How it works</h3>
                <div className="space-y-4">
                  {cfg.steps.map((s, idx) => (
                    <div key={s.title} className="rounded-2xl bg-background/40 border border-border/50 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl bg-accent-gold/20 text-accent-gold border border-accent-gold/30 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-semibold">{s.title}</div>
                          <div className="text-sm text-text-muted">{s.description}</div>
                          {s.placeholderTip && (
                            <div className="text-xs text-text-muted pt-2">
                              <span className="text-accent-gold">Tip:</span> {s.placeholderTip}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-effect rounded-3xl p-7 glow-effect">
                <h3 className="text-3xl font-bold mb-4">Benefits</h3>
                <p className="text-text-muted mb-5">These are client-ready bullets. Replace anytime.</p>
                <div className="flex flex-wrap gap-3 text-sm text-text-muted">
                  {cfg.benefits.map((b: string) => (
                    <span key={b} className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">
                      {b}
                    </span>
                  ))}
                </div>

                <div className="pt-6 grid gap-3">
                  <Button variant="primary" href={cfg.ctas.primary.href} className="w-full">
                    {cfg.ctas.primary.label}
                  </Button>
                  <Button variant="outline" href={cfg.ctas.secondary.href} className="w-full">
                    {cfg.ctas.secondary.label}
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Region Groups (visible now, login later) */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h3 className="text-3xl font-bold">Communities by Country</h3>
              <div className="text-sm text-text-muted">
                Visible now • Chat will be enabled after you add Supabase/auth
              </div>
            </div>

            <div className="space-y-8">
              {groupsByCountry.map(([country, groups]) => (
                <div key={country} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-text-primary">{country}</h4>
                    <span className="text-xs text-text-muted">{groups.length} group(s)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map((g) => (
                      <motion.div
                        key={g.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
                        className="group"
                      >
                        <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.28)]">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

                          <div className="p-6 space-y-4 relative z-10">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {g.featured && (
                                    <span className="px-2 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                                      Featured
                                    </span>
                                  )}
                                  <span className="px-2 py-1 rounded-full bg-card/50 text-text-muted text-xs border border-border/40">
                                    {country}
                                  </span>
                                </div>

                                <h5 className="text-2xl font-bold mt-2 mb-1 group-hover:text-accent-gold transition-colors truncate">
                                  {g.name}
                                </h5>
                                <p className="text-text-muted text-sm">
                                  {g.city ? `${g.city} • ` : ''}
                                  {g.members.toLocaleString()} members
                                </p>
                              </div>
                            </div>

                            <p className="text-text-muted text-sm">{g.description}</p>

                            <div className="flex flex-wrap gap-2">
                              {g.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-2.5 py-1 rounded-full bg-background/40 border border-border/50 text-xs text-text-muted"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <div className="pt-2 space-y-2">
                              <Button variant="primary" className="w-full text-sm" disabled>
                                Join Group (Login needed)
                              </Button>
                              <Button variant="outline" className="w-full text-sm" disabled>
                                Open Chat (Coming soon)
                              </Button>
                            </div>

                            <div className="text-xs text-text-muted pt-1">
                              This is visible now. You’ll enable real group chat after Supabase is connected.
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-text-muted">
            Tip: This page is fully “client ready” visually. When you’re ready, we’ll connect Supabase for login + group chat.
          </div>
        </div>
      </div>
    </>
  )
}
