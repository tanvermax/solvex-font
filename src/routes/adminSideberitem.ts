// src/routes/adminSideberitem.ts
import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
import AdminQuotationManagement from "@/components/layout/AdminLayoute/AdminRFQRequests/AdminRFQRequests";
import AdminShipmentTracking from "@/components/layout/AdminLayoute/AdminShipmentTracking/AdminShipmentTracking";
import Allproduct from "@/components/layout/AdminLayoute/AddProduct/Allproduct";
import OrderviewAdmin from "@/components/layout/AdminLayoute/OrderviewAdmin/OrderviewAdmin";
import AdminOverviewPage from "@/components/layout/AdminLayoute/Overview/Adminoverviewpage";
import AdminOrderTrack from "@/components/layout/AdminLayoute/AdminOrderTrack/AdminOrderTrack";
import AdminShipmentsPage from "@/components/layout/AdminLayoute/Shipment/AdminShipmentsPage";
import AdminReportsPage from "@/components/layout/AdminLayoute/Reports/AdminReportsPage";
import AdminCreateShipmentPage from "@/components/layout/AdminLayoute/Shipment/AdminCreateShipmentPage";
import AdminFleetManagementPage from "@/components/layout/AdminLayoute/Fleet/AdminFleetManagementPage";
import AdminRFQAnalyticsPage from "@/components/layout/AdminLayoute/RFQ/AdminRFQAnalyticsPage";
import AdminQuotationTemplatesPage from "@/components/layout/AdminLayoute/RFQ/AdminQuotationTemplatesPage";
import AdminRouteOptimizationPage from "@/components/layout/AdminLayoute/Fleet/AdminRouteOptimizationPage";
import AdminUsersPage from "@/components/layout/AdminLayoute/User/AdminUsersPage";
import AdminUserDetailsPage from "@/components/layout/AdminLayoute/User/AdminUserDetailsPage";
import AdminCorporateBuyersPage from "@/components/layout/AdminLayoute/User/AdminCorporateBuyersPage";
import AdminSettingsPage from "@/components/layout/AdminLayoute/Settings/AdminSettingsPage";
import AdminRFQRequests from "@/components/layout/AdminLayoute/AdminRFQRequests/AdminRFQRequests";
import AdminContactPage from "@/components/layout/AdminLayoute/Contact/AdminContactPage";

// 🔥 NEW: Category & Subcategory Pages
import CategoryListPage from "@/components/layout/AdminLayoute/Category/CategoryListPage";


import type { ISidebarItem } from "@/types";

import {
  LayoutDashboard,
  ChartArea,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  Truck,
  FileSpreadsheet,
  Users,
  UserCog,
  Building2,
  BarChart3,
  Settings,
  Package,
  MapPin,
  Route,
  Eye,
  Database,
  FileBarChart,
  MessageSquare,
  Copy,
  TrendingUp,
  Layers,        // 🔥 NEW
  FolderTree,    // 🔥 NEW
} from "lucide-react";
import CategoryFormPage from "@/components/layout/AdminLayoute/Category/CategoryFormPage";
import SubcategoryListPage from "@/components/layout/AdminLayoute/Subcategory/SubcategoryListPage";
import SubcategoryFormPage from "@/components/layout/AdminLayoute/Subcategory/SubcategoryFormPage";

