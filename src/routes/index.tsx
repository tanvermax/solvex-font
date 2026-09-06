// routes/index.tsx
import App from "@/App";
import DashbordLayout from "@/components/layout/DashbordLayout";
import About from "@/pages/About";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Veryfy from "@/pages/Veryfy";
import { genarateRoutes } from "@/utils/genarateRoutes";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItem } from "./adminSideberitem";
import { userSidebarItem } from "./userSIdebarItem";
import DeluxeError from "@/components/ErrorComponent/Error";
import ProductDetails from "@/components/layout/HomeLayout/ProductCard/ProductDetails";
import CartPage from "@/components/layout/HomeLayout/Cart/Cart";
import Help from "@/pages/Help/Help";
import HomeShope from "@/components/layout/HomeShope/HomeShope";
import EditProduct from "@/components/layout/AdminLayoute/AddProduct/EditProduct";
import ProductsPage from "@/pages/Products/ProductsPage";
import SourcingPage from "@/pages/Sourching/Sourching";
import IndustriesPage from "@/pages/IndustriesPage/IndustriesPage";
import RFQPage from "@/pages/Rfq/Rfq";
import TrackShipmentPage from "@/pages/TrackShipment/TrackShipmentPage";
import ContactPage from "@/pages/ContactUs/ContactPage";

// 🔥 Import Route Guards
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";

const router = createBrowserRouter([
    // ===== PUBLIC ROUTES =====
    {
        Component: App,
        errorElement: <DeluxeError />,
        path: "/",
        children: [
            {
                path: "about",
                Component: About,
            },
            {
                path: "shop",
                Component: HomeShope,
            }, 
            {
                path: "cart",
                Component: CartPage,
            },
            {
                path:"products",
                Component:ProductsPage
            },
            {
                path:"contactus",
                Component:ContactPage
            },
            {
                path:"sourcing",
                Component:SourcingPage
            },
            {
                path:"industries",
                Component:IndustriesPage
            },
            {
                path:"rfq",
                Component:RFQPage
            },
            {
                path: "/",
                Component: Home,
            },
            {
                path:"alldata/:id",
                Component:ProductDetails
            },
            {
                path:"ordertrack",
                Component:TrackShipmentPage
            },
            {
                path:"help",
                Component:Help
            },
            // 🔥 Edit Product - Admin only (but we'll protect it with AdminRoute)
            {
                path: "/admin/products/edit/:id",
                Component: EditProduct,
            }
        ]
    },

    // ===== 🔥 ADMIN ROUTES (Protected with AdminRoute) =====
    {
        path: "/admin",
        element: <AdminRoute />,  // 🔥 Admin Guard - only ADMIN/SUPER_ADMIN can access
        errorElement: <DeluxeError />,
        children: [
            {
                element: <DashbordLayout />,  // Use DashbordLayout for admin
                children: [...genarateRoutes(adminSidebarItem)],
            }
        ],
    },

    // ===== 🔥 USER ROUTES (Protected with ProtectedRoute) =====
    {
        path: "/user",
        element: <ProtectedRoute />,  // 🔥 General Auth Guard - any logged in user
        errorElement: <DeluxeError />,
        children: [
            {
                element: <DashbordLayout />,  // Use DashbordLayout for user
                children: [...genarateRoutes(userSidebarItem)],
            }
        ],
    },

    // ===== 🔥 AUTH ROUTES (Public) =====
    {
        Component: Login,
        path: "/login",
        errorElement: <DeluxeError />,
    },
    {
        Component: Register,
        path: "/register",
        errorElement: <DeluxeError />,
    },
    {
        Component: Veryfy,
        path: "/verify",
        errorElement: <DeluxeError />,
    },

    // ===== 🔥 REDIRECT: Unknown routes to home =====
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
]);

export default router;