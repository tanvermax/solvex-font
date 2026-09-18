import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { ToastContainer } from "react-toastify";
import CommonLayout from "./components/layout/CommoneLayout";
import { SidebarProvider } from "./components/ui/sidebar";

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    // <SidebarProvider defaultOpen={true}>
    <CommonLayout>
      <ScrollRestoration />
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      <Outlet />
    </CommonLayout>
    // </SidebarProvider>
  );
}