import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
import AdminOrderTrack from "@/components/layout/AdminLayoute/AdminOrderTrack/AdminOrderTrack";
import AdminQuotationManagement from "@/components/layout/AdminLayoute/AdminQuotationManagement/AdminQuotationManagement";
import AdminShipmentTracking from "@/components/layout/AdminLayoute/AdminShipmentTracking/AdminShipmentTracking";
import Allproduct from "@/components/layout/AdminLayoute/Allproduct";
import OrderviewAdmin from "@/components/layout/AdminLayoute/OrderviewAdmin/OrderviewAdmin";
import AdminOverviewPage from "@/components/layout/AdminLayoute/Overview/Adminoverviewpage";

import type { ISidebarItem } from "@/types";

import { 
  LayoutDashboard, 
  ChartArea,
  ShoppingBag, 
  PlusCircle, 
  ClipboardList,
  Truck,
  FileSpreadsheet
} from "lucide-react";

export const adminSidebarItem: ISidebarItem[] = [
  {
    title: "Admin Dashboard",
    url: "#",
    items: [
      {
        title: "Overview Stats",
        url: "/admin/dashboard",
        component: AdminOverviewPage,
        icon: LayoutDashboard,
      },
      {
        title: "Quotation Requests (RFQ)",
        url: "/admin/quotations",
        component: AdminQuotationManagement, // B2B SLA Price Quote দেয়ার পেজ
        icon: FileSpreadsheet,
      },
      {
        title: "Fleet & Tracking Update",
        url: "/admin/shipments",
        component: AdminShipmentTracking, // Tracking ID তৈরি ও স্ট্যাটাস চেঞ্জের পেজ
        icon: Truck,
      },
      {
        title: "Order Overview",
        url: "/admin/order-overview",
        component: OrderviewAdmin,
        icon: ChartArea,
      },
      {
        title: "All Products",
        url: "/admin/products", // URL /admin/products সেট করা ভালো
        component: Allproduct,
        icon: ShoppingBag,
      },
      {
        title: "Orders History",
        url: "/admin/orders",
        component: AdminOrderTrack,
        icon: ClipboardList,
      },
      {
        title: "Add New Product",
        url: "/admin/add-product",
        component: AddProduct,
        icon: PlusCircle,
      },
    ],
  },
];