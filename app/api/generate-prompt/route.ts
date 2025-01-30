import { NextResponse } from "next/server"
import OpenAI from "openai"

const aiPromptTemplate = `Act as an expert prompt engineer skilled in generating ControlNet prompts for Stable Diffusion to achieve the highest-quality results. I need a highly detailed, structured prompt based on the image I provide. The prompt should be around 150 words long. The prompt should include:

1. Clear descriptions of the scene's elements, objects, and their arrangement.
2. Visual style (e.g., Scandinavian, cyberpunk, hyper-realistic, anime, cinematic).
3. Specific materials, colors, and textures (e.g., wood, marble, matte surfaces, glass).
4. Lighting setup (e.g., cinematic, natural light, dramatic shadows, high contrast).
5. Key details like camera angles, depth of field (DOF), focal points, and symmetry.
6. Technical enhancements like ultra-detailed, 8K resolution, sharp focus, and photorealistic rendering.

Output the result in a clean, structured format, optimized for ControlNet depth maps ensuring it aligns with achieving a photorealistic, professional, and award-winning image.

Based on the provided image, generate a prompt following the above guidelines:`


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { image } = body

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: aiPromptTemplate },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    })

    const generatedPrompt = response.choices[0].message.content

    return NextResponse.json({ generatedPrompt })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while generating the prompt" }, { status: 500 })
  }
}

