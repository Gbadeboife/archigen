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
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
      }`}
    >
      <input {...getInputProps()} />
      {uploadedImage ? (
        <div className="relative w-full aspect-square">
          <Image
            src={uploadedImage || "/placeholder.svg"}
            alt="Uploaded image"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
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

