import { describe, expect, it } from 'vitest'
import { createNote, noteTitle } from './note'

describe('note domain', () => {
  it('creates an explicitly isolated guest note', () => {
    const note = createNote(new Date('2026-10-14T12:00:00.000Z'))
    expect(note.owner).toBe('guest-local')
    expect(note.version).toBe(1)
    expect(note.createdAt).toBe(note.updatedAt)
  })
  it('derives a useful title without mutating content', () => {
    expect(noteTitle({ title: '', content: '# 周末计划\n\n- 买花' })).toBe('周末计划')
    expect(noteTitle({ title: '', content: '' })).toBe('空白便签')
  })
})
