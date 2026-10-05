# AGENTS.md — Development Constitution

**Audience:** every AI coding agent and human engineer working in this repository.
**Status:** binding. These are rules, not suggestions.
**Last verified against the codebase:** 2026-09-19.

Read this file **before** inspecting, modifying, refactoring, or creating code here.

---

## 0. THE PRIME DIRECTIVE

> ### Before writing new UI code, inspect and reuse the existing component system.
>
> ### Pages MUST be composed from reusable primitives and domain components.
>
> ### Pages MUST NOT rebuild UI elements inside page-specific components.

This is the highest-priority rule in the project. Every other rule exists to support it.

The single most common failure of AI agents in this codebase is **claiming** to do
component-based development while actually generating one enormous page file containing
hand-rolled buttons, cards, badges, images, loaders, modals, and empty states.

That is a **defect**, not a style preference. It will be rejected in review.

If you take nothing else from this document:

| Need UI functionality              | Action                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------- |
| It already exists                  | **Reuse it.**                                                          |
| It exists but needs a tweak        | **Extend it** via props / variants / composition / slots.              |
| It genuinely does not exist        | **Create it in the right shared location**, then use it.               |
| You are not sure whether it exists | **Search the repository.** Not knowing is NOT permission to duplicate. |

"Already exists" is decided by **responsibility, not resemblance** — see §6.0, which governs
every reuse decision in this document.

---

## 1. THE 60-SECOND CHECKLIST

Read this before every coding task. It is the compressed form of this document.

```text
□ 1.  Did I read the request and restate what I am actually building?
□ 2.  Did I LIST src/components/** before writing any JSX?
□ 3.  Did I grep for an existing component, hook, util, or type that does this?
□ 4.  Am I reusing primitives instead of raw <button>/<div>/<img>?
□ 5.  Am I using design tokens instead of inventing colors/spacing/radii?
□ 6.  Is this new code in the correct architectural location?
□ 7.  Did I avoid duplicating an existing implementation?
□ 8.  Did I decide reuse by RESPONSIBILITY (§6.0), not by matching markup?
□ 9.  Are loading / empty / error / disabled states handled?
□ 10. Is it responsive and keyboard-accessible?
□ 11. Did I run `pnpm typecheck && pnpm lint && pnpm build`?
□ 12. Did I remove the dead code I replaced?
□ 13. Did I check other consumers of every shared component I touched?
```

If you cannot tick **every** box, the task is **not** done.

---

## 2. REPOSITORY FACTS — VERIFIED, DO NOT INVENT

### 2.1 The actual stack

These versions were read from `package.json` and `node_modules`. Treat this table as truth.

| Concern             | Actual technology                    | Notes                                                                |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------- |
| Framework           | **Next.js 15.5.19**, App Router      | `src/app/**`. No Pages Router.                                       |
| UI runtime          | **React 19.2.4**                     | Server Components are the default.                                   |
| Language            | **TypeScript 5.9.3**, `strict: true` | `noEmit`. Alias `@/*` → `./src/*`.                                   |
| Styling             | **Tailwind CSS v4.3.1**              | CSS-first. **There is no `tailwind.config.js`.**                     |
| PostCSS             | `@tailwindcss/postcss`               | `postcss.config.mjs`.                                                |
| Validation          | **Zod 4.4.3**                        | Used by the contact endpoint.                                        |
| Transactional email | **Resend 6.14.0**                    | Server-side only.                                                    |
| Package manager     | **pnpm 11.8.0**                      | `engines.node >= 20.9.0`, `.nvmrc` = 22.                             |
| Lint                | **ESLint 9** flat config             | `next/core-web-vitals`, `next/typescript`, `eslint-config-prettier`. |
| Format              | **Prettier 3.8.4**                   | + `prettier-plugin-tailwindcss` (auto class sorting).                |
| Hosting             | **Vercel**                           | `vercel.json` sets framework + security headers.                     |
| Tests               | **NONE CONFIGURED**                  | See §18. Do not fabricate a test command.                            |

### 2.2 Technologies this project does NOT use

You MUST NOT introduce, import from, or write documentation/code assuming any of the following,
because they are **not** installed:

> Redux · Zustand · Jotai · Recoil · React Query / TanStack Query · SWR · shadcn/ui ·
> Radix UI · Material UI · Chakra · styled-components · Emotion · CSS Modules ·
> Framer Motion / `motion` · `next-themes` · `clsx` · `tailwind-merge` ·
> `class-variance-authority` · `lucide-react` · `geist` · React Hook Form ·
> Prisma · Supabase · Drizzle · tRPC · Vitest · Jest · Playwright · Storybook

Several of these were removed deliberately during the teardown. **Do not silently re-add them.**
To add any dependency, follow §21 (Dependencies) — which REQUIRES asking first.

### 2.3 Current state of the repository — READ THIS CAREFULLY

This project is **mid-redesign**. The previous portfolio implementation was intentionally
deleted. As of the last verification, the entire application source is:

```text
src/
├── app/
│   ├── api/contact/route.ts   # Resend-backed contact endpoint  (KEEP — working backend)
│   ├── favicon.ico
│   ├── layout.tsx             # minimal root layout stub
│   └── page.tsx               # minimal placeholder route
├── lib/
│   ├── resend.ts              # Resend client factory           (KEEP)
│   └── validations.ts         # Zod contact schema              (KEEP)
└── styles/
    └── globals.css            # `@import "tailwindcss";` only
```

**There is no component library in this repository yet.** No `Button`. No `Card`. No tokens.
No hooks. No `cn()` helper.

This has two consequences you MUST internalize:

1. **This document is prescriptive, not descriptive.** It defines the architecture you are
   REQUIRED to build toward. When it references `src/components/ui/Button.tsx`, that is the
   mandated destination, not a promise the file exists today.
2. **You are building the foundation that every later agent will be forced to reuse.**
   Sloppiness now compounds. The first agent to implement a button decides what every
   button in this application looks like forever.

Do **not** interpret "no components exist yet" as permission to write page-local UI.
It is the opposite: it is an instruction to **create the primitive first, then use it**.

### 2.4 Reference material in git history

The deleted implementation is still recoverable and contains a **well-structured Tailwind v4
token system** worth learning from before you design a new one:

```bash
git show HEAD:src/styles/tokens/colors.css
git show HEAD:src/styles/theme/tailwind-theme.css
git show HEAD:src/styles/globals.css
git show HEAD:src/components/buttons/Button.tsx
```

Treat this as **reference, not gospel** — the visual design is being replaced. Reuse the
_architecture_ (two-layer tokens, semantic naming), not necessarily the _values_.

### 2.5 Established conventions that already exist and MUST be followed

The surviving backend code sets binding precedents.

**`src/app/api/contact/route.ts` — the canonical Route Handler pattern:**

- ALWAYS `safeParse`, NEVER `parse`, on untrusted request bodies.
- ALWAYS wrap `await request.json()` in try/catch — malformed JSON throws.
- ALWAYS guard required server env vars explicitly and fail with a 500 + server log.
- Return **generic** messages to the client; log **details** server-side via `console.error`.
  Never leak provider errors, stack traces, or env values to the browser.
- Use `NextResponse.json(body, { status })` with meaningful status codes
  (`400` validation, `500` misconfiguration, `502` upstream failure).

**`src/lib/resend.ts` — the canonical integration pattern:**
lazy factory (`getResendClient()`), reads env at call time, throws on missing key.
NEVER instantiate SDK clients at module top-level with required secrets — it breaks builds.

**Known inconsistency to fix, not copy:** `src/lib/validations.ts` uses
`z.string().email()`, which is **deprecated in Zod 4**. The canonical form in this repo is
top-level `z.email()`. Use the canonical form in new code.

### 2.6 Formatting is automated — do not fight it

`prettier-plugin-tailwindcss` sorts Tailwind classes. Double quotes, semicolons,
2-space indent, 80-char print width, trailing commas.

- MUST NOT hand-sort Tailwind class strings.
- MUST NOT argue with Prettier output or add `// prettier-ignore` to preserve a preference.
- ALWAYS run `pnpm format` before finishing.

