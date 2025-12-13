# Amethyst Aesthetics CO2 Laser - Customization Plan

> **Ready to customize when Marianne's website is available**

## 📋 Overview

This document outlines the complete customization process for transforming the CO2 laser template into Amethyst Aesthetics' branded landing page. The process uses automated tools to extract data from Marianne's existing website and populate the template.

---

## 🚀 Quick Start (When Website is Ready)

### Prerequisites
1. **Marianne's website URL** - Live and accessible
2. **Firecrawl API Key** - For web scraping ([Get one here](https://firecrawl.dev))
3. **Node.js 18+** - Already installed
4. **Video file** - Marianne's edited CO2 Laser explainer video

### Automated Setup Command
```bash
# Set your Firecrawl API key
export FIRECRAWL_API_KEY="your-api-key-here"

# Run the automated customization
./quick-start.sh
# Enter Marianne's website URL when prompted
```

That's it! The system will:
- ✅ Extract all clinic data from her website
- ✅ Customize the template automatically
- ✅ Run quality assurance checks
- ✅ Prepare for deployment

---

## 📊 Data to Extract from Marianne's Website

The automation will look for and extract:

### Business Information
- [ ] Business name: "Amethyst Aesthetics"
- [ ] Full business description
- [ ] Specialties and services offered
- [ ] Years in business / establishment date
- [ ] CQC registration number (if applicable)
- [ ] Professional qualifications

### Contact Information
- [ ] Phone number(s)
- [ ] Email address(es)
- [ ] Business address
- [ ] Opening hours
- [ ] Social media links

### Location Data
- [ ] Full postal address
- [ ] City/town
- [ ] Postcode
- [ ] Google Maps coordinates (if available)

### Team Information
- [ ] Marianne's full name and title
- [ ] Professional qualifications
- [ ] Bio/description
- [ ] Team photo (if available)
- [ ] Other team members (if any)

### Services & Pricing
- [ ] CO2 Laser treatment details
- [ ] Other services offered
- [ ] Pricing information
- [ ] Treatment areas (face, neck, décolletage, etc.)
- [ ] Session duration

### Testimonials & Reviews
- [ ] Patient testimonials
- [ ] Google/Facebook reviews
- [ ] Star ratings
- [ ] Before/after images (if available)

### Branding Elements
- [ ] Logo (high resolution)
- [ ] Brand colors (primary, secondary, accent)
- [ ] Font choices
- [ ] Brand voice/tone

---

## 🎬 Video Integration Steps

### 1. Prepare Video File
**Current Status:** Marianne has 2 video files that need editing/stitching

**Steps:**
1. Edit and stitch the 2 video files together
2. Export in portrait format (9:16 or similar)
3. Optimize for web:
   - Format: MP4 (H.264 codec)
   - Resolution: 1080x1920 or 720x1280
   - Target file size: < 50MB for fast loading
4. Save as: `co2-laser-explainer.mp4`

### 2. Add Video to Project
```bash
# Create videos folder if it doesn't exist
mkdir -p /Users/marktaylor/Desktop/amethyst-beauty/AB-co2-laser/public/videos

# Copy your edited video
cp /path/to/your/edited-video.mp4 /Users/marktaylor/Desktop/amethyst-beauty/AB-co2-laser/public/videos/co2-laser-explainer.mp4
```

### 3. Video Modal Already Created
The VideoModal component will be created with:
- Portrait orientation support
- Smooth animations
- Close button with keyboard support (ESC key)
- Backdrop blur effect
- Mobile-responsive design

### 4. Video Placement
The "Watch Video" button will appear in:
- **Hero Section** - Primary CTA alongside booking button
- **About Section** - "Learn more about CO2 Laser" trigger

---

## 🔧 Manual Customization (If Needed)

If the automation doesn't capture everything or you need to make manual adjustments:

### Files to Update Manually

#### 1. **package.json**
```json
{
  "name": "amethyst-aesthetics-co2-laser",
  "description": "CO2 Laser Treatment Landing Page for Amethyst Aesthetics"
}
```

#### 2. **app/layout.tsx** - Metadata & SEO
Update:
- Page title
- Meta description
- Keywords
- Business name
- Location
- Domain URL

#### 3. **components/StructuredData.tsx** - Schema.org
Update:
- Business name
- Address
- Phone
- Email
- Services
- Reviews/ratings

#### 4. **components/TeamSection.tsx**
Update:
- Marianne's name and title
- Professional credentials
- Bio
- Team photo path

#### 5. **components/AboutSection.tsx**
Update:
- Clinic description
- Years of experience
- Specializations

#### 6. **components/BookingModal.tsx**
Configure:
- Booking calendar integration
- Calendar URL/embed code
- Consultation pricing

---

## 🎨 Branding Customization

### Color Scheme (tailwind.config.js)
Once you have Marianne's brand colors, update:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#...',
          100: '#...',
          // ... Amethyst Aesthetics brand colors
          500: '#...',
          600: '#...',
        }
      }
    }
  }
}
```

### Logo & Favicon
```bash
# Add logo files to public/images/
cp /path/to/logo.png /Users/marktaylor/Desktop/amethyst-beauty/AB-co2-laser/public/images/logo.png

