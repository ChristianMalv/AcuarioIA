'use client'

import { useMemo, useState } from 'react'
import GoogleReviews from '@/components/GoogleReviews'

type StoreOption = {
  id: string
  label: string
  placeId: string
}

export default function GoogleReviewsSection({ minStars = 4 }: { minStars?: number }) {
  const stores = useMemo<StoreOption[]>(
    () => [
      {
        id: 'canek',
        label: 'Canek',
        placeId: 'ChIJ14xHXUdzVo8R-U16yzY60jA',
      },
      {
        id: 'caucel',
        label: 'Caucel',
        placeId: 'ChIJqYQvVAALVo8Rg8SUvf1flKQ',
      },
      {
        id: 'circuito-sur',
        label: 'Circuito Sur',
        placeId: 'ChIJ9dXn-j1xVo8RbvQsvjd4qX4',
      },
      {
        id: 'dorada',
        label: 'Dorada',
        placeId: 'ChIJAQWmuLx1Vo8Rf3iy4NF3qRA',
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
          <div className="flex flex-wrap gap-2 md:ml-auto">
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

      <GoogleReviews minStars={minStars} placeId={selected?.placeId} />
    </div>
  )
}
