// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import router from "./routes/index.tsx";
import { ThemeProvider } from "./providers/theme.provider.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import { SplashProvider } from "./providers/SplashProvider.tsx";
import SplashScreen from "./components/loading/SplashScreen.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          {/* 🔥 Splash Provider wrap */}
          <SplashProvider>
            {/* 🔥 Splash Screen — always rendered first */}
            <SplashScreen />
            
            {/* 🔥 Main App */}
            <RouterProvider router={router} />
            <Toaster richColors />
          </SplashProvider>
        </ThemeProvider>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>
);