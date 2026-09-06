"use client";

import {
  LayoutDashboard,
  PackageCheck,
  LogOut,
  User,
  ShieldCheck,
  Building,
  Sparkles,
} from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { logout } from "@/redux/features/auth/auth.slice";

export interface IUser {
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | "CORPORATE_BUYER";
  picture?: string;
  companyName?: string;
}

interface UserMenuProps {
  userData: IUser;
}

export default function UserMenu({ userData }: UserMenuProps) {
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 🔥 Call logout API
      await logoutMutation(undefined).unwrap();
      
      // 🔥 Dispatch logout action to clear Redux state
      dispatch(logout());
      
      // 🔥 Reset all API state
      dispatch(authApi.util.resetApiState());
      
      // 🔥 Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 🔥 Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      
      // 🔥 Show success message
      toast.success("Logged out successfully", {
        description: "You have been logged out of your account.",
      });
      
      // 🔥 Navigate to home
      navigate("/");
      
      // 🔥 Force reload to clear all states
      window.location.href = "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      
      // 🔥 Even if API fails, clear local state
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.warning("Logged out locally", {
        description: "You have been logged out, but there was an issue with the server.",
      });
      
      navigate("/");
      window.location.href = "/";
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-9 rounded-full p-0 transition-transform active:scale-95 focus-visible:ring-1 focus-visible:ring-primary hover:bg-transparent"
        >
          <div className="relative size-9">
            <Avatar className="size-9 border border-primary/20 shadow-sm">
              <AvatarImage src={userData?.picture} alt={userData?.name} />
              <AvatarFallback className="bg-primary/10 font-bold text-primary text-xs">
                {userData?.name ? getInitials(userData.name) : <User className="size-4" />}
              </AvatarFallback>
            </Avatar>

            {/* Verified B2B Badge */}
            <span className="absolute -bottom-0.5 -end-0.5 rounded-full bg-background p-0.5 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  className="fill-primary"
                  d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                />
                <path
                  className="fill-background"
                  d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                />
              </svg>
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 p-2 rounded-2xl shadow-xl border-border/60 bg-background/95 backdrop-blur-md"
        align="end"
        sideOffset={8}
      >
        {/* Profile Header */}
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold leading-none text-foreground truncate">
                {userData?.name}
              </p>
              {userData?.role === "ADMIN" || userData?.role === "SUPER_ADMIN" ? (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  <ShieldCheck className="size-3" /> Admin
                </span>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground truncate">{userData?.email}</p>
            {userData?.companyName && (
              <p className="flex items-center gap-1 text-[11px] text-primary/80 font-medium pt-1">
                <Building className="size-3" /> {userData.companyName}
              </p>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 border-border/40" />

        {/* Dynamic Navigation Items */}
        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2 focus:bg-primary/10">
            <Link
              to={
                userData?.role === "ADMIN" || userData?.role === "SUPER_ADMIN"
                  ? "/admin/dashboard"
                  : "/dashboard"
              }
              className="flex items-center gap-2.5 font-medium text-xs text-foreground"
            >
              <LayoutDashboard className="size-4 text-primary" />
              <span>
                {userData?.role === "ADMIN" || userData?.role === "SUPER_ADMIN"
                  ? "Admin Dashboard"
                  : "Buyer Portal"}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2 focus:bg-primary/10">
            <Link
              to="/ordertrack"
              className="flex items-center gap-2.5 font-medium text-xs text-foreground"
            >
              <PackageCheck className="size-4 text-primary" />
              <span>Track & Order History</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2 focus:bg-primary/10">
            <Link
              to="/rfq"
              className="flex items-center gap-2.5 font-medium text-xs text-foreground"
            >
              <Sparkles className="size-4 text-primary" />
              <span>My Quotations (RFQs)</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 border-border/40" />

        {/* Logout Action */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="rounded-xl cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center justify-between font-medium text-xs"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="size-4" />
            <span>{isLoading ? "Logging out..." : "Log out"}</span>
          </div>
          {isLoading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}