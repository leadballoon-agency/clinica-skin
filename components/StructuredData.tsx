export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Clinica Skin Cambridge",
    "alternateName": "Clinica Skin",
    "url": "https://co2lasercambridge.co.uk",
    "sameAs": [
      "https://clinicaskin.co.uk",
      "https://www.facebook.com/clinica.skin.cambridge"
    ],
    "logo": "https://co2lasercambridge.co.uk/images/clinica-logo-two-fonts-2-e1747394036335.webp",
    "image": "https://co2lasercambridge.co.uk/images/Dr-Katarzyna-cropped.jpg",
    "description": "Doctor-led CO2 laser resurfacing clinic in Cambridge. Dr. Katarzyna specializes in acne scar treatment, wrinkle reduction, sun damage repair, and advanced skin rejuvenation. CQC-registered and award-winning.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3-4 Sussex Street",
      "addressLocality": "Cambridge",
      "addressRegion": "Cambridgeshire",
      "postalCode": "CB1 1PA",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.2053",
      "longitude": "0.1218"
    },
    "telephone": "+441223555123",
    "priceRange": "£££",
    "openingHours": [
      "Mo-Fr 09:00-18:00",
      "Sa 09:00-17:00"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "CO2 Laser Treatments",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "CO2 Skin Resurfacing - Face",
            "description": "Full-face CO2 laser rejuvenation for wrinkles, scarring & texture"
          },
          "price": "900",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "CO2 Skin Resurfacing - Face + Neck",
            "description": "Comprehensive CO2 laser treatment for face and neck"
          },
          "price": "1300",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "CO2 Skin Resurfacing - Face, Neck + Chest",
            "description": "Full advanced CO2 laser rejuvenation package"
          },
          "price": "1700",
          "priceCurrency": "GBP"
        }
      ]
    },
    "medicalSpecialty": [
      "Dermatology",
      "Aesthetic Medicine",
      "Laser Therapy",
      "Regenerative Medicine"
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Clinica Skin CO2 Laser Cambridge",
    "alternateName": "CO2 Laser Cambridge",
    "url": "https://co2lasercambridge.co.uk",
    "description": "Doctor-led CO2 laser resurfacing for acne scars, wrinkles, sun damage & skin texture in Cambridge by Dr. Katarzyna",
    "publisher": {
      "@type": "Organization",
      "name": "Clinica Skin Cambridge"
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Clinica Skin Cambridge",
    "alternateName": "CO2 Laser Cambridge",
    "image": "https://co2lasercambridge.co.uk/images/Dr-Katarzyna-cropped.jpg",
    "description": "Doctor-led CO2 laser resurfacing clinic in Cambridge. CQC-registered, award-winning clinic specializing in acne scar treatment, wrinkle reduction, sun damage repair, and advanced skin rejuvenation with Dr. Katarzyna.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "3-4 Sussex Street",
      "addressLocality": "Cambridge",
      "addressRegion": "Cambridgeshire",
      "postalCode": "CB1 1PA",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.2053",
      "longitude": "0.1218"
    },
    "url": "https://co2lasercambridge.co.uk",
    "telephone": "+441223555123",
    "email": "info@clinicaskin.co.uk",
    "priceRange": "££-£££",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "17:00"
      }
    ],
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "GBP",
    "areaServed": [
      { "@type": "City", "name": "Cambridge" },
      { "@type": "City", "name": "Ely" },
      { "@type": "City", "name": "Newmarket" },
      { "@type": "City", "name": "Huntingdon" },
      { "@type": "City", "name": "St Ives" },
      { "@type": "City", "name": "Royston" }
    ],
    "hasMap": "https://maps.google.com/?q=3-4+Sussex+Street,+Cambridge+CB1+1PA",
    "medicalSpecialty": [
      "Dermatology",
      "Aesthetic Medicine",
      "Cosmetic Dermatology",
      "Regenerative Medicine"
    ]
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "CO2 Laser Resurfacing Cambridge",
    "description": "Doctor-led fractional CO2 laser treatment for acne scars, wrinkles, sun damage, and skin texture by Dr. Katarzyna at Clinica Skin",
    "provider": {
      "@type": "MedicalBusiness",
      "name": "Clinica Skin Cambridge",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3-4 Sussex Street",
        "addressLocality": "Cambridge",
        "addressRegion": "Cambridgeshire",
        "postalCode": "CB1 1PA",
        "addressCountry": "GB"
      },
      "telephone": "+441223555123"
    },
    "areaServed": [
      "Cambridge",
      "Cambridgeshire",
      "Ely",
      "Newmarket",
      "Huntingdon",
      "Suffolk",
      "Norfolk",
      "Hertfordshire"
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://co2lasercambridge.co.uk"
    },
    "category": "Medical Treatment",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "CO2 Laser Treatment Packages",
      "itemListElement": [
        {
          "@type": "Offer",
          "name": "CO2 Skin Resurfacing - Face",
          "price": "900",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "name": "CO2 Skin Resurfacing - Face + Neck",
          "price": "1300",
          "priceCurrency": "GBP"
        },
        {
          "@type": "Offer",
          "name": "CO2 Skin Resurfacing - Face, Neck + Chest",
          "price": "1700",
          "priceCurrency": "GBP"
        }
      ]
    }
  }

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Clinica Skin Cambridge",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "219",
      "bestRating": "5",
      "worstRating": "5"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Stuart Graham" },
        "datePublished": "2025-11-15",
        "reviewBody": "Very impressed by my visit today - Thank you Katrina! Put at ease, great treatment and a relaxed, professional but unpretentious environment. Will definitely be back for skin resurfacing in the next few weeks.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Tuzer Kalkan" },
        "datePublished": "2025-10-20",
        "reviewBody": "I have been getting treatment from Clinica for the last 7 months for facial hyperpigmentation/melasma areas. The treatment included laser and microneedling, and I've seen visible improvement in my skin tone and texture.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Vidia Kartika" },
        "datePublished": "2025-09-28",
        "reviewBody": "When I moved to Cambridge, all of my skin sensitivity was flaring up — cystic acne, dermatitis, inflammation all over my face. Dr Katarzyna's care completely transformed my skin. I finally have calm, clear, healthy skin again.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sophie Smith" },
        "datePublished": "2025-07-22",
        "reviewBody": "Amazing service. The team at Clinica are so knowledgeable and take really good care of you. Jodie & Katarzyna completely put me at ease and thoroughly explained the procedures and what was best for my skin.",
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
      }
    ]
  }

  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": "Dr. Katarzyna Molenda Wasilewska",
    "alternateName": "Dr. Kat",
    "image": "https://co2lasercambridge.co.uk/images/Dr-Katarzyna-cropped.jpg",
    "jobTitle": "Founder & Senior Aesthetic Medicine Doctor",
    "description": "Cambridge University Medicine Graduate. Qualified in Aesthetic and Regenerative Medicine. Member of Aesthetic Complications Expert Group (ACE). International speaker on skin longevity.",
    "worksFor": {
      "@type": "MedicalBusiness",
      "name": "Clinica Skin Cambridge",
      "url": "https://co2lasercambridge.co.uk"
    },
    "medicalSpecialty": [
      "Aesthetic Medicine",
      "Regenerative Medicine",
      "Dermatology",
      "CO2 Laser Resurfacing"
    ],
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "University of Cambridge"
    },
    "knowsAbout": [
      "CO2 Laser Resurfacing",
      "Acne Scar Treatment",
      "Skin Rejuvenation",
      "Anti-Aging Treatments"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />
    </>
  )
}
