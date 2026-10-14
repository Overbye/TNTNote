export type NoteOwner = 'guest-local' | 'admin-private'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  version: number
  owner: NoteOwner
}

export function createNote(now = new Date()): Note {
  const timestamp = now.toISOString()
  return { id: crypto.randomUUID(), title: '', content: '', createdAt: timestamp, updatedAt: timestamp, version: 1, owner: 'guest-local' }
}

export function noteTitle(note: Pick<Note, 'title' | 'content'>): string {
  const heading = note.content.match(/^#{1,6}\s+(.+)$/m)?.[1]
  const firstLine = note.content.split('\n').find((line) => line.trim())
  return note.title.trim() || heading?.trim() || firstLine?.replace(/^[-*#>\s]+/, '').trim() || '空白便签'
}
