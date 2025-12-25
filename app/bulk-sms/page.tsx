"use client"

import Link from "next/link"
import Card from "@/components/Card"
import Button from "@/components/Button"
import { useCases } from "@/lib/bulkSms"

export default function BulkSMS() {
  const prefersReducedMotion = useReducedMotion()

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
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
        .fade-in-up { animation: fadeInUp .6s ease-out both; }

        .glossy-overlay {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
        }
        .glow-effect {
          box-shadow: 0 0 30px rgba(245,179,1,0.2),
                      0 0 60px rgba(245,179,1,0.1),
                      inset 0 0 30px rgba(255,255,255,0.05);
        }`,
        }}
      />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                Bulk SMS
              </span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Choose a campaign type, customize your message, confirm recipients, then pay and send — all in minutes.
            </p>
          </motion.div>

          {/* Use cases */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="mb-14">
            <h2 className="text-3xl font-bold mb-6">Start a Campaign</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((uc) => (
                <motion.div
                  key={uc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="p-0 overflow-hidden">
                    <div className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl transition-all duration-500 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,179,1,0.3)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10" />

                      <div className="p-6 space-y-4 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="text-4xl">{uc.icon}</div>
                          <span className="px-3 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                            Use Case
                          </span>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent-gold transition-colors">
                            {uc.title}
                          </h3>
                          <p className="text-text-muted text-sm leading-relaxed">{uc.description}</p>
                        </div>

                        <Link href={`/bulk-sms/${uc.id}/compose`} className="block">
                          <Button variant="primary" className="w-full">
                            Start {uc.title}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* What you get */}
          <motion.section initial="initial" animate="animate" variants={fadeInUp} className="max-w-3xl mx-auto">
            <div className="glass-effect rounded-3xl overflow-hidden glow-effect">
              <div className="relative p-8 sm:p-10 text-center">
                <div className="absolute inset-0 glossy-overlay pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-bold">What’s Included</h2>
                  <p className="text-lg text-text-muted">
                    Personalization ({`{name}`}), CSV upload, confirmation screen, and a payment page with PayPal, Mobile Money, and Card options.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/bulk-sms/wedding/compose">
                      <Button variant="primary">Try a Wedding Campaign</Button>
                    </Link>
                    <Link href="/bulk-sms/event/compose">
                      <Button variant="outline">Try Event Promotion</Button>
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
