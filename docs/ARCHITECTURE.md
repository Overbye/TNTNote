# Architecture

## Current data flow

`React UI → useNotes application hook → NoteRepository → IndexedDB`

The UI never calls IndexedDB directly. `NoteRepository` is replaceable in tests. A debounced write follows each edit; version and timestamp advance before persistence.

## Ownership isolation

- `guest-local`: anonymous, device-local, never uploaded implicitly.
- `admin-private`: reserved for the authenticated administrator's cloud collection.

Queries are owner-scoped by default. Cloud migration must be opt-in and copy guest records into the administrator scope only after confirmation.

## Future Worker boundary

`src/services/contracts.ts` defines ports for authentication, D1/R2 sync, Markdown transfer, and private GitHub backup. Implementations belong in a Worker. D1 stores ordinary note records and versions; R2 is reserved for large attachments/exports. GitHub credentials belong only in a Worker Secret.

## Conflict protocol

Each push carries the client's `expectedVersion`. The Worker updates only when the stored version matches. A mismatch returns local, remote and base version information. The client then offers keep-local, keep-remote or manual merge; no automatic last-write-wins.

## PWA model

Workbox precaches the application shell. IndexedDB works offline. Future private API responses must not enter Cache Storage; queued mutations need stable operation IDs and expected versions.
