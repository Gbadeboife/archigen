import Link from "next/link";

import Image from "next/image"

import { styles } from "@/config/landing";
import { HeaderSection } from "@/components/shared/header-section";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Styles() {
  return (
    <section>
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>

          <HeaderSection
          label="Styles"
          title="Choose from 10+ design styles."
          subtitle="Explore our curated collection of preset architectural styles for instant design transformations."
          />

          <div className="grid gap-3 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {styles.map((style) => {
              return (
                <div
                  className="relative p-5 overflow-hidden border group rounded-2xl bg-background md:p-8"
                  key={style.title}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 duration-300 -translate-y-1/2 border rounded-full opacity-25 aspect-video bg-gradient-to-b from-purple-500/80 to-white blur-2xl group-hover:-translate-y-1/4 dark:from-white dark:to-white dark:opacity-5 dark:group-hover:opacity-10"
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

                    <p className="mt-3 text-sm md:text-base text-muted-foreground">
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
