
'use client'

import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useToast } from '@/contexts/ToastContext'
import { ArrowDown, ArrowUp, Eye, EyeOff, Image as ImageIcon, Pencil, Trash2, Upload } from 'lucide-react'

interface CarouselSlide {
  id: string
  image: string
  alt: string
  title?: string | null
  description?: string | null
  layersJson?: string | null
  textJson?: string | null
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

type LayerDraft = {
  id: string
  file: File
  previewUrl: string
  z: number
  x: number
  y: number
  w: number
  mx: number
  my: number
  mw: number
}

export default function CarruselAdmin() {
  const { success, error } = useToast()

  const clampPct = (n: number): number => {
    if (!Number.isFinite(n)) return 0
    return Math.max(0, Math.min(100, n))
  }

  const draftLayerStyle = (x: number, y: number, w: number): React.CSSProperties => {
    return {
      left: `${clampPct(x)}%`,
      top: `${clampPct(y)}%`,
      width: `${clampPct(w)}%`,
    }
  }

  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string>('')

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [alt, setAlt] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [layersJson, setLayersJson] = useState('')
  const [textColor, setTextColor] = useState('#ffffff')
  const [textX, setTextX] = useState(4)
  const [textY, setTextY] = useState(70)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')
  const [titleSize, setTitleSize] = useState(16)
  const [descriptionSize, setDescriptionSize] = useState(72)
  const [layerDrafts, setLayerDrafts] = useState<LayerDraft[]>([])
  const [baseFit, setBaseFit] = useState<'cover' | 'contain'>('cover')
  const [active, setActive] = useState(true)

  const isEditing = Boolean(editingId)

  const extractBaseFit = (raw: string | null | undefined): 'cover' | 'contain' | null => {
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as any
      const fit = parsed?.base?.fit
      if (fit === 'cover' || fit === 'contain') return fit
      return null
    } catch {
      return null
    }
  }

