# Safety Plan Web App - Development Context

## Project Overview
A trauma-informed, privacy-first web application for LGBT+ youth to create a personalized safety plan during mental health emergencies. The app is designed to feel calm, non-judgmental, and supportive while giving users full control over their information.

## Product Direction
This project is being built as a frontend-first experience with a simple, browser-based admin panel. The first version prioritizes:
- privacy and autonomy
- accessibility and readability
- clear, supportive guidance
- a calm mobile-first experience
- content that can be updated by authorized admins without a database

## Core Values
- Privacy first: no accounts, no persistent user tracking, no analytics
- Accessibility: WCAG 2.1 AA minimum target
- Trauma-informed: non-clinical, non-shaming language and no forced interactions
- Autonomy: users control their plan and can choose what to share
- Safety-minded: clear crisis resources and calm, supportive UX

## Current Technical Stack
- Frontend: React with TypeScript
- Build tool: Vite
- Styling: Tailwind CSS
- Routing: React Router
- Persistence:
  - safety plan data: sessionStorage
  - admin configuration: localStorage
- Hosting target: Vercel
- Backend: not required for the first version; admin content is edited directly in the browser through a password-protected page

## Current Implementation Status
The initial version now includes:
- a welcome page with an introduction to safety planning
- a resources page with crisis support links and community resources
- a six-step wizard for building a personalized safety plan
- a completed plan view that can be printed
- an admin configuration page with a simple shared password gate
- browser-based persistence for the plan and editable content
- the whole site in English and Spanish, switchable at any time from the navbar (see "Multilanguage (English / Spanish)")
- a region preference (United States / Mexico) in the navbar, with regional date and phone formats (see "Localization (region: United States / Mexico)")

## Core Experience

### 1. Welcome Page
- warm, clear introduction to what a safety plan is
- prominent call to action to start the wizard
- link to resources
- calm, low-pressure language

### 2. Resources Page
- crisis hotlines and supportive resources
- links open in new tabs
- easy to read, accessible layout
- designed for quick access during difficult moments

### 3. Safety Plan Wizard
The wizard is structured as a six-step flow:
1. Warning signs and triggers
2. Coping strategies
3. Support people
4. Professional resources
5. Environment changes
6. Reason for living

UX expectations:
- progress indicator throughout the flow
- simple save/continue behavior using browser storage
- supportive language at each step
- no forced interaction or alarming animation

### 4. Completed Plan Page
- full plan displayed in a clean, printable format
- print action for paper use
- restart action for creating a new plan
- gentle reminder about getting support if needed

### 5. Admin Configuration Page
- password-protected access for editing the app content
- editable content for:
  - app title and description
  - welcome intro text
  - resources list
  - wizard step titles and guidance
- designed to feel like part of the main website rather than a separate admin backend

## Privacy and Data Model
- No user accounts
- No database storage for user plans
- No analytics or third-party trackers
- The safety plan is stored only in the browser session
- Admin content is stored locally in the browser for the current prototype version
- This is intentionally simple and privacy-preserving, not production-grade security

## Accessibility and Design Principles
- mobile-first responsive layout
- semantic HTML and clear heading structure
- large touch targets for mobile use
- readable typography and high contrast
- visible focus states
- no shame-based or overly clinical language
- calm visual design informed by the Figma prototype

## Multilanguage (English / Spanish)
Every page, including the accessibility panel and the admin page, is available in English (`en`) and Spanish (`es`). The user can switch at any moment from the **Language / Idioma** dropdown in the desktop navbar or from the mobile menu, and the admin page has its own language toggle that also selects which language's content is being edited.

### How the language is chosen
- The active language lives in `LanguageProvider` ([LanguageContext.tsx](src/context/LanguageContext.tsx)), mounted in [App.tsx](src/App.tsx) around the routes and the accessibility provider.
- On first load, `loadStoredLanguage()` ([language.ts](src/context/language.ts)) uses a previously saved choice if there is one, otherwise the browser language (`es-*` → Spanish, anything else → English).
- The choice is saved in `localStorage` under `safety-plan-language`. Like the theme, this is a preference, not user data.
- When the language changes, the provider also updates `<html lang>`, the browser tab title and the meta description, so screen readers and the browser use the right language.
- Read-aloud (accessibility panel) uses a voice in the active language, and the panel's section names update after a switch.

