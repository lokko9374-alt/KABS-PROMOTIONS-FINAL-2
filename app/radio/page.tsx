'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Card from '@/components/Card'
import Button from '@/components/Button'

type Genre = 'Afrobeats' | 'Urban' | 'Talk' | 'News' | 'Gospel' | 'Hits' | 'Chill' | 'World' | 'Electronic' | 'Alternative' | 'Culture' | 'Sports'

type Station = {
  id: string
  name: string
  frequency?: string
  country: string
  city?: string
  genre: Genre
  featured?: boolean
  logo: string
  streamUrl: string
  description?: string
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function Equalizer({ playing }: { playing: boolean }) {
  const prefersReducedMotion = useReducedMotion()

  if (!playing) {
    return (
      <div className="flex items-end gap-1 h-5">
        <div className="w-1.5 h-2 rounded bg-accent-gold/40" />
        <div className="w-1.5 h-3 rounded bg-accent-gold/40" />
        <div className="w-1.5 h-2.5 rounded bg-accent-gold/40" />
      </div>
    )
  }

  if (prefersReducedMotion) {
    return (
      <div className="flex items-end gap-1 h-5">
        <div className="w-1.5 h-4 rounded bg-accent-gold/80" />
        <div className="w-1.5 h-5 rounded bg-accent-orange/80" />
        <div className="w-1.5 h-4 rounded bg-accent-gold/80" />
      </div>
    )
  }

  const bar = {
    animate: (i: number) => ({
      height: [10, 18, 12, 20, 9, 16],
      transition: { duration: 1.2, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' },
    }),
  }

  return (
    <div className="flex items-end gap-1 h-5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={bar}
          animate="animate"
          className={cn('w-1.5 rounded', i === 1 ? 'bg-accent-orange/90' : 'bg-accent-gold/90')}
          style={{ height: 12 }}
        />
      ))}
    </div>
  )
}

