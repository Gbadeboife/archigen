import Link from "next/link";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
 
  return (
    <section className="py-12 space-y-6 sm:py-20 lg:py-20">
      <div className="container flex flex-col items-center max-w-5xl gap-5 text-center">
        <Link
          href=""
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-3 text-xs md:px-4 md:text-sm lg:text-sm",
          )}
          target="_blank"
        >
                   Join us on Discord for Latest Updates

        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          The{" "}
          <span className="font-extrabold text-gradient_indigo-purple">
            AI Assistant
          </span> {" "}
          for Architects{" "}
        </h1>

        <p
          className="max-w-2xl text-sm leading-normal text-balance text-muted-foreground sm:leading-8 sm:text-base md:text-base lg:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Achieve photorealistic renders in seconds.<br/>Transform ideas into reality with a click.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2 px-4 text-sm md:px-6 md:text-base lg:text-base",
            )}
          >
            <span>Get Started for Free</span>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
