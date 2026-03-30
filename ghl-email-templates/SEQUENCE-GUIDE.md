# GHL Email Sequence — Clinica Skin CO2 Laser Follow-Up

## Quick Reference

| # | File | Subject Line | Preview Text | Delay |
|---|------|-------------|--------------|-------|
| 1 | `email-1-welcome.html` | Thanks for your interest, {{contact.first_name}} — here's what happens next | Your free consultation at Clinica Skin Cambridge | Immediate |
| 2 | `email-2-how-it-works.html` | How CO2 laser actually works (2-minute read) | The science behind skin transformation | Day 2 |
| 3 | `email-3-does-it-hurt.html` | "Does CO2 laser hurt?" — the honest answer | What our patients actually say about the experience | Day 4 |
| 4 | `email-4-social-proof.html` | "My skin hasn't looked this good in years" | What real Clinica Skin patients are saying | Day 6 |
| 5 | `email-5-faqs.html` | Your CO2 laser questions, answered | Everything you need to know before booking | Day 8 |
| 6 | `email-6-urgency.html` | {{contact.first_name}}, we're holding a consultation slot for you | Limited availability this month | Day 11 |
| 7 | `email-7-final-followup.html` | Last check-in from Clinica Skin | No pressure — just making sure you have everything you need | Day 14 |

## GHL Setup Instructions

### 1. Create the Workflow
- Trigger: Form submission / assessment tool / booking enquiry
- From Name: `Clinica Skin Cambridge`
- From Email: Use your verified sending domain
- Reply-To: `info@co2lasercambridge.co.uk`

### 2. Add Each Email Step
For each email:
1. Add a **Send Email** action
2. Set to **HTML mode** (not the visual builder)
3. Copy-paste the full HTML from each file
4. Set the Subject Line and Preview Text from the table above
5. Add a **Wait** step between each email (use the delays above)

### 3. Set Up Exit Conditions
- Add a **Goal** step: "Appointment Booked" — exits the contact from the sequence if they book at any point
- Tag contacts who complete the full sequence without booking as `nurture-co2-cold` for future re-engagement

### 4. Optional Enhancements
- After Email 4, add an **If/Else** branch to check if the contact has opened any previous emails — if not, switch to SMS follow-up
- Consider adding a parallel SMS path for high-intent leads (those who filled out the assessment tool)

## GHL Merge Fields Used
- `{{contact.first_name}}` — used in subject lines and email body throughout

## Design Notes
- Matches Clinica Skin landing page branding (blues: #0056A7, #5394CB)
- Playfair Display for headings, Inter for body text (Google Fonts loaded)
- Fully responsive — tested for mobile and desktop
- All inline CSS for maximum email client compatibility
- Table-based layout for Outlook/Gmail support
- Logo loaded from: `https://co2lasercambridge.co.uk/images/clinica-logo-two-fonts-2-e1747394036335.webp`
- All CTA buttons link to: `https://co2lasercambridge.co.uk`
