"use client";

import { motion } from "framer-motion";
import { Factory, ShieldCheck, Truck, Wrench, Cpu, Building2, HardHat } from "lucide-react";

const brands = [
  { name: "Apex Industrial", logo: "APEX", icon: Factory },
  { name: "Global Logistics", logo: "LOGIX", icon: Truck },
  { name: "BuildTech Corp", logo: "BUILDTECH", icon: Wrench },
  { name: "SteelCorp Intl", logo: "STEELCORP", icon: ShieldCheck },
  { name: "PowerGrid Solutions", logo: "POWERGRID", icon: Cpu },
  { name: "OmniSupply Platform", logo: "OMNISUPPLY", icon: Building2 },
  { name: "Metro Safety Gear", logo: "METROSAFE", icon: HardHat },
];

export default function LogoSlider() {
  // Triple array for continuous, uninterrupted seamless loop
  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <section 
      aria-label="Trusted Enterprise Partners" 
      className="w-full bg-transparent border-y border-border/40 py-8 overflow-hidden relative"
    >
      {/* Title / Heading */}
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground/80 uppercase">
          Trusted by 850+ Enterprise Procurement Leaders
        </p>
      </div>

      {/* Infinite Horizontal Marquee Track with Subtle Edge Fade */}
      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        
        <motion.div
          className="flex flex-nowrap items-center gap-10 md:gap-16 whitespace-nowrap py-1"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 35, // Elegant slow speed
          }}
        >
          {marqueeItems.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${index}`}
                className="flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer grayscale hover:grayscale-0 shrink-0"
              >
                <Icon className="size-5 text-foreground" />
                <span className="text-base md:text-lg font-black tracking-widest text-foreground font-mono uppercase">
                  {brand.logo}
                </span>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}