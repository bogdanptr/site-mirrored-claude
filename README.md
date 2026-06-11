# Giga Energy Site

Astro recreation of the Giga Energy marketing site.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Workflow

- `main` is the production branch — always deployable, deployed via Vercel.
- All changes go through a feature branch + pull request.
- CI runs `npm run build` on every PR; it must pass before merging.
