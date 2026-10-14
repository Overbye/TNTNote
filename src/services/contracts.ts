import type { Note } from '../domain/note'

export interface AuthSession { actorId: string; role: 'admin'; expiresAt: string }
export interface AuthGateway { getSession(): Promise<AuthSession | null>; signIn(): Promise<AuthSession>; signOut(): Promise<void> }
export interface SyncSnapshot { note: Note; etag: string; syncedAt: string }
export interface SyncConflict { local: Note; remote: Note; baseVersion: number }
export type PushResult = { status: 'accepted'; snapshot: SyncSnapshot } | { status: 'conflict'; conflict: SyncConflict }
export interface CloudSyncGateway { pull(since?: string): Promise<SyncSnapshot[]>; push(note: Note, expectedVersion: number): Promise<PushResult> }
export interface MarkdownTransferGateway { export(note: Note): Promise<Blob>; import(file: File): Promise<Note> }
export interface BackupGateway { backup(notes: Note[]): Promise<{ commitSha: string }>; restore(commitSha?: string): Promise<Note[]> }

// Future Worker implementations own D1/R2/GitHub credentials. Never implement
// these gateways with browser-visible tokens.