---

## 3. MANDATORY DEVELOPMENT WORKFLOW

This sequence is **REQUIRED**. Skipping steps 2–6 is the defining behaviour of a bad agent.

```text
1. UNDERSTAND   → Restate the feature. Identify every UI element it needs.
2. INSPECT      → Read the project structure. Know where things live.
3. DISCOVER     → List and read src/components/**. Know what already exists.
4. READ         → Open the specific components you might reuse. Read their props.
5. SURVEY       → Check design tokens, utils, hooks, types, existing patterns.
6. DECIDE       → Map each UI element → an existing component, an extension, or a new one.
7. COMPOSE      → Build the feature from existing pieces.
8. CREATE       → Only now, create genuinely missing reusable components.
9. IMPLEMENT    → Only now, write the page/feature.
10. VALIDATE    → typecheck, lint, build. Review against §26 and §27.
```

**BEFORE implementing**, you MUST have actually run discovery commands. Reading this file
is not discovery. Recalling a previous conversation is not discovery.

```bash
# Minimum viable discovery — run these, do not skip them
find src/components -type f 2>/dev/null | sort
find src -type d -maxdepth 3 | sort
grep -rn "export function\|export const" src/components src/hooks src/lib 2>/dev/null
grep -rni "button\|card\|modal\|skeleton" src --include='*.tsx' -l 2>/dev/null
```

### 3.1 The STOP AND INSPECT rule

If you are **unsure** whether a reusable implementation exists, you MUST search the
repository before writing a new one.

**Lack of immediate knowledge is NEVER permission to create duplicate code.**

Writing the code again is almost always faster than finding the original.
Speed is not the objective. **A coherent codebase is the objective.**

### 3.2 Agent behaviour standard

Behave like a senior engineer inheriting a mature codebase — not like a code generator
producing isolated examples.

Priority order:

```text
CORRECT:  understand → discover → reuse → stay consistent → implement → validate
WRONG:    generate JSX → copy a pattern → add another component → move on
```

---

## 4. ARCHITECTURE

### 4.1 Dependency direction — strictly one-way

```text
              Pages  (src/app/**)
                 ↓
      Feature Components  (src/features/*/components)
                 ↓
     Shared Domain Components  (src/components/domain, /shared)
                 ↓
      UI Primitives  (src/components/ui, /layout)
                 ↓
        Design Tokens · Utils · Types  (src/styles, src/lib, src/types)
```

**RULES:**

- Pages MAY import from any layer below them.
- A layer MUST NOT import from a layer above it.
- UI primitives MUST NOT import feature or domain components.
- UI primitives MUST NOT import from `src/app/**`. Ever.
- Shared components MUST NOT import page-specific implementations.
- Features SHOULD NOT import from another feature's internals. Promote the shared piece
  to `src/components/` or `src/lib/` instead.
- NEVER create a circular import to "make it work."

### 4.2 Target file organization

Build toward this. Create directories **when you first genuinely need them**, not upfront.

```text
src/
├── app/                      # Next.js App Router: routes, layouts, route handlers
│   ├── (routes)/             # route groups as the URL structure requires
│   └── api/                  # Route Handlers
├── components/
│   ├── ui/                   # PRIMITIVES: Button, Input, Badge, Skeleton, Modal…
│   ├── layout/               # STRUCTURE: Container, Stack, Grid, Section, PageLayout
│   ├── shared/               # cross-feature composites: PageHeader, EmptyState, ErrorState
│   └── domain/               # business-meaningful, cross-feature: ProductCard, UserCard
├── features/                 # self-contained feature slices (see §4.3)
│   └── <feature>/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── utils/
├── hooks/                    # genuinely global hooks: useDebounce, useMediaQuery…
├── lib/                      # clients, integrations, cross-cutting helpers
├── services/                 # API/data-access layer (if it outgrows lib/)
├── types/                    # shared TypeScript types
├── constants/                # routes, config, enums, single-source-of-truth values
├── utils/                    # pure functions: formatting, sorting, transforms
└── styles/                   # globals.css, tokens, theme mapping
```

**RULES:**

- MUST NOT place reusable components inside `src/app/**`. `src/app` is for routing.
- Page-specific components with **genuinely zero** reuse potential MAY live beside the
  route in a `_components/` folder (underscore = not a route segment).
- The moment a `_components/` component is needed by a second route, it MUST be promoted
  to `src/components/` or `src/features/`.
- MUST NOT dump every component into one flat `components/` folder.

### 4.3 Feature boundaries

Use `src/features/<name>/` when functionality has **its own domain logic** — its own types,
services, and multiple components. Do not create a feature folder for a single component.

A feature folder SHOULD expose a small public surface. Prefer importing
`@/features/products` over deep-reaching into `@/features/products/components/internal/Foo`.

### 4.4 Do not rewrite working architecture without reason

When implementing a feature:

- MUST understand existing patterns before changing them.
- MUST preserve working conventions.
- MUST make focused changes scoped to the request.
- MUST NOT refactor unrelated areas because a different architecture is theoretically nicer.
- Improve architecture **incrementally**, as a by-product of touching code legitimately.

If you believe a broad refactor is genuinely needed, **say so and ask** — do not perform it
unannounced inside an unrelated task.

---

## 5. THE COMPONENT SYSTEM

### 5.1 Hierarchy

**Tier 1 — UI Primitives** (`src/components/ui/`)
The visual and behavioural foundation. Generic, domain-free, reusable anywhere.

```text
Button · IconButton · Link · Input · Textarea · Select · Checkbox · Radio · Switch
Label · Badge · Avatar · Tooltip · Spinner · Skeleton · Divider · Image · Icon
Heading · Text · Modal · Drawer · Dropdown · Tabs · Accordion
```

**Tier 2 — Layout Primitives** (`src/components/layout/`)
Spacing and structure. No visual opinion beyond layout.

```text
Container · Stack · Grid · Flex · Section · Spacer · PageLayout · PageContainer
```

**Tier 3 — Shared Composites** (`src/components/shared/`)
Recurring cross-feature patterns built from Tiers 1–2.

```text
PageHeader · SectionHeader · EmptyState · ErrorState · NotFoundState
SearchBar · FilterBar · Pagination · DataTable · FormField · ConfirmDialog
```

**Tier 4 — Domain Components** (`src/components/domain/` or `src/features/*/components/`)
Business concepts. Named after the domain, built from lower tiers.

```text
ProductCard · UserCard · StatCard · FeatureCard · ArticleCard · PricingCard
ProductImage · ProductGallery · ProductGrid
```

> None of these exist yet (§2.3). This is the **target inventory**. Build each one the
> first time it is genuinely needed — then reuse it forever after.

### 5.2 Pages MUST NOT recreate primitives

**FORBIDDEN** — hand-rolling a primitive that exists:

```tsx
// ❌ NEVER
<button className="rounded-md bg-violet-500 px-4 py-2 text-white hover:bg-violet-600">
  Save
</button>
```

**REQUIRED:**

```tsx
// ✅ ALWAYS
<Button variant="primary">Save</Button>
```

The same applies to every primitive: raw `<img>` instead of the `Image` primitive, a
bespoke spinner `<div>` instead of `Spinner`, an inline `<div role="dialog">` instead of
`Modal`, a copy-pasted "no results" block instead of `EmptyState`.

### 5.3 Pages compose — they do not implement

A page component SHOULD read approximately like this:

```tsx
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <PageLayout>
      <PageHeader title="Products" description="Everything we make." />

      <Section>
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Check back soon."
            action={<Button variant="primary">Refresh</Button>}
          />
        ) : (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </Section>
    </PageLayout>
  );
}
```

Pages are RESPONSIBLE for:
data loading · page-level state · routing · permissions · feature orchestration · arrangement.

Pages MUST NOT become mini-applications containing duplicated UI implementations.

### 5.4 THE CRITICAL ANTI-PATTERN

> This is documented explicitly because AI agents do it constantly.

A page needs: a heading, product cards, buttons, badges, product images, a loader, an
empty state, and a modal.

