// components/navbar-components/user-menu.tsx
"use client";

import {
  LogOutIcon,
  SettingsIcon,
  HeartIcon,
  ShoppingBagIcon,
  CrownIcon,
  SparklesIcon,
  GemIcon,
  DiamondIcon,
  ClockIcon,
  GiftIcon,
  StarIcon,
  LayoutDashboard,
  PackageCheck,
  Truck,
  FileSpreadsheet,
  ShoppingBag,
  Users,
  HelpCircle,
  Building,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { logout } from "@/redux/features/auth/auth.slice";

export interface IUser {
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "CORPORATE_BUYER";
  picture?: string;
  avatar?: string;
  companyName?: string;
  joinDate?: string;
  loyaltyPoints?: number;
}

interface UserMenuProps {
  userData: IUser;
}

export default function UserMenu({ userData }: UserMenuProps) {
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const isAdmin = userData?.role === "ADMIN" || userData?.role === "SUPER_ADMIN";

  // 🔥 Logout Handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
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
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    const initials = nameParts
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    return initials || 'U';
  };

  // Get role badge color
  const getRoleBadge = (role: string) => {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      return {
        label: '🛡️ Admin',
        className: 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-600 border-amber-400/30'
      };
    }
    if (role === 'CORPORATE_BUYER') {
      return {
        label: '🏢 Corporate',
        className: 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-600 border-blue-400/30'
      };
    }
    return {
      label: '👤 Member',
      className: 'bg-gradient-to-r from-pink-400/20 to-purple-400/20 text-purple-600 border-purple-400/30'
    };
  };

  // 🔥 আপনার প্রজেক্টের মেনু আইটেম - এখানে শুধু এই অংশ পরিবর্তন করুন
  const menuItems = isAdmin ? [
    {
      icon: LayoutDashboard,
      label: "Admin Dashboard",
      href: "/admin/dashboard",
      description: "Overview & Analytics",
      color: "text-[#0F52BA]",
      bgColor: "bg-[#0F52BA]/10",
    },
    {
      icon: FileSpreadsheet,
      label: "RFQ Management",
      href: "/admin/quotations",
      description: "Manage RFQ requests",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Truck,
      label: "Shipment Tracking",
      href: "/admin/shipments",
      description: "Fleet & Logistics",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: ShoppingBag,
      label: "Product Management",
      href: "/admin/products",
      description: "Manage inventory",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Users,
      label: "User Management",
      href: "/admin/users",
      description: "Manage users & roles",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      href: "/admin/settings",
      description: "System configuration",
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
    },
  ] : [
    {
      icon: LayoutDashboard,
      label: "Buyer Portal",
      href: "/dashboard",
      description: "Your dashboard",
      color: "text-[#0F52BA]",
      bgColor: "bg-[#0F52BA]/10",
    },
    {
      icon: PackageCheck,
      label: "Track & Order History",
      href: "/ordertrack",
      description: "Track your shipments",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: SparklesIcon,
      label: "My Quotations (RFQs)",
      href: "/rfq",
      description: "Your RFQ requests",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: User,
      label: "My Profile",
      href: "/profile",
      description: "Account settings",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/help",
      description: "Need assistance?",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  // 🔥 যদি userData না থাকে, কিছু রেন্ডার করবেন না
  if (!userData) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative">
            <Avatar className="h-11 w-11 ring-2 ring-primary/20 transition-all group-hover:ring-orange-400/50 shadow-lg shadow-primary/10 group-hover:shadow-orange-400/20">
              <AvatarImage src={userData?.picture || userData?.avatar || "./avatar-80-07.jpg"} alt={userData.name} />
              <AvatarFallback className="bg-linear-to-br from-blue-1100 to-orange text-orange-600 font-semibold">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            
            {/* Premium Verified Badge with sparkle effect */}
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="absolute -end-0.5 -top-0.5"
            >
              <span className="sr-only">Verified Premium</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="premiumGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                  </radialGradient>
                </defs>
                <path
                  className="fill-background"
                  d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
                />
                <path
                  fill="url(#premiumGrad)"
                  d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                />
                <path
                  className="fill-background"
                  d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                />
              </svg>
            </motion.span>

            {/* Online status dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3">
              <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
            </span>
          </div>
        </motion.button>
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent 
            className="w-80 p-1.5 border-primary/10 shadow-2xl shadow-pink-500/10 bg-gradient-to-b from-white to-pink-50/30 backdrop-blur"
            align="end"
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95, rotateX: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, rotateX: -5 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                {/* Premium User Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 opacity-50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-300/20 to-purple-300/20 rounded-full blur-2xl"></div>
                  
                  <DropdownMenuLabel className="p-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14 ring-2 ring-orange-400/30 shadow-lg shadow-pink-400/20">
                        <AvatarImage src={userData?.picture || userData?.avatar || "./avatar-80-07.jpg"} alt={userData.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-blue-500 text-white text-lg font-bold">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground truncate text-sm font-bold">
                            {userData.name}
                          </span>
                          <Badge className={`${getRoleBadge(userData.role).className} border-0 text-[10px] px-2 py-0.5`}>
                            {getRoleBadge(userData.role).label}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground truncate text-xs flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                          {userData.email}
                        </span>
                        {userData.companyName && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Building size={10} className="text-blue-400" />
                            <span className="text-[10px] text-muted-foreground">
                              {userData.companyName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </motion.div>

                <DropdownMenuSeparator className="my-1" />

                {/* Menu Items - আপনার কাস্টম মেনু আইটেম */}
                <DropdownMenuGroup className="px-1 space-y-0.5">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link to={item.href} onClick={() => setIsOpen(false)}>
                        <DropdownMenuItem 
                          className={`px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer relative ${
                            isActive(item.href) 
                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20' 
                              : 'hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/5'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${item.bgColor} ${item.color} group-hover:scale-110 transition-all duration-200`}>
                            <item.icon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                          </div>
                          <div className="flex-1 ml-2">
                            <span className="text-sm font-medium group-hover:text-primary transition-colors">
                              {item.label}
                            </span>
                            <p className="text-[10px] text-muted-foreground/70">
                              {item.description}
                            </p>
                          </div>
                          <motion.div 
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-all"
                            initial={{ x: -5 }}
                            animate={{ x: 0 }}
                          >
                            <span className="text-xs text-primary">✦</span>
                          </motion.div>
                        </DropdownMenuItem>
                      </Link>
                    </motion.div>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1" />

                {/* Logout Button */}
                <DropdownMenuItem className="p-1">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button 
                      onClick={handleLogout}
                      disabled={isLoggingOut || isLoading}
                      variant="ghost"
                      className="w-full gap-2 bg-gradient-to-r from-destructive/10 to-destructive/5 hover:from-destructive/20 hover:to-destructive/10 text-destructive hover:text-destructive border border-destructive/20 hover:border-destructive/30 transition-all duration-300 group"
                    >
                      {(isLoggingOut || isLoading) ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-destructive/30 border-t-destructive rounded-full"
                        />
                      ) : (
                        <LogOutIcon size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      )}
                      <span className="font-medium">
                        {(isLoggingOut || isLoading) ? "Logging out..." : "Sign Out"}
                      </span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-auto text-destructive/50"
                      >
                        ✦
                      </motion.span>
                    </Button>
                  </motion.div>
                </DropdownMenuItem>

                {/* Footer with brand */}
                <div className="px-4 py-2 mt-1">
                  <p className="text-[10px] text-center text-muted-foreground/50 flex items-center justify-center gap-2">
                    <span className="w-4 h-px bg-gradient-to-r from-transparent to-primary/30"></span>
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-medium">
                      ✦ SolveX B2B Platform ✦
                    </span>
                    <span className="w-4 h-px bg-gradient-to-l from-transparent to-primary/30"></span>
                  </p>
                </div>
              </div>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}