# Add favicon
cp /path/to/favicon.png /Users/marktaylor/Desktop/amethyst-beauty/AB-co2-laser/public/images/favicon.png
```

Update references in:
- `app/icon.tsx`
- `app/apple-icon.tsx`
- `components/Navigation.tsx`

---

## ✅ Quality Assurance Checklist

Before deployment, run the QA system:

```bash
node quality-assurance-system.js /Users/marktaylor/Desktop/amethyst-beauty/AB-co2-laser
```

### Manual Checks
- [ ] All "ND Skin Clinic" references replaced
- [ ] All placeholder text updated with real content
- [ ] Video plays correctly in modal
- [ ] Video modal closes properly (X button & ESC key)
- [ ] Booking calendar integration works
- [ ] Contact information is correct
- [ ] Address and location accurate
- [ ] Team information up to date
- [ ] All links working (social media, booking, etc.)
- [ ] Mobile responsive design working
- [ ] Images loading correctly
- [ ] SEO metadata complete
- [ ] Schema.org structured data valid

### Automated Tests (36 checks)
The QA system will automatically test:
- ✅ Code quality (TypeScript, ESLint)
- ✅ Content validation (no placeholders remaining)
- ✅ Performance (bundle size, image optimization)
- ✅ SEO compliance (meta tags, schema markup)
- ✅ Accessibility (ARIA, alt text, navigation)
- ✅ Security (headers, vulnerabilities)
- ✅ Cross-platform (responsive, mobile, browsers)
- ✅ Integration (forms, booking, analytics)

---

## 🚀 Deployment Steps

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI (if not already)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Configure custom domain in Vercel dashboard
```

### Option 2: Netlify
```bash
# Install Netlify CLI (if not already)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Configure custom domain in Netlify dashboard
```

### Option 3: Automated Deployment
```bash
node deployment-automation.js /Users/marktaylor/Desktop/amethyst-beauty/AB-co2-laser --platform vercel --domain yourdomain.co.uk
```

---

## 📝 Current Status

### Completed ✅
- [x] Project folder created and copied
- [x] Base CO2 laser template ready
- [x] Automation scripts available
- [x] Customization plan documented

### Waiting For ⏳
- [ ] Marianne's website to go live
- [ ] Video files edited and stitched together
- [ ] Brand assets (logo, colors, images)
- [ ] Final content approval from Marianne

### Next Steps 🎯
1. **Wait for Marianne's website** - Get the live URL
2. **Prepare video file** - Edit and stitch the 2 video clips
3. **Gather brand assets** - Logo, colors, photos
4. **Run automation** - Use quick-start.sh with her website URL
5. **Manual video integration** - Add the edited video file
6. **QA testing** - Run all checks
7. **Deploy** - Launch the site

---

## 🆘 Troubleshooting

### Automation Issues

**Problem:** Firecrawl API rate limit exceeded
**Solution:** Wait 60 seconds and retry

**Problem:** Website data extraction incomplete
**Solution:** Run the scraper on specific pages:
```bash
node firecrawl-integration.js --url https://marianne-site.co.uk/about
node firecrawl-integration.js --url https://marianne-site.co.uk/services
```

**Problem:** QA tests failing
**Solution:** Review the generated report and fix issues manually

### Video Issues

**Problem:** Video too large (slow loading)
**Solution:** Re-export with lower resolution or use compression:
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4
```

**Problem:** Video not playing in modal
**Solution:** Check file path and format (must be MP4)

### Build Issues

**Problem:** TypeScript errors
**Solution:** Run `npm install` and check for missing dependencies

**Problem:** Build fails on Vercel/Netlify
**Solution:** Test locally first with `npm run build`

---

## 📞 Contact & Support

**Client:** Marianne - Amethyst Aesthetics
**Project:** CO2 Laser Landing Page
**Template Base:** ND Skin Clinic CO2 Laser Template
**Framework:** Next.js 15.5.0 + React 19 + TypeScript

---

## 🎉 Ready to Launch?

Once Marianne's website is live and you have all the assets:

1. Run `./quick-start.sh` and enter her website URL
2. Add the edited video file to `/public/videos/`
3. Run QA checks with `node quality-assurance-system.js`
4. Deploy with `vercel --prod` or `netlify deploy --prod`
5. Configure custom domain
6. Celebrate! 🎊

---

*Document created: {{ current_date }}*
*Last updated: {{ current_date }}*
*Status: Awaiting Marianne's website and video assets*
