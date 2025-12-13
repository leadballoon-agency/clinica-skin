/**
 * Firecrawl Integration Module for Clinic Data Extraction
 *
 * This module provides real web scraping capabilities using Firecrawl API
 * to extract comprehensive clinic information from existing websites.
 */

class FirecrawlClinicExtractor {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.FIRECRAWL_API_KEY;
    this.baseUrl = 'https://api.firecrawl.dev/v0';

    if (!this.apiKey) {
      throw new Error('Firecrawl API key is required. Set FIRECRAWL_API_KEY environment variable or pass it to constructor.');
    }
  }

  /**
   * Extract comprehensive clinic data from a website
   */
  async extractClinicData(websiteUrl) {
    console.log(`🔍 Extracting data from: ${websiteUrl}`);

    try {
      // Step 1: Scrape the main page
      const mainPageData = await this.scrapePage(websiteUrl, {
        formats: ['markdown', 'html'],
        onlyMainContent: true
      });

      // Step 2: Map the website to find all pages
      const siteMap = await this.mapWebsite(websiteUrl);

      // Step 3: Scrape key pages (about, team, services, contact)
      const keyPages = await this.scrapeKeyPages(websiteUrl, siteMap);

      // Step 4: Extract structured data
      const extractedData = await this.extractStructuredData(mainPageData, keyPages);

      // Step 5: Extract images and media
      const mediaData = await this.extractMediaData(mainPageData, keyPages);

      return {
        ...extractedData,
        media: mediaData,
        sourcePages: {
          main: mainPageData,
          additional: keyPages
        }
      };

    } catch (error) {
      console.error('Error extracting clinic data:', error.message);
      throw error;
    }
  }

  /**
   * Scrape a single page with Firecrawl
   */
  async scrapePage(url, options = {}) {
    const defaultOptions = {
      formats: ['markdown', 'html'],
      onlyMainContent: true,
      waitFor: 3000,
      ...options
    };

    try {
      const response = await fetch(`${this.baseUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          ...defaultOptions
        })
      });

      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Scraping failed: ${data.error || 'Unknown error'}`);
      }

      return data.data;

    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Map website to discover all pages
   */
  async mapWebsite(websiteUrl) {
    try {
      const response = await fetch(`${this.baseUrl}/map`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: websiteUrl,
          limit: 50,
          includeSubdomains: false
        })
      });

      if (!response.ok) {
        throw new Error(`Firecrawl map API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Mapping failed: ${data.error || 'Unknown error'}`);
      }

      return data.data || [];

    } catch (error) {
      console.error(`Failed to map website ${websiteUrl}:`, error.message);
      return []; // Return empty array if mapping fails
    }
  }

  /**
   * Scrape key pages based on discovered URLs
   */
  async scrapeKeyPages(baseUrl, siteMap) {
    const keyPageTypes = {
      about: ['about', 'about-us', 'our-story', 'who-we-are'],
      team: ['team', 'staff', 'doctors', 'practitioners', 'our-team'],
      services: ['services', 'treatments', 'procedures', 'what-we-do'],
      contact: ['contact', 'contact-us', 'get-in-touch', 'location'],
      pricing: ['prices', 'pricing', 'costs', 'fees']
    };

    const keyPages = {};

    for (const [pageType, keywords] of Object.entries(keyPageTypes)) {
      const matchingUrl = this.findMatchingUrl(siteMap, keywords, baseUrl);

      if (matchingUrl) {
        try {
          console.log(`  📄 Scraping ${pageType} page: ${matchingUrl}`);
          keyPages[pageType] = await this.scrapePage(matchingUrl);

          // Add a small delay to be respectful to the server
          await this.delay(1000);
        } catch (error) {
          console.warn(`  ⚠️ Failed to scrape ${pageType} page: ${error.message}`);
        }
      }
    }

    return keyPages;
  }

  /**
   * Find URL matching keywords
   */
  findMatchingUrl(siteMap, keywords, baseUrl) {
    for (const keyword of keywords) {
      const match = siteMap.find(url => {
        const path = url.replace(baseUrl, '').toLowerCase();
        return path.includes(keyword) || path.includes(`/${keyword}`);
      });

      if (match) return match;
    }

    return null;
  }

  /**
   * Extract structured data using AI
   */
  async extractStructuredData(mainPageData, keyPages) {
    // Use Firecrawl's extract endpoint for structured data extraction
    const schema = {
      type: "object",
      properties: {
        business: {
          type: "object",
          properties: {
            name: { type: "string", description: "Business/clinic name" },
            tagline: { type: "string", description: "Business tagline or slogan" },
            description: { type: "string", description: "Business description" },
            yearsEstablished: { type: "number", description: "Year the business was established" },
            specialties: { type: "array", items: { type: "string" }, description: "Main specialties or services" }
          }
        },
        contact: {
          type: "object",
          properties: {
            phone: { type: "string", description: "Primary phone number" },
            email: { type: "string", description: "Primary email address" },
            address: { type: "string", description: "Full physical address" },
            postcode: { type: "string", description: "UK postcode" },
            openingHours: { type: "object", description: "Opening hours by day" }
          }
        },
        location: {
          type: "object",
          properties: {
            city: { type: "string", description: "City name" },
            region: { type: "string", description: "County or region" },
            country: { type: "string", description: "Country" }
          }
        },
        team: {
          type: "object",
          properties: {
            members: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Team member name" },
                  title: { type: "string", description: "Job title or position" },
                  qualifications: { type: "array", items: { type: "string" }, description: "Qualifications and certifications" },
                  bio: { type: "string", description: "Biography or description" },
                  specialties: { type: "array", items: { type: "string" }, description: "Areas of specialization" }
                }
              }
            }
          }
        },
        services: {
          type: "object",
          properties: {
            treatments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Treatment name" },
                  description: { type: "string", description: "Treatment description" },
                  price: { type: "string", description: "Treatment price" },
                  duration: { type: "string", description: "Treatment duration" }
                }
              }
            }
          }
        },
        socialProof: {
          type: "object",
          properties: {
            reviews: {
              type: "object",
              properties: {
                rating: { type: "number", description: "Average rating (1-5)" },
                count: { type: "number", description: "Number of reviews" },
                platform: { type: "string", description: "Review platform (Google, Facebook, etc.)" }
              }
            },
            testimonials: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string", description: "Testimonial text" },
                  author: { type: "string", description: "Author name" },
                  treatment: { type: "string", description: "Treatment received" }
                }
              }
            }
          }
        },
        branding: {
          type: "object",
          properties: {
            brandVoice: { type: "string", description: "Brand voice/tone (professional, friendly, luxury, etc.)" },
            keyMessages: { type: "array", items: { type: "string" }, description: "Key brand messages" }
          }
        }
      }
    };

    try {
      // Combine all page content for extraction
      const combinedContent = [
        mainPageData.markdown || mainPageData.content,
        ...Object.values(keyPages).map(page => page.markdown || page.content)
      ].filter(Boolean).join('\n\n');

      const response = await fetch(`${this.baseUrl}/extract`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          urls: [mainPageData.metadata?.sourceURL || mainPageData.url],
          schema: schema,
          prompt: `Extract comprehensive clinic/business information from this website. Focus on:
- Business name, description, and specialties
- Complete contact information including phone, email, address
- Team member details including names, titles, qualifications, and bios
- Services and treatments offered with descriptions and pricing
- Customer reviews and testimonials
- Brand voice and key messaging
- Location and opening hours

Be thorough and accurate. If information is not available, leave fields empty rather than guessing.`
        })
      });

      if (!response.ok) {
        throw new Error(`Firecrawl extract API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(`Extraction failed: ${data.error || 'Unknown error'}`);
      }

      return data.data?.[0]?.extract || {};

    } catch (error) {
      console.error('Failed to extract structured data:', error.message);

      // Fallback to manual extraction if AI extraction fails
      return this.fallbackExtraction(mainPageData, keyPages);
    }
  }

  /**
   * Fallback manual extraction if AI extraction fails
   */
  fallbackExtraction(mainPageData, keyPages) {
    const allContent = [
      mainPageData.markdown || mainPageData.content || '',
      ...Object.values(keyPages).map(page => page.markdown || page.content || '')
    ].join('\n');

    return {
      business: {
        name: this.extractBusinessName(allContent, mainPageData.metadata?.title),
        description: mainPageData.metadata?.description || this.extractDescription(allContent),
        specialties: this.extractSpecialties(allContent)
      },
      contact: {
        phone: this.extractPhone(allContent),
        email: this.extractEmail(allContent),
        address: this.extractAddress(allContent),
        postcode: this.extractPostcode(allContent)
      },
      location: {
        city: this.extractCity(allContent),
        region: this.extractRegion(allContent),
        country: 'United Kingdom'
      },
      team: {
        members: this.extractTeamMembers(allContent, keyPages.team)
      },
      services: {
        treatments: this.extractTreatments(allContent, keyPages.services)
      },
      socialProof: {
        reviews: this.extractReviews(allContent),
        testimonials: this.extractTestimonials(allContent)
      },
      branding: {
        brandVoice: this.analyzeBrandVoice(allContent),
        keyMessages: this.extractKeyMessages(allContent)
      }
    };
  }

  /**
   * Extract media data (logos, images, etc.)
   */
  async extractMediaData(mainPageData, keyPages) {
    const mediaData = {
      logos: [],
      teamPhotos: [],
      facilityImages: [],
      treatmentImages: []
    };

    // Extract from main page
    if (mainPageData.html) {
      mediaData.logos.push(...this.extractLogos(mainPageData.html));
      mediaData.facilityImages.push(...this.extractFacilityImages(mainPageData.html));
    }

    // Extract from team page
    if (keyPages.team?.html) {
      mediaData.teamPhotos.push(...this.extractTeamPhotos(keyPages.team.html));
    }

    // Extract from services page
    if (keyPages.services?.html) {
      mediaData.treatmentImages.push(...this.extractTreatmentImages(keyPages.services.html));
    }

    return mediaData;
  }

  // Media extraction helper methods
  extractLogos(html) {
    const logoSelectors = [
      'img[class*="logo"]',
      'img[id*="logo"]',
      'img[alt*="logo"]',
      '.logo img',
      '#logo img',
      'header img'
    ];

    const logos = [];
    for (const selector of logoSelectors) {
      const matches = html.match(new RegExp(`<img[^>]*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*src=["']([^"']+)["']`, 'gi'));
      if (matches) {
        logos.push(...matches.map(match => {
          const srcMatch = match.match(/src=["']([^"']+)["']/);
          return srcMatch ? srcMatch[1] : null;
        }).filter(Boolean));
      }
    }

    return [...new Set(logos)]; // Remove duplicates
  }

  extractTeamPhotos(html) {
    const teamSelectors = [
      'img[class*="team"]',
      'img[class*="staff"]',
      'img[class*="doctor"]',
      'img[class*="practitioner"]',
      '.team img',
      '.staff img'
    ];

    const photos = [];
    for (const selector of teamSelectors) {
      const matches = html.match(new RegExp(`<img[^>]*${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^>]*src=["']([^"']+)["']`, 'gi'));
      if (matches) {
        photos.push(...matches.map(match => {
          const srcMatch = match.match(/src=["']([^"']+)["']/);
          return srcMatch ? srcMatch[1] : null;
        }).filter(Boolean));
      }
    }

    return [...new Set(photos)];
  }

  extractFacilityImages(html) {
    const facilityKeywords = ['clinic', 'facility', 'office', 'reception', 'treatment-room'];
    const images = [];

    for (const keyword of facilityKeywords) {
      const matches = html.match(new RegExp(`<img[^>]*(?:alt|class|id)[^>]*${keyword}[^>]*src=["']([^"']+)["']`, 'gi'));
      if (matches) {
        images.push(...matches.map(match => {
          const srcMatch = match.match(/src=["']([^"']+)["']/);
          return srcMatch ? srcMatch[1] : null;
        }).filter(Boolean));
      }
    }

    return [...new Set(images)];
  }

  extractTreatmentImages(html) {
    const treatmentKeywords = ['treatment', 'procedure', 'before', 'after', 'result'];
    const images = [];

    for (const keyword of treatmentKeywords) {
      const matches = html.match(new RegExp(`<img[^>]*(?:alt|class|id)[^>]*${keyword}[^>]*src=["']([^"']+)["']`, 'gi'));
      if (matches) {
        images.push(...matches.map(match => {
          const srcMatch = match.match(/src=["']([^"']+)["']/);
          return srcMatch ? srcMatch[1] : null;
        }).filter(Boolean));
      }
    }

    return [...new Set(images)];
  }

  // Extraction helper methods (implement the same patterns from the main agent)
  extractBusinessName(content, title) {
    if (title) {
      const titleMatch = title.match(/^([^|]+)/);
      if (titleMatch) return titleMatch[1].trim();
    }

    const patterns = [
      /(?:Dr\.?\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:Clinic|Aesthetics|Beauty|Skin|Medical)/i,
      /^#\s*([^|]+)/m,
      /(?:welcome to|about)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  extractDescription(content) {
    const paragraphs = content.split('\n').filter(line =>
      line.length > 50 &&
      !line.startsWith('#') &&
      !line.startsWith('*') &&
      !line.includes('©') &&
      !line.includes('cookie')
    );

    return paragraphs[0] || null;
  }

  extractPhone(content) {
    const phonePattern = /(?:tel:|phone:|call\s+us:?|contact\s+us:?)?\s*((?:\+44|0)[\s-]?[1-9](?:[\s-]?\d){8,10})/i;
    const match = content.match(phonePattern);
    return match ? match[1].replace(/[\s-]/g, '') : null;
  }

  extractEmail(content) {
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const match = content.match(emailPattern);
    return match ? match[1] : null;
  }

  extractAddress(content) {
    const addressPatterns = [
      /(?:address|location|find us|visit us):?\s*([^,\n]+,[^,\n]+,[^,\n]+)/i,
      /(\d+[^,\n]+,[^,\n]+,[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/i
    ];

    for (const pattern of addressPatterns) {
      const match = content.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  extractPostcode(content) {
    const postcodePattern = /([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})/;
    const match = content.match(postcodePattern);
    return match ? match[1] : null;
  }

  extractCity(content) {
    const address = this.extractAddress(content);
    if (address) {
      const parts = address.split(',').map(part => part.trim());
      return parts[parts.length - 2] || null;
    }
    return null;
  }

  extractRegion(content) {
    const postcode = this.extractPostcode(content);
    if (postcode) {
      const postcodeArea = postcode.substring(0, 2).toUpperCase();
      const regionMap = {
        'SW': 'London', 'SE': 'London', 'NW': 'London', 'N1': 'London',
        'E1': 'London', 'W1': 'London', 'WC': 'London', 'EC': 'London',
        'M1': 'Manchester', 'M2': 'Manchester', 'M3': 'Manchester',
        'B1': 'Birmingham', 'B2': 'Birmingham',
        'LS': 'Leeds', 'S1': 'Sheffield', 'NG': 'Nottingham'
      };
      return regionMap[postcodeArea] || null;
    }
    return null;
  }

  extractSpecialties(content) {
    const specialtyKeywords = [
      'anti-aging', 'anti-ageing', 'aesthetic', 'cosmetic', 'dermatology',
      'botox', 'fillers', 'laser', 'microneedling', 'chemical peel',
      'facial', 'skin rejuvenation', 'wrinkle treatment', 'acne treatment',
      'pigmentation', 'scar treatment', 'thread lift', 'plasma pen',
      'hydrafacial', 'dermaplaning', 'radiofrequency'
    ];

    return specialtyKeywords.filter(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  extractTeamMembers(content, teamPageData) {
    const teamContent = teamPageData?.markdown || content;
    const members = [];

    // Look for team member sections
    const memberSections = teamContent.split(/(?=##?\s*(?:Dr\.?\s*)?[A-Z][a-z]+\s+[A-Z][a-z]+)/);

    for (const section of memberSections) {
      const nameMatch = section.match(/##?\s*((?:Dr\.?\s*)?[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        const title = this.extractTitleFromSection(section);
        const qualifications = this.extractQualificationsFromSection(section);
        const bio = this.extractBioFromSection(section);

        members.push({
          name,
          title: title || 'Aesthetic Practitioner',
          qualifications: qualifications.length > 0 ? qualifications : ['Certified Aesthetic Practitioner'],
          bio: bio || null
        });
      }
    }

    return members;
  }

  extractTitleFromSection(section) {
    const titlePatterns = [
      /(?:title|position|role):\s*([^\n]+)/i,
      /\*\*([^*]+(?:doctor|dr|practitioner|specialist|consultant)[^*]*)\*\*/i,
      /^([^\n]*(?:doctor|dr|practitioner|specialist|consultant)[^\n]*)/im
    ];

    for (const pattern of titlePatterns) {
      const match = section.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }

  extractQualificationsFromSection(section) {
    const qualPatterns = [
      /(?:qualification|qualifications|education|training|certification)s?:\s*([^\n]+)/gi,
      /((?:BSc|MSc|PhD|MD|MBBS|BDS|FRCGP|GMC)[^\n,]*)/gi,
      /(?:qualified|certified|trained) in ([^\n,]+)/gi
    ];

    const qualifications = new Set();
    for (const pattern of qualPatterns) {
      const matches = section.matchAll(pattern);
      for (const match of matches) {
        qualifications.add(match[1]?.trim());
      }
    }

    return Array.from(qualifications).filter(Boolean);
  }

  extractBioFromSection(section) {
    const lines = section.split('\n').filter(line =>
      line.length > 50 &&
      !line.startsWith('#') &&
      !line.match(/^(?:qualification|education|training)/i)
    );

    return lines[0] || null;
  }

  extractTreatments(content, servicesPageData) {
    const servicesContent = servicesPageData?.markdown || content;
    const treatments = [];

    const treatmentPatterns = [
      /##?\s*([^#\n]+(?:treatment|therapy|procedure|service)[^#\n]*)/gi,
      /\*\s*([^*\n]+(?:treatment|therapy|procedure)[^*\n]*)/gi,
      /-\s*([^-\n]+(?:treatment|therapy|procedure)[^-\n]*)/gi
    ];

    for (const pattern of treatmentPatterns) {
      const matches = servicesContent.matchAll(pattern);
      for (const match of matches) {
        const treatment = match[1].trim();
        if (treatment.length > 3 && treatment.length < 100) {
          treatments.push({
            name: treatment,
            description: null,
            price: null
          });
        }
      }
    }

    return treatments;
  }

  extractReviews(content) {
    const reviewPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:star|rating|out of 5)/i,
      /(\d+)\s*(?:reviews?|testimonials?)/i,
      /rated\s*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*\/\s*5/i
    ];

    for (const pattern of reviewPatterns) {
      const match = content.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        if (value <= 5) {
          return { rating: value, platform: 'Website' };
        } else {
          return { count: value, platform: 'Website' };
        }
      }
    }

    return null;
  }

  extractTestimonials(content) {
    const testimonialPatterns = [
      /"([^"]{50,300})"/g,
      /testimonial:\s*"([^"]+)"/gi,
      /review:\s*"([^"]+)"/gi
    ];

    const testimonials = [];
    for (const pattern of testimonialPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        testimonials.push({
          text: match[1].trim(),
          author: 'Patient'
        });
      }
    }

    return testimonials;
  }

  analyzeBrandVoice(content) {
    const lowerContent = content.toLowerCase();

    const toneIndicators = {
      professional: ['professional', 'expert', 'certified', 'qualified', 'experienced', 'clinical'],
      luxury: ['luxury', 'premium', 'exclusive', 'bespoke', 'elite', 'sophisticated'],
      friendly: ['friendly', 'caring', 'personal', 'welcoming', 'comfortable', 'approachable'],
      medical: ['medical', 'clinical', 'treatment', 'diagnosis', 'procedure', 'healthcare']
    };

    const scores = {};
    for (const [tone, words] of Object.entries(toneIndicators)) {
      scores[tone] = words.reduce((sum, word) =>
        sum + (lowerContent.split(word).length - 1), 0
      );
    }

    const dominantTone = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    return dominantTone;
  }

  extractKeyMessages(content) {
    const messagePatterns = [
      /(?:we|our)\s+([^.!?]{20,100})/gi,
      /(?:specializ|focus|dedicate)[^.!?]{0,20}(?:in|on|to)\s+([^.!?]+)/gi,
      /(?:unique|different|special)[^.!?]{0,30}([^.!?]+)/gi
    ];

    const messages = new Set();
    for (const pattern of messagePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        const message = match[1]?.trim();
        if (message && message.length > 10 && message.length < 150) {
          messages.add(message);
        }
      }
    }

    return Array.from(messages).slice(0, 5); // Limit to top 5 messages
  }

  /**
   * Utility function to add delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = FirecrawlClinicExtractor;