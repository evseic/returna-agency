# Skill: nextjs-performance
# Maps to: vercel-labs/agent-skills nextjs-performance
# Installed manually — registry source unavailable in this environment

## Purpose
Apply this skill for ALL Next.js component, routing, and data-fetching decisions.
It ensures every component is placed in the optimal rendering mode.

---

## 1. Rendering Mode Decision Tree

```
Does the component use: useState, useEffect, onClick, browser APIs?
  YES → "use client" directive required
  NO  → Server Component (default — no directive needed)

Does the component fetch data?
  YES + can be cached → fetch() in Server Component with cache headers
  YES + real-time     → Client Component + SWR or useEffect
  YES + per-request   → Server Component with { cache: 'no-store' }
```

**Rules:**
- Default to Server Components — never add `"use client"` speculatively
- `"use client"` boundary must be pushed as far down the tree as possible
- Never put `"use client"` on layout.tsx unless absolutely necessary

---

## 2. Data Fetching Patterns

### ✅ Server Component fetch (preferred)
```tsx
async function ProjectList() {
  const data = await fetch('https://api.example.com/projects', {
    next: { revalidate: 3600 } // ISR: revalidate every hour
  })
  const projects = await data.json()
  return <ul>{projects.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

### ✅ Supabase in Server Component
```tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

async function Projects() {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.from('projects').select('*')
  return <ProjectGrid projects={data ?? []} />
}
```

### ✅ Client Component with fallback
```tsx
'use client'
import { useEffect, useState } from 'react'

export function DynamicWidget() {
  const [data, setData] = useState(null)
  useEffect(() => { fetchData().then(setData) }, [])
  if (!data) return <Skeleton />
  return <Widget data={data} />
}
```

---

## 3. Image Optimization

Always use `next/image`. Never use raw `<img>` tags.

```tsx
import Image from 'next/image'

// Required: explicit width + height OR fill with sized container
<Image
  src="/project-cover.jpg"
  alt="Descriptive alt text — never empty"
  width={800}
  height={600}
  priority={true}  // Only for above-the-fold images (LCP)
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

**Rules:**
- `priority` on the Hero image only (prevents LCP penalty)
- `loading="lazy"` is the default — only override with `priority`
- Always specify `alt` — descriptive, not filename

---

## 4. Font Loading

Only use `next/font` — never load Google Fonts via `<link>` in `<head>`.

```tsx
// app/layout.tsx
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

---

## 5. Route Segment Config

Use these exports in page/layout files to control caching:

```tsx
export const dynamic = 'force-static'      // Always static
export const dynamic = 'force-dynamic'     // Always SSR
export const revalidate = 60               // ISR: revalidate every 60s
export const runtime = 'edge'              // Run on Edge runtime
```

---

## 6. Bundle Size Rules

- Never import an entire library when only one function is needed
  ```tsx
  // ❌ Bad
  import _ from 'lodash'
  // ✅ Good
  import debounce from 'lodash/debounce'
  ```
- Use `next/dynamic` for heavy components below the fold:
  ```tsx
  const HeavyChart = dynamic(() => import('./Chart'), { ssr: false })
  ```
- Check bundle size: `npm run build` → inspect `.next/analyze/`

---

## 7. Core Web Vitals Targets

| Metric | Target   | Common Causes of Failure           |
|--------|----------|------------------------------------|
| LCP    | < 2.5s   | Unoptimized hero image, no priority|
| FID    | < 100ms  | Large JS bundles, blocking scripts |
| CLS    | < 0.1    | Missing image dimensions, web fonts|
| TTFB   | < 600ms  | Slow server/edge, no caching       |

---

## Checklist (run before marking any component task done)

- [ ] Server Component where possible — `"use client"` only when needed
- [ ] All `<img>` replaced with `next/image` with explicit dimensions
- [ ] Fonts loaded via `next/font/google` only
- [ ] Heavy below-fold components wrapped in `next/dynamic`
- [ ] Data fetches use appropriate cache strategy
- [ ] `npm run build` passes with zero errors