**❌ THE WRONG APPROACH** — one 600-line page file containing a custom heading block, a
custom card `<div>` repeated inline, custom `<button>` elements, custom badge `<span>`s, raw
`<img>` tags, a hand-built spinner, an inline "nothing here" block, and a bespoke modal
with its own `useState` and backdrop.

**✅ THE CORRECT APPROACH** — compose from the system (§5.3), where `ProductCard` itself
is built from `Card`, `Image`, `Heading`, `Text`, `Badge`, and `Button`.

The wrong version "works." It is still wrong. It creates eight future duplication sites and
guarantees visual drift.

---

## 6. COMPONENT REUSE RULES

### 6.0 Reuse follows responsibility, not resemblance

**This is the governing principle of this section. Apply it before any other reuse rule.**

Reuse decisions MUST be based on what a component _means_, not on what its markup looks
like. Matching JSX is **evidence**, never justification.

**Same responsibility, different appearance → ONE component with variants.**
`FavoriteProductCard`, `SearchResultProductCard`, and `RecommendedProductCard` all answer
the same question — "how does this application present a product?" Density, badges, and
spacing may differ; the responsibility does not. They are one `ProductCard` with variants.
Forking them guarantees the three drift apart visually and behaviourally.

**Different responsibility, identical appearance → SEPARATE components.**
A stat tile and a testimonial block may both render today as a bordered, padded, rounded
box. That resemblance is **coincidental**. Merging them into
`<Card variant="stat" | "testimonial">` couples two unrelated concepts: the next design
change to one drags the other with it, and the component accumulates unrelated props,
states, and business logic.

They MAY both _compose_ the same low-level `Card` shell — that is correct reuse of a visual
primitive without conflating the domain concepts. Sharing a shell is not the same as being
the same thing.

**The test to apply before merging or forking:**

> ### "Would a single design or business decision change both?"
>
> **Yes** → they are one concept. Reuse it, with variants for the differences.
> **No** → they are two concepts. Keep them separate, even if the markup is nearly identical.

Two blocks of identical markup are a prompt to ask that question — not an answer to it.

### 6.1 Discovery is mandatory

**BEFORE CREATING ANY NEW COMPONENT, YOU MUST SEARCH FOR AN EXISTING ONE.**

You MUST search across: component names · component directories · similar JSX ·
similar class strings · utility functions · hooks · types/interfaces · API helpers.

```bash
grep -rin "productcard\|product-card" src --include='*.tsx' --include='*.ts'
grep -rn "rounded-xl border" src --include='*.tsx'   # is a Card shell being repeated?
```

### 6.2 Extend before you create

When an existing component already carries the responsibility you need (§6.0), you MUST
extend it rather than create a near-duplicate — **regardless of how much of the requirement
it currently covers**.

Extend through, in order of preference:

1. **composition / children / slots** (most flexible, least coupling)
2. **a new variant** (when the difference is a coherent visual mode)
3. **a new prop** (when the difference is genuinely configuration)

There is deliberately **no percentage threshold** here. "It only covers half of what I need"
is not a licence to fork — it usually means the component's API is under-built, and building
it out is the work. Conversely, a component that already covers almost everything is still
the wrong base if its responsibility differs (§6.0, §6.7).

### 6.3 Duplicate components are FORBIDDEN

You MUST NOT create any of these:

| Forbidden                                                   | Required instead                   |
| ----------------------------------------------------------- | ---------------------------------- |
| `Button` + `CustomButton` + `PrimaryButton` + `SaveButton`  | `<Button variant="…">`             |
| `ProductCard` + `FavoriteProductCard` (same responsibility) | `<ProductCard variant="…">`        |
| `Loader` + `PageLoader` duplicating animation code          | one `Spinner`, composed            |
| several image wrappers with the same behaviour              | one `Image` primitive              |
| a separate modal implementation per page                    | one `Modal`                        |
| repeated form-field markup                                  | one `FormField`                    |
| repeated badge / card-shell / section-header markup         | `Badge` / `Card` / `SectionHeader` |

If the difference is **primarily styling or configuration**, it is a variant — not a component.

### 6.4 Composition over copying

Two features sharing a visual structure with different content MUST use composition:

```tsx
// ✅ One card system, composed per use case
<Card>
  <CardImage src={product.image} alt={product.name} ratio="4/3" />
  <CardContent>
    <CardTitle>{product.name}</CardTitle>
    <CardDescription>{product.summary}</CardDescription>
  </CardContent>
  <CardActions>
    <Button variant="primary">Buy</Button>
  </CardActions>
</Card>
```

NOT `ProductCardContainer` + `FavoriteCardContainer` + `RecommendationCardContainer` +
`SearchResultCardContainer`, each re-implementing the same shell.

### 6.5 No copy-paste development

Copying an existing implementation and tweaking it is **NOT** an acceptable default strategy.

**BEFORE copying any block of code, you MUST ask: can the original become reusable?**
If yes — refactor the shared behaviour into an abstraction and use it in **both** places.

### 6.6 Avoid the opposite failure: over-componentization

Reusable architecture does NOT mean every `div`, `span`, or 5-line block becomes a component.

A new component SHOULD satisfy at least one of:

- reused in multiple places, or clearly likely to be
- a meaningful design-system primitive
- a meaningful business/domain concept
- encapsulates important behaviour
- makes a large component significantly easier to understand
- provides consistency across the application
- isolates complex logic
- establishes an intentional abstraction

MUST NOT create abstractions purely to raise the component count.

> The goal is **high reuse + clear architecture + low duplication** —
> NOT the maximum number of components.

**Premature abstraction is a real cost.** Do not build a configurable, generic component for
a use case that does not exist yet. Abstract from **observed** requirements rather than
imagined ones — a real second usage shows you what actually varies, while a hypothetical one
leads you to parameterize the wrong axis and bake in the wrong flexibility.

This is not a counting rule. Something that is plainly a design-system primitive or a core
domain concept (§6.0) SHOULD be built properly the first time; waiting for a second usage to
"prove" that a `Button` is reusable is its own failure.

### 6.7 Do not turn components into monsters

Reuse MUST NOT produce a god-component handling every possible case.

A component MUST have a **coherent responsibility**. If a proposed variant introduces
completely unrelated markup, behaviour, state, and business logic, a **separate component
is cleaner**.

> **Reuse common concepts. Separate genuinely different concepts.**

### 6.8 Component size

Large components warrant review, but there is **no mechanical line limit**.
Do NOT apply a rule like "split everything over 100 lines."

Split when:
multiple responsibilities exist · identifiable reusable sections exist · logic overwhelms
presentation · readability is poor · testing is hard · reuse opportunities exist.

### 6.9 Modifying a shared component

Shared primitives affect many screens. BEFORE modifying one you MUST:

```bash
grep -rn "ComponentName" src --include='*.tsx' --include='*.ts'
```

1. **Inspect every usage.**
2. **Maintain backward compatibility** when reasonable (new props default to current behaviour).
3. If behaviour must change, **deliberately migrate every consumer** in the same change.
4. NEVER change a global reusable component without accounting for its existing consumers.
5. NEVER "fix" a shared component by forking a page-specific copy.

When a new design needs something the shared component lacks, FIRST determine whether it
can safely support another variant · size · state · slot · prop · composition pattern.

---

## 7. COMPONENT API QUALITY

### 7.1 Structured props, not boolean soup

```tsx
// ❌ FORBIDDEN — unscalable, contradictory combinations possible
<Card isBlue isSmall hasShadow isProduct hasBorder showIcon />

// ✅ REQUIRED — structured, typed, mutually exclusive where it matters
<Card variant="product" size="sm" elevation="raised" />
```

### 7.2 API requirements

Component APIs MUST be **predictable · typed · extendable · easy to understand · hard to misuse**.

- ALWAYS type props with an explicit exported `interface` or `type`.
- ALWAYS use string-literal unions for variants: `variant?: "primary" | "secondary" | "ghost"`.
- ALWAYS give variants sensible defaults so the common case is `<Button>Save</Button>`.
- Primitives SHOULD extend native props so consumers can pass `aria-*`, `type`, `onClick`:
  `interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> { … }`
