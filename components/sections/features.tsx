import Image from "next/image"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";



export default function Features() {
  return (
    <section className="py-16">
      <MaxWidthWrapper>
      
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Exterior Rendering Feature */}
          <div className="mb-4 flex flex-col items-center text-center">
            {/*<Image
              src="/../../public/_static/images/benefits.png"
              alt="Exterior Rendering Icon"
              width={64}
              height={64}
              className="mb-4"
            />
            */}

            <h3 className="mb-2 text-xl font-semibold md:text-2xl">Exterior Renderings</h3>
            <p className="mb-6 text-sm text-muted-foreground md:text-base">
              Transform your architectural designs into stunning exterior visualizations with our AI-powered rendering
              engine.
            </p>
            <Image
              src="/_static/images/exterior.png"
              alt="Exterior Rendering Example"
              width={400}
              height={300}
              className="w-full rounded-lg shadow-lg"
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

            <h3 className="mb-2 text-xl font-semibold md:text-2xl">Interior Renderings</h3>
            <p className="mb-6 text-sm text-muted-foreground md:text-base">
              Bring your interior spaces to life with photorealistic AI renderings that showcase every detail of your
              design.
            </p>
            <Image
              src="/_static/images/interior.png"
              alt="Interior Rendering Example"
              width={400}
              height={300}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
      </MaxWidthWrapper>
      
    </section>
  )
}

