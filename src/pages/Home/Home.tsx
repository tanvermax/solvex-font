import EnterpriseSourcingSection from "@/components/layout/HomeLayout/EnterpriseSourcingSection/EnterpriseSourcingSection";
import FeaturedCategories from "@/components/layout/HomeLayout/FeaturedCategories/FeaturedCategories";
import FeaturedProducts from "@/components/layout/HomeLayout/FeaturedProducts/FeaturedProducts";
import HeroSection from "@/components/layout/HomeLayout/Hero/HeroSection";
import ProcurementFAQSection from "@/components/layout/HomeLayout/InteractiveRFQ/ProcurementFAQSection";
import LogoSlider from "@/components/layout/HomeLayout/LogoSlider/LogoSlider";
import ProcurementProcessSection from "@/components/layout/HomeLayout/ProcurementProcessSection/ProcurementProcessSection";
import TestimonialsSection from "@/components/layout/HomeLayout/TestimonialsSection/TestimonialsSection";
import WhyChooseUs from "@/components/layout/HomeLayout/WhyChooseUs/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <LogoSlider />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <ProcurementProcessSection />
      <EnterpriseSourcingSection />
      <TestimonialsSection />
      <ProcurementFAQSection/>
    </div>
  );
}
