// src/pages/Home/Home.tsx
import { useGetAllCategoriesQuery } from "@/redux/features/category/category.api";
import { useGetAllProductsQuery } from "@/redux/features/product/product.api";
import SEO from "@/components/seo/SEO";

// Components
import HeroSection from "@/components/layout/HomeLayout/Hero/HeroSection";
import LogoSlider from "@/components/layout/HomeLayout/LogoSlider/LogoSlider";
import FeaturedCategories from "@/components/layout/HomeLayout/FeaturedCategories/FeaturedCategories";
import FeaturedProducts from "@/components/layout/HomeLayout/FeaturedProducts/FeaturedProducts";
import ProcurementProcessSection from "@/components/layout/HomeLayout/ProcurementProcessSection/ProcurementProcessSection";
import EnterpriseSourcingSection from "@/components/layout/HomeLayout/EnterpriseSourcingSection/EnterpriseSourcingSection";
import TestimonialsSection from "@/components/layout/HomeLayout/TestimonialsSection/TestimonialsSection";
import ProcurementFAQSection from "@/components/layout/HomeLayout/InteractiveRFQ/ProcurementFAQSection";
import WhyChooseUsSection from "@/components/layout/HomeLayout/WhyChooseUs/WhyChooseUs";
import { useEffect } from "react";

export default function Home() {
  // 🔥 Critical API calls (for splash)
  const { isLoading: categoriesLoading, error: catError } =
    useGetAllCategoriesQuery();

  const { isLoading: productsLoading, error: prodError } =
    useGetAllProductsQuery({ isFeatured: true, limit: 8, page: 1 });

  // 🔥 Track critical data — splash will hide when done
useEffect(() => {
  if (!categoriesLoading && !productsLoading) {
    // Give React a tick to render
    setTimeout(() => {
      document.dispatchEvent(new Event("render-event"));
    }, 500);
  }
}, [categoriesLoading, productsLoading]);

  return (
    <div>
      <SEO
        title="Enterprise B2B Industrial Supplies Bangladesh"
        description="SolveX Supply - Direct factory procurement with tiered wholesale pricing for B2B industrial supplies. Bulk order corporate gifts, promotional items, stationery, packaging & more in Bangladesh."
        keywords="B2B industrial supplies Bangladesh, corporate gifts Dhaka, bulk procurement, promotional items wholesale, RFQ platform"
        url="/"
      />

      <HeroSection />
      <LogoSlider />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUsSection />
      <ProcurementProcessSection />
      <EnterpriseSourcingSection />
      <TestimonialsSection />
      <ProcurementFAQSection />
    </div>
  );
}