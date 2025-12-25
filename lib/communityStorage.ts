export type CommunityDraft = {
    id: string
    feature: string
    title: string
    fieldA: string
    fieldB: string
    notes: string
    createdAt: string
    updatedAt: string
  }
  
  const KEY = 'kabs.community.drafts.v1'
  
  function safeParse<T>(value: string | null, fallback: T): T {
    try {
      return value ? (JSON.parse(value) as T) : fallback
    } catch {
      return fallback
    }
  }
  
  export function getDrafts(): CommunityDraft[] {
    if (typeof window === 'undefined') return []
    return safeParse<CommunityDraft[]>(localStorage.getItem(KEY), [])
  }
  
  export function saveDrafts(drafts: CommunityDraft[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(KEY, JSON.stringify(drafts))
  }
  
  export function upsertDraft(draft: CommunityDraft) {
    const drafts = getDrafts()
    const i = drafts.findIndex((d) => d.id === draft.id)
    if (i >= 0) drafts[i] = draft
    else drafts.unshift(draft)
    saveDrafts(drafts)
    return draft
  }
  
  export function deleteDraft(id: string) {
    const drafts = getDrafts().filter((d) => d.id !== id)
    saveDrafts(drafts)
  }
  
  export function draftsByFeature(feature: string) {
    return getDrafts().filter((d) => d.feature === feature)
  }
  