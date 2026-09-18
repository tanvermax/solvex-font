import AddProduct from "@/components/layout/AdminLayoute/AddProduct/AddProduct";
import AdminQuotationManagement from "@/components/layout/AdminLayoute/AdminRFQRequests/AdminRFQRequests";
import AdminShipmentTracking from "@/components/layout/AdminLayoute/AdminShipmentTracking/AdminShipmentTracking";
import Allproduct from "@/components/layout/AdminLayoute/Allproduct";
import OrderviewAdmin from "@/components/layout/AdminLayoute/OrderviewAdmin/OrderviewAdmin";
import AdminOverviewPage from "@/components/layout/AdminLayoute/Overview/Adminoverviewpage";

// 🔥 নতুন ইমপোর্ট - যেগুলো তৈরি করতে হবে
import AdminOrderTrack from "@/components/layout/AdminLayoute/AdminOrderTrack/AdminOrderTrack";
import AdminShipmentsPage from "@/components/layout/AdminLayoute/Shipment/AdminShipmentsPage";
import AdminReportsPage from "@/components/layout/AdminLayoute/Reports/AdminReportsPage";
import AdminCreateShipmentPage from "@/components/layout/AdminLayoute/Shipment/AdminCreateShipmentPage";
import AdminFleetManagementPage from "@/components/layout/AdminLayoute/Fleet/AdminFleetManagementPage";
import AdminRFQAnalyticsPage from "@/components/layout/AdminLayoute/RFQ/AdminRFQAnalyticsPage";
import AdminQuotationTemplatesPage from "@/components/layout/AdminLayoute/RFQ/AdminQuotationTemplatesPage";
import AdminRouteOptimizationPage from "@/components/layout/AdminLayoute/Fleet/AdminRouteOptimizationPage";

// import AdminCategoriesPage from "@/pages/admin/Products/AdminCategoriesPage";
// import AdminInventoryPage from "@/pages/admin/Products/AdminInventoryPage";
// import AdminUserDetailsPage from "@/pages/admin/Users/AdminUserDetailsPage";
// import AdminCorporateBuyersPage from "@/pages/admin/Users/AdminCorporateBuyersPage";
// import AdminPaymentsPage from "@/pages/admin/Payments/AdminPaymentsPage";
// import AdminInvoicesPage from "@/pages/admin/Payments/AdminInvoicesPage";
// import AdminReportsPage from "@/pages/admin/Reports/AdminReportsPage";
// import AdminSettingsPage from "@/pages/admin/Settings/AdminSettingsPage";
// import AdminDiscountsPage from "@/pages/admin/Marketing/AdminDiscountsPage";
// import AdminPromotionsPage from "@/pages/admin/Marketing/AdminPromotionsPage";

import type { ISidebarItem } from "@/types";

