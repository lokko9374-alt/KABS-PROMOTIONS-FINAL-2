'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Card from '@/components/Card'
import Button from '@/components/Button'

type Genre =
  | 'News'
  | 'Entertainment'
  | 'Music'
  | 'Sports'
  | 'Culture'
  | 'Talk'
  | 'Documentary'
  | 'Kids'
  | 'Movies'
  | 'Lifestyle'
  | 'Religious'

type VideoType = 'youtube' | 'vimeo' | 'embed' // embed = already an iframe-ready URL

type TVChannel = {
  id: string
  name: string
  country: string
  city?: string
  genre: Genre
  featured?: boolean
  logo: string
  description?: string

  // Video settings
  videoType: VideoType
  videoUrl: string // can be youtube url, youtube id, vimeo url, or embed url
  live?: boolean
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getEmbedUrl(channel: TVChannel) {
  const raw = channel.videoUrl

  if (channel.videoType === 'youtube') {
    // Accepts:
    // - full youtube URL
    // - already embed URL
    // - or 11-char videoId
    const isEmbed = raw.includes('youtube.com/embed/')
    if (isEmbed) return raw

    const idMatch =
      raw.match(/(?:youtube\.com\/(?:watch\?v=|live\/|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/)?.[1] ||
      (raw.length === 11 ? raw : null)

    return idMatch ? `https://www.youtube.com/embed/${idMatch}?autoplay=1&mute=0&playsinline=1` : raw
  }

  if (channel.videoType === 'vimeo') {
    const isPlayer = raw.includes('player.vimeo.com/video/')
    if (isPlayer) return raw

    const idMatch = raw.match(/vimeo\.com\/(\d+)/)?.[1]
    return idMatch ? `https://player.vimeo.com/video/${idMatch}?autoplay=1` : raw
  }

  // "embed" assumes you already have an iframe-safe URL
  return raw
}

function VideoFrame({ channel }: { channel: TVChannel }) {
  const embed = getEmbedUrl(channel)

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-card/50 border border-border/50">
      <iframe
        src={embed}
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={`${channel.name} player`}
      />
    </div>
  )
}

function ChannelCard({
  channel,
  activeId,
  onPlay,
}: {
  channel: TVChannel
  activeId: string | null
  onPlay: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const isActive = activeId === channel.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
      className="group"
    >
      <div
        className={cn(
          'relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500',
          'hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.28)]',
          isActive && 'border-accent-gold/60 shadow-[0_0_45px_rgba(245,179,1,0.35)]'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl bg-background/40 border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
                <img src={channel.logo} alt={`${channel.name} logo`} className="w-full h-full object-contain p-2" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {channel.featured && (
                    <span className="px-2 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-card/50 text-text-muted text-xs border border-border/40">
                    {channel.genre}
                  </span>
                  {channel.live && (
                    <span className="px-2 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold animate-pulse">
                      🔴 LIVE
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold mt-2 mb-1 group-hover:text-accent-gold transition-colors truncate">
                  {channel.name}
                </h3>

                <p className="text-text-muted text-sm truncate">
                  {channel.country}
                  {channel.city ? ` • ${channel.city}` : ''}
                </p>
              </div>
            </div>
          </div>

          {channel.description && <p className="text-text-muted text-sm">{channel.description}</p>}

          <Button variant={isActive ? 'primary' : 'outline'} className="w-full text-sm" onClick={onPlay}>
            {isActive ? 'Playing…' : 'Watch Live'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function TVPage() {
  const prefersReducedMotion = useReducedMotion()

  // ✅ Add your channels here (YouTube/Vimeo/Embeds)
  // Tip: Use official channels (YouTube Live) for stability.
  const channels: TVChannel[] = [
    // Uganda (examples)
    {
      id: 'nbs-ug',
      name: 'NBS TV (UG)',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'News',
      featured: true,
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@NBSTVUG/live',
      description: 'Live news and updates.',
    },
    {
      id: 'ntv-ug',
      name: 'NTV Uganda',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'News',
      featured: true,
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@NTVUganda/live',
      description: 'Live and top stories.',
    },

    // USA (examples)
    {
      id: 'abc-news-live',
      name: 'ABC News Live',
      country: 'USA',
      genre: 'News',
      featured: true,
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@ABCNews/live',
      description: '24/7 live news coverage.',
    },
    {
      id: 'nasa',
      name: 'NASA Live',
      country: 'USA',
      genre: 'Documentary',
      featured: true,
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@NASA/live',
      description: 'Space, launches, ISS content.',
    },

    // UK (examples)
    {
      id: 'sky-news',
      name: 'Sky News Live',
      country: 'UK',
      genre: 'News',
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@SkyNews/live',
      description: 'Live UK + world news.',
    },

    // Kenya / Africa (examples)
    {
      id: 'ktn',
      name: 'KTN News',
      country: 'Kenya',
      genre: 'News',
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@KTNNewsKE/live',
      description: 'Kenya and global updates.',
    },

    // UAE (examples)
    {
      id: 'al-arabiya',
      name: 'Al Arabiya',
      country: 'UAE',
      genre: 'News',
      live: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      videoType: 'youtube',
      videoUrl: 'https://www.youtube.com/@AlArabiya/live',
      description: 'Arabic news stream.',
    },
  ]

  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<'All' | Genre>('All')
  const [selectedCountry, setSelectedCountry] = useState<'All' | string>('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const [active, setActive] = useState<TVChannel | null>(null)
  const [showModal, setShowModal] = useState(false)

  const genres: Array<'All' | Genre> = [
    'All',
    'News',
    'Entertainment',
    'Music',
    'Sports',
    'Culture',
    'Talk',
    'Documentary',
    'Kids',
    'Movies',
    'Lifestyle',
    'Religious',
  ]

  const countries = useMemo(() => {
    const set = new Set(channels.map((c) => c.country))
    return ['All', ...Array.from(set).sort()]
  }, [channels])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return channels
      .filter((c) => (featuredOnly ? !!c.featured : true))
      .filter((c) => (selectedGenre === 'All' ? true : c.genre === selectedGenre))
      .filter((c) => (selectedCountry === 'All' ? true : c.country === selectedCountry))
      .filter((c) => {
        if (!q) return true
        return (
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          (c.city?.toLowerCase().includes(q) ?? false) ||
          c.genre.toLowerCase().includes(q) ||
          (c.description?.toLowerCase().includes(q) ?? false)
        )
      })
  }, [channels, featuredOnly, selectedGenre, selectedCountry, search])

  const featured = useMemo(() => channels.filter((c) => c.featured), [channels])

  const countriesForTabs = useMemo(() => {
    const set = new Set(channels.map((c) => c.country))
    return Array.from(set).sort()
  }, [channels])

  const fadeInUp = {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const openChannel = (c: TVChannel) => {
    setActive(c)
    setShowModal(true)
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
          .glow-effect {
            box-shadow: 0 0 30px rgba(245,179,1,0.18),
                        0 0 60px rgba(245,179,1,0.10),
                        inset 0 0 30px rgba(255, 255, 255, 0.04);
          }
        `,
        }}
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(245,179,1,0.10),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_85%,rgba(255,138,0,0.10),transparent_55%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-10">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                KABS TV
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Watch live channels in-frame • Search + filter by country, genre, and featured picks.
            </p>
          </motion.div>

          {/* Featured */}
          {featured.length > 0 && (
            <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-12">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  <span>⭐</span>
                  <span>Featured Channels</span>
                </h3>
                <div className="text-text-muted text-sm">{featured.length} featured</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured.slice(0, 6).map((c) => (
                  <ChannelCard key={c.id} channel={c} activeId={active?.id ?? null} onPlay={() => openChannel(c)} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Country Tabs */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-6">
            <div className="glass-effect rounded-2xl p-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCountry('All')}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  selectedCountry === 'All'
                    ? 'text-accent-gold border-2 border-accent-gold/50 glow-effect'
                    : 'bg-card/40 border border-border/50 text-text-muted hover:text-text-primary hover:border-accent-gold/30'
                )}
              >
                All Countries
              </button>

              {countriesForTabs.map((country) => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    selectedCountry === country
                      ? 'text-accent-gold border-2 border-accent-gold/50 glow-effect'
                      : 'bg-card/40 border border-border/50 text-text-muted hover:text-text-primary hover:border-accent-gold/30'
                  )}
                >
                  {country}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8 space-y-4">
            <div className="glass-effect rounded-2xl p-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  type="text"
                  placeholder="Search channels (name, country, city, genre)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border/50 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all"
                />
              </div>

              <div className="mt-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGenre(g)}
                      className={cn(
                        'px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm',
                        selectedGenre === g
                          ? 'glass-effect text-accent-gold border-2 border-accent-gold/50 glow-effect'
                          : 'bg-card/50 border border-border/50 text-text-muted hover:border-accent-gold/30 hover:text-text-primary'
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Country:</span>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-background/50 border border-border/50 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className="bg-background">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setFeaturedOnly((v) => !v)}
                    className={cn(
                      'px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm',
                      featuredOnly
                        ? 'glass-effect text-accent-gold border-2 border-accent-gold/50 glow-effect'
                        : 'bg-card/50 border border-border/50 text-text-muted hover:border-accent-gold/30 hover:text-text-primary'
                    )}
                  >
                    ⭐ Featured only
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${search}-${selectedGenre}-${selectedCountry}-${featuredOnly}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((c) => (
                <ChannelCard key={c.id} channel={c} activeId={active?.id ?? null} onPlay={() => openChannel(c)} />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 text-center text-xs text-text-muted">
            Tip: Use official YouTube Live links for each station for the most reliable “live iframe” experience.
          </div>
        </div>

        {/* Modal Player */}
        <AnimatePresence>
          {showModal && active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-3xl max-w-5xl w-full overflow-hidden glow-effect"
              >
                <div className="p-5 flex items-center justify-between gap-3 border-b border-border/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-background/40 border border-border/50 overflow-hidden flex items-center justify-center">
                      <img src={active.logo} alt="" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-lg truncate">{active.name}</div>
                      <div className="text-xs text-text-muted truncate">
                        {active.country}
                        {active.city ? ` • ${active.city}` : ''} • {active.genre}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                </div>

                <div className="p-5">
                  <VideoFrame channel={active} />

                  {active.description && (
                    <div className="mt-4 text-sm text-text-muted">{active.description}</div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
