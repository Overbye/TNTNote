import { deleteDB, openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Note } from '../domain/note'

interface TNTNoteDB extends DBSchema {
  notes: { key: string; value: Note; indexes: { 'by-updated': string; 'by-owner': Note['owner'] } }
  meta: { key: string; value: { key: string; value: string } }
}

export interface NoteRepository {
  list(owner?: Note['owner']): Promise<Note[]>
  get(id: string): Promise<Note | undefined>
  save(note: Note): Promise<void>
  remove(id: string): Promise<void>
}

let database: Promise<IDBPDatabase<TNTNoteDB>> | undefined
function getDatabase() {
  database ??= openDB<TNTNoteDB>('tntnote', 1, { upgrade(db) {
    const notes = db.createObjectStore('notes', { keyPath: 'id' })
    notes.createIndex('by-updated', 'updatedAt')
    notes.createIndex('by-owner', 'owner')
    db.createObjectStore('meta', { keyPath: 'key' })
  } })
  return database
}

export const noteRepository: NoteRepository = {
  async list(owner = 'guest-local') {
    const notes = await (await getDatabase()).getAllFromIndex('notes', 'by-owner', owner)
    return notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
  async get(id) { return (await getDatabase()).get('notes', id) },
  async save(note) { await (await getDatabase()).put('notes', note) },
  async remove(id) { await (await getDatabase()).delete('notes', id) },
}

export async function resetDatabaseForTests() {
  if (database) (await database).close()
  database = undefined
  await deleteDB('tntnote')
}
