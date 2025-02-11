import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Upload } from 'lucide-react'

interface ImageDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void
  uploadedImage: string | null
}

export function ImageDropzone({ onDrop, uploadedImage }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
      }`}
    >
      <input {...getInputProps()} />
      {uploadedImage ? (
        <div className="relative aspect-square w-full">
          <Image
            src={uploadedImage}
            alt="Uploaded image"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
            
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Upload className="mb-4 size-12 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag and drop an image here, or click to select a file'}
          </p>
        </div>
      )}
    </div>
  )
}

