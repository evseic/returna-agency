# Skill: debugging
# Source: addyosmani/agent-skills — installed manually (git unavailable)

## Purpose
Apply this skill whenever any error, unexpected behavior, or failed build appears.
Read the full error before touching any code.

---

## 1. Error Diagnosis Protocol

```
Step 1: READ the full error message — all of it, including the stack trace
Step 2: Identify the ERROR TYPE
  - TypeScript compile error   → see section 2
  - Runtime / browser error    → see section 3
  - Build error (Next.js)      → see section 4
  - Supabase / network error   → see section 5
Step 3: Check agent_memory — has this error appeared before?
  YES → Apply the stored solution directly. Do not experiment.
  NO  → Diagnose, fix, save to memory.
Step 4: Fix root cause — never silence with @ts-ignore or try/catch no-op
Step 5: Verify fix — run npm run build or reproduce the runtime scenario
```

---

## 2. TypeScript Errors

### Common patterns and fixes

| Error Pattern | Root Cause | Fix |
|---|---|---|
| `Type 'X' is not assignable to type 'Y'` | Wrong type passed | Add proper interface or cast with `as` only when safe |
| `Property 'X' does not exist on type` | Missing interface field | Add field to interface in `/types/index.ts` |
| `Module '"X"' has no exported member 'Y'` | Wrong import name | Check actual exports: `node -e "console.log(Object.keys(require('X')))"` |
| `Object is possibly 'null'` | Missing null guard | Add `?? fallback` or early return |
| `Parameter 'X' implicitly has 'any' type` | Missing type annotation | Define the type explicitly |

**Never use:**
```tsx
// ❌ These hide real problems
// @ts-ignore
// @ts-expect-error (only if adding detailed comment WHY)
const x = value as any
```

---

## 3. Runtime / Browser Errors

### Debugging steps
1. Open DevTools → Console → read the full error + stack
2. `document is not defined` → component uses browser API without `"use client"`
3. `Cannot read properties of null` → missing null check or data not loaded yet
4. `Hydration mismatch` → Server and client render different HTML:
   ```tsx
   // Fix: use useEffect for client-only values
   const [mounted, setMounted] = useState(false)
   useEffect(() => setMounted(true), [])
   if (!mounted) return null
   ```

### React-specific
- Missing `key` prop → add unique stable key (never array index for dynamic lists)
- Stale closure in `useEffect` → add missing dependency to array
- Infinite re-render → check if object/array created inside render is in deps array

---

## 4. Next.js Build Errors

### Approach
```bash
npm run build 2>&1 | head -60   # Read the FIRST error only — fix it first
```

**Common Next.js build errors:**

| Error | Cause | Fix |
|---|---|---|
| `Error: Event handlers cannot be passed to Client Component props` | Passing function from Server → Client | Add `"use client"` to the parent or restructure |
| `useSearchParams() should be wrapped in a Suspense boundary` | Missing Suspense | Wrap component in `<Suspense fallback={...}>` |
| `Static generation failed` | Async error during build | Add try/catch + fallback data |
| `Cannot find module '@/...'` | Wrong alias or missing file | Check tsconfig.json paths + file actually exists |

---

## 5. Supabase / Network Errors

```tsx
// Always wrap Supabase in try/catch — never let it throw unhandled
async function fetchData() {
  try {
    const { data, error } = await supabase.from('table').select('*')
    if (error) {
      console.error('[Component] Supabase error:', error.message, error.details)
      return fallbackData  // Never return undefined
    }
    return data ?? fallbackData
  } catch (err) {
    console.error('[Component] Unexpected error:', err)
    return fallbackData
  }
}
```

**Common Supabase errors:**

| Error | Cause | Fix |
|---|---|---|
| `permission denied for table X` | Missing RLS policy | Add policy in Supabase dashboard |
| `JWT expired` | Auth token stale | Refresh session or re-auth |
| `relation "X" does not exist` | Table not created | Run migration SQL |
| `violates row-level security policy` | INSERT policy missing `WITH CHECK` | Check RLS policy definition |

---

## 6. Debugging Tools

```bash
# TypeScript only
npx tsc --noEmit 2>&1

# Full build
npm run build 2>&1

# Check what a package exports
node -e "console.log(Object.keys(require('package-name')))"

# Inspect environment variables loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env)"
```

---

## Checklist

- [ ] Read the full error before touching code
- [ ] Checked agent_memory for this error
- [ ] Fixed root cause (not silenced)
- [ ] Ran `npm run build` — zero errors
- [ ] Saved new memory if this was a new error pattern