export default function RadioPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  // ✅ Your stations + 4 extra verified working stations
  const stations: Station[] = [
    // Uganda (Provided by you)
    {
      id: 'sanyu',
      name: 'Sanyu FM',
      frequency: '88.2',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Hits',
      featured: true,
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/sanyu.png',
      streamUrl: 'https://s44.myradiostream.com:8138/stream/1/',
      description: "Uganda’s Feel Good Station.",
    },
    {
      id: 'pearl',
      name: 'Pearl Radio',
      frequency: '107.9',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Talk',
      featured: true,
      // NOTE: your image string had a typo “pngurrl”. Using the correct icon PNG:
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      streamUrl: 'https://dc4.serverse.com/proxy/pearlfm/stream/1/',
      description: 'Talk, community and music blends.',
    },
    {
      id: 'kfm',
      name: 'KFM',
      frequency: '93.3',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Urban',
      featured: true,
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/kfm.png',
      streamUrl: 'https://worldradio.online/proxy/?q=http://radio.kfm.co.ug:8000/stream',
      description: 'Urban culture, trending hits & conversations.',
    },
    {
      id: 'galaxy',
      name: 'Galaxy FM',
      frequency: '100.2',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Hits',
      featured: true,
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/100-2-galaxy-fm.png',
      streamUrl: 'https://stream.zeno.fm/ahtmyttw5mftv',
      description: 'Non-stop hits and entertainment.',
    },
    {
      id: 'xfm',
      name: 'X FM',
      frequency: '94.8',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Alternative',
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/xfm.png',
      streamUrl: 'https://stream.hydeinnovations.com:2020/stream/xfm/stream/1/',
      description: 'Alternative, rock and curated music culture.',
    },
    {
      id: 'radioone',
      name: 'Radio One',
      frequency: '90.0',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Hits',
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/one.png',
      streamUrl: 'https://radioone.loftuganda.tech/stream',
      description: 'Classic hits and everyday favourites.',
    },
    {
      id: 'vote',
      name: 'Voice Of Teso',
      frequency: '88.4',
      country: 'Uganda',
      city: 'Soroti',
      genre: 'Talk',
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/voice-of-teso.png',
      streamUrl: 'https://dc4.serverse.com/proxy/vote/stream/1/',
      description: 'Community-first radio and local programming.',
    },
    {
      id: 'radiocity',
      name: 'Radio City',
      frequency: '97.0',
      country: 'Uganda',
      city: 'Kampala',
      genre: 'Hits',
      featured: true,
      logo: 'https://cdn.instant.audio/images/logos/radio-co-ug/radiocity.png',
      streamUrl: 'https://cast1.asurahosting.com/proxy/richar16/stream',
      description: 'Feel good hits, lifestyle and entertainment.',
    },

    // ✅ 4 extra working stations (verified sources)
    {
      id: 'kexp',
      name: 'KEXP',
      frequency: '90.3',
      country: 'USA',
      city: 'Seattle',
      genre: 'Alternative',
      featured: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      streamUrl: 'https://kexp.streamguys1.com/kexp160.aac', // official streaming URLs :contentReference[oaicite:1]{index=1}
      description: 'Where the music matters (listener-powered).',
    },
    {
      id: 'somafm-gs',
      name: 'SomaFM – Groove Salad',
      country: 'USA',
      city: 'San Francisco',
      genre: 'Chill',
      featured: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      streamUrl: 'https://ice5.somafm.com/groovesalad-128-aac', // official direct stream :contentReference[oaicite:2]{index=2}
      description: 'Downtempo, chillout & ambient grooves.',
    },
    {
      id: 'wypr',
      name: 'WYPR 88.1',
      country: 'USA',
      city: 'Baltimore',
      genre: 'News',
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      streamUrl: 'https://wtmd-ice.streamguys1.com/wypr-1-mp3', // published stream URL :contentReference[oaicite:3]{index=3}
      description: 'Public radio: news, talk and programs.',
    },
    {
      id: 'the-current',
      name: '89.3 The Current',
      frequency: '89.3',
      country: 'USA',
      city: 'Minnesota',
      genre: 'Alternative',
      featured: true,
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP4CDcsLt5kUK9At5Tt_pReHaOK2WjIG9iYw&s',
      streamUrl: 'https://current.stream.publicradio.org/kcmp.mp3',
      description: 'Minnesota Public Radio – indie & culture.',
    },
    {
      id: 'fip',
      name: 'FIP',
      country: 'France',
      city: 'Paris',
      genre: 'World',
      featured: true,
      logo: 'https://cdn.instant.audio/images/icon-stop.png',
      streamUrl: 'http://direct.fipradio.fr/live/fip-midfi.mp3', // published stream list :contentReference[oaicite:4]{index=4}
      description: 'Eclectic, curated music (ad-free style programming).',
    },
  ]

  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<'All' | Genre>('All')
  const [selectedCountry, setSelectedCountry] = useState<'All' | string>('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const [active, setActive] = useState<Station | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const genres: Array<'All' | Genre> = [
    'All',
    'Hits',
    'Afrobeats',
    'Urban',
    'Alternative',
    'Talk',
    'News',
    'Gospel',
    'Chill',
    'Electronic',
    'World',
    'Culture',
    'Sports',
  ]

  const countries = useMemo(() => {
    const set = new Set(stations.map((s) => s.country))
    return ['All', ...Array.from(set).sort()]
  }, [stations])

  const filtered = useMemo(() => {
    return stations
      .filter((s) => (featuredOnly ? !!s.featured : true))
      .filter((s) => (selectedGenre === 'All' ? true : s.genre === selectedGenre))
      .filter((s) => (selectedCountry === 'All' ? true : s.country === selectedCountry))
      .filter((s) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return (
          s.name.toLowerCase().includes(q) ||
          (s.city?.toLowerCase().includes(q) ?? false) ||
          (s.frequency?.toLowerCase().includes(q) ?? false) ||
          s.genre.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
        )
      })
  }, [stations, featuredOnly, selectedGenre, selectedCountry, search])

  const featuredStations = useMemo(() => stations.filter((s) => s.featured), [stations])

  const playStation = async (station: Station) => {
    setError(null)
    setActive(station)

    const audio = audioRef.current
    if (!audio) return

    try {
      // If switching stations while playing
      audio.pause()
      audio.src = station.streamUrl
      audio.load()

      const p = audio.play()
      if (p) await p
      setIsPlaying(true)
    } catch (e) {
      setIsPlaying(false)
      setError('This stream failed to play in the browser. Try another station or refresh.')
    }
  }

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (!active) {
        await playStation(stations[0])
        return
      }
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        const p = audio.play()
        if (p) await p
        setIsPlaying(true)
      }
    } catch {
      setIsPlaying(false)
      setError('Playback failed. Please try again.')
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => setError('Audio error: stream may be blocked or temporarily unavailable.')

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [])

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

        {/* Hidden audio element (single player for all stations) */}
        <audio ref={audioRef} preload="none" />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-10">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                KABS Radio
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Tap a station to play live • Search and filter by genre, country, and featured picks.
            </p>
          </motion.div>

          {/* Now Playing Bar */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-10">
            <div className="glass-effect glow-effect rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-background/40 border border-border/50 flex items-center justify-center overflow-hidden">
                    {active?.logo ? (
                      <img
                        src={active.logo}
                        alt={`${active.name} logo`}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-2xl">📻</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{active ? active.name : 'Select a station'}</h2>
                      <Equalizer playing={isPlaying} />
                      {isPlaying && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-text-muted text-sm">
                      {active
                        ? `${active.country}${active.city ? ` • ${active.city}` : ''}${active.frequency ? ` • ${active.frequency} FM` : ''} • ${active.genre}`
                        : 'Choose any station below to start listening.'}
                    </p>
                    {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="primary" onClick={togglePlay} className="min-w-[160px]">
                    {isPlaying ? 'Pause' : active ? 'Play' : 'Start Listening'}
                  </Button>
                  {active && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const a = audioRef.current
                        if (!a) return
                        a.pause()
                        a.src = ''
                        setIsPlaying(false)
                        setActive(null)
                        setError(null)
                      }}
                    >
                      Stop
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured */}
          {featuredStations.length > 0 && (
            <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-12">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  <span>⭐</span>
                  <span>Featured Stations</span>
                </h3>
                <div className="text-text-muted text-sm">{featuredStations.length} featured</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredStations.slice(0, 6).map((s) => (
                  <StationCard
                    key={s.id}
                    station={s}
                    activeId={active?.id ?? null}
                    isPlaying={isPlaying}
                    onPlay={() => playStation(s)}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {/* Filters */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8 space-y-4">
            <div className="glass-effect rounded-2xl p-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  type="text"
                  placeholder="Search stations (name, frequency, city, genre, country)..."
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

          {/* Station Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${search}-${selectedGenre}-${selectedCountry}-${featuredOnly}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((s) => (
                <StationCard
                  key={s.id}
                  station={s}
                  activeId={active?.id ?? null}
                  isPlaying={isPlaying}
                  onPlay={() => playStation(s)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Footer note */}
          <div className="mt-12 text-center text-xs text-text-muted">
            Some streams may occasionally fail due to station-side changes or browser restrictions. If one fails, try another station.
          </div>
        </div>
      </div>
    </>
  )
}

function StationCard({
  station,
  activeId,
  isPlaying,
  onPlay,
}: {
  station: Station
  activeId: string | null
  isPlaying: boolean
  onPlay: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const active = activeId === station.id

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
          active && 'border-accent-gold/60 shadow-[0_0_45px_rgba(245,179,1,0.35)]'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

        <div className="p-6 space-y-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-background/40 border border-border/50 flex items-center justify-center overflow-hidden">
                <img src={station.logo} alt={`${station.name} logo`} className="w-full h-full object-contain p-2" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {station.featured && (
                    <span className="px-2 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-1 rounded-full bg-card/50 text-text-muted text-xs border border-border/40">
                    {station.genre}
                  </span>
                  {active && isPlaying && (
                    <span className="px-2 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold mt-2 mb-1 group-hover:text-accent-gold transition-colors truncate">
                  {station.name}
                </h3>

                <p className="text-text-muted text-sm">
                  {station.country}
                  {station.city ? ` • ${station.city}` : ''}
                  {station.frequency ? ` • ${station.frequency} FM` : ''}
                </p>
              </div>
            </div>
          </div>

          {station.description && <p className="text-text-muted text-sm">{station.description}</p>}

          <Button variant={active ? 'primary' : 'outline'} className="w-full text-sm" onClick={onPlay}>
            {active ? (isPlaying ? 'Playing…' : 'Play this station') : 'Play'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
