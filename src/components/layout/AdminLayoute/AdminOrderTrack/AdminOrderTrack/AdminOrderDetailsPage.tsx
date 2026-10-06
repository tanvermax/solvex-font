// src/pages/admin/Orders/AdminOrderDetailsPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppSelector } from "@/redux/hook";
import { useCurrentUser } from "@/redux/features/auth/auth.slice";
import {
  ArrowLeft,
  Printer,
  Download,
  Edit,
  Truck,
  Package,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  FileText,
  MoreVertical,
  Send,
  UserCheck,
  UserX,
  Loader2,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

interface OrderAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  email?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  trackingId?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: string;
    date: string;
    note?: string;
    user?: string;
  }[];
}

// Status Configuration
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: Clock,
    variant: "warning",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: CheckCircle,
    variant: "info",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    icon: RefreshCw,
    variant: "info",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    icon: Truck,
    variant: "info",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    icon: Package,
    variant: "warning",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    icon: MapPin,
    variant: "warning",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle,
    variant: "success",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
    variant: "danger",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    icon: RefreshCw,
    variant: "default",
  },
};

const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: Clock,
  },
  PAID: {
    label: "Paid",
    color: "bg-green-500/10 text-green-500",
    icon: CheckCircle,
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-500/10 text-red-500",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-500/10 text-gray-500",
    icon: RefreshCw,
  },
};

