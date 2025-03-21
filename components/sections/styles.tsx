import Link from "next/link";

import Image from "next/image"

import { styles } from "@/config/landing";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Styles() {
  return (
    <section id="styles">
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>

          <HeaderSection
          label="Styles"
          title="Choose from 8+ design styles."
          subtitle="Explore our curated collection of preset architectural styles for instant design transformations."
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {styles.map((style) => {
              return (
                <div
                  className="group relative overflow-hidden rounded-2xl border bg-background p-5 md:p-8"
                  key={style.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 aspect-video -translate-y-1/2 rounded-full border bg-gradient-to-b from-purple-500/80 to-white opacity-25 blur-2xl duration-300 group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
                  />
                  <div className="relative">
                    <div className="relative flex rounded-2xl border border-border shadow-sm *:relative *:m-auto ">
                      <Image
                        src={`/_static/images/${style.image}`}
                        alt={style.title}
                        width={400}
                        height={300}
                        className="w-full rounded-sm"
                      />
                    </div>

                    <h4 className="mt-6 text-lg font-semibold">
                      {style.title}
                    </h4>

                    <p className="mt-3 text-sm text-muted-foreground md:text-base">
                      {style.description}
                    </p>

                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
