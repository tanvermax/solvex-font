import type { ReactNode } from "react";
import Footer from "./Footer";
import Navber from "./Navber";
import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";

interface IProps {
  children: ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-[#011226]">
      <div className="sticky  top-0 z-40 container mx-auto  px-4 md:px-6 bg-white dark:bg-[#011226]">
        <Navber />
      </div>
      <div className=" b container  mx-auto">
        <ToastContainer />
        {children}
        <Toaster />
      </div>

      <Footer />
    </div>
  );
}
