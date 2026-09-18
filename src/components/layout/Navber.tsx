"use client";

import { Link, useLocation, useNavigate } from "react-router";
import { 
  Layers, 
  LogIn, 
  Menu,
  Sparkles,
  ContactRoundIcon,
  X,
  Home,
  Phone,
  FileText,
  PackageSearch,
  Truck,
  Building2,
  User,
  Settings,
  HelpCircle,
  Loader2,
  LogOut,
} from "lucide-react";

import Logo from "@/assets/icons/logo";
import { ModeToggle } from "./ModeToggler";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout, useCurrentUser, useIsAuthenticated } from "@/redux/features/auth/auth.slice";
import { Skeleton } from "@/components/ui/skeleton";
import UserMenu from "../navbar-components/user-menu";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { toast } from "react-toastify";

const NAVIGATION_LINKS = [
  { href: "/products", label: "Products", icon: Layers },
  { href: "/sourcing", label: "Sourcing", icon: PackageSearch },
  { href: "/industries", label: "Industries", icon: Building2 },
  { href: "/rfq", label: "Request Quote", icon: FileText },
  { href: "/contactus", label: "Contact Us", icon: ContactRoundIcon },
  { href: "/ordertrack", label: "Track Shipment", icon: Truck },
] as const;

// Mobile bottom navigation items
const BOTTOM_NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Products", icon: Layers, href: "/products" },
  { label: "RFQ", icon: FileText, href: "/rfq" },
  { label: "Contact", icon: Phone, href: "/contactus" },
  { label: "Profile", icon: User, href: "/profile" },
];

// Quick action suggestions for mobile
const QUICK_ACTIONS = [
  { label: "Request Quote", icon: FileText, href: "/rfq" },
  { label: "Track Order", icon: Truck, href: "/ordertrack" },
  { label: "Browse Products", icon: PackageSearch, href: "/products" },
  { label: "Support", icon: HelpCircle, href: "/contactus" },
];

