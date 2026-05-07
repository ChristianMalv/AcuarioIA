import { NextResponse } from 'next/server'

type GooglePlaceReview = {
  author_name?: string
  profile_photo_url?: string
  rating?: number
  relative_time_description?: string
  text?: string
  time?: number
  language?: string
  translatedText?: string
  isAutoTranslated?: boolean
}

type FindPlaceFromTextResponse = {
  status?: string
  error_message?: string
  candidates?: Array<{ place_id?: string }>
}

type GooglePlaceDetailsResponse = {
  status?: string
  error_message?: string
  result?: {
    name?: string
    rating?: number
    user_ratings_total?: number
    reviews?: GooglePlaceReview[]
  }
}

const MONTH_SECONDS = 60 * 60 * 24 * 30

type TranslateResponse = {
  data?: {
    translations?: Array<{ translatedText?: string }>
  }
}

async function translateTextsToSpanish(apiKey: string, texts: string[]): Promise<string[] | null> {
  if (texts.length === 0) return []
  const url = new URL('https://translation.googleapis.com/language/translate/v2')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: texts, target: 'es', format: 'text' }),
    next: { revalidate: MONTH_SECONDS },
  })
  if (!res.ok) return null
  const data = (await res.json()) as TranslateResponse
  const translations = data.data?.translations
  if (!translations || translations.length !== texts.length) return null
  return translations.map((t) => t.translatedText ?? '')
}

async function resolvePlaceIdFromText(apiKey: string, input: string): Promise<string | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json')
  url.searchParams.set('input', input)
  url.searchParams.set('inputtype', 'textquery')
  url.searchParams.set('fields', 'place_id')
  url.searchParams.set('language', 'es')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: MONTH_SECONDS } })
  if (!res.ok) return null
  const data = (await res.json()) as FindPlaceFromTextResponse
  if (data.status !== 'OK') return null
  const placeId = data.candidates?.[0]?.place_id
  return placeId ?? null
}

export async function GET(request: Request) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  const envPlaceId = process.env.GOOGLE_PLACE_ID
  const placeQuery = process.env.GOOGLE_PLACE_QUERY
  const translateApiKey = process.env.GOOGLE_TRANSLATE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'Missing env vars',
        missing: {
          GOOGLE_MAPS_API_KEY: !apiKey,
          GOOGLE_PLACE_ID: !envPlaceId,
          GOOGLE_PLACE_QUERY: !placeQuery,
        },
      },
      { status: 500 }
    )
  }

  const reqUrl = new URL(request.url)
  const placeIdOverride = reqUrl.searchParams.get('placeId')
  const placeQueryOverride = reqUrl.searchParams.get('query')

  let placeId = placeIdOverride || envPlaceId || null
  if (!placeId) {
    const queryToResolve = placeQueryOverride || placeQuery
    if (!queryToResolve) {
      return NextResponse.json(
        {
          error: 'Missing env vars',
          missing: {
            GOOGLE_PLACE_ID: true,
            GOOGLE_PLACE_QUERY: true,
          },
        },
        { status: 500 }
      )
    }

    placeId = await resolvePlaceIdFromText(apiKey, queryToResolve)
    if (!placeId) {
      return NextResponse.json(
        {
          error: 'Unable to resolve place_id from GOOGLE_PLACE_QUERY',
        },
        { status: 502 }
      )
    }
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json')
  url.searchParams.set('place_id', placeId)
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews')
  url.searchParams.set('language', 'es')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: MONTH_SECONDS } })
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch Google reviews' }, { status: 502 })
  }

  const data = (await res.json()) as GooglePlaceDetailsResponse
  if (data.status !== 'OK' || !data.result) {
    return NextResponse.json(
      {
        error: 'Google Places error',
        status: data.status,
        message: data.error_message,
      },
      { status: 502 }
    )
  }

  const reviews = Array.isArray(data.result.reviews) ? data.result.reviews : []

  const normalized = reviews.map((r) => ({
    ...r,
    language: (r.language ?? '').toLowerCase(),
  }))

  const spanish = normalized.filter((r) => r.language.startsWith('es'))
  const nonSpanish = normalized.filter((r) => !r.language.startsWith('es'))

  let finalReviews: GooglePlaceReview[] = spanish

  if (translateApiKey && nonSpanish.length > 0) {
    const textsToTranslate = nonSpanish.map((r) => r.text ?? '')
    const translated = await translateTextsToSpanish(translateApiKey, textsToTranslate)

    if (translated) {
      finalReviews = finalReviews.concat(
        nonSpanish.map((r, i) => ({
          ...r,
          translatedText: translated[i] || r.text,
          isAutoTranslated: true,
        }))
      )
    }
  }

  return NextResponse.json(
    {
    name: data.result.name ?? '',
    rating: data.result.rating ?? null,
    userRatingsTotal: data.result.user_ratings_total ?? null,
    reviews: finalReviews,
    },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${MONTH_SECONDS}, stale-while-revalidate=86400`,
      },
    }
  )
}
