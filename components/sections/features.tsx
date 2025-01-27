import Image from "next/image"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";



export default function Features() {
  return (
    <section className="py-16">
      <MaxWidthWrapper>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Exterior Rendering Feature */}
          <div className="flex flex-col items-center text-center mb-4">
            {/*<Image
              src="/../../public/_static/images/benefits.png"
              alt="Exterior Rendering Icon"
              width={64}
              height={64}
              className="mb-4"
            />
            */}

            <h3 className="text-xl md:text-2xl font-semibold mb-2">Exterior Renders</h3>
            <p className="mb-6 text-sm md:text-base text-muted-foreground">
              Transform your architectural designs into stunning exterior visualizations with our AI-powered rendering
              engine.
            </p>
            <Image
              src="/_static/images/exterior.png"
              alt="Exterior Rendering Example"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-full"
            />
          </div>

          {/* Interior Rendering Feature */}
          <div className="flex flex-col items-center text-center">
            {/*<Image
              src=""
              alt="Interior Rendering Icon"
              width={64}
              height={64}
              className="mb-4"
            />*/}

            <h3 className="text-xl md:text-2xl font-semibold mb-2">Interior Renders</h3>
            <p className="mb-6 text-sm md:text-base text-muted-foreground">
              Bring your interior spaces to life with photorealistic AI renders that showcase every detail of your
              design.
            </p>
            <Image
              src="/_static/images/interior.png"
              alt="Interior Rendering Example"
              width={400}
              height={300}
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
      </MaxWidthWrapper>
      
    </section>
  )
}

