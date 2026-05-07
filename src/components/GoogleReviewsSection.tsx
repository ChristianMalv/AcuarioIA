'use client'

import { useMemo, useState } from 'react'
import GoogleReviews from '@/components/GoogleReviews'

type StoreOption = {
  id: string
  label: string
  query: string
}

export default function GoogleReviewsSection({ minStars = 4 }: { minStars?: number }) {
  const stores = useMemo<StoreOption[]>(
    () => [
      {
        id: 'canek',
        label: 'Canek',
        query: 'Pinturas Acuario Canek Mérida Yucatán',
      },
      {
        id: 'caucel',
        label: 'Caucel',
        query: 'Pinturas Acuario Caucel Mérida Yucatán',
      },
      {
        id: 'circuito-sur',
        label: 'Circuito Sur',
        query: 'Pinturas Acuario Circuito Sur Mérida Yucatán',
      },
      {
        id: 'dorada',
        label: 'Dorada',
        query: 'Pinturas Acuario Dorada Mérida Yucatán',
      },
    ],
    []
  )

  const [selectedId, setSelectedId] = useState(stores[0]?.id ?? 'canek')
  const selected = stores.find((s) => s.id === selectedId) ?? stores[0]

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Reseñas en Google</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {stores.map((s) => {
              const active = s.id === selectedId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <GoogleReviews minStars={minStars} query={selected?.query} />
    </div>
  )
}