### Where the text lives
All user-facing copy lives in `src/data/`, never directly in components. Each content file follows the same pattern:

```ts
export const thingContent = { heading: 'English text', ... };  // English
const en = thingContent;
const es: typeof en = { heading: 'Texto en español', ... };     // Spanish
export function useThingContent() {
  const { language } = useLanguage();
  return language === 'es' ? es : en;
}
```

- `const es: typeof en` makes TypeScript reject a Spanish version that is missing a key or has an extra one.
- Components call the hook (`const { heroContent } = useWelcomeContent();`) and never import text in a specific language.
- Routes, URLs and ids (`to`, `url`, `id`, `stepId`, `field`, `category`) must be identical in both languages; only the text is translated.
- The English exports (`thingContent`) are still exported so existing tests can reference the default copy.

| File | Used by |
| --- | --- |
| `welcomeContent.ts` | navbar, footer, welcome page |
| `resourcesContent.ts` | resources page, "Get help" tab of the accessibility panel |
| `wizardContent.ts` | wizard page and its components |
| `defaultConfig.ts` | wizard steps and options, resources list, admin defaults (`defaultConfig.en` / `defaultConfig.es`) |
| `completedPlanContent.ts` | completed plan page |
| `accessibilityContent.ts` | accessibility widget and panels |
| `adminContent.ts` | admin page |
| `appShellContent.ts` | admin layout (`AppShell`) |
| `themeToggleContent.ts` | dark / light mode button |

### Wizard answers and the language switch
The plan stores the text of the options the user picked (e.g. `"Crying"`). So that answers are not left in the old language, `localizePlan()` in [defaultConfig.ts](src/data/defaultConfig.ts) translates them:
- preset options are matched by their **position** in the step's option list, so `options[i]` in English must mean the same as `options[i]` in Spanish;
- anything the user typed ("Other…") and the final free-text message are kept exactly as written;
- the wizard re-translates its saved plan when the language changes, and the completed plan page translates on display.

### Adding or changing text
1. Edit the English value and the Spanish value in the same `src/data/*Content.ts` file. Both are required.
2. For wizard options, keep both lists in the same order and the same length.
3. Run `npm test`. `src/data/translations.test.tsx` fails if the two languages stop matching.

### Adding another language
1. Add the code to `Language` and `LANGUAGE_OPTIONS` in [language.ts](src/context/language.ts), and update the checks in `loadStoredLanguage()`.
2. Add its title and description to `DOCUMENT_META` in [LanguageContext.tsx](src/context/LanguageContext.tsx).
3. Add a translated object to each file in `src/data/` and return it from that file's hook.
4. Add it to `AppConfig` in [app.ts](src/types/app.ts) and to `defaultConfig`.
5. Add the language to the tests (see "Multilanguage tests" below).

## Localization (region: United States / Mexico)
Separate from the language, the user can say which country they are in from the **Region / Región** dropdown in the desktop navbar or from the mobile menu. Language and region are independent (e.g. Spanish in the United States is valid). The region will decide which resources are shown on the resources page (not wired yet).

### How the region is chosen
- The active region lives in `RegionProvider` ([RegionContext.tsx](src/context/RegionContext.tsx)), mounted in [App.tsx](src/App.tsx) inside `LanguageProvider`.
- On first load, `loadStoredRegion()` ([region.ts](src/context/region.ts)) uses a previously saved choice, otherwise `DEFAULT_REGION` (`us`, the original market). The region is **never detected** from the browser or IP: auto-detection is out of scope.
- The choice is saved in `localStorage` under `safety-plan-region`. Like the language and theme, it is a preference, not user data.
- `useRegion()` without a provider returns `us` with a no-op setter, so components render in isolation.
- The option labels live in `welcomeContent.ts` (`navRegionLabel`, `regionOptions`), in both languages; the codes (`us`, `mx`) are the same in both.

### Regional formats
[locale.ts](src/lib/locale.ts) holds the formatting helpers. Components should use the `useLocale()` hook, which binds them to the current language + region (locale tag `en-US`, `es-MX`, `es-US`, `en-MX`):
- `formatDate` / `formatTime`: `Intl.DateTimeFormat` with the locale (US `3/5/2026`, MX `5/3/2026`).
- `formatPhoneNumber`: US `(866) 488-7386`; MX `55 1234 5678` (Mexico City, Guadalajara, Monterrey) or `222 123 4567`. A leading `+1` / `+52` is accepted. Short codes (`988`, `911`) and anything that is not a 10-digit national number are returned unchanged, so a number is never broken.
- `toTelHref`: international `tel:` link (`tel:+525512345678`); short codes stay as they are.