// Mock Data - Replace with actual API call
const fetchOrderDetails = async (id: string): Promise<Order> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock order data
  return {
    id,
    orderNumber: `ORD-${String(Math.floor(100000 + Math.random() * 900000))}`,
    customer: {
      id: "cust-001",
      name: "Md. Shahidul Islam",
      email: "shahidul@example.com",
      phone: "+880 1712-345678",
    },
    items: [
      {
        id: "item-001",
        productId: "prod-001",
        productName: "Industrial Hydraulic Pump",
        sku: "IHP-2024-001",
        quantity: 2,
        price: 12500.0,
        total: 25000.0,
      },
      {
        id: "item-002",
        productId: "prod-002",
        productName: "Heavy Duty Steel Roller",
        sku: "HDSR-2024-002",
        quantity: 1,
        price: 8750.0,
        total: 8750.0,
      },
      {
        id: "item-003",
        productId: "prod-003",
        productName: "Industrial Grease 5L",
        sku: "IG-2024-003",
        quantity: 3,
        price: 450.0,
        total: 1350.0,
      },
    ],
    subtotal: 35100.0,
    shippingCost: 450.0,
    tax: 5265.0,
    discount: 1500.0,
    total: 39315.0,
    currency: "BDT",
    status: "IN_TRANSIT",
    paymentStatus: "PAID",
    paymentMethod: "bkash",
    shippingAddress: {
      street: "125, New Elephant Road",
      city: "Dhaka",
      state: "Dhaka",
      country: "Bangladesh",
      zipCode: "1205",
      phone: "+880 1712-345678",
      email: "shahidul@example.com",
    },
    billingAddress: {
      street: "125, New Elephant Road",
      city: "Dhaka",
      state: "Dhaka",
      country: "Bangladesh",
      zipCode: "1205",
      phone: "+880 1712-345678",
      email: "shahidul@example.com",
    },
    trackingId: "TRK-2026-09-08-001",
    trackingUrl: "https://tracking.example.com/TRK-2026-09-08-001",
    notes: "Please handle with care. Fragile items.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        status: "Order Placed",
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: "Order created by customer",
        user: "Customer",
      },
      {
        status: "Confirmed",
        date: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        note: "Order confirmed by admin",
        user: "Admin",
      },
      {
        status: "Processing",
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: "Processing started",
        user: "System",
      },
      {
        status: "Shipped",
        date: new Date(Date.now() - 86400000 * 0.5).toISOString(),
        note: "Dispatched from warehouse",
        user: "Admin",
      },
      {
        status: "In Transit",
        date: new Date(Date.now() - 86400000 * 0.25).toISOString(),
        note: "Package left sorting center",
        user: "System",
      },
    ],
  };
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppSelector(useCurrentUser);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState("");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Fetch order details
  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await fetchOrderDetails(id);
        setOrder(data);
        setNewStatus(data.status);
      } catch (error) {
        console.error("Failed to load order:", error);
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!order || !newStatus || newStatus === order.status) return;

    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedOrder = {
        ...order,
        status: newStatus as Order["status"],
        updatedAt: new Date().toISOString(),
        timeline: [
          ...order.timeline,
          {
            status: newStatus,
            date: new Date().toISOString(),
            note: statusNote || `Status changed to ${newStatus}`,
            user: user?.name || "Admin",
          },
        ],
      };

      setOrder(updatedOrder);
      setIsStatusDialogOpen(false);
      setStatusNote("");
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedOrder = {
        ...order,
        status: "CANCELLED" as Order["status"],
        updatedAt: new Date().toISOString(),
        timeline: [
          ...order.timeline,
          {
            status: "CANCELLED",
            date: new Date().toISOString(),
            note: statusNote || "Order cancelled by admin",
            user: user?.name || "Admin",
          },
        ],
      };

      setOrder(updatedOrder);
      setIsCancelDialogOpen(false);
      setStatusNote("");
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsUpdating(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order?.currency || "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status component
  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status];
    if (!config) return <Badge>{status}</Badge>;

    const Icon = config.icon;
    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
          config.color
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const PaymentStatusBadge = ({ status }: { status: string }) => {
    const config = PAYMENT_STATUS_CONFIG[status];
    if (!config) return <Badge>{status}</Badge>;

    const Icon = config.icon;
    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
          config.color
        )}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => navigate("/admin/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/orders")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Edit Button */}
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          {/* Print Button */}
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          {/* Download Button */}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                View Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={
                  order.status === "CANCELLED" || order.status === "DELIVERED"
                }
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(order.total)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Items
                </p>
                <p className="text-2xl font-bold">{order.items.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Payment
                </p>
                <p className="text-2xl font-bold capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Customer
                </p>
                <p className="text-lg font-semibold truncate max-w-[120px]">
                  {order.customer.name}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  {order.items.length} items in this order
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-medium">
                {formatCurrency(order.subtotal)}
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.sku}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.subtotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Shipping
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.shippingCost)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Tax
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.tax)}
                    </TableCell>
                  </TableRow>
                  {order.discount > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium text-green-600">
                        Discount
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        -{formatCurrency(order.discount)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="border-t-2 border-primary/20">
                    <TableCell
                      colSpan={3}
                      className="text-right font-bold text-lg"
                    >
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {formatCurrency(order.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the journey of this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-4">
                <div className="absolute left-3 top-3 h-[calc(100%-24px)] w-0.5 bg-border" />
                {order.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{event.status}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      {event.note && (
                        <p className="text-sm text-muted-foreground">
                          {event.note}
                        </p>
                      )}
                      {event.user && (
                        <p className="text-xs text-muted-foreground/70">
                          By: {event.user}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="space-y-6">
          {/* Update Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Change the order status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={newStatus}
                onValueChange={setNewStatus}
                disabled={
                  order.status === "CANCELLED" || order.status === "DELIVERED"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Add note about this status update..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="h-20"
              />

              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={
                  isUpdating ||
                  !newStatus ||
                  newStatus === order.status ||
                  order.status === "CANCELLED" ||
                  order.status === "DELIVERED"
                }
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Customer Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{order.customer.phone}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Shipping Address</p>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p>
                    {order.shippingAddress.country} -{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  {order.shippingAddress.phone && (
                    <p>Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Billing Address</p>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>{order.billingAddress.street}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}
                  </p>
                  <p>
                    {order.billingAddress.country} -{" "}
                    {order.billingAddress.zipCode}
                  </p>
                  {order.billingAddress.phone && (
                    <p>Phone: {order.billingAddress.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info Card */}
          {order.trackingId && (
            <Card>
              <CardHeader>
                <CardTitle>Tracking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Tracking ID:</span>
                  <span className="text-sm">{order.trackingId}</span>
                </div>
                {order.trackingUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      window.open(order.trackingUrl, "_blank")
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Track Shipment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes Card */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ===== CANCEL ORDER DIALOG ===== */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cancel Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for cancellation</Label>
              <Textarea
                placeholder="Please provide a reason for cancellation..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="h-24"
              />
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Warning:</strong> Cancelling this order will:
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>Refund the customer (if payment was made)</li>
                  <li>Restore product inventory</li>
                  <li>Remove this order from active processing</li>
                </ul>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}