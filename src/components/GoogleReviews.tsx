'use client'

import { useEffect, useMemo, useState } from 'react'

type GoogleReview = {
  author_name?: string
  profile_photo_url?: string
  rating?: number
  relative_time_description?: string
  text?: string
  time?: number
  translatedText?: string
  isAutoTranslated?: boolean
}

type GoogleReviewsResponse = {
  name: string
  rating: number | null
  userRatingsTotal: number | null
  reviews: GoogleReview[]
}

function Stars({ rating }: { rating: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function GoogleReviews({
  minStars = 4,
  limit = 6,
  query,
}: {
  minStars?: number
  limit?: number
  query?: string
}) {
  const [data, setData] = useState<GoogleReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setLoadError('')
        const url = query ? `/api/google-reviews?query=${encodeURIComponent(query)}` : '/api/google-reviews'
        const res = await fetch(url)
        const json = await res.json().catch(() => null)

        if (!res.ok) {
          const msg = (json as { error?: string } | null)?.error || 'No se pudieron cargar las reseñas'
          setLoadError(msg)
          setData(null)
          return
        }

        setData(json as GoogleReviewsResponse)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [query])

  const filtered = useMemo(() => {
    const reviews = data?.reviews ?? []
    const ok = reviews.filter((r) => (r.rating ?? 0) >= minStars)
    ok.sort((a, b) => (b.time ?? 0) - (a.time ?? 0))
    return ok.slice(0, limit)
  }, [data, minStars, limit])

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Reseñas de nuestros clientes</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : loadError ? (
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-700">
            {loadError}
          </div>
        ) : filtered.length === 0 ? (
          <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-700">
            No hay reseñas para mostrar en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, idx) => (
              <div key={`${r.time ?? 0}-${idx}`} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-start gap-3">
                  {r.profile_photo_url ? (
                    <img
                      src={r.profile_photo_url}
                      alt={r.author_name ?? 'Autor'}
                      className="h-10 w-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-gray-900 truncate">{r.author_name ?? 'Cliente'}</div>
                      <div className="shrink-0">{typeof r.rating === 'number' ? <Stars rating={r.rating} /> : null}</div>
                    </div>
                    {r.relative_time_description ? (
                      <div className="text-sm text-gray-500 mt-1">{r.relative_time_description}</div>
                    ) : null}
                  </div>
                </div>

                {r.isAutoTranslated ? (
                  <div className="mt-3 text-xs text-gray-500">Traducción automática</div>
                ) : null}

                {r.translatedText ? (
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">{r.translatedText}</p>
                ) : r.text ? (
                  <p className="text-gray-700 mt-4 text-sm leading-relaxed">{r.text}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
