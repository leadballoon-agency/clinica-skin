# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CO2 laser treatment landing page for Clinica Skin Cambridge, built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. Single-page marketing site with booking integration.

**Domain**: co2lasercambridge.co.uk
**Repository**: https://github.com/leadballoon-agency/clinica-skin
**Clinic**: Clinica Aesthetics & Wellbeing (trading as Clinica Skin Cambridge)
**Location**: 3-4 Sussex Street, Cambridge CB1 1PA
**Phone**: 01223 555 123
**Google Place ID**: ChIJES_wBeNx2EcR3WhSSDja7B0

## Client Agreement (Lead Balloon Agency)

**Status**: Trial period until end of January 2025
**Client Contact**: Dr. Katarzyna (Kat) Molenda Wasilewska

### Services
- Technical Marketing: £295/month (Facebook/Insta ads, email, WhatsApp, landing page)
- Appointment Setting: £20/day + £25 per qualified appointment
- Recommended Ad Spend: £25/day (£750/month)

### Guarantee
- Minimum 5 qualified appointments during trial
- No invoice if target not met
- First invoice at end of January 2025

### Pending from Client
- [ ] Advertising video for social media
- [ ] Facebook Business Manager access
- [ ] Google Business Profile access
- [ ] Stripe account access
- [ ] Company documentation (proof of ownership)
- [ ] Landing page corrections/approval
- [ ] Text and photo for Marie
- [ ] Phorest login (send to kerrytelesales@gmail.com)

## Team

### Doctors
- **Dr. Katarzyna Wasilewska** - Founder & Senior Aesthetic Medicine Doctor (Cambridge University)
- **Dr. Abigail Coutinho** - Senior Aesthetic Medicine Doctor (King's College London)

### Supporting Team
- **Jodie Stebbings** - Clinic Manager & Senior Technician (laser specialist)
- **Alina Bila** - Junior Technician
- **Klaudia Traubert** - Massage & Wellness Therapist
- **Paulina Lutynska** - Eyelash Specialist

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
- Compact pill-style toggle for consultation type (Video / In-Clinic)
- **In-Clinic is default** (includes SkinCeuticals digital skin scan)
- Video option for remote initial assessments
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
- **Google Review Link**: https://search.google.com/local/writereview?placeid=ChIJES_wBeNx2EcR3WhSSDja7B0

## Pending Work (When Client Confirms)

### Immediate
- [ ] Add Marie's profile (text + photo from client)
- [ ] Upload client's advertising video to VideoModal
- [ ] Connect Facebook Pixel to client's account
- [ ] Set up GHL calendar with client's booking system
- [ ] Connect to Phorest booking system

### Pre-Launch
- [ ] Client approval on landing page content
- [ ] Verify domain DNS (co2lasercambridge.co.uk)
- [ ] Test booking flow end-to-end
- [ ] Set up Facebook/Instagram ad campaigns

## Files Reference

- **Service Agreement**: `LEAD-BALLOON-SERVICE-AGREEMENT.md`
- **Letter to Client**: `LETTER-TO-KAT.md`
- **Agreement Template**: `~/Desktop/LEAD-BALLOON-AGREEMENT-TEMPLATE.md`
