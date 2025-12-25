'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Card from '@/components/Card'
import Button from '@/components/Button'

// Types
interface Event {
  id: string
  title: string
  date: string
  time?: string
  location: string
  venue?: string
  description: string
  longDescription?: string
  imageUrl: string
  tag: string
  category: 'Music' | 'Culture' | 'Business' | 'Community' | 'Arts' | 'Food'
  featured?: boolean
  tiktokUrl?: string
  ticketUrl?: string
  status: 'upcoming' | 'past' | 'live'
  attendees?: number
  price?: string
}

interface TikTokEmbed {
  id: string
  eventId: string
  url: string
  thumbnail?: string
  caption?: string
}

// Event Data - You can replace the first 3 with your real events
const eventsData: Event[] = [
  // Featured events with TikTok highlights (you'll provide 3 real ones)
  {
    id: '1',
    title: 'AfroBeats Festival 2024',
    date: 'March 15, 2024',
    time: '6:00 PM',
    location: 'London, UK',
    venue: 'O2 Arena',
    description: 'A celebration of African music and culture featuring top artists from across the diaspora.',
    longDescription: 'Join us for an unforgettable night of AfroBeats, Amapiano, and African music. Featuring performances by Burna Boy, Wizkid, and special guests. Experience the rhythm, feel the culture, and celebrate with thousands of music lovers.',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    tag: 'Music',
    category: 'Music',
    featured: true,
    tiktokUrl: 'https://www.tiktok.com/@kaberex1/video/7582863908508142879',
    ticketUrl: '#',
    status: 'past',
    attendees: 15000,
    price: '£45 - £150',
  },
  {
    id: '2',
    title: 'Cultural Heritage Gala',
    date: 'April 20, 2024',
    time: '7:00 PM',
    location: 'New York, USA',
    venue: 'Metropolitan Museum',
    description: 'An elegant evening celebrating African heritage with food, music, and art.',
    longDescription: 'A sophisticated gathering celebrating the rich tapestry of African heritage. Enjoy curated art exhibitions, live performances, and a culinary journey through the diaspora. Black tie optional.',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    tag: 'Culture',
    category: 'Culture',
    featured: true,
    tiktokUrl: '', // Add your TikTok URL here
    ticketUrl: '#',
    status: 'past',
    attendees: 500,
    price: '$75 - $200',
  },
  {
    id: '3',
    title: 'Community Empowerment Summit',
    date: 'May 10, 2024',
    time: '9:00 AM',
    location: 'Toronto, Canada',
    venue: 'Convention Centre',
    description: 'Join leaders and activists for discussions on community development and empowerment.',
    longDescription: 'A full-day summit bringing together thought leaders, entrepreneurs, and community organizers. Featuring keynote speakers, panel discussions, networking sessions, and workshops on building stronger diaspora communities.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    tag: 'Business',
    category: 'Business',
    featured: true,
    tiktokUrl: '', // Add your TikTok URL here
    ticketUrl: '#',
    status: 'past',
    attendees: 1200,
    price: 'CAD $50 - $150',
  },
  // Additional events
  {
    id: '4',
    title: 'Diaspora Food Festival',
    date: 'June 8, 2024',
    time: '12:00 PM',
    location: 'Atlanta, USA',
    venue: 'Centennial Olympic Park',
    description: 'A culinary celebration of African diaspora cuisine from across the globe.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    tag: 'Food',
    category: 'Food',
    status: 'upcoming',
    attendees: 5000,
    price: '$25 - $75',
  },
  {
    id: '5',
    title: 'AfroFuturism Art Exhibition',
    date: 'June 15, 2024',
    time: '10:00 AM',
    location: 'Los Angeles, USA',
    venue: 'The Broad Museum',
    description: 'Exploring the intersection of African culture and futuristic visions through art.',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
    tag: 'Arts',
    category: 'Arts',
    status: 'upcoming',
    price: '$20 - $40',
  },
  {
    id: '6',
    title: 'Reggae & Dancehall Night',
    date: 'July 4, 2024',
    time: '8:00 PM',
    location: 'Miami, USA',
    venue: 'Club LIV',
    description: 'Vibes and good energy with the best reggae and dancehall DJs.',
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop',
    tag: 'Music',
    category: 'Music',
    status: 'upcoming',
    price: '$30 - $80',
  },
  {
    id: '7',
    title: 'African Fashion Week',
    date: 'July 20, 2024',
    time: '6:00 PM',
    location: 'Paris, France',
    venue: 'Palais de Tokyo',
    description: 'Showcasing the best of African and diaspora fashion designers.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop',
    tag: 'Culture',
    category: 'Culture',
    status: 'upcoming',
    price: '€50 - €150',
  },
  {
    id: '8',
    title: 'Tech Diaspora Summit',
    date: 'August 5, 2024',
    time: '9:00 AM',
    location: 'San Francisco, USA',
    venue: 'Moscone Center',
    description: 'Connecting African diaspora tech professionals and entrepreneurs.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
    tag: 'Business',
    category: 'Business',
    status: 'upcoming',
    price: '$100 - $300',
  },
  {
    id: '9',
    title: 'Soul Food Sunday Brunch',
    date: 'August 18, 2024',
    time: '11:00 AM',
    location: 'Chicago, USA',
    venue: 'The Signature Room',
    description: 'A delicious brunch celebrating soul food traditions and community.',
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=600&fit=crop',
    tag: 'Food',
    category: 'Food',
    status: 'upcoming',
    price: '$45 - $95',
  },
  {
    id: '10',
    title: 'Jazz & Blues Heritage Night',
    date: 'September 2, 2024',
    time: '7:30 PM',
    location: 'New Orleans, USA',
    venue: 'Preservation Hall',
    description: 'Celebrating the African roots of jazz and blues music.',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
    tag: 'Music',
    category: 'Music',
    status: 'upcoming',
    price: '$35 - $85',
  },
  {
    id: '11',
    title: 'Diaspora Film Festival',
    date: 'September 15, 2024',
    time: '6:00 PM',
    location: 'Toronto, Canada',
    venue: 'TIFF Bell Lightbox',
    description: 'Showcasing films by African diaspora filmmakers from around the world.',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
    tag: 'Arts',
    category: 'Arts',
    status: 'upcoming',
    price: 'CAD $25 - $60',
  },
  {
    id: '12',
    title: 'Community Health Fair',
    date: 'October 5, 2024',
    time: '10:00 AM',
    location: 'Houston, USA',
    venue: 'George R. Brown Convention Center',
    description: 'Free health screenings, wellness workshops, and community resources.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    tag: 'Community',
    category: 'Community',
    status: 'upcoming',
    price: 'Free',
  },
  {
    id: '13',
    title: 'Amapiano Takeover',
    date: 'October 20, 2024',
    time: '9:00 PM',
    location: 'Johannesburg, South Africa',
    venue: 'Constitution Hill',
    description: 'The biggest Amapiano event of the year with international DJs.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    tag: 'Music',
    category: 'Music',
    status: 'upcoming',
    price: 'R200 - R500',
  },
  {
    id: '14',
    title: 'Black Excellence Awards',
    date: 'November 10, 2024',
    time: '6:00 PM',
    location: 'London, UK',
    venue: 'Grosvenor House',
    description: 'Celebrating outstanding achievements in the African diaspora community.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    tag: 'Culture',
    category: 'Culture',
    status: 'upcoming',
    price: '£100 - £300',
  },
  {
    id: '15',
    title: 'Kwanzaa Celebration',
    date: 'December 26, 2024',
    time: '4:00 PM',
    location: 'Brooklyn, USA',
    venue: 'Brooklyn Museum',
    description: 'A week-long celebration of Kwanzaa with daily events and activities.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    tag: 'Culture',
    category: 'Culture',
    status: 'upcoming',
    price: 'Free - $25',
  },
]

