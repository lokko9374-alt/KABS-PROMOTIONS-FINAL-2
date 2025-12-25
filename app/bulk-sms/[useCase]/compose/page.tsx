"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import Card from "@/components/Card"
import Button from "@/components/Button"
import {
  BulkDraft,
  BulkUseCaseId,
  calcSegments,
  draftStorageKey,
  estimateCost,
  makeDefaultDraft,
  parseRecipientsFromTextarea,
  useCases,
} from "@/lib/bulkSms"

function readDraft(useCase: BulkUseCaseId) {
  try {
    const raw = localStorage.getItem(draftStorageKey(useCase))
    if (!raw) return null
    return JSON.parse(raw) as BulkDraft
  } catch {
    return null
  }
}

function writeDraft(d: BulkDraft) {
  localStorage.setItem(draftStorageKey(d.useCase), JSON.stringify(d))
}

function parseCSV(text: string) {
  // Very simple CSV: phone,name (header optional)
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (!lines.length) return []
  const start = lines[0].toLowerCase().includes("phone") ? 1 : 0

  const out: { phone: string; name?: string }[] = []
  for (let i = start; i < lines.length; i++) {
    const [phone, name] = lines[i].split(",").map((x) => (x || "").trim())
    if (phone) out.push({ phone, name })
  }
  // Dedup by phone
  const map = new Map<string, { phone: string; name?: string }>()
  for (const r of out) map.set(r.phone, r)
  return Array.from(map.values())
}

export default function ComposePage({ params }: { params: { useCase: string } }) {
  const prefersReducedMotion = useReducedMotion()
  const useCase = params.useCase as BulkUseCaseId
  const uc = useCases.find((u) => u.id === useCase)

  const [draft, setDraft] = useState<BulkDraft>(() => makeDefaultDraft(useCase))
  const [recipientsText, setRecipientsText] = useState("")
  const [csvName, setCsvName] = useState<string>("")
  const [csvError, setCsvError] = useState<string | null>(null)

  useEffect(() => {
    if (!uc) return
    const saved = readDraft(useCase)
    setDraft(saved || makeDefaultDraft(useCase))
  }, [useCase, uc])

  useEffect(() => {
    // Persist
    if (!draft?.useCase) return
    writeDraft(draft)
  }, [draft])

  const segments = useMemo(() => calcSegments(draft.message), [draft.message])
  const cost = useMemo(() => estimateCost(draft), [draft])

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

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
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

        <div className="max-w-7xl mx-auto">
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
            <Link href="/bulk-sms" className="text-text-muted hover:text-accent-gold transition-colors flex items-center gap-2 mb-6">
              <span>←</span> Back to Bulk SMS
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold bg-clip-text text-transparent">
                {uc.icon} {uc.title}
              </span>
            </h1>
            <p className="text-text-muted mt-2">
              Step 1 of 3 — Customize your message and recipients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Compose */}
            <motion.div initial="initial" animate="animate" variants={fadeInUp} className="lg:col-span-7">
              <div className="glass-effect rounded-3xl overflow-hidden glow-effect">
                <div className="relative p-6 sm:p-8">
                  <div className="absolute inset-0 glossy-overlay pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-text-muted mb-2">Campaign name</label>
                        <input
                          value={draft.campaignName}
                          onChange={(e) => setDraft({ ...draft, campaignName: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-muted mb-2">Sender ID</label>
                        <input
                          value={draft.senderId}
                          onChange={(e) => setDraft({ ...draft, senderId: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
                        />
                        <p className="text-xs text-text-muted mt-2">Example: KABS, KABSPromo, YourBrand</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-muted mb-2">Message</label>
                      <textarea
                        value={draft.message}
                        onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                        rows={8}
                        className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
                      />
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-text-muted">
                        <span className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">
                          Personalize: {"{name}"}
                        </span>
                        <span className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">
                          Length: {draft.message.length} chars
                        </span>
                        <span className="px-3 py-2 rounded-xl bg-background/50 border border-border/50">
                          Segments: {segments} (160 chars each)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-muted mb-2">Recipients (paste numbers)</label>
                      <textarea
                        value={recipientsText}
                        onChange={(e) => setRecipientsText(e.target.value)}
                        placeholder="+2567xxxxxxx&#10;+1xxxxxxxxxx&#10;2567xxxxxxx"
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/40"
                      />
                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => {
                            const recipients = parseRecipientsFromTextarea(recipientsText)
                            setDraft({ ...draft, recipients })
                          }}
                        >
                          Import from Paste
                        </Button>

                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={async (e) => {
                              setCsvError(null)
                              const file = e.target.files?.[0]
                              if (!file) return
                              setCsvName(file.name)
                              const text = await file.text()
                              const recipients = parseCSV(text)
                              if (!recipients.length) {
                                setCsvError("CSV looks empty. Expected columns: phone,name")
                                return
                              }
                              setDraft({ ...draft, recipients })
                            }}
                          />
                          <span className="inline-flex">
                            <Button variant="outline" type="button">
                              Upload CSV
                            </Button>
                          </span>
                        </label>
                      </div>
                      {csvName && <p className="text-xs text-text-muted mt-2">Loaded: {csvName}</p>}
                      {csvError && (
                        <p className="text-xs text-red-300 mt-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                          {csvError}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link href={`/bulk-sms/${useCase}/confirm`} className="w-full">
                        <Button variant="primary" className="w-full" disabled={draft.recipients.length === 0 || !draft.message.trim()}>
                          Continue to Confirm
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={() => setDraft(makeDefaultDraft(useCase))}
                      >
                        Reset Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Summary */}
            <motion.div initial="initial" animate="animate" variants={fadeInUp} className="lg:col-span-5">
              <Card className="p-0 overflow-hidden">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                  <div className="p-6 space-y-5 relative">
                    <h2 className="text-2xl font-bold">Summary</h2>

                    <div className="space-y-2 text-sm text-text-muted">
                      <p>
                        <span className="text-text-primary font-semibold">Campaign:</span> {draft.campaignName}
                      </p>
                      <p>
                        <span className="text-text-primary font-semibold">Sender ID:</span> {draft.senderId}
                      </p>
                      <p>
                        <span className="text-text-primary font-semibold">Recipients:</span> {draft.recipients.length}
                      </p>
                      <p>
                        <span className="text-text-primary font-semibold">Segments:</span> {cost.segments}
                      </p>
                      <p>
                        <span className="text-text-primary font-semibold">Estimated total:</span> {cost.currency} {cost.total.toFixed(2)}
                      </p>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-text-muted mb-2">Preview</p>
                      <div className="rounded-2xl bg-background/40 border border-border/50 p-4 text-sm text-text-primary whitespace-pre-wrap">
                        {draft.message.replace("{name}", "Monica")}
                      </div>
                      <p className="text-xs text-text-muted mt-2">
                        Tip: Use {"{name}"} to personalize recipients (CSV can include names).
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