### Adding another region
1. Add the code to `Region`, `REGION_CODES` and `isRegion()` in [region.ts](src/context/region.ts).
2. Add its label to `regionOptions` in both languages in `welcomeContent.ts`.
3. Add its country code (and phone format, if different) in [locale.ts](src/lib/locale.ts).
4. Add it to the tests below.

### Region tests
| Test file | What it checks |
| --- | --- |
| [region.test.ts](src/context/region.test.ts) | saved region, default `us`, no detection from the browser locale, invalid saved values, no-provider default |
| [RegionContext.test.tsx](src/context/RegionContext.test.tsx) | switching from the desktop dropdown and the mobile menu, saving and restoring the choice, Spanish labels, independence from the language dropdown |
| [locale.test.tsx](src/lib/locale.test.tsx) | locale tags, date/time formats per locale, US/MX phone formats and fallbacks, `tel:` links, `useLocale()` following both selectors |

To start a test in a region, set `localStorage.setItem(REGION_STORAGE_KEY, 'mx')` before rendering; `renderResponsive` already wraps the UI in `RegionProvider`.

## Design Direction
The visual language should remain:
- warm and comforting
- polished but not overly clinical
- simple and easy to read
- trauma-informed and supportive
- consistent with the Figma reference

## Responsive Grid & Layout Rules
These rules define how ANY page adapts across screen sizes. They are the baseline for every layout; a page-specific mobile design (planned separately, per page) becomes the base/mobile layer and these rules govern how it scales up to tablet and desktop, unless a specific design overrides them.

### Breakpoints (Tailwind v4 defaults, mobile-first)
- Base (no prefix): < 640px — phones
- `sm:` ≥ 640px — large phones / small tablets
- `md:` ≥ 768px — tablets
- `lg:` ≥ 1024px — small laptops / desktop (nav switches from mobile menu to full nav, per [WelcomeNavbar.tsx](src/components/welcome/WelcomeNavbar.tsx))
- `xl:` ≥ 1280px — desktop
- `2xl:` ≥ 1536px — large desktop
- Always write base styles for mobile first, then layer `sm:`/`md:`/`lg:`/`xl:` overrides only where the layout structurally changes. Never write desktop-first styles that get undone at smaller sizes.
- Minimum supported width is 320px (see `body { min-width: 320px }` in [index.css](src/index.css)); no layout should ever require horizontal scrolling below that.

### Grid columns
- Mobile (< 640px): 4-column grid, 16px gutters, 24px outer margin (`px-6`)
- Tablet (640–1023px): 8-column grid, 24px gutters, 32–48px outer margin
- Desktop (≥ 1024px): 12-column grid, 32px gutters, up to 64px outer margin (`lg:px-16`)
- Implement with Tailwind `grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8`, or with `flex flex-wrap` + fractional basis utilities when a CSS grid isn't a natural fit (e.g. nav items, pill buttons).
- Content spans should be expressed in column fractions (`col-span-4`, `sm:col-span-4`, `lg:col-span-6`) rather than fixed pixel widths, so sections reflow predictably instead of being redesigned per breakpoint.

### Page container
- Max content width: `1312px`, centered (`mx-auto`) — this is the existing convention from [WelcomeNavbar.tsx](src/components/welcome/WelcomeNavbar.tsx) and should be reused for every page, not reinvented per page.
- Outer horizontal padding scales with breakpoint: `px-6` (mobile) → `px-8` (tablet) → `lg:px-16` (desktop).
- Full-bleed sections (hero backgrounds, color bands) may extend edge-to-edge, but their inner content still sits inside the `max-w-[1312px]` container.

### Spacing
- Use Tailwind's default 4px-based spacing scale exclusively (`gap-4`, `p-6`, `py-12`, etc.). Only drop to an arbitrary value (`px-[…]`) when matching a specific Figma measurement exactly, as already done for the `1312px` container.
- Vertical rhythm between major page sections: `py-12` mobile → `py-16` tablet → `py-24` desktop, unless a specific page design says otherwise.