- `className` is an **escape hatch, not the styling mechanism.** Layout and presentational
  primitives SHOULD accept and merge it so consumers can handle genuine one-offs. A
  component whose visual contract must be guaranteed (§8.4) MAY deliberately refuse it — a
  closed API is a legitimate design decision, not an oversight. What is always FORBIDDEN is
  using `className` from a page to redesign a primitive in place (§8.4).
- MUST NOT accept a `style` object prop as the standard way to customise appearance.
- MUST NOT leak implementation details through prop names (`innerDivClass`, `wrapperStyle`).
- Boolean props are acceptable for genuine binary states: `disabled`, `loading`, `required`.

### 7.3 Variants

Use variants for intentional visual differences:

```tsx
<ProductCard variant="default" />
<ProductCard variant="compact" />
<ProductCard variant="featured" />
```

Variant definitions MUST live in **one place** inside the component (a lookup map keyed by
variant name), never scattered through conditional JSX branches.

Since `class-variance-authority`, `clsx`, and `tailwind-merge` are **not installed** (§2.2),
use a simple typed record until a real need justifies a dependency:

```tsx
const variantStyles: Record<Variant, string> = {
  primary: "bg-accent-primary text-text-primary hover:bg-accent-secondary",
  secondary: "bg-surface text-text-primary hover:bg-elevated-surface",
  ghost: "bg-transparent text-text-secondary hover:bg-surface",
};
```

---

## 8. DESIGN SYSTEM & STYLING

### 8.1 Tailwind v4 — how this project is configured

**There is no `tailwind.config.js` and you MUST NOT create one.** Tailwind v4 is configured
in CSS. The REQUIRED architecture is two layers:

**Layer 1 — raw semantic tokens** (`src/styles/tokens/*.css`) as CSS custom properties:

```css
:root {
  --background-primary: #08080c;
  --text-primary: #ffffff;
  --accent-primary: #a855f7;
  --space-4: 1rem;
  --radius-md: 0.5rem;
}
```

**Layer 2 — Tailwind theme mapping** (`src/styles/theme/tailwind-theme.css`) exposing those
tokens as Tailwind utilities via `@theme inline`:

```css
@theme inline {
  --color-background-primary: var(--background-primary);
  --color-text-primary: var(--text-primary);
  --color-accent-primary: var(--accent-primary);
  --spacing-4: var(--space-4);
  --radius-md: var(--radius-md);
}
```

This yields `bg-background-primary`, `text-text-primary`, `rounded-md`, etc.
`src/styles/globals.css` imports Tailwind first, then the token and theme layers.

Use `@theme inline` when the value references another CSS variable; plain `@theme` for
literal values.

### 8.2 Token discipline — REQUIRED

You MUST NOT introduce new colors · spacing values · border radii · shadows · font sizes ·
breakpoints · z-index values · animation timings **when an equivalent token already exists**.

- ALWAYS use semantic token utilities (`bg-surface`, `text-text-muted`).
- MUST NOT hardcode hex colors in components (`bg-[#a855f7]`).
- MUST NOT use arbitrary values as a shortcut: `mt-[17px]`, `rounded-[13px]`, `text-[15.5px]`.
  Arbitrary values are permitted ONLY when the design genuinely requires a one-off value —
  and then a brief comment MUST explain why.
- If a genuinely new token is needed, ADD IT TO THE TOKEN LAYER, then use it. Never inline it.
- MUST NOT define magic numbers inline. Name them.

### 8.3 Repeated class strings signal a missing component

If this keeps appearing across files:

```text
className="rounded-xl border border-border-default bg-surface p-6 shadow-sm"
```

…the application is probably missing a `<Card />`.

Repetition is a **signal to investigate, not a counter to reach.** There is no magic number
of occurrences. Apply §6.0: if the repeated markup represents the same concept everywhere it
appears, extract it into a component. If the resemblance is coincidental, leave it —
extracting it would couple unrelated things together.

When it is genuinely one concept, extract it **early**, before it becomes the snippet every
future page copies.

Unexplained style blobs copied into page implementations are FORBIDDEN.

### 8.4 Visual consistency

The same conceptual element MUST look and behave identically everywhere.

Every primary button MUST share: height · padding · typography · border radius · hover
state · focus state · disabled state · loading state.

**Agents MUST NOT independently redesign an existing component inside a new page.**
If the design truly changed, change it in the component (§6.9) — not locally.

---

## 9. CORE UI CONCERNS

### 9.1 Images

Images drift across pages faster than anything else. A reusable image strategy is REQUIRED.

- ALWAYS use `next/image`. MUST NOT use raw `<img>` except for genuine edge cases
  (inline SVG sprites, email templates) with a comment explaining why.
- `next.config.ts` ALREADY configures `formats: ["image/avif", "image/webp"]`, device sizes,
  image sizes, and a 30-day `minimumCacheTTL`. MUST NOT override these per-usage.
- ALWAYS provide `alt`. Decorative images MUST use `alt=""`, never a missing attribute.
- ALWAYS provide `sizes` for responsive/`fill` images — omitting it ships oversized images.
- ALWAYS reserve space (explicit `width`/`height`, or a ratio wrapper with `fill`) to
  prevent **layout shift**.
- Use `priority` ONLY for genuine above-the-fold LCP images. Never on every image.
- The shared `Image` primitive MUST own: aspect ratio · object-fit · fallback · loading
  behaviour · responsive sizing · error state · alt handling.
- Pages MUST NOT create bespoke image wrappers.
- Remote images REQUIRE an `images.remotePatterns` entry in `next.config.ts`.

### 9.2 Loading states

MUST NOT recreate loaders. Use the centralized set and pick by context:

| Context                        | Required component                             |
| ------------------------------ | ---------------------------------------------- |
| Action in progress on a button | `<Button loading />`                           |
| Content block / card data      | `<CardSkeleton />` / `<Skeleton />`            |
| Full route transition          | `loading.tsx` (App Router) or `<PageLoader />` |
| Inline indeterminate wait      | `<Spinner />`                                  |

- Skeletons SHOULD match the shape of the content they replace, to avoid layout shift.
- A loading state MUST NOT remove focus or collapse layout height unexpectedly.
- Loading states MUST be consistent across the app — no page-local spinner variants.

### 9.3 Empty and error states

REQUIRED reusable components for: empty · not-found · API error · permission denied ·
offline/network failure · retry action.

- MUST NOT build custom error UI inside each page.
- Every list/collection view MUST handle the empty case explicitly.
- Error states MUST offer a recovery path (retry, navigate away) where one exists.
- Use the App Router's `error.tsx` / `not-found.tsx` conventions for route-level failures,
  with the shared state components rendered inside them.

### 9.4 All UI states are REQUIRED

Reusable components MUST account for every relevant state:

```text
default · hover · focus · focus-visible · active · disabled · loading · error · empty · selected
```

**Agents MUST NOT implement only the happy path.** A `Button` without a disabled style and
a visible focus ring is incomplete, not "done."

### 9.5 Forms

A consistent form architecture is REQUIRED. Standardize: field · label · helper text ·
validation error · disabled state · loading state · required indicator.

- ALWAYS use the shared `FormField` wrapper rather than assembling label + input + error
  markup per form.
- Every input MUST have an associated `<label>` (`htmlFor` ↔ `id`). Placeholder is NOT a label.
- Validation errors MUST be programmatically associated (`aria-describedby`) and
  `aria-invalid` MUST be set.
