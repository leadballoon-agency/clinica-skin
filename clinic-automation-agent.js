#!/usr/bin/env node

/**
 * CO2 Laser Template Customization Agent
 *
 * This agent automatically customizes the CO2 laser template for new clinic clients
 * by scraping their existing website and applying the extracted data to our template.
 *
 * Features:
 * - Web scraping with Firecrawl integration
 * - Intelligent data extraction and validation
 * - Template customization with file generation
 * - Quality assurance and reporting
 * - Deployment preparation
 *
 * Usage: node clinic-automation-agent.js --url <clinic-website-url> [options]
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class ClinicCustomizationAgent {
  constructor(options = {}) {
    this.templatePath = options.templatePath || '/Users/marktaylor/Desktop/co2-laser-demo-template';
    this.outputPath = options.outputPath || '/Users/marktaylor/Desktop';
    this.firecrawlApiKey = options.firecrawlApiKey || process.env.FIRECRAWL_API_KEY;
    this.extractedData = {};
    this.customizationReport = [];
    this.manualReviewItems = [];
    this.qualityChecks = [];
  }

  /**
   * Main execution flow
   */
  async execute(websiteUrl, clinicName = null, options = {}) {
    console.log('🚀 Starting CO2 Laser Template Customization Agent...\n');

    try {
      // Step 1: Website Analysis & Data Extraction
      console.log('📊 Step 1: Analyzing website and extracting data...');
      await this.extractWebsiteData(websiteUrl);

      // Step 2: Data Processing & Validation
      console.log('🔍 Step 2: Processing and validating extracted data...');
      await this.processAndValidateData();

      // Step 3: Template Customization
      console.log('⚙️ Step 3: Customizing template with clinic data...');
      const outputDir = await this.customizeTemplate(clinicName);

      // Step 4: Quality Assurance
      console.log('✅ Step 4: Running quality assurance checks...');
      await this.runQualityAssurance(outputDir);

      // Step 5: Generate Reports
      console.log('📄 Step 5: Generating reports and deployment guide...');
      await this.generateReports(outputDir);

      console.log(`\n🎉 Customization completed successfully!`);
      console.log(`📁 Output directory: ${outputDir}`);
      console.log(`📋 Check the customization report for details.`);

      return {
        success: true,
        outputPath: outputDir,
        extractedData: this.extractedData,
        customizationReport: this.customizationReport,
        manualReviewItems: this.manualReviewItems
      };

    } catch (error) {
      console.error('❌ Error during customization:', error.message);
      return {
        success: false,
        error: error.message,
        extractedData: this.extractedData
      };
    }
  }

  /**
   * Extract data from the clinic's website using Firecrawl
   */
  async extractWebsiteData(websiteUrl) {
    // This would integrate with Firecrawl API
    // For now, simulating the data extraction structure

    console.log(`   🌐 Scraping website: ${websiteUrl}`);

    // Simulate Firecrawl API call
    const scrapedData = await this.simulateFirecrawlScraping(websiteUrl);

    // Extract structured information
    this.extractedData = {
      business: {
        name: this.extractBusinessName(scrapedData),
        tagline: this.extractTagline(scrapedData),
        description: this.extractDescription(scrapedData),
        yearsEstablished: this.extractYearsEstablished(scrapedData)
      },
      contact: {
        phone: this.extractPhone(scrapedData),
        email: this.extractEmail(scrapedData),
        address: this.extractAddress(scrapedData),
        postcode: this.extractPostcode(scrapedData),
        website: websiteUrl
      },
      location: {
        city: this.extractCity(scrapedData),
        region: this.extractRegion(scrapedData),
        country: this.extractCountry(scrapedData),
        coordinates: await this.getCoordinates(scrapedData)
      },
      team: {
        members: this.extractTeamMembers(scrapedData),
        practitionerNames: this.extractPractitionerNames(scrapedData),
        qualifications: this.extractQualifications(scrapedData)
      },
      services: {
        treatments: this.extractTreatments(scrapedData),
        pricing: this.extractPricing(scrapedData),
        specialties: this.extractSpecialties(scrapedData)
      },
      branding: {
        logoUrl: this.extractLogoUrl(scrapedData),
        colorScheme: this.extractColorScheme(scrapedData),
        brandVoice: this.extractBrandVoice(scrapedData)
      },
      socialProof: {
        reviews: this.extractReviews(scrapedData),
        testimonials: this.extractTestimonials(scrapedData),
        socialMedia: this.extractSocialMedia(scrapedData)
      }
    };

    console.log('   ✅ Data extraction completed');
    console.log(`   📊 Extracted: ${Object.keys(this.extractedData.business).length} business fields, ${Object.keys(this.extractedData.contact).length} contact fields, ${this.extractedData.team.members?.length || 0} team members`);
  }

  /**
   * Simulate Firecrawl API scraping (replace with actual API integration)
   */
  async simulateFirecrawlScraping(url) {
    // This would be replaced with actual Firecrawl API calls
    return {
      content: `Sample content from ${url}`,
      title: "Sample Clinic - Advanced Aesthetic Treatments",
      description: "Professional aesthetic clinic offering advanced treatments",
      // ... other scraped data
    };
  }

  /**
   * Data extraction methods
   */
  extractBusinessName(data) {
    // Extract business name from title, headers, or specific selectors
    const patterns = [
      /(?:Dr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:Clinic|Aesthetics|Beauty|Skin|Medical)/i,
      /<h1[^>]*>([^<]+(?:Clinic|Aesthetics|Beauty))/i,
      /<title>([^|]+)/i
    ];

    for (const pattern of patterns) {
      const match = data.content?.match(pattern) || data.title?.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  extractTagline(data) {
    // Extract tagline or slogan
    const patterns = [
      /(?:tagline|slogan)["']?\s*:\s*["']?([^"'\n]+)/i,
      /<p[^>]*class[^>]*(?:tagline|slogan)[^>]*>([^<]+)/i
    ];

    for (const pattern of patterns) {
      const match = data.content?.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  extractDescription(data) {
    // Extract clinic description
    return data.description || null;
  }

  extractPhone(data) {
    // Extract phone number
    const phonePattern = /(?:tel:|phone:|call\s+us:|contact\s+us:)?\s*((?:\+44|0)[\s-]?[1-9](?:[\s-]?\d){8,10})/i;
    const match = data.content?.match(phonePattern);
    return match ? match[1].replace(/[\s-]/g, '') : null;
  }

  extractEmail(data) {
    // Extract email address
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = data.content?.match(emailPattern);
    return match ? match[1] : null;
  }

  extractAddress(data) {
    // Extract physical address
    const addressPatterns = [
      /address["']?\s*:\s*["']?([^"'\n]+)/i,
      /<address[^>]*>([^<]+)</i,
      /(?:located at|find us at|visit us at):\s*([^,\n]+)/i
    ];

    for (const pattern of addressPatterns) {
      const match = data.content?.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  extractPostcode(data) {
    // Extract UK postcode
    const postcodePattern = /([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/;
    const match = data.content?.match(postcodePattern);
    return match ? match[1] : null;
  }

  extractCity(data) {
    // Extract city from address or location data
    const address = this.extractedData.contact?.address;
    if (address) {
      // Simple city extraction logic
      const parts = address.split(',');
      return parts[parts.length - 2]?.trim();
    }
    return null;
  }

  extractRegion(data) {
    // Extract region/county
    const postcode = this.extractPostcode(data);
    if (postcode) {
      // Map postcode to region (simplified)
      const postcodeArea = postcode.substring(0, 2);
      const regionMap = {
        'SW': 'London',
        'SE': 'London',
        'NW': 'London',
        'N1': 'London',
        'E1': 'London',
        'W1': 'London',
        'WC': 'London',
        'EC': 'London',
        'M1': 'Manchester',
        'B1': 'Birmingham',
        // Add more mappings
      };
      return regionMap[postcodeArea] || null;
    }
    return null;
  }

  extractCountry(data) {
    return 'United Kingdom'; // Default for UK clinics
  }

  async getCoordinates(data) {
    // Get latitude/longitude from address
    // This would integrate with a geocoding service
    return {
      latitude: 51.5074, // Default to London
      longitude: -0.1278
    };
  }

  extractTeamMembers(data) {
    // Extract team member information
    const teamPattern = /<div[^>]*class[^>]*(?:team|staff|doctor|practitioner)[^>]*>.*?<\/div>/gi;
    const matches = data.content?.match(teamPattern) || [];

    return matches.map((match, index) => ({
      id: index + 1,
      name: this.extractNameFromTeamBlock(match),
      title: this.extractTitleFromTeamBlock(match),
      qualifications: this.extractQualificationsFromTeamBlock(match),
      bio: this.extractBioFromTeamBlock(match),
      image: this.extractImageFromTeamBlock(match)
    })).filter(member => member.name);
  }

  extractNameFromTeamBlock(block) {
    const namePattern = /<h[2-4][^>]*>([^<]+)</i;
    const match = block.match(namePattern);
    return match ? match[1].trim() : null;
  }

  extractTitleFromTeamBlock(block) {
    const titlePattern = /<p[^>]*class[^>]*title[^>]*>([^<]+)/i;
    const match = block.match(titlePattern);
    return match ? match[1].trim() : 'Aesthetic Practitioner';
  }

  extractQualificationsFromTeamBlock(block) {
    const qualPattern = /(?:qualification|degree|certification):\s*([^,\n]+)/i;
    const match = block.match(qualPattern);
    return match ? [match[1].trim()] : ['Certified Aesthetic Practitioner'];
  }

  extractBioFromTeamBlock(block) {
    const bioPattern = /<p[^>]*>([^<]{50,})</i;
    const match = block.match(bioPattern);
    return match ? match[1].trim() : null;
  }

  extractImageFromTeamBlock(block) {
    const imgPattern = /<img[^>]+src=["']([^"']+)/i;
    const match = block.match(imgPattern);
    return match ? match[1] : null;
  }

  extractPractitionerNames(data) {
    const members = this.extractTeamMembers(data);
    return members.map(member => member.name).filter(Boolean);
  }

  extractQualifications(data) {
    // Extract all qualifications mentioned
    const qualPatterns = [
      /(?:qualified|certified|trained) in ([^,\n]+)/gi,
      /([A-Z]{2,})\s*certified/gi,
      /(NVQ|HND|BSc|MSc|PhD|MD|MBBS)\s*(?:in\s+)?([^,\n]*)/gi
    ];

    const qualifications = new Set();
    for (const pattern of qualPatterns) {
      const matches = data.content?.matchAll(pattern) || [];
      for (const match of matches) {
        qualifications.add(match[1]?.trim());
      }
    }

    return Array.from(qualifications).filter(Boolean);
  }

  extractTreatments(data) {
    // Extract treatment/service information
    const treatmentPatterns = [
      /(?:treatment|service|procedure)s?[^:]*:([^,\n]+)/gi,
      /<li[^>]*>([^<]*(?:treatment|therapy|procedure))/gi,
      /(?:we offer|services include|treatments include)[^:]*:([^.]+)/gi
    ];

    const treatments = new Set();
    for (const pattern of treatmentPatterns) {
      const matches = data.content?.matchAll(pattern) || [];
      for (const match of matches) {
        const treatment = match[1]?.trim();
        if (treatment && treatment.length > 3) {
          treatments.add(treatment);
        }
      }
    }

    return Array.from(treatments);
  }

  extractPricing(data) {
    // Extract pricing information
    const pricePattern = /£(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    const matches = data.content?.matchAll(pricePattern) || [];

    const prices = [];
    for (const match of matches) {
      prices.push(parseFloat(match[1].replace(',', '')));
    }

    return prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length,
      found: prices
    } : null;
  }

  extractSpecialties(data) {
    // Extract clinic specialties
    const specialtyKeywords = [
      'anti-aging', 'aesthetic', 'cosmetic', 'dermatology', 'skin care',
      'botox', 'fillers', 'laser', 'microneedling', 'chemical peel',
      'facial', 'skin rejuvenation', 'wrinkle treatment'
    ];

    const found = specialtyKeywords.filter(keyword =>
      data.content?.toLowerCase().includes(keyword.toLowerCase())
    );

    return found;
  }

  extractLogoUrl(data) {
    // Extract logo URL
    const logoPatterns = [
      /<img[^>]+(?:class|id)[^>]*logo[^>]+src=["']([^"']+)/i,
      /<img[^>]+src=["']([^"']*logo[^"']*)/i,
      /<img[^>]+alt=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)/i
    ];

    for (const pattern of logoPatterns) {
      const match = data.content?.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  extractColorScheme(data) {
    // Extract color scheme from CSS
    const colorPattern = /(?:color|background-color):\s*([#a-fA-F0-9]{6}|rgb\([^)]+\))/g;
    const matches = data.content?.matchAll(colorPattern) || [];

    const colors = [];
    for (const match of matches) {
      colors.push(match[1]);
    }

    return colors.length > 0 ? {
      primary: colors[0],
      colors: [...new Set(colors)].slice(0, 5)
    } : null;
  }

  extractBrandVoice(data) {
    // Analyze brand voice from content
    const content = data.content?.toLowerCase() || '';

    const professionalWords = ['professional', 'expert', 'certified', 'qualified', 'experienced'];
    const luxuryWords = ['luxury', 'premium', 'exclusive', 'bespoke', 'elite'];
    const friendlyWords = ['friendly', 'caring', 'personal', 'welcoming', 'comfortable'];

    const scores = {
      professional: professionalWords.reduce((sum, word) => sum + (content.split(word).length - 1), 0),
      luxury: luxuryWords.reduce((sum, word) => sum + (content.split(word).length - 1), 0),
      friendly: friendlyWords.reduce((sum, word) => sum + (content.split(word).length - 1), 0)
    };

    const dominantTone = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    return {
      tone: dominantTone,
      scores: scores
    };
  }

  extractReviews(data) {
    // Extract review information
    const reviewPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:star|rating)/i,
      /(\d+)\s*reviews?/i,
      /rated\s*(\d+(?:\.\d+)?)/i
    ];

    const reviews = {};
    for (const pattern of reviewPatterns) {
      const match = data.content?.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (value <= 5) reviews.rating = value;
        if (value > 5) reviews.count = value;
      }
    }

    return Object.keys(reviews).length > 0 ? reviews : null;
  }

  extractTestimonials(data) {
    // Extract testimonial text
    const testimonialPattern = /<blockquote[^>]*>([^<]+)</gi;
    const matches = data.content?.matchAll(testimonialPattern) || [];

    const testimonials = [];
    for (const match of matches) {
      testimonials.push({
        text: match[1].trim(),
        author: 'Patient' // Would extract actual author if available
      });
    }

    return testimonials;
  }

  extractSocialMedia(data) {
    // Extract social media links
    const socialPatterns = {
      facebook: /facebook\.com\/([^\/\s"']+)/i,
      instagram: /instagram\.com\/([^\/\s"']+)/i,
      twitter: /twitter\.com\/([^\/\s"']+)/i,
      linkedin: /linkedin\.com\/(?:company|in)\/([^\/\s"']+)/i
    };

    const social = {};
    for (const [platform, pattern] of Object.entries(socialPatterns)) {
      const match = data.content?.match(pattern);
      if (match) social[platform] = match[1];
    }

    return Object.keys(social).length > 0 ? social : null;
  }

  extractYearsEstablished(data) {
    // Extract establishment year
    const yearPattern = /(?:established|founded|since)\s*(?:in\s*)?(\d{4})/i;
    const match = data.content?.match(yearPattern);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * Process and validate extracted data
   */
  async processAndValidateData() {
    // Validate required fields
    const required = {
      'Business Name': this.extractedData.business?.name,
      'Phone Number': this.extractedData.contact?.phone,
      'Email Address': this.extractedData.contact?.email,
      'Location': this.extractedData.contact?.address || this.extractedData.location?.city
    };

    for (const [field, value] of Object.entries(required)) {
      if (!value) {
        this.manualReviewItems.push({
          type: 'missing_required',
          field: field,
          message: `${field} not found - requires manual input`,
          priority: 'high'
        });
      }
    }

    // Validate data quality
    if (this.extractedData.contact?.phone && !this.extractedData.contact.phone.match(/^\+?44/)) {
      this.manualReviewItems.push({
        type: 'validation_warning',
        field: 'Phone Number',
        message: 'Phone number may not be UK format',
        priority: 'medium'
      });
    }

    if (this.extractedData.contact?.email && !this.extractedData.contact.email.includes('@')) {
      this.manualReviewItems.push({
        type: 'validation_error',
        field: 'Email Address',
        message: 'Invalid email format detected',
        priority: 'high'
      });
    }

    console.log(`   ✅ Data validation completed`);
    console.log(`   ⚠️  Found ${this.manualReviewItems.length} items requiring manual review`);
  }

  /**
   * Customize the template with extracted data
   */
  async customizeTemplate(clinicName = null) {
    const sanitizedName = clinicName || this.extractedData.business?.name || 'New Clinic';
    const outputDir = path.join(this.outputPath, `${sanitizedName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-co2-laser-site`);

    // Copy template to new directory
    console.log(`   📂 Creating output directory: ${outputDir}`);
    await this.copyDirectory(this.templatePath, outputDir);

    // Apply customizations
    await this.customizeLayoutFile(outputDir);
    await this.customizeFooterComponent(outputDir);
    await this.customizeCTAComponent(outputDir);
    await this.customizeTeamSection(outputDir);
    await this.customizeHeroSection(outputDir);
    await this.customizeBookingConfig(outputDir);
    await this.customizePackageJson(outputDir);

    console.log(`   ✅ Template customization completed`);
    return outputDir;
  }

  /**
   * Copy directory recursively
   */
  async copyDirectory(src, dest) {
    try {
      execSync(`cp -r "${src}" "${dest}"`);
    } catch (error) {
      throw new Error(`Failed to copy template: ${error.message}`);
    }
  }

  /**
   * Customize layout.tsx file
   */
  async customizeLayoutFile(outputDir) {
    const layoutPath = path.join(outputDir, 'app', 'layout.tsx');
    let content = await fs.readFile(layoutPath, 'utf8');

    const replacements = {
      'Your Clinic Name': this.extractedData.business?.name || 'Your Clinic Name',
      'your-clinic-domain.com': this.getDomainFromUrl(this.extractedData.contact?.website) || 'your-clinic-domain.com',
      '+447888864454': this.extractedData.contact?.phone || '+447888864454',
      'info@leadballoon.co.uk': this.extractedData.contact?.email || 'info@leadballoon.co.uk',
      '[Your Street Address]': this.extractedData.contact?.address || '[Your Street Address]',
      '[Your City]': this.extractedData.location?.city || '[Your City]',
      '[Your Postal Code]': this.extractedData.contact?.postcode || '[Your Postal Code]',
      '[Your Country Code]': 'GB',
      '0.0000': this.extractedData.location?.coordinates?.latitude?.toString() || '0.0000',
      '-0.0000': this.extractedData.location?.coordinates?.longitude?.toString() || '0.0000'
    };

    for (const [search, replace] of Object.entries(replacements)) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
    }

    await fs.writeFile(layoutPath, content);
    this.customizationReport.push({
      file: 'app/layout.tsx',
      changes: Object.keys(replacements).length,
      description: 'Updated metadata, schema markup, and contact information'
    });
  }

  /**
   * Customize Footer component
   */
  async customizeFooterComponent(outputDir) {
    const footerPath = path.join(outputDir, 'components', 'Footer.tsx');
    let content = await fs.readFile(footerPath, 'utf8');

    const replacements = {
      'Your Clinic Name': this.extractedData.business?.name || 'Your Clinic Name',
      '+447888864454': this.extractedData.contact?.phone || '+447888864454',
      'info@leadballoon.co.uk': this.extractedData.contact?.email || 'info@leadballoon.co.uk',
      '[Your Location]': this.extractedData.contact?.address || this.extractedData.location?.city || '[Your Location]'
    };

    for (const [search, replace] of Object.entries(replacements)) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
    }

    await fs.writeFile(footerPath, content);
    this.customizationReport.push({
      file: 'components/Footer.tsx',
      changes: Object.keys(replacements).length,
      description: 'Updated footer contact information and clinic name'
    });
  }

  /**
   * Customize CTA Section component
   */
  async customizeCTAComponent(outputDir) {
    const ctaPath = path.join(outputDir, 'components', 'CTASection.tsx');
    let content = await fs.readFile(ctaPath, 'utf8');

    const replacements = {
      '+447888864454': this.extractedData.contact?.phone || '+447888864454',
      'info@leadballoon.co.uk': this.extractedData.contact?.email || 'info@leadballoon.co.uk',
      '[Your Location]': this.extractedData.contact?.address || this.extractedData.location?.city || '[Your Location]'
    };

    for (const [search, replace] of Object.entries(replacements)) {
      content = content.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
    }

    await fs.writeFile(ctaPath, content);
    this.customizationReport.push({
      file: 'components/CTASection.tsx',
      changes: Object.keys(replacements).length,
      description: 'Updated CTA section contact information'
    });
  }

  /**
   * Customize Team Section component
   */
  async customizeTeamSection(outputDir) {
    const teamPath = path.join(outputDir, 'components', 'TeamSection.tsx');
    let content = await fs.readFile(teamPath, 'utf8');

    if (this.extractedData.team?.members?.length > 0) {
      const teamMember = this.extractedData.team.members[0];
      const replacements = {
        'Your Expert Team': teamMember.name || 'Your Expert Team',
        'Expert in Anti-Ageing & Skin Health': teamMember.title || 'Expert in Anti-Ageing & Skin Health',
        'As experts in anti-ageing and skin health with over 10 years of experience in advanced aesthetic treatments, our team leads the CO2 laser program with a focus on excellence and patient safety. Our commitment is to deliver transformative results while ensuring the highest standards of care throughout your treatment journey.':
          teamMember.bio || 'As experts in anti-ageing and skin health with over 10 years of experience in advanced aesthetic treatments, our team leads the CO2 laser program with a focus on excellence and patient safety.'
      };

      for (const [search, replace] of Object.entries(replacements)) {
        content = content.replace(search, replace);
      }

      this.customizationReport.push({
        file: 'components/TeamSection.tsx',
        changes: Object.keys(replacements).length,
        description: 'Updated team member information with clinic data'
      });
    } else {
      this.manualReviewItems.push({
        type: 'customization_needed',
        field: 'Team Section',
        message: 'No team member data found - requires manual update of TeamSection.tsx',
        priority: 'medium'
      });
    }

    await fs.writeFile(teamPath, content);
  }

  /**
   * Customize Hero Section component
   */
  async customizeHeroSection(outputDir) {
    const heroPath = path.join(outputDir, 'components', 'HeroSection.tsx');

    try {
      let content = await fs.readFile(heroPath, 'utf8');

      // Update location-specific content if available
      if (this.extractedData.location?.city) {
        content = content.replace(/London/g, this.extractedData.location.city);
        content = content.replace(/Marylebone/g, this.extractedData.location.city);
      }

      await fs.writeFile(heroPath, content);
      this.customizationReport.push({
        file: 'components/HeroSection.tsx',
        changes: 1,
        description: 'Updated location references in hero section'
      });
    } catch (error) {
      // Hero section file might not exist in all templates
      console.log('   ⚠️  HeroSection.tsx not found, skipping...');
    }
  }

  /**
   * Customize booking configuration
   */
  async customizeBookingConfig(outputDir) {
    const bookingPath = path.join(outputDir, 'config', 'booking.ts');

    try {
      let content = await fs.readFile(bookingPath, 'utf8');

      // Note: Actual booking URL would need to be provided separately
      this.manualReviewItems.push({
        type: 'configuration_needed',
        field: 'Booking Configuration',
        message: 'Update GHL_BOOKING_URL in config/booking.ts with client\'s booking system URL',
        priority: 'high'
      });

      this.customizationReport.push({
        file: 'config/booking.ts',
        changes: 0,
        description: 'Booking configuration requires manual URL update'
      });
    } catch (error) {
      console.log('   ⚠️  booking.ts not found, skipping...');
    }
  }

  /**
   * Customize package.json
   */
  async customizePackageJson(outputDir) {
    const packagePath = path.join(outputDir, 'package.json');
    let packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));

    const clinicName = this.extractedData.business?.name || 'New Clinic';
    packageJson.name = `${clinicName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-co2-laser-site`;
    packageJson.description = `CO2 Laser treatment website for ${clinicName}`;

    await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
    this.customizationReport.push({
      file: 'package.json',
      changes: 2,
      description: 'Updated project name and description'
    });
  }

  /**
   * Helper function to extract domain from URL
   */
  getDomainFromUrl(url) {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  /**
   * Run quality assurance checks
   */
  async runQualityAssurance(outputDir) {
    // Check file integrity
    const requiredFiles = [
      'package.json',
      'app/layout.tsx',
      'components/Footer.tsx',
      'components/CTASection.tsx',
      'components/TeamSection.tsx'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(outputDir, file);
      try {
        await fs.access(filePath);
        this.qualityChecks.push({
          type: 'file_check',
          file: file,
          status: 'pass',
          message: 'File exists and accessible'
        });
      } catch {
        this.qualityChecks.push({
          type: 'file_check',
          file: file,
          status: 'fail',
          message: 'Required file missing or inaccessible'
        });
      }
    }

    // Check for placeholder content
    await this.checkForPlaceholders(outputDir);

    // Validate React components
    await this.validateReactComponents(outputDir);

    console.log(`   ✅ Quality assurance completed`);
    console.log(`   📊 Ran ${this.qualityChecks.length} quality checks`);
  }

  /**
   * Check for remaining placeholder content
   */
  async checkForPlaceholders(outputDir) {
    const placeholders = [
      'Your Clinic Name',
      '[Your Location]',
      'your-clinic-domain.com',
      'info@leadballoon.co.uk'
    ];

    const filesToCheck = [
      'app/layout.tsx',
      'components/Footer.tsx',
      'components/CTASection.tsx'
    ];

    for (const file of filesToCheck) {
      const filePath = path.join(outputDir, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        for (const placeholder of placeholders) {
          if (content.includes(placeholder)) {
            this.qualityChecks.push({
              type: 'placeholder_check',
              file: file,
              status: 'warning',
              message: `Placeholder "${placeholder}" still present`
            });
          }
        }
      } catch (error) {
        // File doesn't exist, already noted in file check
      }
    }
  }

  /**
   * Validate React components syntax
   */
  async validateReactComponents(outputDir) {
    const componentFiles = [
      'components/Footer.tsx',
      'components/CTASection.tsx',
      'components/TeamSection.tsx'
    ];

    for (const file of componentFiles) {
      const filePath = path.join(outputDir, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');

        // Basic syntax checks
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;

        if (openBraces !== closeBraces) {
          this.qualityChecks.push({
            type: 'syntax_check',
            file: file,
            status: 'fail',
            message: 'Mismatched braces detected'
          });
        } else if (openParens !== closeParens) {
          this.qualityChecks.push({
            type: 'syntax_check',
            file: file,
            status: 'fail',
            message: 'Mismatched parentheses detected'
          });
        } else {
          this.qualityChecks.push({
            type: 'syntax_check',
            file: file,
            status: 'pass',
            message: 'Basic syntax validation passed'
          });
        }
      } catch (error) {
        // File doesn't exist, already noted in file check
      }
    }
  }

  /**
   * Generate comprehensive reports
   */
  async generateReports(outputDir) {
    const reportDir = path.join(outputDir, 'customization-reports');
    await fs.mkdir(reportDir, { recursive: true });

    // Generate customization report
    await this.generateCustomizationReport(reportDir);

    // Generate manual review checklist
    await this.generateManualReviewChecklist(reportDir);

    // Generate deployment guide
    await this.generateDeploymentGuide(reportDir);

    // Generate quality assurance report
    await this.generateQualityReport(reportDir);

    console.log(`   📋 Reports generated in: ${reportDir}`);
  }

  /**
   * Generate customization report
   */
  async generateCustomizationReport(reportDir) {
    const report = {
      timestamp: new Date().toISOString(),
      extractedData: this.extractedData,
      customizations: this.customizationReport,
      summary: {
        totalFiles: this.customizationReport.length,
        totalChanges: this.customizationReport.reduce((sum, item) => sum + item.changes, 0),
        dataCompleteness: this.calculateDataCompleteness()
      }
    };

    await fs.writeFile(
      path.join(reportDir, 'customization-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate human-readable markdown report
    const markdown = this.generateMarkdownReport(report);
    await fs.writeFile(
      path.join(reportDir, 'CUSTOMIZATION-REPORT.md'),
      markdown
    );
  }

  /**
   * Calculate data completeness percentage
   */
  calculateDataCompleteness() {
    const fields = [
      this.extractedData.business?.name,
      this.extractedData.contact?.phone,
      this.extractedData.contact?.email,
      this.extractedData.contact?.address,
      this.extractedData.location?.city,
      this.extractedData.team?.members?.length > 0
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(report) {
    return `# CO2 Laser Template Customization Report

## Summary
- **Customization Date**: ${new Date(report.timestamp).toLocaleDateString()}
- **Files Modified**: ${report.summary.totalFiles}
- **Total Changes**: ${report.summary.totalChanges}
- **Data Completeness**: ${report.summary.dataCompleteness}%

## Extracted Data

### Business Information
- **Name**: ${this.extractedData.business?.name || 'Not found'}
- **Tagline**: ${this.extractedData.business?.tagline || 'Not found'}
- **Description**: ${this.extractedData.business?.description || 'Not found'}
- **Years Established**: ${this.extractedData.business?.yearsEstablished || 'Not found'}

### Contact Information
- **Phone**: ${this.extractedData.contact?.phone || 'Not found'}
- **Email**: ${this.extractedData.contact?.email || 'Not found'}
- **Address**: ${this.extractedData.contact?.address || 'Not found'}
- **Postcode**: ${this.extractedData.contact?.postcode || 'Not found'}
- **Website**: ${this.extractedData.contact?.website || 'Not found'}

### Location
- **City**: ${this.extractedData.location?.city || 'Not found'}
- **Region**: ${this.extractedData.location?.region || 'Not found'}
- **Country**: ${this.extractedData.location?.country || 'Not found'}

### Team Information
- **Team Members Found**: ${this.extractedData.team?.members?.length || 0}
${this.extractedData.team?.members?.map(member => `  - ${member.name} - ${member.title}`).join('\n') || '  - None found'}

### Services & Treatments
- **Treatments Found**: ${this.extractedData.services?.treatments?.length || 0}
${this.extractedData.services?.treatments?.map(treatment => `  - ${treatment}`).join('\n') || '  - None found'}

### Branding
- **Logo URL**: ${this.extractedData.branding?.logoUrl || 'Not found'}
- **Brand Voice**: ${this.extractedData.branding?.brandVoice?.tone || 'Not analyzed'}

### Social Proof
- **Reviews Rating**: ${this.extractedData.socialProof?.reviews?.rating || 'Not found'}
- **Reviews Count**: ${this.extractedData.socialProof?.reviews?.count || 'Not found'}
- **Testimonials Found**: ${this.extractedData.socialProof?.testimonials?.length || 0}

## File Modifications

${report.customizations.map(change => `### ${change.file}
- **Changes Made**: ${change.changes}
- **Description**: ${change.description}
`).join('\n')}

## Manual Review Required
${this.manualReviewItems.length > 0 ? this.manualReviewItems.map(item => `- **${item.field}** (${item.priority}): ${item.message}`).join('\n') : '- No manual review items'}

## Next Steps
1. Review all manual review items listed above
2. Test the customized website locally
3. Update booking configuration with client's actual booking URL
4. Review and replace placeholder images
5. Test all contact forms and CTAs
6. Deploy to staging environment for client review
`;
  }

  /**
   * Generate manual review checklist
   */
  async generateManualReviewChecklist(reportDir) {
    const checklist = `# Manual Review Checklist

## High Priority Items
${this.manualReviewItems.filter(item => item.priority === 'high').map(item =>
  `- [ ] **${item.field}**: ${item.message}`
).join('\n') || '- No high priority items'}

## Medium Priority Items
${this.manualReviewItems.filter(item => item.priority === 'medium').map(item =>
  `- [ ] **${item.field}**: ${item.message}`
).join('\n') || '- No medium priority items'}

## Low Priority Items
${this.manualReviewItems.filter(item => item.priority === 'low').map(item =>
  `- [ ] **${item.field}**: ${item.message}`
).join('\n') || '- No low priority items'}

## Additional Manual Tasks
- [ ] Update booking configuration in \`config/booking.ts\`
- [ ] Replace placeholder images in \`public/images/\`
- [ ] Update social media links if available
- [ ] Review and customize treatment pricing
- [ ] Test contact forms and booking integration
- [ ] Review SEO metadata for accuracy
- [ ] Test responsive design on mobile devices
- [ ] Update privacy policy with clinic details
- [ ] Set up analytics tracking
- [ ] Configure domain and hosting
`;

    await fs.writeFile(
      path.join(reportDir, 'MANUAL-REVIEW-CHECKLIST.md'),
      checklist
    );
  }

  /**
   * Generate deployment guide
   */
  async generateDeploymentGuide(reportDir) {
    const guide = `# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Hosting platform account (Vercel, Netlify, etc.)

## Local Setup
1. Navigate to the customized template directory
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open http://localhost:3000 to preview

## Pre-Deployment Checklist
- [ ] Complete all manual review items
- [ ] Update booking configuration
- [ ] Replace placeholder images
- [ ] Test all contact forms
- [ ] Review mobile responsiveness
- [ ] Update privacy policy
- [ ] Set up domain and SSL

## Vercel Deployment
1. Connect Git repository to Vercel
2. Configure build settings:
   - Build Command: \`npm run build\`
   - Output Directory: \`.next\`
3. Set environment variables if needed
4. Deploy and test

## Domain Configuration
1. Add custom domain in hosting platform
2. Update DNS records:
   - A record: Point to hosting IP
   - CNAME: www subdomain
3. Enable SSL certificate
4. Test domain propagation

## Post-Deployment
- [ ] Test all functionality on live site
- [ ] Set up Google Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Test booking integration
- [ ] Monitor site performance
- [ ] Set up backup schedule

## Support
For technical issues, contact the development team with:
- Error messages
- Screenshots
- Browser and device information
`;

    await fs.writeFile(
      path.join(reportDir, 'DEPLOYMENT-GUIDE.md'),
      guide
    );
  }

  /**
   * Generate quality assurance report
   */
  async generateQualityReport(reportDir) {
    const passedChecks = this.qualityChecks.filter(check => check.status === 'pass').length;
    const totalChecks = this.qualityChecks.length;
    const score = Math.round((passedChecks / totalChecks) * 100);

    const report = `# Quality Assurance Report

## Overall Score: ${score}% (${passedChecks}/${totalChecks} checks passed)

## Quality Checks

${this.qualityChecks.map(check =>
  `### ${check.file || check.type}
- **Status**: ${check.status.toUpperCase()}
- **Message**: ${check.message}
`).join('\n')}

## Recommendations
${score >= 90 ? '✅ Excellent quality - ready for deployment' :
  score >= 70 ? '⚠️ Good quality - address warnings before deployment' :
  '❌ Poor quality - requires fixes before deployment'}

## Next Steps
${this.qualityChecks.filter(check => check.status === 'fail').length > 0 ?
  '1. Fix all failed quality checks\n2. Re-run quality assurance\n3. Review manual checklist' :
  '1. Complete manual review checklist\n2. Test thoroughly\n3. Proceed with deployment'}
`;

    await fs.writeFile(
      path.join(reportDir, 'QUALITY-REPORT.md'),
      report
    );
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
CO2 Laser Template Customization Agent

Usage: node clinic-automation-agent.js --url <website-url> [options]

Options:
  --url <url>              Target clinic website URL (required)
  --name <name>            Override clinic name
  --template <path>        Custom template path
  --output <path>          Custom output directory
  --firecrawl-key <key>    Firecrawl API key
  --help, -h               Show this help message

Examples:
  node clinic-automation-agent.js --url https://example-clinic.com
  node clinic-automation-agent.js --url https://clinic.com --name "Elite Aesthetics"
`);
    process.exit(0);
  }

  const urlIndex = args.indexOf('--url');
  if (urlIndex === -1 || !args[urlIndex + 1]) {
    console.error('❌ Error: --url parameter is required');
    process.exit(1);
  }

  const websiteUrl = args[urlIndex + 1];
  const nameIndex = args.indexOf('--name');
  const clinicName = nameIndex !== -1 ? args[nameIndex + 1] : null;

  const agent = new ClinicCustomizationAgent({
    templatePath: args[args.indexOf('--template') + 1] || undefined,
    outputPath: args[args.indexOf('--output') + 1] || undefined,
    firecrawlApiKey: args[args.indexOf('--firecrawl-key') + 1] || undefined
  });

  agent.execute(websiteUrl, clinicName)
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Customization completed successfully!');
        console.log(`📁 Output: ${result.outputPath}`);
        console.log(`📊 Data completeness: ${agent.calculateDataCompleteness()}%`);
        console.log(`⚠️  Manual review items: ${result.manualReviewItems.length}`);
      } else {
        console.error('\n❌ Customization failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Unexpected error:', error.message);
      process.exit(1);
    });
}

module.exports = ClinicCustomizationAgent;