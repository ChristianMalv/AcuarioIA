'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  )
}

// Hook para tracking de eventos
export const useGoogleAnalytics = () => {
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackPurchase = (transactionId: string, value: number, items: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: 'MXN',
        items: items
      })
    }
  }

  const trackAddToCart = (itemId: string, itemName: string, price: number, quantity: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'MXN',
        value: price * quantity,
        items: [{
          item_id: itemId,
          item_name: itemName,
          price: price,
          quantity: quantity
        }]
      })
    }
  }

  const trackViewItem = (itemId: string, itemName: string, category: string, price: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'MXN',
        value: price,
        items: [{
          item_id: itemId,
          item_name: itemName,
          item_category: category,
          price: price,
          quantity: 1
        }]
      })
    }
  }

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackViewItem
  }
}

// Declaración de tipos para gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
