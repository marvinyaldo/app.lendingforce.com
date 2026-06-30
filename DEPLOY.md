# Deploy — GitHub + Render

## 1. Push to GitHub

Create an empty repo on GitHub (no README, no .gitignore), then:

```powershell
git remote add origin https://github.com/<your-user>/<your-repo>.git
git branch -M main
git push -u origin main
```

## 2. Deploy on Render

1. Go to <https://dashboard.render.com/select-repo?type=blueprint>.
2. Connect your GitHub account and pick this repo.
3. Render auto-detects `render.yaml` and creates the **lending-force-web** static site.
4. Click **Apply** — first build takes ~2 minutes.

Every push to `main` redeploys automatically. PRs get preview URLs.

## Local commands

```powershell
pnpm install        # once
pnpm dev            # http://localhost:5173
pnpm build          # outputs apps/web/dist
pnpm typecheck
```

## Output

Static files land in `apps/web/dist/` — fully portable to any static host.
