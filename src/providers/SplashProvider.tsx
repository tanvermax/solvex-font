// src/providers/SplashProvider.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SplashContextType {
  isVisible: boolean;
  hideSplash: () => void;
  criticalDataLoaded: boolean;
  markDataLoaded: () => void;
}

const SplashContext = createContext<SplashContextType | null>(null);

export const useSplash = () => {
  const ctx = useContext(SplashContext);
  if (!ctx) throw new Error("useSplash must be used within SplashProvider");
  return ctx;
};

export function SplashProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [criticalDataLoaded, setCriticalDataLoaded] = useState(false);

  // 🔥 Safety: Max 3 seconds wait
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      console.log("⚠️ Splash timeout — forcing hide");
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(safetyTimer);
  }, []);

  // 🔥 Auto-hide when data loaded
  useEffect(() => {
    if (criticalDataLoaded) {
      // Small delay for smooth animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [criticalDataLoaded]);

  const hideSplash = () => setIsVisible(false);
  const markDataLoaded = () => setCriticalDataLoaded(true);

  return (
    <SplashContext.Provider
      value={{ isVisible, hideSplash, criticalDataLoaded, markDataLoaded }}
    >
      {children}
    </SplashContext.Provider>
  );
}