export const adminSidebarItem: ISidebarItem[] = [
  // ============================================
  // 📊 SECTION 1: DASHBOARD & ANALYTICS
  // ============================================
  {
    title: "Dashboard & Analytics",
    url: "#",
    items: [
      {
        title: "Overview Stats",
        url: "/admin/dashboard",
        component: AdminOverviewPage,
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: AdminOverviewPage,
        icon: BarChart3,
      },
      {
        title: "Reports",
        url: "/admin/reports",
        component: AdminReportsPage,
        icon: FileBarChart,
      },
    ],
  },

  // ============================================
  // 💬 SECTION 2: MESSAGE MANAGEMENT
  // ============================================
  {
    title: "Message Management",
    url: "#",
    items: [
      {
        title: "Message",
        url: "/admin/message",
        component: AdminContactPage,
        icon: ClipboardList,
      },
    ],
  },

  // ============================================
  // 📦 SECTION 3: ORDER MANAGEMENT
  // ============================================
  {
    title: "Order Management",
    url: "#",
    items: [
      {
        title: "All Orders",
        url: "/admin/orders",
        component: AdminOrderTrack,
        icon: ClipboardList,
      },
      {
        title: "Order Overview",
        url: "/admin/order-overview",
        component: OrderviewAdmin,
        icon: ChartArea,
      },
      {
        title: "Bulk Order Actions",
        url: "/admin/orders/bulk",
        component: AdminOrderTrack,
        icon: Copy,
      },
    ],
  },

  // ============================================
  // 🚚 SECTION 4: FLEET & SHIPMENT TRACKING
  // ============================================
  {
    title: "Fleet & Logistics",
    url: "#",
    items: [
      {
        title: "Shipments",
        url: "/admin/shipments",
        component: AdminShipmentsPage,
        icon: Truck,
      },
      {
        title: "Create Shipment",
        url: "/admin/shipments/create",
        component: AdminCreateShipmentPage,
        icon: Package,
      },
      {
        title: "Fleet Management",
        url: "/admin/fleet",
        component: AdminFleetManagementPage,
        icon: MapPin,
      },
      {
        title: "Route Optimization",
        url: "/admin/fleet/routes",
        component: AdminRouteOptimizationPage,
        icon: Route,
      },
      {
        title: "Tracking Update",
        url: "/admin/shipments/tracking",
        component: AdminShipmentTracking,
        icon: Eye,
      },
    ],
  },

  // ============================================
  // 📝 SECTION 5: RFQ MANAGEMENT
  // ============================================
  {
    title: "RFQ & Quotations",
    url: "#",
    items: [
      {
        title: "RFQ Requests",
        url: "/admin/quotations",
        component: AdminRFQRequests,
        icon: FileSpreadsheet,
      },
      {
        title: "RFQ Analytics",
        url: "/admin/quotations/analytics",
        component: AdminRFQAnalyticsPage,
        icon: TrendingUp,
      },
      {
        title: "Quotation Templates",
        url: "/admin/quotations/templates",
        component: AdminQuotationTemplatesPage,
        icon: Copy,
      },
    ],
  },

  // ============================================
  // 🏷️ SECTION 6: PRODUCT & INVENTORY
  // ============================================
  {
    title: "Product Management",
    url: "#",
    items: [
      {
        title: "All Products",
        url: "/admin/products",
        component: Allproduct,
        icon: ShoppingBag,
      },
      {
        title: "Add Product",
        url: "/admin/add-product",
        component: AddProduct,
        icon: PlusCircle,
      },
      // 🔥 NEW: Categories
      {
        title: "Categories",
        url: "/admin/categories",
        component: CategoryListPage,
        icon: Layers,
      },
      {
        title: "Add Category",
        url: "/admin/categories/add",
        component: CategoryFormPage,
        icon: PlusCircle,
      },
      // 🔥 NEW: Subcategories
      {
        title: "Subcategories",
        url: "/admin/subcategories",
        component: SubcategoryListPage,
        icon: FolderTree,
      },
      {
        title: "Add Subcategory",
        url: "/admin/subcategories/add",
        component: SubcategoryFormPage,
        icon: PlusCircle,
      },
      // Existing
      {
        title: "Bulk Import",
        url: "/admin/products/import",
        component: Allproduct,
        icon: Database,
      },
      {
        title: "Product Reviews",
        url: "/admin/reviews",
        component: Allproduct,
        icon: MessageSquare,
      },
    ],
  },

  // ============================================
  // 👥 SECTION 7: USER MANAGEMENT
  // ============================================
  {
    title: "User Management",
    url: "#",
    items: [
      {
        title: "All Users",
        url: "/admin/users",
        component: AdminUsersPage,
        icon: Users,
      },
      {
        title: "User Details",
        url: "/admin/users/:id",
        component: AdminUserDetailsPage,
        icon: UserCog,
      },
      {
        title: "Corporate Buyers",
        url: "/admin/corporate",
        component: AdminCorporateBuyersPage,
        icon: Building2,
      },
    ],
  },
];