'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window {
    fbq: any
    _fbq: any
  }
}

const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1420040315939258'
const IS_PRODUCTION = process.env.NODE_ENV === 'production'
const TEST_MODE = process.env.NEXT_PUBLIC_META_PIXEL_TEST_MODE === 'true'

export default function FacebookPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pixelLoaded, setPixelLoaded] = useState(false)
  const initialized = useRef(false)

  // Don't load pixel in development unless test mode is enabled
  if (!IS_PRODUCTION && !TEST_MODE) {
    return null
  }

  // Check when pixel script is fully loaded
  useEffect(() => {
    const checkPixel = setInterval(() => {
      if (typeof window !== 'undefined' && window.fbq && window.fbq.version) {
        setPixelLoaded(true)
        clearInterval(checkPixel)
      }
    }, 100)

    const timeout = setTimeout(() => {
      clearInterval(checkPixel)
      if (!pixelLoaded) {
        console.warn('Meta Pixel: Script failed to load within 10 seconds')
      }
    }, 10000)

    return () => {
      clearInterval(checkPixel)
      clearTimeout(timeout)
    }
  }, [pixelLoaded])

  // Track PageView on navigation
  useEffect(() => {
    // In development with StrictMode, prevent double-firing
    if (!IS_PRODUCTION && initialized.current) {
      return
    }
    initialized.current = true

    if (typeof window !== 'undefined' && window.fbq && pixelLoaded) {
      if (TEST_MODE) {
        console.log('[Meta Pixel TEST] PageView:', pathname, searchParams?.toString())
      }
      window.fbq('track', 'PageView')
    }
  }, [pathname, searchParams, pixelLoaded])

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Meta Pixel: Script loaded successfully')
        }}
        onError={(e) => {
          console.error('Meta Pixel: Script failed to load', e)
        }}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FACEBOOK_PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Enhanced tracking with retry logic
export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window === 'undefined') return
  if (!IS_PRODUCTION && !TEST_MODE) {
    console.log(`[Meta Pixel DEV] Would track: ${eventName}`, parameters)
    return
  }

  const maxAttempts = 10
  let attempts = 0

  const attemptTrack = () => {
    if (window.fbq && window.fbq.version) {
      if (TEST_MODE) {
        console.log(`[Meta Pixel TEST] Event: ${eventName}`, parameters)
      }
      window.fbq('track', eventName, parameters)
    } else if (attempts < maxAttempts) {
      attempts++
      setTimeout(attemptTrack, 100)
    } else {
      console.warn(`Meta Pixel: Failed to track ${eventName} after ${maxAttempts} attempts`)
    }
  }

  attemptTrack()
}

// Specific tracking functions for our landing page
export const trackAssessmentStart = () => {
  trackEvent('InitiateCheckout', { content_name: 'Skin Assessment Started' })
}

export const trackAssessmentComplete = (recommendation: string) => {
  trackEvent('CompleteRegistration', {
    content_name: 'Assessment Completed',
    value: recommendation,
    currency: 'GBP'
  })
}

export const trackBookingModalOpen = () => {
  trackEvent('ViewContent', { content_name: 'Booking Modal Opened' })
}

export const trackBookingSubmit = (treatmentType: string, price?: string) => {
  trackEvent('Lead', {
    content_name: 'Booking Form Submitted',
    content_category: treatmentType,
    value: price ? parseFloat(price.replace('£', '')) : undefined,
    currency: 'GBP'
  })
}

export const trackPhoneClick = () => {
  trackEvent('Contact', { content_name: 'Phone Number Clicked' })
}

export const trackPRPDealView = () => {
  trackEvent('ViewContent', {
    content_name: 'PRP For Free Deal Viewed',
    content_category: 'Special Offer'
  })
}
