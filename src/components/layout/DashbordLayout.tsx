// components/layout/DashbordLayout.tsx
import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useGetMeQuery } from "@/redux/features/user/use.api";

function MobileHeader() {
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="flex h-14 items-center gap-2 border-b px-4 bg-background md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <span className="text-sm font-semibold">Dashboard</span>
    </header>
  );
}

export default function DashbordLayout() {
  const { isLoading } = useGetMeQuery(undefined);
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F52BA]" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Mobile Header */}
          <MobileHeader />
          
          {/* Desktop Header */}
          <header className="hidden md:flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-[calc(100vh-8rem)] flex-1 rounded-xl bg-muted/50 p-4 md:p-6">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}