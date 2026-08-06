"use client";

// import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router";
import { 
  FileText, 
  PackageSearch, 
  Truck, 
  Layers, 
  Building2,
  LogIn, 
  Menu,
  Sparkles
} from "lucide-react";

import Logo from "@/assets/icons/logo";
// import UserMenu from "@/components/navbar-components/user-menu";
import { ModeToggle } from "./ModeToggler";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";

const NAVIGATION_LINKS = [
  { href: "/products", label: "Products", icon: Layers },
  { href: "/sourcing", label: "Sourcing", icon: PackageSearch },
  { href: "/industries", label: "Industries", icon: Building2 },
  { href: "/rfq", label: "Request Quote", icon: FileText },
  { href: "/ordertrack", label: "Track Shipment", icon: Truck },
] as const;

export default function FloatingNavbar() {
  // const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  // const [inquiryCount, setInquiryCount] = useState<number>(0);
  const location = useLocation();

  // const updateInquiryCartView = useCallback(() => {
  //   try {
  //     const localItems = JSON.parse(localStorage.getItem("inquiryCart") || "[]");
  //     setInquiryCount(Array.isArray(localItems) ? localItems.length : 0);
  //   } catch {
  //     setInquiryCount(0);
  //   }
  // }, []);

  // useEffect(() => {
  //   updateInquiryCartView();
  //   window.addEventListener("cartUpdated", updateInquiryCartView);
  //   window.addEventListener("storage", updateInquiryCartView);

  //   return () => {
  //     window.removeEventListener("cartUpdated", updateInquiryCartView);
  //     window.removeEventListener("storage", updateInquiryCartView);
  //   };
  // }, [updateInquiryCartView]);


  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      {/* Floating Curved Pill Container */}
      <div className="max-w-7xl shadow-[-1px_5px_52px_10px_rgba(0,_0,_0,_0.3)] mx-auto rounded-full bg-background/80 dark:bg-slate-950/90 backdrop-blur-[2px] border border-border/80  shadow-black/10 px-4 py-2 transition-all">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center md:gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden size-8 rounded-full border border-border/50"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-3 mt-3 rounded-2xl border shadow-2xl bg-background/95 backdrop-blur-2xl">
                <div className="mb-2 px-2 py-1 border-b border-border/40">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF5500]">SolveX Navigation</p>
                </div>
                <div className="flex flex-col gap-1">
                  {NAVIGATION_LINKS.map((link) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <link.icon className="size-4 text-primary" />
                        {link.label}
                      </Link>
                    );
                  })}
                  <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-semibold h-8 px-3">
                <Link to="/login">
                  <LogIn className="size-3.5 mr-1" />
                  <span>Login</span>
                </Link>
              </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Link to="/" >
              <Logo />
            </Link>
          </div>

          {/* Center Navigation Links (Image Style) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAVIGATION_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "text-foreground font-bold bg-muted/10  shadow-[4px_9px_35px_20px_rgba(59,_130,_300,_0.15)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* RFQ Basket Button */}
            {/* <Link
              to="/inquiry-cart"
              className="relative p-2 rounded-full border border-border/60 hover:bg-muted transition-colors flex items-center justify-center"
              aria-label="Inquiry Cart"
            >
              <FileText className="size-4 text-foreground" />
              {inquiryCount > 0 && (
                <Badge className="bg-[#FF5500] text-white border-2 border-background absolute -top-1 -right-1 rounded-full text-[9px] font-black h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {inquiryCount}
                </Badge>
              )}
            </Link> */}

            <ModeToggle />

            {/* User Auth or Sign In Button */}
            {/* {isUserLoading ? (
              <div className="size-8 flex items-center justify-center">
                <Spinner />
              </div>
            ) : userData?.data?.email ? (
              <UserMenu userData={userData.data} />
            ) : (
              <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-semibold h-8 px-3">
                <Link to="/login">
                  <LogIn className="size-3.5 mr-1" />
                  <span>Login</span>
                </Link>
              </Button>
            )} */}

            {/* Primary Action Button (Image Style) */}
            <Button 
              asChild 
              size="sm" 
              className="bg-[#0F52BA] hover:bg-[#0b3e8f] text-white font-bold md:text-xs text-[9px] rounded-full h-8 px-4 shadow-md"
            >
              <Link to="/rfq" className="flex items-center gap-1.5">
                <Sparkles className="size-3 fill-current text-[#ffffff]" />
                <span>Start Sourcing</span>
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
}