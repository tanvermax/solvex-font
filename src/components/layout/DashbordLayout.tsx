// components/layout/DashbordLayout.tsx
import { Outlet, useLocation, Navigate } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "../ui/separator";
import { useAppSelector } from "@/redux/hook";
import { useCurrentUser } from "@/redux/features/auth/auth.slice";

export default function DashbordLayout() {
  const user = useAppSelector(useCurrentUser);
  const location = useLocation();
  
  // 🔥 Check if user is admin
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  
  // 🔥 Extra security: If trying to access admin route but not admin
  if (location.pathname.startsWith('/admin') && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // 🔥 If trying to access user route but not logged in
  if (location.pathname.startsWith('/user') && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* 🔥 Show user role in header */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name} ({user?.role})
              </span>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}