# Lending Force — Guided Call Script (Monorepo)

A monorepo for the Lending Force guided call script tool, originally a single-file HTML
prototype. Converted to a typed React app with a shared data layer.

## Structure

```
.
├── apps/
│   └── web/                  # Vite + React + TS — the call navigator UI
├── packages/
│   ├── call-script/          # Question flow + rebuttal copy (typed data)
│   ├── exporters/            # JSON / Internal XML / MISMO-style XML exporters
│   └── types/                # Shared TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Requirements

- Node.js >= 18.17
- pnpm 9 (`npm i -g pnpm`)

## Getting started

```powershell
pnpm install
pnpm dev          # runs apps/web on http://localhost:5173
pnpm build        # builds everything
pnpm typecheck    # type-checks everything
```

## Notes

- The MISMO-style XML exporter is a prototype mapping. Validate against the destination
  LOS/POS before production use.
- Call data is persisted to `localStorage` under the key `lfGuidedCallV2`.
