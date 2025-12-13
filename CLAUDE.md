# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CO2 laser treatment landing page for Clinica Skin Cambridge, built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. Single-page marketing site with booking integration.

**Domain**: co2lasercambridge.co.uk
**Clinic**: Clinica Skin Cambridge
**Practitioner**: Dr. Katarzyna Molenda Wasilewska
**Location**: 3-4 Sussex Street, Cambridge CB1 1PA
**Phone**: 01223 555 123

## Development Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run lint       # Run ESLint
```

## Architecture

### Page Structure

Single-page app using `app/page.tsx` → `PageWrapper.tsx` as the main orchestrator. PageWrapper is a client component that manages:
- Modal state (booking modal, video modal)
- Assessment data flow between `AssessmentTool` and `BookingModal`
- Click handlers passed down to all section components

### Key Component Flow

```
app/layout.tsx (metadata, fonts, analytics)
  └── app/page.tsx
        └── PageWrapper.tsx (client, state management)
              ├── Navigation
              ├── PremiumHero
              ├── AssessmentTool → captures user responses → BookingModal
              ├── AboutSection, PremiumTreatments, ResultsGallery, etc.
              └── BookingModal (booking integration)
```

### Booking Integration

Booking uses GoHighLevel (GHL) calendar embed:
- `BookingModal.tsx` loads GHL calendar iframe (link.leadballoon.co.uk)
- Offers video or in-clinic consultation options
- Photo upload available for personalised assessment
- Phone number click tracking via `FacebookPixel.tsx`

### SEO & Structured Data

- `app/layout.tsx` - Comprehensive Next.js metadata export (OG, Twitter, robots)
- `components/StructuredData.tsx` - JSON-LD schemas (MedicalBusiness, LocalBusiness, Service, Review, Physician)
- `app/sitemap.ts` and `app/robots.ts` - Dynamic sitemap and robots.txt

### Analytics

- `FacebookPixel.tsx` - FB Pixel with custom event tracking functions
- `ConvertBox.tsx` - ConvertBox popup integration (loaded in Suspense)

### Styling

Custom Tailwind config with:
- `primary` color palette (Clinica blue tones: primary-500: #5394CB, primary-600: #0056A7)
- `neutral` grays
- Custom fonts: Playfair Display (display), Inter (sans)
- Custom animations: `float`, `fade-in`, `slide-up`

### Path Aliases

Uses `@/*` path alias mapping to project root (configured in tsconfig.json).

## Key Content Details

### Dr. Katarzyna Wasilewska
- Cambridge University Medicine Graduate
- GMC-Registered Medical Doctor
- Aesthetic & Regenerative Medicine Specialist
- ACE Group Member
- Spoken internationally including Stanford University

### CO2 Treatment Pricing
- Face: £900
- Face + Neck: £1,300
- Face, Neck + Chest: £1,700
- Chest only: £800
- Hands: £450
- Body (larger area): £700

### Key Differentiators
- Doctor-led (GMC-registered)
- Cambridge-trained
- Free consultation + SkinCeuticals digital scan
- CQC-registered & award-winning

## External Services

- **GHL Calendar**: GoHighLevel booking calendar (link.leadballoon.co.uk)
- **Facebook Pixel**: Conversion tracking
- **ConvertBox**: Popup/lead capture
- **Vercel**: Deployment platform

## SEO

- **Domain**: co2lasercambridge.co.uk
- **OG Image**: Dr. Katarzyna's photo (/images/Dr-Katarzyna-cropped.jpg)
- **Structured Data**: MedicalBusiness, MedicalClinic, Service, Review, Physician schemas
- **219 Google Reviews** (5-star rating)