### Typography
- Body copy line-height stays at ~150–160% at every breakpoint (matches `leading-[160%]` already used for nav/body text).
- Headings may step up one Tailwind text size per breakpoint (e.g. `text-3xl sm:text-4xl lg:text-5xl`) rather than using one fixed size everywhere.

### Touch targets & interaction
- Minimum 44×44px hit area for any interactive element on mobile/tablet (buttons, links, form controls), consistent with the existing accessibility principles.
- Elements that are click/hover-based on desktop (e.g. the language dropdown in the navbar) need a tap-friendly equivalent on touch/mobile — don't rely on `:hover` alone.

### Media & Image Responsiveness
- Images and illustrations scale with `w-full h-auto` or `object-cover`/`object-contain` inside a constrained container; never set fixed pixel `width`/`height` in CSS/inline styles, except for small fixed assets like logos and icons (e.g. the Trevor Project logo in [FeatureShowcase.tsx](src/components/welcome/FeatureShowcase.tsx)).
- Every image sits inside a parent with a `max-w-[…]` or grid/flex constraint (per the Grid columns and Page container rules above) so it can never overflow its column on any breakpoint.
- Use `object-cover` when an image must fill a fixed-aspect box (e.g. a rounded hero image) and `object-contain` when the whole image must stay visible without cropping (e.g. a logo on a colored background).
- Where an image's proportions must stay consistent across breakpoints, set an explicit `aspect-[w/h]` (or `aspect-square`) on the container instead of a fixed height, so it reflows fluidly instead of jumping.
- Swap art direction per breakpoint (e.g. cropped hero image on mobile vs. full illustration on desktop) using `hidden`/responsive `block` pairs only when a page's design explicitly calls for different imagery, not as a default.
- `<img>` tags still need real `width`/`height` attributes (not CSS) matching the source asset's intrinsic ratio, so the browser can reserve space and avoid layout shift — the Tailwind sizing classes then override the rendered size responsively.
- Do not introduce new image assets, crops, or art direction on your own — per the Design & Content Rules above, new images/illustrations must come from the user; this rule only governs how existing/provided images are made responsive.

### How this interacts with page-specific mobile designs
When a mobile design is provided for a given page, treat it as the base (unprefixed) Tailwind classes. Then apply the column/container/spacing rules above to derive the `sm:`/`md:`/`lg:` layers, unless the page design specifies a different tablet/desktop treatment. This keeps every page consistent without requiring a full bespoke design at every breakpoint.

## Unit Tests (Responsiveness)

Every component and page has a co-located `*.test.tsx` unit test whose job is to
prove the component still adapts correctly across screen sizes. The suite is the
executable counterpart of the "Responsive Grid & Layout Rules" above.