  const startEdit = (slide: CarouselSlide) => {
    setEditingId(slide.id)
    setExistingImageUrl(slide.image)
    setFile(null)
    setPreviewUrl(slide.image)
    setAlt(slide.alt)
    setTitle(slide.title || '')
    setDescription(slide.description || '')
    setLayersJson(slide.layersJson || '')
    try {
      const t = slide.textJson ? (JSON.parse(slide.textJson) as any) : null
      const c = typeof t?.color === 'string' && t.color.trim() ? t.color.trim() : '#ffffff'
      setTextColor(c)
      setTextX(Number.isFinite(t?.x) ? Math.max(0, Math.min(100, Number(t.x))) : 4)
      setTextY(Number.isFinite(t?.y) ? Math.max(0, Math.min(100, Number(t.y))) : 70)
      setTextAlign(t?.align === 'center' || t?.align === 'right' ? t.align : 'left')
      setTitleSize(Number.isFinite(t?.titleSize) ? Math.max(10, Number(t.titleSize)) : 16)
      setDescriptionSize(Number.isFinite(t?.descriptionSize) ? Math.max(14, Number(t.descriptionSize)) : 72)
    } catch {
      setTextColor('#ffffff')
      setTextX(4)
      setTextY(70)
      setTextAlign('left')
      setTitleSize(16)
      setDescriptionSize(72)
    }
    setLayerDrafts([])
    setActive(slide.active)
    const fit = extractBaseFit(slide.layersJson)
    setBaseFit(fit || 'cover')
    globalThis.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buildTextJson = () => {
    const payload = {
      color: textColor,
      x: clampPct(textX),
      y: clampPct(textY),
      align: textAlign,
      titleSize,
      descriptionSize,
    }
    return JSON.stringify(payload)
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  useEffect(() => {
    if (!file) {
      setPreviewUrl(existingImageUrl || '')
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, existingImageUrl])

  const maxOrder = useMemo(() => {
    if (slides.length === 0) return 0
    return Math.max(...slides.map(s => s.order))
  }, [slides])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/carousel')
      if (!response.ok) {
        error('Error', 'No se pudieron cargar las imágenes del carrusel')
        return
      }
      const data = await response.json()
      setSlides(data)
    } catch (err) {
      error('Error', 'Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (uploadFile: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', uploadFile)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      throw new Error(body?.error || 'No se pudo subir la imagen')
    }

    const data = await response.json()
    return data.imageUrl as string
  }

  const resetForm = () => {
    setFile(null)
    setPreviewUrl('')
    setExistingImageUrl('')
    setEditingId(null)
    setAlt('')
    setTitle('')
    setDescription('')
    setLayersJson('')
    setTextColor('#ffffff')
    setTextX(4)
    setTextY(70)
    setTextAlign('left')
    setTitleSize(16)
    setDescriptionSize(72)
    setLayerDrafts([])
    setBaseFit('cover')
    setActive(true)
  }

  useEffect(() => {
    return () => {
      for (const l of layerDrafts) {
        URL.revokeObjectURL(l.previewUrl)
      }
    }
  }, [layerDrafts])

  const addLayerFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setLayerDrafts((prev) => {
      const next = prev.slice()
      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
        const url = URL.createObjectURL(f)
        const z = next.length + 10
        const y = 10 + next.length * 8
        next.push({
          id,
          file: f,
          previewUrl: url,
          z,
          x: 6,
          y,
          w: 30,
          mx: 6,
          my: Math.min(70, y + 10),
          mw: 60,
        })
      }
      return next
    })
  }

  const buildLayersJsonFromDrafts = (baseSrc: string) => {
    return JSON.stringify(
      {
        base: { src: baseSrc, fit: baseFit },
        layers: layerDrafts.map((l) => ({
          id: l.id,
          src: '',
          z: l.z,
          pos: { x: l.x, y: l.y, w: l.w },
          posMobile: { x: l.mx, y: l.my, w: l.mw },
        })),
      },
      null,
      2
    )
  }

  const handleSubmit = async () => {
    if (!file && !existingImageUrl) {
      error('Error', 'Selecciona una imagen')
      return
    }
    if (!alt.trim()) {
      error('Error', 'El texto alternativo (alt) es requerido')
      return
    }

    try {
      setSubmitting(true)
      const imageUrl = file ? await uploadImage(file) : existingImageUrl

      let finalLayersJson: string | null = layersJson.trim() ? layersJson.trim() : null

      const isDraftLikeLayersJson = (raw: string): boolean => {
        try {
          const parsed = JSON.parse(raw) as any
          const baseSrc = parsed?.base?.src
          if (typeof baseSrc === 'string' && baseSrc.startsWith('blob:')) return true
          const layers = parsed?.layers
          if (Array.isArray(layers)) {
            for (const l of layers) {
              const src = l?.src
              if (typeof src !== 'string' || src.trim() === '' || src.startsWith('blob:')) return true
            }
          }
          return false
        } catch {
          return false
        }
      }

      if (finalLayersJson) {
        try {
          const parsed = JSON.parse(finalLayersJson) as any
          if (parsed && typeof parsed === 'object') {
            if (parsed.base && typeof parsed.base === 'object') {
              const baseSrc = parsed.base.src
              if (typeof baseSrc !== 'string' || baseSrc.trim() === '' || baseSrc.startsWith('blob:')) {
                parsed.base.src = imageUrl
                finalLayersJson = JSON.stringify(parsed)
              }
            }
          }
        } catch {
          // keep user-provided string if it's not valid JSON
        }
      }

      if (finalLayersJson && layerDrafts.length > 0 && isDraftLikeLayersJson(finalLayersJson)) {
        finalLayersJson = null
      }

      if (!finalLayersJson && layerDrafts.length > 0) {
        const layerUploads = await Promise.all(
          layerDrafts.map(async (l) => {
            const url = await uploadImage(l.file)
            return { draftId: l.id, url }
          })
        )

        const urlById = new Map(layerUploads.map((u) => [u.draftId, u.url]))
        const payload = {
          base: { src: imageUrl, fit: baseFit },
          layers: layerDrafts.map((l) => ({
            id: l.id,
            src: urlById.get(l.id) || '',
            z: l.z,
            pos: { x: l.x, y: l.y, w: l.w },
            posMobile: { x: l.mx, y: l.my, w: l.mw },
          })),
        }

        finalLayersJson = JSON.stringify(payload)
      }

      const payload = {
        image: imageUrl,
        alt: alt.trim(),
        title: title.trim() ? title.trim() : null,
        description: description.trim() ? description.trim() : null,
        layersJson: finalLayersJson,
        textJson: buildTextJson(),
        active,
        order: maxOrder + 1,
      }

      const response = await fetch(isEditing ? `/api/carousel/${editingId}` : '/api/carousel', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...payload, order: undefined } : payload)
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'No se pudo crear la imagen del carrusel')
      }

      success('Éxito', isEditing ? 'Imagen actualizada' : 'Imagen agregada al carrusel')
      resetForm()
      await fetchSlides()
    } catch (err) {
      const msg = err instanceof Error ? err.message : isEditing ? 'Error al actualizar la imagen del carrusel' : 'Error al crear la imagen del carrusel'
      error('Error', msg)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActive = async (slide: CarouselSlide) => {
    try {
      const response = await fetch(`/api/carousel/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !slide.active })
      })

      if (!response.ok) {
        error('Error', 'No se pudo actualizar la imagen')
        return
      }

      success('Éxito', `Imagen ${!slide.active ? 'activada' : 'desactivada'}`)
      await fetchSlides()
    } catch (err) {
      error('Error', 'Error al actualizar la imagen')
    }
  }

  const updateOrder = async (slide: CarouselSlide, newOrder: number) => {
    try {
      const response = await fetch(`/api/carousel/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      })

      if (!response.ok) {
        error('Error', 'No se pudo actualizar el orden')
        return
      }

      success('Éxito', 'Orden actualizado')
      await fetchSlides()
    } catch (err) {
      error('Error', 'Error al actualizar el orden')
    }
  }

  const deleteSlide = async (slide: CarouselSlide) => {
    if (!globalThis.confirm(`¿Estás seguro de que quieres eliminar esta imagen del carrusel?`)) return

    try {
      const response = await fetch(`/api/carousel/${slide.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        error('Error', 'No se pudo eliminar la imagen')
        return
      }

      success('Éxito', 'Imagen eliminada')
      await fetchSlides()
    } catch (err) {
      error('Error', 'Error al eliminar la imagen')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión del Carrusel</h1>
              <p className="text-gray-600 mt-2">Administra las imágenes del carrusel principal</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Upload size={18} className="mr-2" />
            {isEditing ? 'Editar imagen' : 'Agregar nueva imagen'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="carousel-image">
                  Imagen
                </label>
                <input
                  id="carousel-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">Máx 5MB. Formatos de imagen.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="carousel-layers">
                  Capas PNG (múltiples)
                </label>
                <input
                  id="carousel-layers"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => addLayerFiles(e.target.files)}
                  className="block w-full text-sm text-gray-700"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">Sube 1 o más PNG para sobreponer.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="carousel-base-fit">
                  Ajuste de imagen base
                </label>
                <select
                  id="carousel-base-fit"
                  value={baseFit}
                  onChange={(e) => setBaseFit(e.target.value as 'cover' | 'contain')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={submitting}
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="carousel-alt">
                  Alt (requerido)
                </label>
                <input
                  id="carousel-alt"
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="carousel-title">
                  Título
                </label>
                <input
                  id="carousel-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la imagen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  disabled={submitting}
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-900 mb-3">Texto (estilo)</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="textColor">
                      Color
                    </label>
                    <input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10 w-20 p-1 border border-gray-300 rounded"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="textAlign">
                      Alineación
                    </label>
                    <select
                      id="textAlign"
                      value={textAlign}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setTextAlign(e.target.value as 'left' | 'center' | 'right')
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      disabled={submitting}
                    >
                      <option value="left">Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="right">Derecha</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="textX">
                      Posición X ({Math.round(textX)}%)
                    </label>
                    <input
                      id="textX"
                      type="range"
                      min={0}
                      max={100}
                      value={textX}
                      onChange={(e) => setTextX(Number(e.target.value))}
                      className="w-full"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="textY">
                      Posición Y ({Math.round(textY)}%)
                    </label>
                    <input
                      id="textY"
                      type="range"
                      min={0}
                      max={100}
                      value={textY}
                      onChange={(e) => setTextY(Number(e.target.value))}
                      className="w-full"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="titleSize">
                      Tamaño título (px)
                    </label>
                    <input
                      id="titleSize"
                      type="number"
                      min={10}
                      value={titleSize}
                      onChange={(e) => setTitleSize(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descriptionSize">
                      Tamaño descripción (px)
                    </label>
                    <input
                      id="descriptionSize"
                      type="number"
                      min={14}
                      value={descriptionSize}
                      onChange={(e) => setDescriptionSize(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="carousel-layers-json">
                  Capas (JSON)
                </label>
                <textarea
                  id="carousel-layers-json"
                  value={layersJson}
                  onChange={(e) => setLayersJson(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={8}
                  disabled={submitting}
                  placeholder='{"base": {"src": "...", "fit": "cover"}, "layers": [{"id":"logo","src":"...","z":20,"pos":{"x":6,"y":10,"w":22},"posMobile":{"x":6,"y":6,"w":38}}]}'
                />
                <p className="text-xs text-gray-500 mt-1">Opcional. Si lo llenas, el slide se renderiza por capas PNG.</p>
              </div>

              {layerDrafts.length > 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Capas cargadas ({layerDrafts.length})</div>
                  <div className="space-y-3">
                    {layerDrafts.map((l) => (
                      <div key={l.id} className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                            <img src={l.previewUrl} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-z-${l.id}`}>z</label>
                                <input
                                  id={`layer-z-${l.id}`}
                                  type="number"
                                  value={l.z}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, z: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-x-${l.id}`}>x%</label>
                                <input
                                  id={`layer-x-${l.id}`}
                                  type="number"
                                  value={l.x}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, x: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-y-${l.id}`}>y%</label>
                                <input
                                  id={`layer-y-${l.id}`}
                                  type="number"
                                  value={l.y}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, y: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-w-${l.id}`}>w%</label>
                                <input
                                  id={`layer-w-${l.id}`}
                                  type="number"
                                  value={l.w}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, w: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                            </div>

                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-mx-${l.id}`}>mobile x%</label>
                                <input
                                  id={`layer-mx-${l.id}`}
                                  type="number"
                                  value={l.mx}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, mx: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-my-${l.id}`}>mobile y%</label>
                                <input
                                  id={`layer-my-${l.id}`}
                                  type="number"
                                  value={l.my}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, my: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600" htmlFor={`layer-mw-${l.id}`}>mobile w%</label>
                                <input
                                  id={`layer-mw-${l.id}`}
                                  type="number"
                                  value={l.mw}
                                  onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setLayerDrafts((prev) => prev.map((p) => (p.id === l.id ? { ...p, mw: v } : p)))
                                  }}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  disabled={submitting}
                                />
                              </div>
                              <div className="flex items-end justify-end">
                                <button
                                  type="button"
                                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={() => {
                                    setLayerDrafts((prev) => {
                                      const removed = prev.find((p) => p.id === l.id)
                                      if (removed) URL.revokeObjectURL(removed.previewUrl)
                                      return prev.filter((p) => p.id !== l.id)
                                    })
                                  }}
                                  disabled={submitting}
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm hover:bg-gray-50"
                      onClick={() => {
                        const baseSrc = (existingImageUrl || previewUrl || '').trim()
                        if (!baseSrc) return
                        const draft = buildLayersJsonFromDrafts(baseSrc)
                        setLayersJson(draft)
                      }}
                      disabled={submitting}
                    >
                      Generar JSON (borrador)
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center space-x-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  disabled={submitting}
                />
                <label htmlFor="active" className="text-sm text-gray-700">Activa</label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2 disabled:opacity-60"
              >
                <Upload size={18} />
                <span>
                  {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar al carrusel'}
                </span>
              </button>

              {isEditing ? (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="ml-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  Cancelar
                </button>
              ) : null}
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Vista previa</div>
              <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className={`w-full h-full ${baseFit === 'contain' ? 'object-contain bg-black' : 'object-cover'}`}
                    />
                    {layerDrafts.length > 0 ? (
                      <div className="absolute inset-0 pointer-events-none">
                        {layerDrafts
                          .slice()
                          .sort((a, b) => a.z - b.z)
                          .map((l) => (
                            <div
                              key={l.id}
                              className="absolute"
                              style={{ ...draftLayerStyle(l.x, l.y, l.w), zIndex: l.z }}
                            >
                              <img src={l.previewUrl} alt="" className="w-full h-auto" />
                            </div>
                          ))}
                      </div>
                    ) : null}

                    {(title.trim() || description.trim()) ? (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end pointer-events-none">
                        <div
                          className={`absolute max-w-[90%] ${
                            textAlign === 'center'
                              ? '-translate-x-1/2'
                              : textAlign === 'right'
                                ? '-translate-x-full'
                                : ''
                          }`}
                          style={{
                            left: `${clampPct(textX)}%`,
                            top: `${clampPct(textY)}%`,
                            transform: `translateY(-100%) ${
                              textAlign === 'center'
                                ? 'translateX(-50%)'
                                : textAlign === 'right'
                                  ? 'translateX(-100%)'
                                  : ''
                            }`.trim(),
                            color: textColor,
                            textAlign: textAlign,
                          }}
                        >
                          <div className="p-6">
                            {title.trim() ? (
                              <div
                                className="font-carousel-headline tracking-[0.25em] uppercase opacity-95 drop-shadow"
                                style={{ fontSize: `${Math.max(10, titleSize)}px` }}
                              >
                                {title.trim()}
                              </div>
                            ) : null}
                            {description.trim() ? (
                              <div
                                className="font-carousel-display uppercase leading-[0.95] tracking-[0.02em] drop-shadow-sm mt-2"
                                style={{ fontSize: `${Math.max(14, descriptionSize)}px` }}
                              >
                                {description.trim()}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={32} />
                    <div className="mt-2 text-sm">Selecciona una imagen</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Imágenes del carrusel ({slides.length})</h2>
          </div>

          {slides.length === 0 ? (
            <div className="p-12 text-center text-gray-600">No hay imágenes en el carrusel.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {slides.map((slide) => (
                    <tr key={slide.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24 h-14 bg-gray-100 rounded overflow-hidden border border-gray-200">
                          <img src={slide.image} alt={slide.alt} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{slide.title || '(Sin título)'}</div>
                        <div className="text-xs text-gray-500 mt-1">alt: {slide.alt}</div>
                        {slide.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{slide.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(slide)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slide.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {slide.active ? (
                            <>
                              <Eye size={12} className="mr-1" />
                              Activa
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} className="mr-1" />
                              Inactiva
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateOrder(slide, slide.order - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            disabled={slide.order === 0}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <span className="w-8 text-center">{slide.order}</span>
                          <button
                            onClick={() => updateOrder(slide, slide.order + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => startEdit(slide)}
                            className="text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-100 rounded"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => deleteSlide(slide)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
