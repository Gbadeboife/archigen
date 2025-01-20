import Image from "next/image"

export default function Features() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Exterior Rendering Feature */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Exterior Rendering Icon"
              width={64}
              height={64}
              className="mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Exterior Renders</h3>
            <p className="mb-6 text-muted-foreground">
              Transform your architectural designs into stunning exterior visualizations with our AI-powered rendering
              engine.
            </p>
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Exterior Rendering Example"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Interior Rendering Feature */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/placeholder.svg?height=64&width=64"
              alt="Interior Rendering Icon"
              width={64}
              height={64}
              className="mb-4"
            />
            <h3 className="text-2xl font-semibold mb-2">Interior Renders</h3>
            <p className="mb-6 text-muted-foreground">
              Bring your interior spaces to life with photorealistic AI renders that showcase every detail of your
              design.
            </p>
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt="Interior Rendering Example"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

