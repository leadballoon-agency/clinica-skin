'use client'

import Script from 'next/script'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export default function ConvertBox() {
  // Temporarily removed production check for debugging
  // if (!IS_PRODUCTION) {
  //   return null
  // }

  console.log('ConvertBox component rendering, NODE_ENV:', process.env.NODE_ENV)

  return (
    <Script
      id="app-convertbox-script"
      src="https://cdn.convertbox.com/convertbox/js/embed.js"
      strategy="afterInteractive"
      data-uuid="e2b4b048-1e07-482a-9efe-79ea173c2cff"
      onLoad={() => {
        console.log('ConvertBox: Script loaded successfully')
      }}
      onError={(e) => {
        console.error('ConvertBox: Script failed to load', e)
      }}
    />
  )
}