// TikTok Embed Component - Using iframe with proper embed URL
function TikTokEmbed({ url, className = '' }: { url: string; className?: string }) {
  if (!url) return null

  // Extract video ID from URL
  const videoIdMatch = url.match(/\/video\/(\d+)/)
  if (!videoIdMatch) {
    // Fallback: try to extract from shortened URL
    return (
      <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-card/50 flex items-center justify-center ${className}`}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-gold hover:underline"
        >
          Watch on TikTok
        </a>
      </div>
    )
  }

  const videoId = videoIdMatch[1]
  // Use TikTok's embed URL - this format works better for inline playback
  const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden bg-card/50 ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-full border-0"
        allow="encrypted-media; autoplay; clipboard-write;"
        allowFullScreen
        title="TikTok video"
        style={{ borderRadius: '1rem' }}
      />
    </div>
  )
}

// Event Card Component with Glassmorphism
function EventCard({ event, onViewDetails }: { event: Event; onViewDetails: (event: Event) => void }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
      className="group"
    >
      <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.3)]">
        {/* Glossy overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
              event.status === 'live' 
                ? 'bg-red-500/90 text-white animate-pulse' 
                : event.status === 'upcoming'
                ? 'bg-accent-gold/90 text-background'
                : 'bg-text-muted/50 text-text-primary'
            }`}>
              {event.status === 'live' ? '🔴 LIVE' : event.status === 'upcoming' ? 'Upcoming' : 'Past'}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md text-accent-gold text-xs font-medium border border-accent-gold/30">
              {event.tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-gold transition-colors">
              {event.title}
            </h3>
            <div className="space-y-2 text-sm text-text-muted">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date} {event.time && `• ${event.time}`}
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.venue ? `${event.venue}, ${event.location}` : event.location}
              </p>
              {event.attendees && (
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {event.attendees.toLocaleString()} attendees
                </p>
              )}
            </div>
          </div>

          <p className="text-text-muted text-sm line-clamp-2">{event.description}</p>

          {event.price && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-accent-gold font-semibold">{event.price}</span>
              {event.status === 'upcoming' && (
                <Button variant="primary" className="text-sm px-4 py-2">
                  Get Tickets
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 text-sm"
              onClick={() => onViewDetails(event)}
            >
              View Details
            </Button>
            {event.tiktokUrl && (
             <Button variant="outline" className="text-sm px-4" onClick={() => onViewDetails(event)}>
                🎬 Watch
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main Component
export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showModal, setShowModal] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const categories = ['All', 'Music', 'Culture', 'Business', 'Community', 'Arts', 'Food']

  const filteredEvents = useMemo(() => {
    return eventsData.filter(event => {
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  // Get featured events - show up to 3, prioritizing those with TikTok URLs
  const featuredEvents = eventsData
    .filter(e => e.featured)
    .sort((a, b) => {
      // Prioritize events with TikTok URLs
      if (a.tiktokUrl && !b.tiktokUrl) return -1
      if (!a.tiktokUrl && b.tiktokUrl) return 1
      return 0
    })
    .slice(0, 3)

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
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
      `}} />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                Events
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Discover premium events celebrating African diaspora culture and community
            </p>
          </motion.div>

          {/* Featured TikTok Highlights */}
          {featuredEvents.length > 0 && (
            <motion.section
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span>✨</span>
                <span>Event Highlights</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.3)]">
                      {/* Glossy overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />
                      
                      {/* TikTok Video */}
                      <div className="relative h-64 overflow-hidden">
                        {event.tiktokUrl ? (
                          <TikTokEmbed url={event.tiktokUrl} className="absolute inset-0" />
                        ) : (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                        
                        {/* Category Tag */}
                        <div className="absolute top-4 left-4 z-20">
                          <span className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md text-accent-gold text-xs font-medium border border-accent-gold/30">
                            {event.tag}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4 relative z-10">
                        <div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-gold transition-colors">
                            {event.title}
                          </h3>
                          <div className="space-y-2 text-sm text-text-muted">
                            <p className="flex items-center gap-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {event.date} {event.time && `• ${event.time}`}
                            </p>
                            <p className="flex items-center gap-2">
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {event.venue ? `${event.venue}, ${event.location}` : event.location}
                            </p>
                          </div>
                        </div>

                        <p className="text-text-muted text-sm line-clamp-2">{event.description}</p>

                        <Button 
                          variant="outline" 
                          className="w-full text-sm"
                          onClick={() => handleViewDetails(event)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Filters and Search */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="mb-8 space-y-4"
          >
            {/* Search */}
            <div className="glass-effect rounded-2xl p-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border/50 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'glass-effect text-accent-gold border-2 border-accent-gold/50 glow-effect'
                      : 'bg-card/50 border border-border/50 text-text-muted hover:border-accent-gold/30 hover:text-text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Events Grid */}
          <AnimatePresence mode="wait">
            {filteredEvents.length > 0 ? (
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-text-muted text-xl">No events found matching your criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {showModal && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-effect rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto glow-effect"
              >
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-effect flex items-center justify-center text-text-primary hover:text-accent-gold transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Event Image */}
                  <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
                    <img
                      src={selectedEvent.imageUrl}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>

                  {/* Event Details */}
                  <div className="p-8 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-sm font-medium">
                          {selectedEvent.tag}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedEvent.status === 'live' 
                            ? 'bg-red-500/20 text-red-400' 
                            : selectedEvent.status === 'upcoming'
                            ? 'bg-accent-gold/20 text-accent-gold'
                            : 'bg-text-muted/20 text-text-muted'
                        }`}>
                          {selectedEvent.status === 'live' ? '🔴 LIVE' : selectedEvent.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                        </span>
                      </div>
                      <h2 className="text-4xl font-bold mb-4">{selectedEvent.title}</h2>
                      <div className="space-y-2 text-text-muted">
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {selectedEvent.date} {selectedEvent.time && `• ${selectedEvent.time}`}
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {selectedEvent.venue ? `${selectedEvent.venue}, ${selectedEvent.location}` : selectedEvent.location}
                        </p>
                        {selectedEvent.attendees && (
                          <p className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {selectedEvent.attendees.toLocaleString()} attendees
                          </p>
                        )}
                        {selectedEvent.price && (
                          <p className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {selectedEvent.price}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold mb-3">About This Event</h3>
                      <p className="text-text-muted leading-relaxed">
                        {selectedEvent.longDescription || selectedEvent.description}
                      </p>
                    </div>

                    {/* TikTok Video */}
                    {selectedEvent.tiktokUrl && (
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Event Highlights</h3>
                        <TikTokEmbed url={selectedEvent.tiktokUrl} />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                      {selectedEvent.status === 'upcoming' && selectedEvent.ticketUrl && (
                        <Button variant="primary" href={selectedEvent.ticketUrl} className="flex-1">
                          Get Tickets
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                        Close
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
