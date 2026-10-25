<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Prototype stores farms, steps, and community posts in browser localStorage via `useStored` in src/lib/data.ts; swap to Lovable Cloud with auth before any real multi-user data. Why: no accounts exist yet, so nothing may claim secure storage.
- Map uses Leaflet + OpenStreetMap (free, no keys), lazy-loaded behind ClientOnly. Why: Leaflet touches window at import.
- Never render invented risk scores, facilities, or citations; show "Assessment Under Development"/"Insufficient Data" until the real pipeline exists.
