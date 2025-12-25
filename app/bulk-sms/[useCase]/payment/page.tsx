"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/Card"
import Button from "@/components/Button"
import { BulkDraft, BulkUseCaseId, PaymentMethod, draftStorageKey, estimateCost, useCases } from "@/lib/bulkSms"

function readDraft(useCase: BulkUseCaseId) {
  try {
    const raw = localStorage.getItem(draftStorageKey(useCase))
    if (!raw) return null
    return JSON.parse(raw) as BulkDraft
  } catch {
    return null
  }
}

export default function PaymentPage({ params }: { params: { useCase: string } }) {
  const router = useRouter()
  const useCase = params.useCase as BulkUseCaseId
  const uc = useCases.find((u) => u.id === useCase)

  const [draft, setDraft] = useState<BulkDraft | null>(null)
  const [method, setMethod] = useState<PaymentMethod>("paypal")
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(readDraft(useCase))
  }, [useCase])

  const cost = useMemo(() => (draft ? estimateCost(draft) : null), [draft])

  async function pay() {
    if (!draft || !cost) return
    setError(null)
    setIsPaying(true)
    try {
      const res = await fetch("/api/bulk-sms/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase: draft.useCase, method, amount: cost.total, currency: cost.currency }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Payment failed")
      }
      const data = await res.json()
      router.push(`/bulk-sms/${useCase}/success?tx=${encodeURIComponent(data.txId)}&method=${method}`)
    } catch (e: any) {
      setError(e?.message || "Payment failed")
    } finally {
      setIsPaying(false)
    }
  }

  if (!uc) return <div className="min-h-screen p-8">Unknown campaign type.</div>
  if (!draft || !cost) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-text-primary">No draft found. Start from compose.</p>
        <Link className="text-accent-gold underline" href={`/bulk-sms/${useCase}/compose`}>Go to Compose</Link>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-effect{background:rgba(11,18,32,.7);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,.1)}
        .glossy-overlay{background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,rgba(255,255,255,.05) 50%,transparent 100%)}
        .glow-effect{box-shadow:0 0 30px rgba(245,179,1,.2),0 0 60px rgba(245,179,1,.1),inset 0 0 30px rgba(255,255,255,.05)}
      `}} />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-card/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,179,1,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,138,0,0.1),transparent_50%)]" />
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link href={`/bulk-sms/${useCase}/confirm`} className="text-text-muted hover:text-accent-gold transition-colors flex items-center gap-2 mb-6">
              <span>←</span> Back to Confirm
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                Payment
              </span>
            </h1>
            <p className="text-text-muted mt-2">Step 3 of 3 — Choose a payment method.</p>
          </motion.div>

          <div className="glass-effect rounded-3xl overflow-hidden glow-effect">
            <div className="relative p-6 sm:p-8">
              <div className="absolute inset-0 glossy-overlay pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <h2 className="text-2xl font-bold">Payment Method</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "paypal" as const, label: "PayPal", icon: "🅿️" },
                      { id: "mobile_money" as const, label: "Mobile Money", icon: "📲" },
                      { id: "card" as const, label: "Card", icon: "💳" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`px-4 py-4 rounded-2xl border text-left transition-all ${
                          method === m.id
                            ? "border-accent-gold/50 bg-accent-gold/10"
                            : "border-border/50 bg-background/30 hover:border-accent-gold/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{m.icon} {m.label}</span>
                          {method === m.id && <span className="text-accent-gold text-sm font-medium">Selected</span>}
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                          {m.id === "paypal" && "Fast checkout with PayPal."}
                          {m.id === "mobile_money" && "MTN/Airtel & regional mobile money options."}
                          {m.id === "card" && "Visa/Mastercard/AMEX supported."}
                        </p>
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <Button variant="primary" className="w-full" onClick={pay} disabled={isPaying}>
                    {isPaying ? "Processing…" : `Pay ${cost.currency} ${cost.total.toFixed(2)}`}
                  </Button>

                  <p className="text-xs text-text-muted">
                    This is a functional demo flow. Later we’ll connect real PayPal/Mobile Money/Card processors.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <Card className="p-0 overflow-hidden">
                    <div className="rounded-3xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50">
                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-bold">Order Summary</h3>
                        <p className="text-sm text-text-muted"><span className="text-text-primary font-semibold">Use case:</span> {uc.title}</p>
                        <p className="text-sm text-text-muted"><span className="text-text-primary font-semibold">Campaign:</span> {draft.campaignName}</p>
                        <p className="text-sm text-text-muted"><span className="text-text-primary font-semibold">Recipients:</span> {cost.qty}</p>
                        <p className="text-sm text-text-muted"><span className="text-text-primary font-semibold">Segments:</span> {cost.segments}</p>
                        <p className="text-lg">
                          <span className="text-text-primary font-semibold">Total:</span>{" "}
                          <span className="text-accent-gold font-bold">{cost.currency} {cost.total.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
