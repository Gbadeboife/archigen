import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "ArchiGen",
  logo: "/_static/logo.jpg",
  description:
    "Generate photorealistic architecture renders in seconds using AI. No design skills required.",
  url: site_url,
  ogImage: `${site_url}/_static/og.png`,
  links: {
    twitter: "https://twitter.com/miickasmt",
    github: "https://github.com/mickasmt/next-saas-stripe-starter",
  },
  mailSupport: "support@saas-starter.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Contact", href: "#" },
      /*{ title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },*/
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Pricing", href: "/pricing" },
      { title: "Blog", href: "#" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Privacy policy", href: "#" },
      { title: "Terms of service", href: "#" },
    ],
  },
];
