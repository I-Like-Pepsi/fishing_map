
import { defineStore } from 'pinia'

interface Draft {
  id: string
  contentType?: 'image' | 'video' | 'text'
  content: string
  category: string
  images: string[]
  video: { url: string; cover: string } | null
  selectedSpot: any
  createTime: Date
}

interface DraftState {
  currentDraft: Draft | null
  drafts: Draft[]
}

export const useDraftStore = defineStore('draft', {
  state: (): DraftState => ({
    currentDraft: null,
    drafts: []
  }),

  actions: {
    saveDraft(draft: Partial<Draft>) {
      const index = this.drafts.findIndex(d => d.id === draft.id)
      if (index >= 0) {
        this.drafts[index] = { ...this.drafts[index], ...draft }
      } else {
        this.drafts.push({
          id: Date.now().toString(),
          createTime: new Date(),
          ...draft
        } as Draft)
      }
      this.currentDraft = this.drafts[this.drafts.length - 1]
      this.saveToLocal()
    },

    deleteDraft(id: string) {
      this.drafts = this.drafts.filter(d => d.id !== id)
      if (this.currentDraft?.id === id) {
        this.currentDraft = null
      }
      this.saveToLocal()
    },

    clearDraft() {
      this.currentDraft = null
    },

    saveToLocal() {
      localStorage.setItem('fishing-drafts', JSON.stringify(this.drafts))
    },

    loadFromLocal() {
      const data = localStorage.getItem('fishing-drafts')
      if (data) {
        this.drafts = JSON.parse(data)
      }
    }
  }
})
