import { NextResponse } from "next/server"
import { auth } from "@/auth";
import { prisma } from '@/lib/db'

async function getLatestModelVersion(modelOwner: string, modelName: string) {
  const response = await fetch(`https://api.replicate.com/v1/models/${modelOwner}/${modelName}`, {
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`Failed to fetch latest model version: ${data.detail || "Unknown error"}`)
  }
  return data.latest_version.id
}

async function upscaleImage(image: string, prompt: string) {
  const latestVersion = await getLatestModelVersion("philz1337x", "clarity-upscaler")

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: latestVersion,
      input: {
        image: image,
        prompt: prompt,
        resemblance: 1,
      },
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to upscale image: ${errorData.detail || "Unknown error"}`)
  }

  const prediction = await response.json()

  let attempts = 0;
  const maxAttempts = 60; // 1 minute maximum waiting time

  // Poll for result
  while (attempts < maxAttempts) {
    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
    })

    if (!statusResponse.ok) {
      throw new Error(`Failed to check prediction status: ${statusResponse.statusText}`)
    }

    const status = await statusResponse.json()

    if (status.status === "succeeded") {
      if (!status.output) {
        throw new Error("Prediction succeeded but no output was returned")
      }
      return status.output
    } else if (status.status === "failed") {
      throw new Error(`Upscaling failed: ${status.error || "Unknown error"}`)
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  
  throw new Error("Operation timed out after 60 seconds")
}

export const runtime = 'nodejs' // Add edge runtime
export const maxDuration = 60 // 1 minutes timeout

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check render limits for free users
    if (!user.flwSubscriptionId && (user.renderCount || 0) >= 10) {
      return NextResponse.json(
        { error: 'Render limit reached, upgrade to pro' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { image, isUrl, prompt, style, category, numberOfOutputs, renderQuality } = body

    // Fetch the latest version for the rendering model
    const latestRenderVersion = await getLatestModelVersion("lucataco", "sdxl-controlnet")

    
    // Use image directly if it's a URL, otherwise use the base64 image
    const imageInput = isUrl ? image : image

    

    // Create multiple predictions based on numberOfOutputs
    const predictions = await Promise.all(
      Array(numberOfOutputs).fill(null).map(async () => {
        const renderResponse = await fetch("https://api.replicate.com/v1/predictions", {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            version: latestRenderVersion,
            input: {
              image: imageInput,
              prompt: `${!!style && style}${prompt}, `,
              negative_prompt: 'low quality, bad quality, changed colors, hallucinations, distortions, layout changes, extra elements, unrealistic reflections, warping, floating objects, surreal details',
              condition_scale: 1,
            },
          }),
        })

        if (!renderResponse.ok) {
          const errorData = await renderResponse.json()
          throw new Error(`Failed to render image: ${errorData.detail || "Unknown error"}`)
        }

        return renderResponse.json()
      })
    )

    let renderedImages: any[] = []
    let attempts = 0
    const maxAttempts = 180 // 3 minutes maximum waiting time

    // Poll for all render results
    while (attempts < maxAttempts) {
      const statusResponses = await Promise.all(
        predictions.map(prediction =>
          fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
            },
          })
        )
      )

      const statuses = await Promise.all(
        statusResponses.map(response => {
          if (!response.ok) {
            throw new Error(`Failed to check prediction status: ${response.statusText}`)
          }
          return response.json()
        })
      )

      // Check if all predictions are complete
      const allComplete = statuses.every(status => 
        status.status === "succeeded" || status.status === "failed"
      )
      
      if (allComplete) {
        // Collect successful outputs
        renderedImages = statuses
          .filter(status => status.status === "succeeded")
          .map(status => status.output)
          .filter(Boolean)

        if (renderedImages.length > 0) {
          if (renderQuality === "best") {
            try {
              // Upscale all images
              const upscaledImages = await Promise.all(
                renderedImages.map(img => upscaleImage(img, prompt))
              )
              // Update render count for free users
              if (!user.flwSubscriptionId) {
                await prisma.user.update({
                  where: { email: session.user.email },
                  data: {
                    renderCount: (user.renderCount || 0) + 1
                  }
                })
              }
              return NextResponse.json({ images: upscaledImages.flat() })
            } catch (upscaleError) {
              console.error("Upscaling failed, returning original images:", upscaleError)
              return NextResponse.json({ images: renderedImages })
            }
          } else {
            // Update render count for free users
            if (!user.flwSubscriptionId) {
              await prisma.user.update({
                where: { email: session.user.email },
                data: {
                  renderCount: (user.renderCount || 0) + 1
                }
              })
            }
            return NextResponse.json({ images: renderedImages })
          }
        } else {
          throw new Error("No images were generated")
        }
      }

      attempts++
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    throw new Error("Operation timed out after 3 minutes")
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unexpected error occurred while rendering and upscaling"
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
