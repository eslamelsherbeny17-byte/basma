'use client'

import { useState, useCallback } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import { compressImage, validateImageFile } from '@/lib/image-utils'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  multiple?: boolean
  maxFiles?: number
  onImagesSelected: (files: File[]) => void
  existingImages?: string[]
  onRemoveExisting?: (index: number) => void
}

export function ImageUploader({
  multiple = false,
  maxFiles = 5,
  onImagesSelected,
  existingImages = [],
  onRemoveExisting,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      if (selectedFiles.length === 0) return

      setError('')
      setUploading(true)
      setProgress(0)

      try {
        const processedFiles: File[] = []
        const newPreviews: string[] = []

        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i]

          // Validate
          const validation = validateImageFile(file)
          if (!validation.valid) {
            setError(validation.error || 'خطأ في الصورة')
            continue
          }

          // Compress
          const compressed = await compressImage(file)
          processedFiles.push(compressed)
          newPreviews.push(URL.createObjectURL(compressed))

          setProgress(((i + 1) / selectedFiles.length) * 100)
        }

        if (multiple) {
          const totalFiles = [...files, ...processedFiles]
          if (totalFiles.length > maxFiles) {
            setError(`الحد الأقصى ${maxFiles} صور`)
            return
          }
          setFiles(totalFiles)
          setPreviews([...previews, ...newPreviews])
          onImagesSelected(totalFiles)
        } else {
          setFiles(processedFiles)
          setPreviews(newPreviews)
          onImagesSelected(processedFiles)
        }
      } catch (err) {
        setError('فشل معالجة الصور')
        console.error(err)
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [files, previews, multiple, maxFiles, onImagesSelected]
  )

  const removePreview = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setFiles(newFiles)
    setPreviews(newPreviews)
    onImagesSelected(newFiles)
  }

  return (
    <div className='space-y-4'>
      {/* Upload Area */}
      <div className='border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors'>
        <input
          type='file'
          accept='image/*'
          multiple={multiple}
          onChange={handleFileChange}
          className='hidden'
          id='image-upload'
        />
        <label htmlFor='image-upload' className='cursor-pointer'>
          <Upload className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
          <p className='text-sm font-medium mb-1'>
            اضغط لرفع {multiple ? 'الصور' : 'صورة'}
          </p>
          <p className='text-xs text-muted-foreground'>
            PNG, JPG, WebP (الحد الأقصى 5MB)
          </p>
          {multiple && (
            <p className='text-xs text-muted-foreground mt-1'>
              يمكنك رفع حتى {maxFiles} صور
            </p>
          )}
        </label>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>جاري المعالجة...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm'>
          {error}
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <p className='text-sm font-medium mb-2'>الصور الحالية:</p>
          <div className='grid grid-cols-3 gap-4'>
            {existingImages.map((image, index) => (
              <div key={index} className='relative aspect-square group'>
                <Image
                  src={image}
                  alt={`Existing ${index + 1}`}
                  fill
                  className='object-cover rounded-lg'
                />
                {onRemoveExisting && (
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-2 left-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => onRemoveExisting(index)}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Previews */}
      {previews.length > 0 && (
        <div>
          <p className='text-sm font-medium mb-2'>صور جديدة:</p>
          <div className='grid grid-cols-3 gap-4'>
            {previews.map((preview, index) => (
              <div key={index} className='relative aspect-square group'>
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className='object-cover rounded-lg'
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='absolute top-2 left-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
                  onClick={() => removePreview(index)}
                >
                  <X className='h-3 w-3' />
                </Button>
                <div className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded'>
                  {(files[index].size / 1024).toFixed(0)} KB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
