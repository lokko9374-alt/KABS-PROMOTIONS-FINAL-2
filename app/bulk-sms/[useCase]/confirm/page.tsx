"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import Card from "@/components/Card"
import Button from "@/components/Button"
import { BulkDraft, BulkUseCaseId, draftStorageKey, estimateCost, useCases } from "@/lib/bulkSms"

function readDraft(useCase: BulkUseCaseId) {
  try {
    const raw = localStorage.getItem(draftStorageKey(useCase))
    if (!raw) return null
    return JSON.parse(raw) as BulkDraft
  } catch {
    return null
  }
}

export default function ConfirmPage({ params }: { params: { useCase: string } }) {
  const useCase = params.useCase as BulkUseCaseId
  const uc = useCases.find((u) => u.id === useCase)

  const [draft, setDraft] = useState<BulkDraft | null>(null)

  useEffect(() => {
    setDraft(readDraft(useCase))
  }, [useCase])

  const cost = useMemo(() => (draft ? estimateCost(draft) : null), [draft])

  if (!uc) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-text-primary">Unknown campaign type.</p>
        <Link href="/bulk-sms" className="text-accent-gold underline">
          Back to Bulk SMS
        </Link>
      </div>
    )
  }

  if (!draft) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-text-primary">No draft found. Start from compose.</p>
        <Link href={`/bulk-sms/${useCase}/compose`} className="text-accent-gold underline">
          Go to Compose
        </Link>
      </div>
    )
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
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              href={`/bulk-sms/${useCase}/compose`}
              className="flex items-center gap-2 text-text-muted hover:text-accent-gold transition-colors mb-6"
            >
              <span>←</span> Back to Compose
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                Confirm Campaign
              </span>
            </h1>
            <p className="text-text-muted mt-2">
              Step 2 of 3 — Review everything before payment.
            </p>
          </motion.div>

          <div className="glass-effect rounded-3xl overflow-hidden glow-effect">
            <div className="relative p-6 sm:p-8">
              <div className="absolute inset-0 glossy-overlay pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Message */}
                  <Card className="p-0 overflow-hidden">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                      <div className="p-6 relative">
                        <h2 className="text-2xl font-bold mb-3">Message</h2>
                        <div className="rounded-2xl bg-background/40 border border-border/50 p-4 whitespace-pre-wrap text-text-primary">
                          {draft.message}
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                          Personalization supported: {"{name}"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Recipients */}
                  <Card className="p-0 overflow-hidden">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                      <div className="p-6 relative">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-2xl font-bold">Recipients</h2>
                          <span className="px-3 py-1.5 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-medium border border-accent-gold/30">
                            {draft.recipients.length} total
                          </span>
                        </div>

                        <div className="mt-4 max-h-56 overflow-auto rounded-2xl bg-background/30 border border-border/50 p-4 text-sm text-text-muted space-y-1">
                          {draft.recipients.slice(0, 40).map((r, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3">
                              <span>{r.name ? `${r.name} — ` : ""}{r.phone}</span>
                            </div>
                          ))}
                          {draft.recipients.length > 40 && (
                            <p className="text-xs text-text-muted mt-2">
                              Showing first 40 recipients…
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right side summary */}
                <div className="lg:col-span-5 space-y-6">
                  <Card className="p-0 overflow-hidden">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                      <div className="p-6 relative space-y-4">
                        <h2 className="text-2xl font-bold">Summary</h2>

                        <div className="space-y-2 text-sm text-text-muted">
                          <p>
                            <span className="text-text-primary font-semibold">Use case:</span> {uc.title}
                          </p>
                          <p>
                            <span className="text-text-primary font-semibold">Campaign:</span> {draft.campaignName}
                          </p>
                          <p>
                            <span className="text-text-primary font-semibold">Sender ID:</span> {draft.senderId}
                          </p>
                          <p>
                            <span className="text-text-primary font-semibold">Recipients:</span> {cost?.qty ?? 0}
                          </p>
                          <p>
                            <span className="text-text-primary font-semibold">Segments:</span> {cost?.segments ?? 1}
                          </p>

                          <div className="pt-2 text-lg">
                            <span className="text-text-primary font-semibold">Total:</span>{" "}
                            <span className="text-accent-gold font-bold">
                              {cost?.currency ?? "USD"} {cost?.total.toFixed(2) ?? "0.00"}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 space-y-3">
                          <Link href={`/bulk-sms/${useCase}/payment`} className="block">
                            <Button variant="primary" className="w-full">
                              Proceed to Payment
                            </Button>
                          </Link>

                          <Link href={`/bulk-sms/${useCase}/compose`} className="block">
                            <Button variant="outline" className="w-full">
                              Edit Campaign
                            </Button>
                          </Link>
                        </div>

                        <p className="text-xs text-text-muted pt-2">
                          Tip: Make sure your Sender ID is approved for Uganda if using an alphanumeric sender.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="glass-effect rounded-2xl p-4">
                    <p className="text-sm text-text-muted">
                      ✅ After payment, you can auto-send or require “Send Now” on the receipt page (your choice).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
