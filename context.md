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

## Design & Content Rules
- Any changes to design must be confirmed with the user before they are made — do not make design changes unilaterally.
- Do not invent CSS values (colors, spacing, fonts, etc.). If a CSS element/value is needed, ask the user and they will provide it.
- Do not create new elements or text (copy/content) on your own — this must come from the user.

## Current Content Approach
The app uses a default configuration object for core content so content can be edited centrally from the admin screen. This keeps the first version lightweight and easy to maintain while still supporting customization.

## Planned Next Steps
- refine the UI to match the Figma more closely
- add the safety warning modal and confirmation-before-print experience
- improve the printable plan layout and export experience
- strengthen admin editing flows and content validation
- consider a future serverless setup if admin configuration needs to be shared across devices

## Deployment Notes
- The app is being prepared for Vercel-style deployment
- HTTPS is required for production readiness
- No third-party scripts or external trackers should be introduced

## References
- The Trevor Project
- Crisis Text Line
- 988 Suicide & Crisis Lifeline
- Trauma-informed care principles