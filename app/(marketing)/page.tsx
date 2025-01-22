import BentoGrid from "@/components/sections/bentogrid";
import Tools from "@/components/sections/tools";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import Benefits from "@/components/sections/benefits";
// import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Features />
      {/*<Powered />*/}
      <BentoGrid />
      <Benefits />
      {/* <InfoLanding data={infos[1]} /> */}
      <Tools />
      <Testimonials />
    </>
  );
}
