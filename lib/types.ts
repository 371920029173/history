export interface HistoryEntry {
  id: string
  title?: string
  description?: string
  content?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface CreateHistoryEntry {
  title?: string
  description?: string
  content?: string
  image_url?: string
}

