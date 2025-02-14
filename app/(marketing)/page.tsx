//import Tools from "@/components/sections/tools";
import Styles from "@/components/sections/styles";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import Benefits from "@/components/sections/benefits";
// import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
//import Testimonials from "@/components/sections/testimonials";

import { constructMetadata } from "@/lib/utils";


export const metadata = constructMetadata({
  title: "Architecture AI Rendering tools – Generate Photorealistic Architecture Renders in Seconds Using AI | ArchiGen",
  description: "Explore our subscription plans.",
});

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Features />
      {/*<Powered />*/}
      {/*<Tools />*/}
      <Benefits />
      {/* <InfoLanding data={infos[1]} /> */}
      <Styles />
      {/*<Testimonials />*/}
    </>
  );
}
