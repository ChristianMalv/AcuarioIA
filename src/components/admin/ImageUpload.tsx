'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  className?: string
}

export default function ImageUpload({ currentImage, onImageChange, className = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || '')
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('La imagen debe ser menor a 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Create FormData to send the file
      const formData = new FormData()
      formData.append('file', file)

      // Upload the file to our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al subir la imagen')
      }

      const result = await response.json()
      
      // Update preview with the actual uploaded image URL
      setPreview(result.imageUrl)
      onImageChange(result.imageUrl)
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`Error al subir la imagen: ${error instanceof Error ? error.message : 'Por favor intenta de nuevo.'}`)
      // Reset preview on error
      setPreview(currentImage || '')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreview('')
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen del Producto
      </label>
      
      {preview ? (
        <div className="relative">
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Haz clic para subir una imagen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  o arrastra y suelta aquí
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Upload size={14} />
                <span>PNG, JPG, GIF hasta 5MB</span>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500">
        Recomendado: Imágenes cuadradas de al menos 400x400px para mejor calidad
      </p>
    </div>
  )
}
