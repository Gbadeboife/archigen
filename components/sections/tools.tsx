import Image from "next/image"
import Link from "next/link"

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { HeaderSection } from "@/components/shared/header-section";


export default function Tools() {

  type toolsLdg = {
    name: string;
    description: string;
    image: string;
    link: string;
  }[]

  const tools: toolsLdg = [
    {
      name: "Exterior AI",
      description: "Create detailed 3D models of your architectural designs with ease.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/3d-modeling",
    },
    {
      name: "Interior AI",
      description: "Access a vast library of high-quality textures for realistic renderings.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/texture-library",
    },
    {
      name: "Sketch AI",
      description: "Perfect your scene's ambiance with advanced lighting controls.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/lighting-studio",
    },
    {
      name: "Upscale AI",
      description: "Generate stunning environments to showcase your designs.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/environment-creator",
    },
    {
      name: "Text-2-Scene AI",
      description: "Craft and customize materials for photorealistic results.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/material-editor",
    },
    {
      name: "Furnish AI",
      description: "Choose the perfect angles to highlight your architectural vision.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/camera-setup",
    },
    {
      name: "Render Farm",
      description: "Harness the power of cloud computing for lightning-fast renders.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/render-farm",
    },
    {
      name: "Post-Processing Suite",
      description: "Fine-tune your renders with professional-grade editing tools.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/post-processing",
    },
  ]


  return (
    <section className="py-32">
      <MaxWidthWrapper>

        <HeaderSection
            label="Tools"
            title="Streamline Your Architecture Workflow with our AI Rendering Tools"
            subtitle="Explore our powerful tools, with more on the way."
        />
        <div className="container mx-auto px-4 mt-6">
          <div className="grid md:grid-cols-2 gap-12">
            {tools.map((tool, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-white p-8 rounded-lg shadow-lg">
                <div className="w-full aspect-square relative mb-6">
                  <Image
                    src={tool.image || "/placeholder.svg"}
                    alt={`${tool.name} icon`}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{tool.name}</h3>
                <p className="text-lg text-gray-600 mb-6">{tool.description}</p>
                <Link
                  href={tool.link}
                  className="text-lg font-medium bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors duration-300"
                >
                  Learn more
                </Link>
              </div>
            ))}
          </div>
        </div>


      </MaxWidthWrapper>
    </section>
  );
}
