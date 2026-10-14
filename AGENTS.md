# TNTNote Agent Guide

## Product invariants

- Keep guest usage login-free and useful offline.
- Treat `guest-local` and `admin-private` as separate ownership domains.
- Never expose Cloudflare, GitHub, D1, or R2 credentials to browser code.
- Never resolve sync conflicts with silent last-write-wins.
- Keep the app deployable as Cloudflare Workers Static Assets without an always-on process.

## Engineering workflow

- Keep domain types independent from React and storage adapters.
- Put browser persistence in `src/data`; put remote adapters behind `src/services/contracts.ts`.
- Add tests for data migrations, destructive actions, and conflict behavior.
- Before handoff, run `npm run check` and verify desktop and mobile behavior.
- Do not create a remote repository or deploy without explicit confirmation of owner, visibility, and account.