export default function FloatingNavbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Get auth state from Redux
  const user = useAppSelector(useCurrentUser);
  const isAuthenticated = useAppSelector(useIsAuthenticated);

  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  console.log(isAuthenticated);
  const handleLogout = async () => {
    try {
      await logoutMutation(undefined).unwrap();
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      
      toast.success("Logged out successfully");
      navigate("/");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.warning("Logged out locally");
      navigate("/");
      window.location.href = "/";
    }
  };
  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check if bottom nav item is active
  const isBottomNavActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(href);
  };

  // Menu item variants
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  } as any;

  // Don't render user-specific UI on server to avoid hydration issues
  const renderAuthButton = () => {
    if (!isMounted) {
      return (
        <Skeleton className="h-8 w-20 rounded-full" />
      );
    }

    if (isAuthenticated && user) {
      return <UserMenu userData={user} />;
    }

    return (
      <>
        {/* Desktop Login Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block"
        >
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="rounded-full text-xs font-semibold h-8 px-3 border border-border/30 hover:border-primary/30 transition-all"
          >
            <Link to="/login" className="flex items-center gap-1">
              <LogIn className="size-3.5" />
              <span>Login</span>
            </Link>
          </Button>
        </motion.div>

        {/* Mobile Login Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden"
        >
          <Link
            to="/login"
            className="size-8 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
          >
            <LogIn className="size-4" />
          </Link>
        </motion.div>
      </>
    );
  };

  return (
    <>
      {/* ===== MAIN FLOATING NAVBAR ===== */}
      <header className="fixed top-4 left-0 right-0 z-50 px-3 md:px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-7xl mx-auto rounded-full bg-background/80 dark:bg-slate-950/90 backdrop-blur-[2px] border border-border/80 shadow-lg transition-all duration-300 ${
            isScrolled 
              ? "shadow-[0_8px_32px_rgba(0,0,0,0.15)] border-border/90" 
              : "shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          } px-3 md:px-4 py-1.5 md:py-2`}
        >
          <div className="flex items-center justify-between gap-2 md:gap-4">
            
            {/* ===== LEFT: Brand Logo & Mobile Trigger ===== */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Menu Trigger with Animation */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative size-9 rounded-full border border-border/50 hover:bg-muted/50 transition-colors flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {isMobileMenuOpen ? (
                    <X className="size-4 text-primary" />
                  ) : (
                    <Menu className="size-4" />
                  )}
                </motion.div>
              </motion.button>

              {/* Brand Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center"
              >
                <Link to="/" className="flex items-center">
                  <Logo />
                </Link>
              </motion.div>
            </div>

            {/* ===== CENTER: Desktop Navigation ===== */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAVIGATION_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={link.href}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                        isActive
                          ? "text-foreground bg-primary/10 shadow-[0_0_20px_rgba(59,130,300,0.15)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="desktopNavIndicator"
                          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.4,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* ===== RIGHT: Action Buttons ===== */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mode Toggle with Animation */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ModeToggle />
              </motion.div>

              {/* Auth Button - Shows UserMenu or Login based on auth state */}
              {renderAuthButton()}

              {/* Primary CTA Button with Animation */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(15, 82, 186, 0.4)",
                    "0 0 0 10px rgba(15, 82, 186, 0)",
                    "0 0 0 0 rgba(15, 82, 186, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-[#0F52BA] hover:bg-[#0b3e8f] text-white font-bold md:text-xs text-[9px] rounded-full h-8 px-3 md:px-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link to="/rfq" className="flex items-center gap-1 md:gap-1.5">
                    <motion.span
                      animate={{ rotate: [0, 15, 0, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Sparkles className="size-3 fill-current text-white" />
                    </motion.span>
                    <span className="hidden xs:inline">Start Sourcing</span>
                    <span className="xs:hidden">RFQ</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ===== ENHANCED MOBILE MENU (Full Screen Overlay) ===== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.5,
                }
              }}
              exit={{ 
                x: "-100%", 
                opacity: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeInOut",
                }
              }}
              className="fixed top-0 left-0 bottom-0 w-[300px] max-w-[80vw] bg-background/95 backdrop-blur-xl border-r border-border/50 z-50 lg:hidden shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Logo />
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="size-8 rounded-full hover:bg-muted/50 transition-colors flex items-center justify-center"
                >
                  <X className="size-4" />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
                {/* Main Navigation */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-3 px-2">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {NAVIGATION_LINKS.map((link, index) => {
                      const isActive = location.pathname === link.href;
                      return (
                        <motion.div
                          key={link.href}
                          custom={index}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-primary/10 text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                          >
                            <link.icon className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span>{link.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="mobileNavIndicator"
                                className="ml-auto w-1 h-6 rounded-full bg-primary"
                                transition={{
                                  type: "spring",
                                  bounce: 0.2,
                                  duration: 0.4,
                                }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-3 px-2">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((action, index) => (
                      <motion.div
                        key={action.label}
                        custom={index + NAVIGATION_LINKS.length}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Link
                          to={action.href}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all border border-border/30 hover:border-primary/30"
                        >
                          <action.icon className="size-5 text-primary" />
                          <span className="text-[10px] font-medium text-center leading-tight">
                            {action.label}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* User Actions */}
                <div className="border-t border-border/40 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {isAuthenticated && user ? (
                      <>
                        <motion.div
                          custom={NAVIGATION_LINKS.length + QUICK_ACTIONS.length}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/profile"
                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/20"
                          >
                            <User className="size-4 text-primary" />
                            <span className="text-xs font-semibold">Profile</span>
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={NAVIGATION_LINKS.length + QUICK_ACTIONS.length + 1}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/dashboard"
                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-border/30"
                          >
                            <Settings className="size-4" />
                            <span className="text-xs font-medium">Dashboard</span>
                          </Link>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          custom={NAVIGATION_LINKS.length + QUICK_ACTIONS.length}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/20"
                          >
                            <LogIn className="size-4 text-primary" />
                            <span className="text-xs font-semibold">Login</span>
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={NAVIGATION_LINKS.length + QUICK_ACTIONS.length + 1}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to="/register"
                            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-border/30"
                          >
                            <User className="size-4" />
                            <span className="text-xs font-medium">Register</span>
                          </Link>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>

                {/* Theme Toggle in Menu */}
                <div className="border-t border-border/40 pt-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-medium text-muted-foreground">Theme</span>
                    <ModeToggle />
                    
                  </div>
                  <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleLogout}
                              disabled={isLoading}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl px-3 py-1.5 h-auto text-xs font-medium gap-1.5"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Logging out...
                                </>
                              ) : (
                                <>
                                  <LogOut className="h-3.5 w-3.5" />
                                  Logout
                                </>
                              )}
                            </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MOBILE BOTTOM NAVIGATION BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-lg"
        >
          <div className="flex items-center justify-around py-1 px-2">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isActive = isBottomNavActive(item.href);
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Link
                    to={item.href}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        size={22}
                        className={`transition-all duration-200 ${
                          isActive ? "scale-110" : ""
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-medium tracking-wide ${
                        isActive ? "text-primary font-semibold" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Safe area spacer for notch phones */}
          <div className="h-safe-bottom bg-transparent" />
        </motion.div>
      </div>

      {/* ===== FLOATING ACTION BUTTON (Mobile Quick Actions) ===== */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-20 right-4 z-40 md:hidden"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center"
          onClick={() => window.location.href = "/rfq"}
        >
          <Sparkles className="size-5 fill-current" />
        </motion.button>
      </motion.div>
    </>
  );
}