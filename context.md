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