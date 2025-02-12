import Link from "next/link";


import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
 
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
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
          <span className="text-gradient_indigo-purple font-extrabold">
            AI Assistant
          </span> {" "}
          for Architects{" "}
        </h1>

        <p
          className="max-w-2xl text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-8 md:text-base lg:text-lg"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Generate photorealistic renders in seconds.<br/>Transform ideas into reality with a click.
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