- Validation schemas MUST live in `src/lib/validations.ts` (or a feature's `validations`)
  and be **shared between client and server**. Never duplicate validation rules.
- Client-side validation is UX. **Server-side validation is the security boundary** and is
  ALWAYS REQUIRED (§17).
- Since React Hook Form is not installed (§2.2), prefer native form semantics and React 19
  form handling. Do not add a form library without following §21.

### 9.6 Responsive design

Every UI implementation MUST consider mobile · tablet · desktop, and wide displays where relevant.

- MUST NOT develop only for the width in a screenshot.
- ALWAYS design mobile-first; add complexity at larger breakpoints.
- MUST NOT use fixed pixel widths where a responsive alternative works.
- Reusable components MUST own their responsive behaviour so pages do not re-specify it.
- ALWAYS use Tailwind's configured breakpoints; MUST NOT invent one-off media queries.
- Interactive targets MUST be large enough for touch (~44px).
- Verify no horizontal overflow at 320px width.

---

## 10. NEXT.JS APP ROUTER RULES

Verified: Next.js 15.5.19, App Router, React 19, `reactStrictMode: true`.

### 10.1 Server Components are the default

- Server Components MUST remain the default. `"use client"` is an **opt-in exception**.
- MUST NOT add `"use client"` to a file merely because it contains JSX.
- BEFORE adding `"use client"`, confirm the file genuinely needs: state, effects, event
  handlers, browser APIs, or a client-only library.
- ALWAYS keep the client boundary **as small and as low in the tree as practical**. Extract
  the interactive fragment into its own small client component instead of marking a whole
  page or layout as client.
- `"use client"` is **contagious**: everything it imports becomes client code. Marking a
  layout or a barrel file as client can drag the entire app into the bundle. Never do it
  casually.
- Server Components MUST NOT be passed non-serializable props (functions, class instances).
  Pass data down; pass interactivity in via `children` composition.

### 10.2 Data fetching

- ALWAYS fetch on the server where the data is needed. MUST NOT add a client-side `useEffect`
  fetch for data that a Server Component can await directly.
- MUST NOT create a Route Handler purely to let a client component fetch data the server
  could have rendered.
- ALWAYS fetch in parallel when requests are independent (`Promise.all`) — do not create
  accidental request waterfalls with sequential `await`s.
- Respect the framework's caching/revalidation model. Set caching intentionally
  (`revalidate`, `cache`, `dynamic`) and comment **why** when it is non-obvious.
- MUST NOT disable caching globally to fix a single stale-data bug.

### 10.3 Server-only code

- Server-only modules (`src/lib/resend.ts`, anything reading secrets) MUST NEVER be imported
  into a client component. Add `import "server-only"` to such modules when in doubt.
- MUST NOT move server logic into the browser to "simplify" a boundary problem.
- Route Handlers and Server Actions are the correct home for privileged operations.

### 10.4 Framework-native capabilities — use them

| Need           | Required approach                                                           |
| -------------- | --------------------------------------------------------------------------- |
| Navigation     | `next/link` — MUST NOT use raw `<a>` for internal routes                    |
| Images         | `next/image` (§9.1)                                                         |
| Fonts          | `next/font` — self-hosted, no layout shift; MUST NOT add `<link>` font tags |
| Metadata / SEO | the `metadata` export / `generateMetadata` — MUST NOT hand-write `<head>`   |
| Route loading  | `loading.tsx`                                                               |
| Route errors   | `error.tsx` (client component) / `global-error.tsx`                         |
| 404            | `not-found.tsx` + `notFound()`                                              |
| Redirects      | `redirect()` / `permanentRedirect()`                                        |

The root layout already defines `metadata` and `viewport` exports. Extend that pattern;
per-route metadata MUST be added via the route's own `metadata` export.

### 10.5 Hydration

- MUST NOT render values that differ between server and client during the initial render:
  `Date.now()`, `Math.random()`, `new Date().toLocaleString()`, `window`/`localStorage` reads.
- Client-only values MUST be read inside `useEffect`, or the subtree deferred, or
  `suppressHydrationWarning` applied **narrowly** with a comment explaining why.
- MUST NOT wrap large subtrees in `suppressHydrationWarning` to silence a real bug.
- Invalid HTML nesting (`<div>` inside `<p>`, `<a>` inside `<a>`) causes hydration errors.
  Semantic correctness is not optional.

### 10.6 Route Handlers

Follow the canonical pattern already established in `src/app/api/contact/route.ts` (§2.5).

- ALWAYS validate the body with Zod `safeParse`.
- ALWAYS return typed, consistent JSON shapes.
- ALWAYS use correct status codes.
- MUST NOT return raw provider/database errors to the client.

---

## 11. TYPESCRIPT RULES

`strict: true` is enabled. Maintain it.

### 11.1 Forbidden escapes

```ts
// ❌ ALL FORBIDDEN as a way to silence the compiler
any
as any
as unknown as Foo
// @ts-ignore
// @ts-expect-error   (without a description AND a justification comment)
!  // non-null assertion used to bypass a real nullability question
```

**NEVER fix a type error by weakening a type.** Fix the actual typing problem.

If `any` is genuinely unavoidable (untyped third-party surface), you MUST:
use `unknown` first and narrow, and if `any` survives, add a comment stating why.

`@ts-expect-error` is permitted ONLY with a description and a comment explaining the
upstream cause — and it MUST be removed when the cause is fixed.

### 11.2 Required practices

- ALWAYS declare explicit interfaces/types for component props, exported functions, and
  API responses.
- ALWAYS prefer **discriminated unions** over optional-field soup for variant state:

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

- ALWAYS type callbacks, hook return values, and generics explicitly where inference is unclear.
- ALWAYS derive types from a single source rather than restating them:
  `type ContactFormValues = z.infer<typeof contactSchema>;` (already the pattern in
  `src/lib/validations.ts` — follow it).
- Data crossing a trust boundary (request bodies, external APIs, `JSON.parse`) MUST be
  **validated at runtime with Zod**, not merely asserted with a TypeScript cast.
  A TypeScript type is **not** a runtime guarantee.
- MUST NOT use `Function`, `object`, or `{}` as types.
- Prefer `type` for unions and `interface` for object shapes that may be extended; be
  consistent within a file.

---

## 12. STATE MANAGEMENT

### 12.1 Do not create unnecessary state

BEFORE adding state, you MUST determine whether the value can instead be:

- derived from props
- derived from existing state
- derived from URL parameters
- obtained from server data
- calculated during render

**Derived values MUST be computed, not stored.** Storing derived data creates stale state.

```tsx
// ❌ stale-state bug waiting to happen
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce((s, i) => s + i.price, 0)), [items]);

// ✅ derive during render
const total = items.reduce((sum, item) => sum + item.price, 0);
```

### 12.2 Classify state correctly

| Kind                                                     | Belongs in                                    |
| -------------------------------------------------------- | --------------------------------------------- |
| Local UI state (open/closed, hover)                      | `useState` in the nearest client component    |
| Form state                                               | the form component / shared form architecture |
| Server data                                              | Server Components; fetched on the server      |
| Shareable/bookmarkable state (filters, tabs, pagination) | **the URL** (search params)                   |
| Global app state                                         | context — only when genuinely cross-cutting   |

- MUST NOT put everything into a global store.
- MUST NOT duplicate server data into client state without a clear reason — it desynchronizes.
- Filter/sort/pagination state SHOULD live in the URL so it survives reload and sharing.
- No global state library is installed (§2.2). React Context is the sanctioned mechanism.
  Do not add a state library without following §21.

### 12.3 `useEffect` discipline

Most `useEffect` usage written by AI agents is unnecessary. An effect is for
**synchronizing with an external system** — not for reacting to renders.

You MUST NOT use `useEffect` to:

- transform data for rendering → derive during render
- reset state when a prop changes → use a `key` to remount instead
- handle a user event → do it in the event handler
- cascade one state update into another → compute both at once

When an effect IS correct, it MUST:

- declare a **complete, honest** dependency array — NEVER remove a dependency to stop a loop
- **clean up**: abort controllers, clear timers/intervals, remove listeners, cancel subscriptions
- guard against races: ignore stale async results

```tsx
useEffect(() => {
  const controller = new AbortController();
  let active = true;

  void (async () => {
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (active) setData(await res.json());
    } catch (err) {
      if (!controller.signal.aborted) setError(err); // never swallow silently
    }
  })();

  return () => {
    active = false;
    controller.abort();
  };
}, [url]);
```

### 12.4 Prop drilling vs context

- Passing a prop through a few layers is fine and explicit. Do NOT reach for context immediately.
- Deep drilling of the same prop through many unrelated layers is a signal to use
  **composition** (`children`) first, and context only if that fails.
- Context MUST NOT be used for high-frequency values — it re-renders all consumers.

---

## 13. DATA & API ARCHITECTURE

- MUST NOT scatter ad-hoc `fetch` calls through components once an abstraction exists.
- ALWAYS centralize API interaction in the project's data layer (`src/lib/`, `src/services/`,
  or a feature's `services/`).
- ALWAYS type API responses and validate untrusted payloads at the boundary (§11.2).
- MUST NOT duplicate the same request in multiple components — hoist it, or rely on
  framework-level request deduplication/caching.
- ALWAYS handle the failure path. **Swallowed errors are FORBIDDEN:**

```ts
// ❌ FORBIDDEN
try {
  await doThing();
} catch {}
try {
  await doThing();
} catch (e) {
  console.log(e);
} // and then continue as if fine
```

An error MUST be surfaced to the user, logged with context, or deliberately handled with a
comment explaining why it is safe to ignore.

- ALWAYS guard against race conditions in concurrent requests (latest-wins, abort stale).
- MUST NOT fire the same mutation twice — disable the trigger while in flight.

---

## 14. ONE SOURCE OF TRUTH

There MUST be exactly one authoritative definition for:

```text
API endpoints · route paths · enums · configuration · constants · validation rules
formatting logic · business rules · shared types · design tokens
```

- A value referenced from **more than one module** — a route path, an endpoint, a storage
  key, a business threshold — MUST have one definition that every use imports
  (e.g. `ROUTES.products` in `src/constants/`). A genuinely single-use literal does not need
  indirection; wrapping it in a constant adds ceremony without removing risk. This rule
  targets values that **drift when duplicated**, not every string in the codebase.
- MUST NOT restate a Zod schema's shape as a separate TypeScript interface — infer it.
- Unexplained numbers and strings MUST be given meaningful names. A value whose meaning is
  self-evident in context does not need extracting: `MAX_RETRIES = 3` earns its name,
  `const TWO = 2` does not.
- Environment variables MUST be read in one place per concern, not inline across the app.

### 14.1 Hooks

Repeated logic MUST be extracted into reusable hooks when it appears in multiple components:
`useDebounce` · `usePagination` · `useMediaQuery` · `useDisclosure` · `usePermissions` ·
`useProductFilters`.

- MUST NOT copy-paste the same `useEffect` into multiple components.
- MUST NOT create a hook that wraps a single `useState` with no added behaviour.
- Global hooks → `src/hooks/`. Feature hooks → `src/features/<f>/hooks/`.
- Hooks MUST follow the rules of hooks: top level only, never conditional.

### 14.2 Utilities

Repeated logic — currency formatting · date formatting · URL construction · validation ·
sorting · transformation · string formatting · query building — MUST live in reusable
utilities, not be copied into components.

Utilities MUST be pure, typed, and independently testable.

### 14.3 Separation of concerns

A single React component MUST NOT contain all of: API calls, validation, business logic,
data transformation, UI, analytics, permissions, and formatting.

Extract into services · hooks · utilities · domain functions · components —
**when complexity justifies it**, not reflexively.

---

## 15. ACCESSIBILITY — MANDATORY

Accessibility is a requirement, not an enhancement. `eslint-plugin-jsx-a11y` ships with
`next/core-web-vitals`; lint failures here MUST NOT be suppressed.

- ALWAYS use semantic HTML: `<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<ul>`, `<h1>`–`<h6>`.
- **NEVER make a clickable `<div>` when a `<button>` is appropriate.**
- Element semantics are REQUIRED to match behaviour:
  navigates → `<a>` / `next/link`; performs an action → `<button>`.
- ALWAYS ensure full keyboard operability: Tab, Enter, Space, Escape, arrow keys where relevant.
- ALWAYS preserve a **visible focus indicator**. `outline: none` without a replacement is FORBIDDEN.
- Modals/drawers MUST trap focus, close on Escape, restore focus to the trigger on close,
  and mark background content inert.
- ALWAYS label form controls (§9.5). ALWAYS provide meaningful `alt` text (§9.1).
- Use ARIA **only when semantic HTML cannot express the intent**. Incorrect ARIA is worse
  than none.
- Icon-only controls MUST have an accessible name (`aria-label` or visually hidden text).
- ALWAYS meet WCAG AA contrast. Token choices MUST be checked, not assumed.
- Dynamic content updates (toasts, async results) SHOULD be announced via a live region.
- Respect `prefers-reduced-motion` for non-essential animation.
- Heading hierarchy MUST be logical — no skipping levels for visual sizing. Use the
  `Heading` primitive's `as` / `size` split for that.

---

## 16. PERFORMANCE

Evidence-based and architecture-aware. **Premature optimization is FORBIDDEN.**

- MUST NOT wrap everything in `memo` / `useMemo` / `useCallback` reflexively. React 19 and
  its compiler handle most cases; needless memoization adds cost and noise.
  Memoize when there is a measured problem or a genuinely expensive computation.
- ALWAYS prefer moving work to the server over optimizing client work (§10.1).
- ALWAYS provide stable, unique `key`s from data identity. **Array index keys are FORBIDDEN**
  for lists that reorder, filter, or mutate.
- ALWAYS lazy-load genuinely heavy, below-the-fold, or conditionally rendered features.
  MUST NOT lazy-load trivial components — it adds waterfalls.
- ALWAYS prevent layout shift: reserve space for images, embeds, and async content (§9.1).
- MUST NOT ship large dependencies for trivial functionality (§21).
- MUST NOT create duplicate network requests for the same data.
- Avoid unnecessary client-side JavaScript — it is the dominant performance lever here.

---

## 17. SECURITY

- NEVER expose API secrets, private keys, tokens, or credentials to client-side code.
- Only `NEXT_PUBLIC_*` variables reach the browser. `RESEND_API_KEY` and `CONTACT_EMAIL`
  are server-only and MUST NEVER be renamed with a `NEXT_PUBLIC_` prefix.
- NEVER commit `.env`. It is gitignored; `.env.example` documents the keys without values.
- NEVER log secrets, full request bodies containing PII, or tokens.
- ALWAYS validate and sanitize input server-side. **Client input is never trustworthy.**
- **Frontend visibility is NOT authorization.** Hiding a button does not protect an endpoint.
  Every privileged operation MUST be authorized on the server.
- `dangerouslySetInnerHTML` is FORBIDDEN without sanitization and an explicit justification.
- MUST NOT weaken the security headers in `vercel.json`
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS).
  Changing them REQUIRES explicit approval.
