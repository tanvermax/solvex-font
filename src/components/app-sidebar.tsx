import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/assets/icons/logo";
import { Link, useLocation } from "react-router";
import { getSidebarItems } from "@/utils/getSidebaritem";
import { useGetMeQuery } from "@/redux/features/auth/auth.api";
import { 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  User, 
  Settings,
  Sparkles,
  LayoutDashboard,
  Package,
  Truck,
  FileSpreadsheet,
  Building2,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/auth.slice";
import { authApi } from "@/redux/features/auth/auth.api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 const { data: userData, isLoading: isUserLoading } = useGetMeQuery(undefined);
  const location = useLocation();

  const authUser = useAppSelector((state) => state.auth.user);

  console.log("authUser",authUser);

  // API Response থাকলে সেটা নিবে, তা না হলে Redux Auth State নিবে
  const currentUser = userData?.data || authUser;
  const currentRole = currentUser?.role;


  console.log("currentUser",currentUser);
  console.log("currentRole",currentRole);

  const data = React.useMemo(() => ({
    navMain: getSidebarItems(currentRole) || [],
  }), [currentRole]);


  const { state, setOpen, open } = useSidebar();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = userData?.data;



  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
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
    }
  };

  const getIconForItem = (title: string) => {
    const icons: Record<string, any> = {
      "Dashboard": LayoutDashboard,
      "Admin Dashboard": LayoutDashboard,
      "Overview Stats": LayoutDashboard,
      "Quotation Requests (RFQ)": FileSpreadsheet,
      "Fleet & Tracking Update": Truck,
      "Order Overview": Package,
      "All Products": Package,
      "Orders History": Truck,
      "Add New Product": Package,
      "Users": User,
      "Corporate Buyers": Building2,
      "Settings": Settings,
    };
    return icons[title] || Package;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
      ADMIN: "bg-[#0F52BA]/10 text-[#0F52BA] border-[#0F52BA]/20",
      CORPORATE_BUYER: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      USER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return colors[role] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };


  return (
    <Sidebar
      {...props}
      className={cn(
        "border-r border-border/40 bg-background/95 backdrop-blur-xl shadow-xl transition-all duration-300",
        "data-[state=collapsed]:w-[70px]",
        "group/sidebar"
      )}
    >
      {/* ===== HEADER ===== */}
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <Link
            to={"/"}
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              state === "collapsed" ? "justify-center w-full" : ""
            )}
          >
            <div className="flex items-center gap-2">
              
              {state !== "collapsed" && (
                <Logo/>
              )}
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 rounded-xl hover:bg-muted/50"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      {/* ===== SEARCH ===== */}
      {state !== "collapsed" && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-3 text-sm rounded-xl bg-muted/30 border border-border/30 focus:border-[#0F52BA]/50 focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* ===== CONTENT ===== */}
      <SidebarContent className="px-3 py-2 overflow-y-auto">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title} className="p-0 mb-4">
            {state !== "collapsed" && (
              <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 mb-2">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  const Icon = getIconForItem(item?.title);

                  return (
                    <SidebarMenuItem key={item.title}>
                      {/* 🔥 FIX: asChild সরিয়ে সরাসরি Link ব্যবহার করুন */}
                      <SidebarMenuButton
                        className={cn(
                          "relative w-full h-10 px-3 rounded-xl font-medium text-sm transition-all duration-300",
                          "hover:bg-muted/50 hover:text-foreground",
                          isActive
                            ? "bg-gradient-to-r from-[#0F52BA]/10 to-[#0F52BA]/5 text-[#0F52BA] shadow-[0_4px_12px_rgba(15,82,186,0.08)]"
                            : "text-muted-foreground hover:text-foreground",
                          state === "collapsed" && "justify-center px-2"
                        )}
                        asChild
                      >
                        <Link
                          to={item.url}
                          className="flex items-center gap-3 w-full h-full"
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                              isActive
                                ? "bg-[#0F52BA]/10 text-[#0F52BA]"
                                : "bg-transparent text-muted-foreground/70 group-hover:bg-muted/50 group-hover:text-foreground"
                            )}
                          >
                           { item.icon ? <item.icon className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </div>

                          {state !== "collapsed" && (
                            <>
                              <span className="truncate flex-1">{item.title}</span>
                              {isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0F52BA] animate-pulse" />
                              )}
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ===== FOOTER ===== */}
      <SidebarFooter className="border-t border-border/40 p-3">
        {state !== "collapsed" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300">
              <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md">
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-primary text-sm">
                  {currentUser?.name ? getInitials(currentUser.name) : <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{currentUser?.name || "Guest"}</p>
                <div className="flex items-center gap-1.5">
                  <Badge className={cn("text-[9px] font-medium border-0", getRoleColor(currentUser?.role || "USER"))}>
                    {currentRole || "USER"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted/50"
                onClick={() => setOpen(!open)}
              >
                {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 font-bold text-primary text-sm">
                {user?.name ? getInitials(user.name) : <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl hover:bg-muted/50"
                onClick={() => setOpen(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}