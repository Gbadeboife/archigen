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
      description: "Generate stunning exterior visualizations of buildings from Sketchup, Blender, 3Ds Max and revit models.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/3d-modeling",
    },
    {
      name: "Interior AI",
      description: "Create beautiful and realistic interior designs from Sketchup, Blender, 3Ds Max and revit models with AI-powered rendering.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/texture-library",
    },
    {
      name: "Sketch AI",
      description: "Transform hand-drawn or digital sketches into stunning architectural renders. Go from quick sketch to photorealistic render in seconds.",
      image: "/placeholder.svg?height=250&width=250",
      link: "/tools/lighting-studio",
    },
    {
      name: "Text-2-Scene AI",
      description: "Turn text descriptions into detailed 3D scenes and visualizations. Bring your vision to life with AI-powered image generation.",
      image: "/placeholder.svg?height=250&width=250",
      link: "",
    },
    {
      name: "Upscale AI",
      description: "Enhance the resolution and quality of your Lumion, Enscape, vray, SketchUp or Revit renders up to 4k.",
      image: "/placeholder.svg?height=250&width=250",
      link: "",
    },
    {
      name: "Furnish AI",
      description: "Automatically furnish and style your interior spaces with AI-powered furniture placement. Choose from a wide range of designs.",
      image: "/placeholder.svg?height=250&width=250",
      link: "",
    },
    {
      name: "Masterplan AI",
      description: "Render site plans and urban layouts with intelligent AI assistance.",
      image: "/placeholder.svg?height=250&width=250",
      link: "",
    },
    {
      name: "Modify AI",
      description: "Easily edit and refine existing renders, making quick changes and adjustments with powerful AI tools.",
      image: "/placeholder.svg?height=250&width=250",
      link: "",
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
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-full aspect-square relative mb-6 border-2 rounded-md">
                  <Image
                    src={tool.image || "/placeholder.svg"}
                    alt={`${tool.name} icon`}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl mb-1 font-semibold md:mb-3">{tool.name}</h3>
                <p className="text-sm md:text-base font-sm mb-3 text-muted-foreground">{tool.description}</p>
                <Link
                  href={tool.link}
                  className="text-sm sm:text-base font-medium bg-blue-600 text-white py-2 px-6 rounded-full link-gradient_indigo-purple hover:bg-blue-700 transition-colors duration-300"
                >
                  {tool.link === "" ? "Coming Soon" : `Try ${tool.name}`}                  
                </Link>
              </div>
            ))}
          </div>
        </div>


      </MaxWidthWrapper>
    </section>
  );
}