- Error responses MUST NOT leak internal details (§2.5).

---

## 18. TESTING — CURRENT REALITY

**No test framework is installed in this repository** (verified: no Vitest, Jest, Testing
Library, Playwright, or Cypress).

Therefore:

- MUST NOT claim tests pass. MUST NOT invent a `pnpm test` command.
- MUST NOT add a test framework unilaterally — that is an architectural decision (§21). Propose it.

**Until a runner exists, the REQUIRED validation gate is:**

```bash
pnpm typecheck && pnpm lint && pnpm build
```

**Once a test runner is adopted**, these rules apply:

- Prioritize: business logic · utilities · validation schemas · critical flows · reusable
  hooks · complex components · bug fixes.
- When fixing a bug, ADD A REGRESSION TEST that fails before the fix.
- Test behaviour, not implementation details.
- MUST NOT write meaningless tests purely for coverage numbers.

---

## 19. NAMING

Names MUST describe **responsibility**, not implementation detail or history.

```text
✅ GOOD:  ProductCard · CheckoutSummary · UserAvatar · SearchFilters · useProductFilters
❌ BAD:   BlueBox · LeftThing · NewComponent · Card2 · UpdatedButton · FinalModal · helper
```

- FORBIDDEN name fragments: `New`, `Old`, `Final`, `Updated`, `V2`, `Copy`, `Temp`, `Test`
  — unless versioning is genuinely intentional and documented.
- Components: `PascalCase`. Hooks: `useCamelCase`. Utilities/variables: `camelCase`.
  Constants: `SCREAMING_SNAKE_CASE`. Types/interfaces: `PascalCase`.
