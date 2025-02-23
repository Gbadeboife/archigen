import Image from "next/image";
import { InfoLdg } from "@/types";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Benefits() {

  interface dataType {
    title: string;
    description: string;
    image: string;
    list: {
      title: string;
      description: string;
      icon: string;
    }[];
  }

  const data: dataType ={
    title: "Accelerate Your Design Process with AI",
    description:
      "Generate stunning visualizations from Sketchup, Blender, 3Ds Max and Revit models. Transform your workflow with AI-powered rendering that delivers stunning visuals in a fraction of the time.",
    image: "/_static/images/benefits.png",
    list: [
      {
        title: "Speed",
        description: "Stop waiting for renderings. Experience lightning-fast results with our AI-powered platform.",
        icon: "rocket",
      },
      {
        title: "Easy to Use",
        description: "ArchiGen is designed to be intuitive and user-friendly, so you can get started right away.",
        icon: "check",
      },
      {
        title: "Quality",
        description:
          "Create stunning, photorealistic renderings that bring your vision to life and wow clients.",
        icon: "stars",
      },
    ],
  }

  return (
    <div className="py-10 sm:py-20">
      <MaxWidthWrapper className="grid gap-10 px-2.5 lg:grid-cols-2 lg:items-center lg:px-7">
        <div className= "lg:order-1">
          <h2 className="text-center font-heading text-3xl text-foreground md:text-4xl lg:text-left lg:text-[40px]">
            {data.title}
          </h2>
          <p className="mt-4 text-center text-base text-muted-foreground lg:text-left">
            {data.description}
          </p>
          <dl className="mt-6 space-y-4 leading-7">
            {data.list.map((item, index) => {
              const Icon = Icons[item.icon || "arrowRight"];
              return (
                <div className="relative pl-8" key={index}>
                  <dt className="font-semibold">
                    <Icon className="absolute left-0 top-1 size-5 stroke-purple-700" />
                    <span>{item.title}</span>
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {item.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        <div
          className= "overflow-hidden rounded-xl border lg:-m-4">
          <div className="aspect-video">
            <Image
              src={data.image}
              alt="Render sample"
              width={400}
              height={300}
              className="size-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
