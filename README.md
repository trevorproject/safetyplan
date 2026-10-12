# Safety Plan Web App

A privacy-first, trauma-informed web app for LGBT+ youth to create a personalized safety plan during mental health emergencies.

## Overview

This project is a frontend-first React application designed to help users build a safety plan in a calm, accessible, and non-judgmental way. The experience is structured around privacy, autonomy, and clarity, with the content easy to update through a simple browser-based admin screen.

## Current Status

The current implementation includes:
- a welcome page introducing the concept of a safety plan
- a resources page with crisis and support links
- a six-step wizard for building a plan
- a completed plan page that can be printed
- an admin page protected by a shared password for editing the app content
- the whole site in English and Spanish, switchable at any time

## Core Principles

- Privacy first: no accounts, no analytics, no persistent user tracking
- Trauma-informed: supportive, low-pressure language
- Accessibility: mobile-first, readable, keyboard-friendly, and focused on clarity
- Autonomy: users stay in control of what they write and what they share

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Browser-based persistence using sessionStorage and localStorage

## Run Locally

### Prerequisites
- Node.js 18 or newer

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/
```

## Run Tests

```bash
npm test            # run the whole suite once
npm run test:watch  # watch mode while developing
npm run test:types  # type-check the test files
```

## Build for Production

```bash
npm run build
```

## Project Structure

- src/pages: page-level views for the experience
- src/components: reusable UI elements and layout
- src/context: app-wide state (language, theme, accessibility)
- src/data: all user-facing text, in English and Spanish, and config defaults
- src/lib: local persistence helpers
- src/types: shared TypeScript types

## Languages (English / Spanish)

The site is available in English and Spanish. Users switch from the **Language / Idioma** menu in the navbar (desktop dropdown or mobile menu). On the first visit the app follows the browser language, and after that it remembers the user's choice in `localStorage`. Switching also updates the page `lang`, the tab title, the read-aloud voice and any wizard answers already selected.

All text lives in `src/data/`: each file has an English and a Spanish version and a `useXContent()` hook that returns the active one. To change any text, edit **both** versions in the same file. `npm test` fails if the two languages stop matching. See the "Multilanguage" section in [context.md](context.md) for how it works, how to add text, and how to add another language.

## Admin Configuration

The admin screen is currently a simple password-protected interface for editing:
- app title and description
- welcome intro text
- resources
- wizard step content

Content is edited separately for each language; use the language toggle at the top of the editor to switch between English and Spanish.

This is intentionally lightweight and browser-based for the current phase.

## Privacy Notes

- User safety plan data is stored only in the browser session
- Admin content is stored locally in the browser for the prototype version
- No database or server-side user storage is used in the current implementation

## Deployment Notes

The app is intended for deployment on Vercel-style hosting. The current design assumes HTTPS and avoids third-party tracking.

### Deploy to Vercel

1. Push the project to a GitHub repository.
2. Create a new Vercel project and import the repository.
3. Vercel will detect the Vite app automatically.
4. Use the default build settings:
   - Build Command: npm run build
   - Output Directory: dist
5. Deploy the project.

After deployment, the app will be available from the Vercel URL.

## Important Note

This app is a supportive tool and is not a substitute for professional crisis help. If someone is in immediate danger, they should contact emergency services or a crisis hotline right away.