- Component files: `PascalCase.tsx` matching the component name. Non-component modules:
  `kebab-case.ts` or `camelCase.ts` — match the directory's existing convention.
- Booleans read as predicates: `isLoading`, `hasError`, `canEdit`.
- Handlers: `handleSubmit` (implementation) / `onSubmit` (prop).
- MUST NOT abbreviate domain terms inconsistently (`prod` vs `product`).
- Naming MUST be consistent across the codebase. When in doubt, match the nearest precedent.

---

## 20. REFACTORING & TECHNICAL DEBT

### 20.1 Delete dead code

AFTER replacing an implementation you MUST remove: obsolete imports · unused variables ·
unused components · dead CSS · deprecated utilities (when safe) · commented-out code.

- MUST NOT leave an old implementation beside a new one "just in case." Git is the safety net.
- MUST NOT leave commented-out blocks of code in the repository.

### 20.2 Do not break existing behaviour

See §6.9 for shared components. Generally: inspect usages → preserve compatibility →
migrate consumers deliberately.

### 20.3 Comments

Comments MUST explain **why**, never restate **what**.

```ts
// ❌ noise
// increment counter
counter++;

// ✅ valuable
// Resend's shared sender domain is rate-limited; swap once our domain is verified.
```

Write comments for: non-obvious business behaviour · constraints · architectural decisions ·
workarounds and their trigger conditions.

### 20.4 TODOs

Vague TODOs are FORBIDDEN.

```ts
// ❌ // TODO fix later
// ✅ // TODO: replace onboarding@resend.dev once FlayerX.studio DNS is verified — blocks custom reply-to.
```

A TODO MUST be specific enough for another engineer to act on without context.

### 20.5 Existing patterns first

The repository is an important source of truth. BEFORE inventing a new architectural pattern,
inspect how similar functionality is already implemented.

Consistency is normally more valuable than local optimality.

**However:** existing duplication or clearly poor practice MUST NOT be blindly copied.
Improve it carefully through reusable abstraction — and say what you changed and why.

---

## 21. DEPENDENCIES

BEFORE installing any package you MUST, in order:

1. Check whether the project already has functionality for the task.
2. Check whether an existing dependency already solves it.
3. Check whether it can reasonably be implemented without another dependency.
4. **Ask the maintainer.** Adding a dependency is an architectural decision.

- MUST NOT add packages for trivial functionality (a date format, a `clsx` re-implementation,
  a debounce, a uuid).
- MUST NOT re-add any package removed during the teardown (§2.2) without explicit approval.
- MUST NOT add a package that duplicates an installed one's capability.
- ALWAYS use **pnpm** (`pnpm add`), never npm or yarn — it would corrupt the lockfile.
- AFTER any dependency change, `pnpm-lock.yaml` MUST be updated and committed, or the
  Vercel build fails on `--frozen-lockfile`.
- Consider bundle cost, maintenance status, and whether it pulls in client JavaScript.

---

## 22. COMMON AI AGENT FAILURE MODES — PREVENTATIVE RULES

These are the specific, recurring ways AI agents damage React/Next.js/TypeScript codebases.
Each is FORBIDDEN here. This section exists because these mistakes are predictable.

| #   | Failure mode                                                                                                                              | Rule                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | **The god page** — one enormous page file re-implementing every primitive                                                                 | §0, §5.4. Compose from the system.                       |
| 2   | **Silent duplication** — rewriting something that exists because searching felt slow                                                      | §3.1. Search first, always.                              |
| 3   | **Copy-paste-and-tweak** as the default strategy                                                                                          | §6.5. Refactor the original into a reusable abstraction. |
| 4   | **Inconsistent architecture** — a new folder/pattern per feature                                                                          | §20.5. Match existing precedent.                         |
| 5   | **Giant components** with tangled responsibilities                                                                                        | §6.8. Split on responsibility, not line count.           |
| 6   | **`"use client"` everywhere**, often on layouts or barrel files                                                                           | §10.1. Smallest possible boundary.                       |
| 7   | **`useEffect` for derived data**                                                                                                          | §12.1, §12.3. Derive during render.                      |
| 8   | **Missing effect cleanup** — leaked timers, listeners, subscriptions                                                                      | §12.3. Always return a cleanup.                          |
| 9   | **Dishonest dependency arrays** — removing deps to stop a loop                                                                            | §12.3. Fix the cause, not the array.                     |
| 10  | **Race conditions** — stale async responses overwriting fresh state                                                                       | §12.3, §13. Abort or ignore stale.                       |
| 11  | **Swallowed errors** — `catch {}` or `catch { console.log(e) }` then continue                                                             | §13. Surface, log with context, or justify.              |
| 12  | **Unnecessary API calls** — refetching what the server already rendered                                                                   | §10.2.                                                   |
| 13  | **Request waterfalls** — sequential awaits for independent data                                                                           | §10.2. `Promise.all`.                                    |
| 14  | **Hydration mismatches** — `Date.now()`, `window`, random values in initial render                                                        | §10.5.                                                   |
| 15  | **Unsafe casts** — `as any`, `@ts-ignore` to clear a build error                                                                          | §11.1. Fix the type.                                     |
| 16  | **Type assertions instead of runtime validation** at trust boundaries                                                                     | §11.2. Zod-validate.                                     |
| 17  | **Dependency bloat** — a package for a ten-line utility                                                                                   | §21.                                                     |
| 18  | **Hardcoded values** — colors, URLs, magic numbers inline                                                                                 | §8.2, §14.                                               |
| 19  | **Arbitrary Tailwind values** — `mt-[17px]` instead of a token                                                                            | §8.2.                                                    |
| 20  | **Inconsistent loading states** — a different spinner per page                                                                            | §9.2.                                                    |
| 21  | **Happy-path-only UI** — no empty, error, disabled, or loading state                                                                      | §9.4.                                                    |
| 22  | **Layout shift** — unsized images, unreserved async content                                                                               | §9.1, §16.                                               |
| 23  | **Poor image handling** — raw `<img>`, missing `sizes`, `priority` everywhere                                                             | §9.1.                                                    |
| 24  | **Accessibility failures** — clickable `<div>`, removed focus ring, unlabelled input                                                      | §15.                                                     |
| 25  | **Index keys** in dynamic lists                                                                                                           | §16.                                                     |
| 26  | **Blind memoization** of everything                                                                                                       | §16.                                                     |
| 27  | **Premature abstraction** — a generic component for one speculative use case                                                              | §6.6.                                                    |
| 28  | **Premature optimization** without measurement                                                                                            | §16.                                                     |
| 29  | **Excessive global state** — putting local UI state in a global store                                                                     | §12.2.                                                   |
| 30  | **Duplicated server data** in client state, drifting out of sync                                                                          | §12.2.                                                   |
| 31  | **Prop drilling** where composition would be cleaner                                                                                      | §12.4.                                                   |
| 32  | **Scope creep** — refactoring unrelated files during a feature task                                                                       | §4.4.                                                    |
| 33  | **Leaving both implementations** — old and new side by side                                                                               | §20.1.                                                   |
| 34  | **Inventing technology** — writing Redux/shadcn/React Query code that isn't installed                                                     | §2.2.                                                    |
| 35  | **Claiming unverified success** — "tests pass" with no test runner; "build works" without running it                                      | §18, §26.                                                |
| 36  | **Narrating instead of inspecting** — asserting what the codebase contains without reading it                                             | §3.                                                      |
| 37  | **Secrets in client code** or `NEXT_PUBLIC_` on a private key                                                                             | §17.                                                     |
| 38  | **Uncontrolled technical debt** — vague TODOs, commented-out code, dead files                                                             | §20.3, §20.4.                                            |
| 39  | **Fighting the formatter** — hand-sorting Tailwind classes, `prettier-ignore`                                                             | §2.6.                                                    |
| 40  | **Redesigning a shared component locally** inside one page                                                                                | §8.4, §6.9.                                              |
| 41  | **Resemblance-driven reuse** — merging unrelated concepts because the markup matched, or forking one concept because its styling differed | §6.0. Decide by responsibility.                          |

