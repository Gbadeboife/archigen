"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RenderStyleCard } from "./mvp-comps/RenderStyleCard"
import { ImageDropzone } from "./mvp-comps/ImageDropzone"
import { LoadingSpinner } from "./mvp-comps/LoadingSpinner"

import { styles } from "@/config/landing";


export default function Renderer() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedRepImage, setUploadedRepImage] = useState<string | null>(null)
  const [renderedImages, setRenderedImages] = useState<string[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [prompt, setPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("interior")
  const [settings, setSettings] = useState({
    numberOfOutputs: 1,
    renderQuality: "fast",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false)
  const [error, setError] = useState<string | null>(null)

  {/*const renderStyles = [
    {
      name: "Photorealistic",
      image: "/placeholder.svg?height=100&width=100",
      description: "Highly detailed and lifelike",
    },
    {
      name: "Sketch",
      image: "/placeholder.svg?height=100&width=100",
      description: "Hand-drawn architectural sketch style",
    },
    {
      name: "Watercolor",
      image: "/placeholder.svg?height=100&width=100",
      description: "Soft, artistic watercolor rendering",
    },
    { name: "Blueprint", image: "/placeholder.svg?height=100&width=100", description: "Technical blueprint style" },
  ]*/}


  const categories = ["interior", "exterior", "sketch"]
  const outputOptions = [1]

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const base64Image = dataUrl.split(",")[1]
      const repImageUrl = `data:application/octet-stream;base64,${base64Image}`

      setUploadedImage(dataUrl)
      setUploadedRepImage(repImageUrl)
    }

    reader.readAsDataURL(file)
  }, [])

  const handleGenerateWithAI = async () => {
    if (!uploadedImage) {
      setError("Please upload an image first.")
      return
    }

    setIsGeneratingPrompt(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate prompt")
      }

      const data = await response.json()
      setPrompt(data.generatedPrompt)
    } catch (err) {
      setError("An error occurred while generating the prompt. Please try again.")
      console.error(err)
    } finally {
      setIsGeneratingPrompt(false)
    }
  }

  const handleRender = async () => {
    if (!uploadedRepImage) {
      setError("Please upload an image first.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedRepImage,
          prompt: prompt,
          style: selectedStyle,
          category: selectedCategory,
          numberOfOutputs: settings.numberOfOutputs,
          renderQuality: settings.renderQuality,
        }),
      })
      const data = await response.json()
      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || "Failed to render image")
      }

      if (Array.isArray(data.images) && data.images.length > 0) {
        setRenderedImages(data.images)
        setSelectedImageIndex(0)
      } else {
        throw new Error("No images were generated")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while rendering. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rendered-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed", error)
      setError("Failed to download the image. Please try again.")
    }
  }

  return (
    <div className="m-auto w-full p-4">
      <div className="flex min-h-screen flex-col gap-6 lg:flex-row">
        <div className="relative w-full lg:flex-[1]">
          <div className="max-h-[calc(100vh-2rem)] space-y-6 overflow-y-auto pb-20">
            {/*<Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["interior", "exterior", "sketch"].map((category) => (
                    <RenderStyleCard
                      key={category}
                      name={category.charAt(0).toUpperCase() + category.slice(1)}
                      image={`/placeholder.svg?height=100&width=100&text=${category}`}
                      description={`${category.charAt(0).toUpperCase() + category.slice(1)} architectural design`}
                      isSelected={selectedCategory === category}
                      onSelect={() => setSelectedCategory(category)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>*/}
            

            <Card>
              <CardContent className="p-3 md:p-6">
                <h2 className="mb-4 text-sm font-semibold md:text-xl">Upload Image</h2>
                <ImageDropzone onDrop={onDrop} uploadedImage={uploadedImage} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6">
                <h2 className="mb-4 text-sm font-semibold md:text-xl">Prompt</h2>
                <Input
                  placeholder="Detailed description of your scene"
                  value={prompt}
                  className="text-sm"
                  onChange={(e) => setPrompt(e.target.value)}
                />
                {/*<Button
                  className="mt-4 w-full"
                  onClick={handleGenerateWithAI}
                  disabled={isGeneratingPrompt || !uploadedImage}
                >
                  {isGeneratingPrompt ? <LoadingSpinner /> : "Generate with AI"}
                </Button>*/}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6">
                <h2 className="mb-4 text-sm font-semibold md:text-xl">Render Style</h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4 lg:gap-2 md:grid-cols-6 lg:grid-cols-4">
                  {styles.map((style) => (
                    <RenderStyleCard
                      key={style.title}
                      name={style.title}
                      image={style.image}
                      isSelected={selectedStyle === style.title}
                      onSelect={() => setSelectedStyle(style.title)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 md:p-6">
                <h2 className="mb-4 text-sm font-semibold md:text-xl">Advanced Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="numberOfOutputs">Number of Outputs</Label>
                    <div className="mt-2 flex justify-between">
                      {outputOptions.map((num) => (
                        <Button
                          key={num}
                          onClick={() => setSettings({ ...settings, numberOfOutputs: num })}
                          variant={settings.numberOfOutputs === num ? "default" : "outline"}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="renderQuality">Render Quality</Label>
                    <div className="mt-2 flex justify-between">
                      <Button
                        onClick={() => setSettings({ ...settings, renderQuality: "fast" })}
                        variant={settings.renderQuality === "fast" ? "default" : "outline"}
                      >
                        Fast Render
                      </Button>
                      <Button
                        onClick={() => setSettings({ ...settings, renderQuality: "best" })}
                        variant={settings.renderQuality === "best" ? "default" : "outline"}
                      >
                        Best Quality
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="w-full fixed bottom-4 lg:left-auto lg:right-[calc(66.666667%+1rem)] lg:w-[calc(33.333333%-2rem)] rounded-lg bg-background border">
              <Button className="w-full" size="lg" onClick={handleRender} disabled={isLoading || !uploadedImage}>
                {isLoading ? <LoadingSpinner /> : "Render"}
              </Button>
            </div>
          </div>

        </div>

        <div className="w-full lg:w-auto lg:flex-[2]">
          <Card className="h-[calc(100%-60px)]">
            <CardContent className="mb-12 flex h-full flex-col p-3 md:p-6 lg:mb-0">
              {error && <div className="mb-4 text-red-500">{error}</div>}
              {Array.isArray(renderedImages) && renderedImages.length > 0 ? (
                <>
                  <div className="mb-4 grid grid-cols-4 gap-2">
                    {renderedImages.map((image, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                          index === selectedImageIndex ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Rendered thumbnail ${index + 1}`}
                          className="h-auto w-full"
                        />
                      </div>
                    ))}
                  </div>
                  {selectedImageIndex !== null && renderedImages[selectedImageIndex] && (
                    <div className="flex flex-col items-center">
                      <img
                        src={renderedImages[selectedImageIndex] || "/placeholder.svg"}
                        alt={`Selected rendered image`}
                        className="h-auto w-full rounded-lg shadow-md"
                      />
                      <Button className="mt-4" onClick={() => handleDownload(renderedImages[selectedImageIndex])}>
                        Download
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex grow flex-col items-center justify-center space-y-6 p-1 text-center text-gray-500 md:p-8">
                  <h3 className="text-base font-semibold md:text-xl">How to Use ArchiGen AI</h3>
                  <ol className="max-w-lg space-y-4 text-left text-sm md:text-base">
                    {/*<li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Select a category: Interior, Exterior, or Sketch</span>
                    </li>*/}
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Upload a picture or screenshot of your model using the drag & drop area or file selector</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>
                        Enter a prompt describing your desired render{/*, or click "Generate with AI" for suggestions*/}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Select a render style that matches your vision</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>Choose the number of outputs and render quality in Advanced Settings</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">6.</span>
                      <span>Click &quot;Render&quot; to generate your realistic rendered images</span>
                    </li>
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

