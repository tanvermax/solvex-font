import { useEffect } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { ToastContainer } from "react-toastify";
import CommonLayout from "./components/layout/CommoneLayout";

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <CommonLayout>
      <ScrollRestoration />
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      <Outlet />
    </CommonLayout>
  );
}