---

## 23. REDESIGN PROTOCOL

This project is actively being redesigned. These rules govern that work specifically.

### 23.1 Design system first, page assembly second

When given a design (screenshots, Figma, description), you MUST NOT interpret each screen
independently and build it in isolation.

**BEFORE implementing any page, you MUST first identify the common visual language:**

```text
typography scale · color roles · spacing rhythm · border radii · shadows · borders
button styles · input styles · card treatment · image treatment · icon style
navigation patterns · section spacing · responsive behaviour
```

Then: **build or update the foundations first, and compose pages from them.**

### 23.2 Progressive reuse across pages

Early implementations carry the cost of building the foundations; later ones should be
increasingly pure composition. Expect the ratio of _new primitive code_ to _composition_ to
fall steadily as the redesign progresses — if it is not falling, something is being rebuilt.

- Invest properly in a primitive the first time its pattern appears. Rushing here produces
  exactly the duplication the rest of this document exists to prevent.
- When a later page **cannot** reuse an existing primitive, treat that as a signal that the
  primitive's API is wrong. Fix the primitive (§6.9) — MUST NOT fork a page-local copy.
- If reuse keeps failing for the same component, the abstraction itself is wrong. Stop and
  reconsider its responsibility (§6.0) instead of piling on more variants.

MUST NOT independently redesign each page.

### 23.3 Changing the system

If the new design requires changing the global component system, **update the design system
deliberately** (§6.9). MUST NOT bypass it with page-specific CSS overrides.

### 23.4 Preserve business behaviour

A visual redesign MUST NOT silently change behaviour. Unless explicitly requested, preserve:

```text
API behaviour · permissions · analytics · validation rules · URL structure
form submission · data transformations · accessibility · tracking · business rules
```

The contact endpoint (`src/app/api/contact/route.ts`) and its schema are **working
behaviour**. A redesign of the contact UI MUST keep posting the same payload shape
(`{ name, email, message }`) to the same endpoint unless a change is explicitly requested.

Separate visual refactoring from behaviour changes wherever practical.

---

## 24. FORBIDDEN PATTERNS — QUICK REFERENCE

```tsx
// ❌ Hand-rolled primitive when one exists or should exist
<button className="rounded bg-violet-500 px-4 py-2 text-white">Save</button>

// ❌ Raw img
<img src={product.image} />

// ❌ Clickable div
<div onClick={handleClick}>Delete</div>

// ❌ Arbitrary values / hardcoded color
<div className="mt-[17px] rounded-[13px] bg-[#a855f7]" />

// ❌ Silencing the type system
const data = response as any;

// ❌ Swallowed error
try { await send(); } catch {}

// ❌ Effect for derived state
useEffect(() => setTotal(calc(items)), [items]);

// ❌ Client component for static content
"use client";
export default function AboutPage() { return <p>About us</p>; }

// ❌ Index key in a dynamic list
{items.map((item, i) => <Row key={i} {...item} />)}

// ❌ Near-duplicate components
ProductCard.tsx · FavoriteProductCard.tsx · FeaturedProductCard.tsx

// ❌ Secret exposed to the browser
NEXT_PUBLIC_RESEND_API_KEY=...

// ❌ Vague debt
// TODO: fix later
```

---

## 25. PRE-IMPLEMENTATION CHECKLIST — REQUIRED

BEFORE writing code, you MUST be able to answer all eleven:

```text
□ 1.  What exactly am I implementing? (restate it)
□ 2.  Which existing components can I reuse?
□ 3.  Which existing hooks can I reuse?
□ 4.  Which existing utilities can I reuse?
□ 5.  Which types already exist?
□ 6.  Which design tokens / styles already exist?
□ 7.  Is there an existing implementation of this elsewhere in the app?
□ 8.  Am I about to duplicate anything?
□ 9.  For anything I plan to merge or fork: would ONE decision change both? (§6.0)
□ 10. Does this belong in a shared component, a feature component, or page-local?
□ 11. What existing functionality could my change affect?
```

Answering from assumption instead of inspection is a violation of §3.1.

---

## 26. POST-IMPLEMENTATION REVIEW — REQUIRED

AFTER implementing, and BEFORE declaring the task complete, you MUST review your own work.

**Reuse**

```text
□ Did I duplicate an existing component?
□ Did I duplicate logic that already exists?
□ Could this reuse more existing primitives than it does?
□ Did I introduce a repeated class string that should be a component?
□ Did I merge two concepts that only looked alike, or fork one that did not? (§6.0)
```

**Architecture**

```text
□ Are files in the correct architectural location?
□ Did I create unnecessary abstractions?
□ Did I build page-specific UI that should be reusable?
□ Did I respect the dependency direction (§4.1)?
```

**Code quality**

```text
□ Are imports clean and unused ones removed?
□ Is dead code — including what I replaced — deleted?
□ Are types correct, with no `any` / `@ts-ignore` / unsafe casts?
□ Are names clear and consistent?
□ Are comments explaining "why", not "what"?
```

**UI**

```text
□ Is it responsive (mobile → wide)?
□ Are loading, empty, and error states handled?
□ Are hover, focus, active, disabled, selected states styled?
□ Is it keyboard accessible with a visible focus indicator?
□ Does it use design tokens rather than arbitrary values?
□ Is layout shift prevented?
```

**Safety**

```text
□ Did I check every consumer of each shared component I modified?
□ Did I preserve existing business behaviour (§23.4)?
□ Are secrets still server-side only?
```

**Validation — MUST actually be run, not assumed**

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm format
```

Every problem your change introduced MUST be fixed before finishing.
Report real results. **NEVER claim a check passed without running it.**

---

## 27. DEFINITION OF DONE

A task is complete ONLY when **all** of the following are true.
Visual correctness alone is NOT completion.

```text
□ The required functionality works
□ Existing reusable components were used wherever appropriate
□ New reusable abstractions are correctly located (§4.2)
□ No unnecessary duplication was introduced
□ `pnpm typecheck` passes
□ `pnpm lint` passes
□ `pnpm build` succeeds
□ Code is formatted (`pnpm format`)
□ Relevant tests pass — or it is stated plainly that no test runner exists (§18)
□ Responsive behaviour was checked
□ Accessibility was considered and basic keyboard operation works
□ Loading / error / empty states are handled where relevant
□ Dead code and obsolete implementations are removed
□ Architecture remains consistent with this document
□ Existing behaviour was not unintentionally broken
□ No secrets are exposed to the client
□ Another engineer could understand the code without asking questions
```

---

## 28. COMMAND REFERENCE

```bash
pnpm install          # install dependencies (pnpm only — never npm/yarn)
pnpm dev              # development server → http://localhost:3000
pnpm build            # production build (the real validation gate)
pnpm start            # serve the production build
pnpm lint             # ESLint
pnpm lint:fix         # ESLint with autofix
pnpm format           # Prettier write (includes Tailwind class sorting)
pnpm format:check     # Prettier check
pnpm typecheck        # tsc --noEmit
```

**Environment variables** (`.env` is gitignored; `.env.example` documents the keys):

| Variable               | Scope           | Purpose                                         |
| ---------------------- | --------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | client + server | Public URL for metadata/OG. Optional on Vercel. |
| `RESEND_API_KEY`       | **server only** | Resend API key. NEVER expose.                   |
| `CONTACT_EMAIL`        | **server only** | Contact form recipient.                         |

---

## 29. AMENDING THIS DOCUMENT

This file is the project's constitution. When the architecture legitimately evolves:

- Update this file **in the same change** that introduces the new pattern.
- Keep §2 (Repository Facts) accurate — it is the section agents trust most, and a stale
  stack table causes invented-technology failures (§22.34).
- MUST NOT delete a rule to make a violating implementation acceptable.

---

> ### Remember the Prime Directive
>
> **Before writing new UI code, inspect and reuse the existing component system.
> Pages are composed from reusable primitives and domain components —
> never rebuilt from scratch inside page-specific files.**
>
> Behave like a senior engineer in a mature codebase, not a code generator.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
