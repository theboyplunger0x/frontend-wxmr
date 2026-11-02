# frontend-wxmr

Three local wXMR frontend design versions, preserved separately for review.

| Version | Source | Local URL |
| --- | --- | --- |
| Noir mockup | `mockups/noir` | http://127.0.0.1:4176/ |
| Metal frontend | `apps/bridge` | http://127.0.0.1:4180/ |
| Holographic frontend | `apps/exploration` | http://127.0.0.1:4194/ |

## Run locally

Requires Node.js 22.16+, npm, and Python 3 for the static Noir mockup.

```sh
npm install
npm run dev:noir
```

In separate terminals:

```sh
npm run dev:metal
npm run dev:holo
```

Production builds: `npm run build`. Then `npm run start:metal` and `npm run start:holo` in separate terminals.

The Holographic app is served directly at `/`; it has no A/B comparison routes. Noir's Swap navigation opens the local Metal swap at port 4180, so run both when reviewing that link.

`apps/swap` supplies shared cross-chain components used by Metal; it is not a fourth design version.

## Scope and limitations

Noir and Holographic are design demos. Their simulated wallet/transfer states are not real transactions. Metal retains wallet, RPC and Jupiter integrations from the original frontend; external services and configuration are required. Cross-chain services are not bundled or configured; related API routes return 503 until connected. No real wallet signatures, transfers, or financial operations were tested for this publication.

No environment credentials, local builds, private attachments, Git history, or other design versions are included. Some explicitly labelled documentation/source links lead to public external websites.

## Provenance

Based on [sullystuff/wxmr-frontend](https://github.com/sullystuff/wxmr-frontend), with local UI design proposals. Original source notices and the IDL provenance in `packages/core/src/idl/SOURCE.md` are retained. This is a design review repository, not an official wXMR deployment or an assertion of production readiness. No new license grant is added for upstream code.

## Publication checks

- Fresh dependency installation from the committed lockfile and both Next.js production builds passed.
- Existing Metal frontend tests: 57 passed, 0 failed (mocked/direct tests, no wallet transactions).
- Local UI navigation reviewed: Noir → local Metal Swap; Metal Bridge/Swap; Holographic Bridge/Swap/Reserves and reverse direction.
- Holographic `/a` and `/b` return 404; `/` is the only app entry.
- Cross-chain health returns 503 without its external service; live RPC/reserve availability and financial execution are not certified by these checks.
