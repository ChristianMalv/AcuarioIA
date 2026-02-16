'use client'

import Script from 'next/script'

interface GoogleAdsPixelProps {
  conversionId: string
}

export default function GoogleAdsPixel({ conversionId }: GoogleAdsPixelProps) {
  return (
    <>
      {/* Google Ads Global Site Tag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${conversionId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${conversionId}');
        `}
      </Script>
    </>
  )
}

// Hook para tracking de conversiones de Google Ads
export const useGoogleAds = () => {
  const trackConversion = (conversionLabel: string, value?: number, currency = 'MXN') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionLabel,
        value: value,
        currency: currency
      })
    }
  }

  const trackPurchaseConversion = (conversionLabel: string, transactionId: string, value: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: conversionLabel,
        value: value,
        currency: 'MXN',
        transaction_id: transactionId
      })
    }
  }

  const trackPageView = (conversionLabel: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        send_to: conversionLabel
      })
    }
  }

  return {
    trackConversion,
    trackPurchaseConversion,
    trackPageView
  }
}
