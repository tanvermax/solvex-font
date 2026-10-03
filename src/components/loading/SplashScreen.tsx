// src/components/loading/SplashScreen.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Package, Truck } from "lucide-react";
import { useSplash } from "@/providers/SplashProvider";
import Logo from "@/assets/icons/logo";

export default function SplashScreen() {
  const { isVisible } = useSplash();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center"
        >
          {/* Animated Background Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"
          />

          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* ===== ANIMATED LOGO ===== */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Rotating Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border-2 border-dashed border-primary/30 rounded-full"
              />

              {/* Pulsing Ring */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 border-2 border-primary/40 rounded-full"
              />

              {/* Logo */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-background rounded-2xl p-6 shadow-2xl border border-border/60"
              >
                <Logo />
              </motion.div>
            </motion.div>

            {/* ===== BRAND TEXT ===== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center space-y-2"
            >
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                SolveX Supply
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Enterprise B2B Platform
              </p>
            </motion.div>

            {/* ===== PROGRESS BAR ===== */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-64 space-y-3"
            >
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                  className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                />
              </div>

              {/* Loading Text with Icons */}
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Package className="size-3.5 text-primary" />
                </motion.div>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Loading Premium Experience...
                </span>
              </div>
            </motion.div>

            {/* ===== ANIMATED DOTS ===== */}
            <div className="flex items-center gap-1.5 pt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Bottom Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 text-center space-y-1"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              B2B • Industrial Supplies • Bangladesh
            </p>
            <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground/40">
              <Sparkles className="size-2.5" />
              <span>Powered by SolveX</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}