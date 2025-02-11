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

    // Render the images
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
          prompt: style !== null ? `${style} style, ${prompt}`: prompt,
        },
      }),
    })

    if (!renderResponse.ok) {
      const errorData = await renderResponse.json()
      throw new Error(`Failed to render image: ${errorData.detail || "Unknown error"}`)
    }

    const renderPrediction = await renderResponse.json()

    let renderedImage

    let attempts = 0;
    const maxAttempts = 180; // 3 minutes maximum waiting time

    // Poll for render results
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${renderPrediction.id}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
      })

      if (!statusResponse.ok) {
        throw new Error(`Failed to check prediction status: ${statusResponse.statusText}`)
      }

      const status = await statusResponse.json()

      if (status.status === "succeeded") {
        renderedImage = status.output

        if (renderedImage /*&& renderedImages.length > 0*/) {
          if (renderQuality === "best") {
            try {
              const upscaledImages = await upscaleImage(renderedImage, prompt)
              // Update render count for free users
              if (!user.flwSubscriptionId) {
                await prisma.user.update({
                  where: { email: session.user.email },
                  data: {
                    renderCount: (user.renderCount || 0) + 1
                  }
                })
              }
              return NextResponse.json({ images: upscaledImages })
            } catch (upscaleError) {
              console.error("Upscaling failed, returning original image:", upscaleError)
              return NextResponse.json({ images: [renderedImage] })
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
            return NextResponse.json({ images: [renderedImage] })
          }
        } else {
          throw new Error("No images were generated")
        }
      } else if (status.status === "failed") {
        throw new Error(`Rendering failed: ${status.error || "Unknown error"}`)
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