### Stack
- Runner: [Vitest](https://vitest.dev) (`vitest.config.ts`, kept separate from
  `vite.config.ts` so the build's `tsc -b` never type-checks it).
- DOM: `jsdom` + React Testing Library + `@testing-library/user-event`.
- Global setup: [src/test/setup.ts](src/test/setup.ts) — jest-dom matchers,
  `matchMedia` / `ResizeObserver` / `scrollTo` polyfills, per-test cleanup.

### Commands
- `npm test` — run the whole suite once (CI mode).
- `npm run test:watch` — watch mode while developing.
- `npm run test:types` — type-check the test files (and app source) against
  `tsconfig.vitest.json`.

### How "responsiveness" is verified
jsdom does not apply CSS or run a layout engine, so the tests cannot measure
rendered pixels. Instead they assert on the responsive **Tailwind utilities**
each component declares — which is where every layout decision in this project
actually lives. The shared helpers are in
[src/test/responsive.tsx](src/test/responsive.tsx):
- `BREAKPOINTS` / `BREAKPOINT_LIST` — 320, 375, 640, 768, 1024, 1280, 1536px
  (the Tailwind v4 defaults plus the two narrowest supported phones).
- `renderResponsive(ui, width, { route })` — render inside a `MemoryRouter` at a
  simulated viewport width.
- `atEachBreakpoint(ui, assert)` — re-render and run an assertion once per
  breakpoint (used for the "renders at every screen width" smoke check).
- `setViewport(width)` — sets `innerWidth` and installs a real `(min|max)-width`
  `matchMedia` evaluator, for any component with JS-driven breakpoints.
- `expectAdaptsAt(container, ['sm','lg', …])` — asserts the subtree declares at
  least one utility at each of those breakpoint prefixes (i.e. it structurally
  changes, not one fixed layout).
- `expectClass(container, 'lg:grid-cols-4')` — assert a specific responsive
  utility is present.
- `expectResponsiveHorizontalPadding` — base `px-*` that scales up at a
  breakpoint (`px-6 → lg:px-16`).
- `expectHasMaxWidthContainer` — a centered `max-w-*` container exists.
- `expectResponsiveBaseline` — bundle of: no pixel-locked `<img>` (`style`
  width/height), every `<img>` carries a sizing utility, and no fixed
  `w-[Npx]` wider than 320px without a fluid cap (proxy for "no horizontal
  scroll at 320px").

### Convention for new components
When you add a component, add `ComponentName.test.tsx` next to it that:
1. renders it with `atEachBreakpoint` and asserts its key text/roles are present
   at every width;
2. calls `expectAdaptsAt` for the breakpoints where its layout changes, plus
   `expectClass` for the specific grid/flex/size utilities that implement that
   change (e.g. `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4`);
3. calls `expectResponsiveBaseline` (and `expectResponsiveHorizontalPadding` /
   `expectHasMaxWidthContainer` for full-width sections);
4. exercises any tap-to-toggle behaviour that replaces a hover interaction on
   mobile (menus, dropdowns, "Other…" fields).

## Multilanguage tests
These tests check that switching language works and that English and Spanish stay in sync. Like the rest of the suite they run with `npm test`.

| Test file | What it checks |
| --- | --- |
| [language.test.ts](src/context/language.test.ts) | initial language (saved choice, then browser locale, then English), the language options, and the safe default when there is no provider |
| [LanguageContext.test.tsx](src/context/LanguageContext.test.tsx) | switching from the desktop dropdown and the mobile menu, `<html lang>`, tab title and meta description, saving the choice, every page rendered in Spanish, wizard answers carried across a switch, and the read-aloud voice language |
| [translations.test.tsx](src/data/translations.test.tsx) | for every `src/data` content hook: Spanish has exactly the same structure as English, routes/URLs/ids are identical, and no text is empty |
| [defaultConfig.test.ts](src/data/defaultConfig.test.ts) | wizard steps and option counts match across languages, and `localizePlan()` (translation, round trip, custom answers, duplicates, old partial data) |
| [ThemeToggle.test.tsx](src/components/common/ThemeToggle.test.tsx), [SpeakableSection.test.tsx](src/components/accessibility/SpeakableSection.test.tsx), [AdminPage.test.tsx](src/pages/AdminPage.test.tsx) | each component's own Spanish labels, and the admin editor editing each language separately |

Notes for writing more of these tests:
- The chosen language is saved in `localStorage`, so clear it in `beforeEach` to keep tests independent. To start a test in Spanish, set `localStorage.setItem(LANGUAGE_STORAGE_KEY, 'es')` before rendering.
- `renderResponsive` already wraps the UI in `LanguageProvider`.
- Use `fireEvent` (not `userEvent`) to pick a language from the desktop dropdown: the dropdown closes on `mouseleave`, and `userEvent`'s simulated pointer movement triggers that in jsdom.

## Design & Content Rules
- Any changes to design must be confirmed with the user before they are made — do not make design changes unilaterally.
- Do not invent CSS values (colors, spacing, fonts, etc.). If a CSS element/value is needed, ask the user and they will provide it.
- Do not create new elements or text (copy/content) on your own — this must come from the user.

## Current Content Approach
The app uses a default configuration object for core content so content can be edited centrally from the admin screen. This keeps the first version lightweight and easy to maintain while still supporting customization. All content exists in English and Spanish (see "Multilanguage (English / Spanish)"), and the admin screen edits each language separately.

## Planned Next Steps
- refine the UI to match the Figma more closely
- add the safety warning modal and confirmation-before-print experience
- improve the printable plan layout and export experience
- strengthen admin editing flows and content validation
- consider a future serverless setup if admin configuration needs to be shared across devices
- make the pages read the content saved from the admin screen (today they use the defaults in `src/data/defaultConfig.ts`, in both languages)

## Deployment Notes
- The app is being prepared for Vercel-style deployment
- HTTPS is required for production readiness
- No third-party scripts or external trackers should be introduced

## References
- The Trevor Project
- Crisis Text Line
- 988 Suicide & Crisis Lifeline
- Trauma-informed care principles