import {
  LayoutDashboard,
  ChartArea,
  ShoppingBag,
  PlusCircle,
  ClipboardList,
  Truck,
  FileSpreadsheet,
  // 🔥 নতুন আইকন
  Users,
  UserCog,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Package,
  MapPin,
  Route,
  Eye,
  Database,
  FileBarChart,
  ShieldCheck,
  MessageSquare,
  Copy,
  TrendingUp,
  Store,
} from "lucide-react";
import AdminUsersPage from "@/components/layout/AdminLayoute/User/AdminUsersPage";
import AdminUserDetailsPage from "@/components/layout/AdminLayoute/User/AdminUserDetailsPage";
import AdminCorporateBuyersPage from "@/components/layout/AdminLayoute/User/AdminCorporateBuyersPage";
import AdminSettingsPage from "@/components/layout/AdminLayoute/Settings/AdminSettingsPage";
import AdminRFQRequests from "@/components/layout/AdminLayoute/AdminRFQRequests/AdminRFQRequests";
import AdminContactPage from "@/components/layout/AdminLayoute/Contact/AdminContactPage";

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
        component: AdminOverviewPage, // TODO: Create AdminAnalyticsPage
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

  {
    title: "Message Management",
    url: "#",
    items: [
      {
        title: "message",
        url: "/admin/message",
        component: AdminContactPage,
        icon: ClipboardList,
      },
    ],
  },

  // ============================================
  // 📦 SECTION 2: ORDER MANAGEMENT
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
        component: AdminOrderTrack, // TODO: Create AdminBulkOrdersPage
        icon: Copy,
      },
    ],
  },

  // ============================================
  // 🚚 SECTION 3: FLEET & SHIPMENT TRACKING
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
        component: AdminRouteOptimizationPage, // TODO: Create AdminRouteOptimizationPage
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
  // 📝 SECTION 4: RFQ MANAGEMENT
  // ============================================
  {
    title: "RFQ & Quotations",
    url: "#",
    items: [
      {
        title: "RFQ Requests",
        url: "/admin/quotations",  // 🔥 Main RFQ List
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
  // 🏷️ SECTION 5: PRODUCT & INVENTORY
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
      // {
      //   title: "Categories",
      //   url: "/admin/categories",
      //   component: AdminCategoriesPage,
      //   icon: Layers,
      // },
      // {
      //   title: "Inventory",
      //   url: "/admin/inventory",
      //   component: AdminInventoryPage,
      //   icon: Boxes,
      // },
      {
        title: "Bulk Import",
        url: "/admin/products/import",
        component: Allproduct, // TODO: Create AdminBulkImportPage
        icon: Database,
      },
      {
        title: "Product Reviews",
        url: "/admin/reviews",
        component: Allproduct, // TODO: Create AdminReviewsPage
        icon: MessageSquare,
      },
    ],
  },

  // ============================================
  // 👥 SECTION 6: USER MANAGEMENT
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
      
  //     {
  //       title: "User Analytics",
  //       url: "/admin/users/analytics",
  //       component: AdminUsersPage, // TODO: Create AdminUserAnalyticsPage
  //       icon: TrendingUp,
  //     },
    ],
  },

  // ============================================
  // 💰 SECTION 7: PAYMENTS & INVOICES
  // ============================================
  // {
  //   title: "Payments & Invoices",
  //   url: "#",
  //   items: [
  //     {
  //       title: "Transactions",
  //       url: "/admin/payments",
  //       component: AdminPaymentsPage,
  //       icon: CreditCard,
  //     },
  //     {
  //       title: "Invoices",
  //       url: "/admin/invoices",
  //       component: AdminInvoicesPage,
  //       icon: Receipt,
  //     },
  //     {
  //       title: "Refund Management",
  //       url: "/admin/refunds",
  //       component: AdminPaymentsPage, // TODO: Create AdminRefundsPage
  //       icon: RefreshCw,
  //     },
  //   ],
  // },

  // ============================================
  // 📊 SECTION 8: REPORTS
  // ============================================





  // {
  //   title: "Reports & Analytics",
  //   url: "#",
  //   items: [
  //     {
  //       title: "Sales Report",
  //       url: "/admin/reports/sales",
  //       component: AdminReportsPage,
  //       icon: TrendingUp,
  //     },
  //     {
  //       title: "Product Report",
  //       url: "/admin/reports/products",
  //       component: AdminReportsPage,
  //       icon: Store,
  //     },
  //     {
  //       title: "Shipment Report",
  //       url: "/admin/reports/shipments",
  //       component: AdminReportsPage,
  //       icon: Truck,
  //     },
  //     {
  //       title: "Financial Report",
  //       url: "/admin/reports/financial",
  //       component: AdminReportsPage,
  //       icon: FileBarChart,
  //     },
  //   ],
  // },

  // ============================================
  // 🎯 SECTION 9: MARKETING & PROMOTIONS
  // ============================================
  // {
  //   title: "Marketing & Promotions",
  //   url: "#",
  //   items: [
  //     {
  //       title: "Discounts & Coupons",
  //       url: "/admin/discounts",
  //       component: AdminDiscountsPage,
  //       icon: Tag,
  //     },
  //     {
  //       title: "Promotions",
  //       url: "/admin/promotions",
  //       component: AdminPromotionsPage,
  //       icon: Megaphone,
  //     },
  //     {
  //       title: "Banners",
  //       url: "/admin/banners",
  //       component: AdminPromotionsPage, // TODO: Create AdminBannersPage
  //       icon: Image,
  //     },
  //     {
  //       title: "Email Campaigns",
  //       url: "/admin/campaigns",
  //       component: AdminPromotionsPage, // TODO: Create AdminCampaignsPage
  //       icon: Mail,
  //     },
  //     {
  //       title: "Newsletter",
  //       url: "/admin/newsletter",
  //       component: AdminPromotionsPage, // TODO: Create AdminNewsletterPage
  //       icon: BellRing,
  //     },
  //   ],
  // },

  // ============================================
  // ⚙️ SECTION 10: SYSTEM SETTINGS
  // ============================================





  // {
  //   title: "System Settings",
  //   url: "#",
  //   items: [
  //     {
  //       title: "General Settings",
  //       url: "/admin/settings",
  //       component: AdminSettingsPage,
  //       icon: Settings,
  //     },
  //     // {
  //     //   title: "Shipping Settings",
  //     //   url: "/admin/settings/shipping",
  //     //   component: AdminSettingsPage, // TODO: Create AdminShippingSettingsPage
  //     //   icon: Truck,
  //     // },
  //     // {
  //     //   title: "Tax Settings",
  //     //   url: "/admin/settings/tax",
  //     //   component: AdminSettingsPage, // TODO: Create AdminTaxSettingsPage
  //     //   icon: Receipt,
  //     // },
  //     // {
  //     //   title: "Security",
  //     //   url: "/admin/settings/security",
  //     //   component: AdminSettingsPage, // TODO: Create AdminSecurityPage
  //     //   icon: ShieldCheck,
  //     // },
  //   ],
  // },
];