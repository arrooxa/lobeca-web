import Benefits from "@/components/Benefits";
import UnderConstructionPage from "@/components/Constructing";
import CTA from "@/components/CTA";
import FeaturedServices from "@/components/FeaturedServices";
import Footer from "@/components/Footer";
import ForBarbers from "@/components/ForBarbers";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Testimonials from "@/components/Testimonials";

const Homepage = () => {
  const isConstructing = false;

  return isConstructing ? (
    <UnderConstructionPage />
  ) : (
    <>
      <Header />
      <HeroSection />
      <FeaturedServices />
      <Benefits />
      <Testimonials />
      <ForBarbers />
      <CTA />
      <Footer />
    </>
  );
};

export default Homepage;
