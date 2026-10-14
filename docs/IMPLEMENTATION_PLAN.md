# Implementation plan

## Phase 1 — local-first MVP (implemented)

- Responsive note UI, guest editing, IndexedDB autosave
- Multiple notes, search, delete confirmation
- Markdown write/preview
- Installable offline PWA
- Unit/component tests and Cloudflare static-assets build

## Phase 2 — portability

- Markdown import/export with front matter IDs and versions
- Export-all archive, restore preview and recoverable trash
- IndexedDB schema migration tests

## Phase 3 — single administrator cloud

- Worker authentication with secure HTTP-only session cookies
- D1 schema scoped by immutable administrator ID
- Version-checked sync queue and explicit three-way conflict UI
- Guest-to-admin import as an explicit copy operation

## Phase 4 — backup and attachments

- R2 attachment storage with signed Worker routes
- Worker-only GitHub App or fine-grained token integration
- Private repository snapshots, restore preview, audit trail and retention

Each phase requires automated tests, desktop/mobile checks, offline reload verification, and review that no secret or private response enters browser bundles or caches.
