# Skill: code-review
# Source: addyosmani/agent-skills — installed manually (git unavailable)

## Purpose
Run this checklist before marking ANY task complete. No exceptions.

---

## 1. TypeScript Quality

- [ ] Zero `any` types — all interfaces defined in `/types/index.ts`
- [ ] No `@ts-ignore` suppressions without a detailed comment explaining WHY
- [ ] All function parameters and return types explicitly annotated
- [ ] All async functions properly `await`ed — no fire-and-forget
- [ ] All union types exhaustively handled (switch + default, or discriminated unions)

---

## 2. React / Next.js Patterns

- [ ] `"use client"` only on components that use hooks or browser APIs
- [ ] All `.map()` calls have a stable unique `key` prop (not array index)
- [ ] No missing `useEffect` dependency array entries
- [ ] No `useEffect` that runs on every render (empty deps = run once)
- [ ] No state updates on unmounted components (use cleanup in `useEffect`)
- [ ] Server Components do not import client-only modules (browser APIs, hooks)
- [ ] All internal navigation uses `next/link`, not raw `<a href>`
- [ ] All images use `next/image` with explicit width, height, and alt

---

## 3. Supabase Calls

- [ ] Every `.from()` call wrapped in try/catch
- [ ] Every error logged with `console.error('[ComponentName] ...')`
- [ ] All calls check both `data` and `error` return values
- [ ] No Supabase client created on every render — use singleton from `lib/supabase.ts`
- [ ] Environment variables checked before initializing client
- [ ] Fallback data returned when Supabase fails — never `undefined`

---

## 4. Accessibility

- [ ] All interactive elements have `aria-label` (buttons, links, inputs)
- [ ] All form inputs have associated `<label>` elements (htmlFor + id)
- [ ] All images have descriptive `alt` text (never empty, never filename)
- [ ] Color contrast ratio ≥ 4.5:1 for normal text, 3:1 for large text
- [ ] Focus styles visible on all interactive elements
- [ ] Dynamic content uses `aria-live` for screen reader announcements
- [ ] Modal/dialog uses `role="dialog"` and manages focus correctly
- [ ] No keyboard traps — users can navigate away from any element

---

## 5. Performance

- [ ] No unnecessary re-renders (memo, useCallback where needed)
- [ ] No heavy computations on every render — use `useMemo`
- [ ] No importing entire libraries for one function
- [ ] No layout shift — all images have explicit dimensions
- [ ] Heavy components below the fold use `next/dynamic`

---

## 6. Security

- [ ] No secrets or API keys in client-side code or committed files
- [ ] All `NEXT_PUBLIC_` variables are safe to expose to the browser
- [ ] All user input sanitized before Supabase insert
- [ ] No `dangerouslySetInnerHTML` with user-controlled content
- [ ] External links use `rel="noopener noreferrer"`

---

## 7. Code Style

- [ ] No dead code (commented-out blocks, unused imports)
- [ ] No console.log left in production code (console.error is fine)
- [ ] Component files have one default/named export only
- [ ] File names: kebab-case for files, PascalCase for components
- [ ] No magic numbers — use named constants

---

## Final Gate

A task is **only done** when:
```
✅ npm run build → zero errors
✅ npx tsc --noEmit → zero errors  
✅ All checklist items above satisfied
✅ New memories saved to agent_memory
```
