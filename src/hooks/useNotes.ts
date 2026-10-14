import { useCallback, useEffect, useRef, useState } from 'react'
import { createNote, type Note } from '../domain/note'
import { noteRepository, type NoteRepository } from '../data/noteRepository'

export function useNotes(repository: NoteRepository = noteRepository) {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeId, setActiveId] = useState<string>()
  const [ready, setReady] = useState(false)
  const [saveState, setSaveState] = useState<'saved' | 'saving'>('saved')
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    let mounted = true
    const activeTimers = timers.current
    void repository.list().then(async (stored) => {
      if (!mounted) return
      const initial = stored.length ? stored : [createNote()]
      if (!stored.length) await repository.save(initial[0])
      if (!mounted) return
      setNotes(initial); setActiveId(initial[0].id); setReady(true)
    })
    return () => { mounted = false; activeTimers.forEach(clearTimeout) }
  }, [repository])

  const persist = useCallback((note: Note) => {
    const previous = timers.current.get(note.id)
    if (previous) clearTimeout(previous)
    setSaveState('saving')
    timers.current.set(note.id, setTimeout(() => {
      void repository.save(note).then(() => setSaveState('saved'))
      timers.current.delete(note.id)
    }, 350))
  }, [repository])

  const updateActive = useCallback((patch: Pick<Note, 'title' | 'content'>) => {
    setNotes((current) => current.map((note) => {
      if (note.id !== activeId) return note
      const updated = { ...note, ...patch, updatedAt: new Date().toISOString(), version: note.version + 1 }
      persist(updated)
      return updated
    }))
  }, [activeId, persist])

  const addNote = useCallback(() => {
    const note = createNote(); setNotes((current) => [note, ...current]); setActiveId(note.id); void repository.save(note)
  }, [repository])

  const deleteNote = useCallback(async (id: string) => {
    const remaining = notes.filter((note) => note.id !== id)
    await repository.remove(id)
    if (!remaining.length) {
      const replacement = createNote(); await repository.save(replacement); setNotes([replacement]); setActiveId(replacement.id)
    } else {
      setNotes(remaining); if (activeId === id) setActiveId(remaining[0].id)
    }
  }, [activeId, notes, repository])

  return { notes, activeNote: notes.find((note) => note.id === activeId), activeId, ready, saveState, setActiveId, updateActive, addNote, deleteNote }
}
