# image-kit

A tiny browser-native image toolkit. Compress, convert, and resize images — 100% client-side. Nothing is uploaded anywhere.

🔗 **[my-image-kit.vercel.app](https://my-image-kit.vercel.app/)**

## Features

- **Compress** — shrink file size with an adjustable quality slider (powered by `browser-image-compression`, uses Web Workers)
- **Convert** — PNG ↔ JPEG ↔ WebP via Canvas API
- **Resize** — scale by width, height, or percentage
- **Batch** — drop multiple files at once, see per-file progress, download individually or as a ZIP
- **Private by design** — no backend, no uploads, no tracking

## Stack

- Vite + React 18 + TypeScript (strict)
- React Router v6
- Tailwind CSS
- Zustand (file queue state)
- react-dropzone
- browser-image-compression, jszip, file-saver
- lucide-react icons

## Getting started

```bash
yarn install
yarn dev
```

Open http://localhost:5173.

### Scripts

| Script | What it does |
| --- | --- |
| `yarn dev` | Start Vite dev server |
| `yarn build` | Type-check + production build |
| `yarn preview` | Preview the built app |
| `yarn typecheck` | Type-check only |
| `yarn format` | Prettier format `src/` |

## Architecture

```
src/
├── tools/              ← tool plugins (compress, convert, resize)
│   ├── types.ts        ← ImageTool interface + option schema
│   └── registry.ts     ← the list of enabled tools
├── store/              ← Zustand file queue
├── components/         ← DropZone, FileList, OptionsPanel, ToolCard, RootLayout
├── pages/              ← HomePage, ToolPage
├── lib/                ← cn, format, image, download helpers
├── router.tsx
└── main.tsx
```

### Adding a new tool

1. Create `src/tools/my-tool.ts` exporting an `ImageTool`:

   ```ts
   import { ImageTool } from './types'

   export const myTool: ImageTool = {
     id: 'my-tool',
     name: 'My Tool',
     tagline: '...',
     icon: SomeLucideIcon,
     accent: 'from-orange-500 to-red-500',
     accept: ['image/*'],
     options: {
       /* schema */
     },
     process: async ({ file, options, onProgress }) => {
       /* ... */
       return { blob, filename }
     },
   }
   ```

2. Register it in `src/tools/registry.ts`.

The `OptionsPanel` renders the form automatically from your `options` schema — no UI code to write.

## License

MIT — personal project, do whatever.
