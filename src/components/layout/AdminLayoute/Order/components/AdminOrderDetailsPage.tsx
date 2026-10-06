// src/components/layout/AdminLayoute/Order/AdminOrderDetailsPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Printer,
  Edit,
  Package,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Truck,
  CreditCard,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  type OrderStatus,
} from "@/redux/features/order/Order.api";
import OrderEditDialog from "./OrderEditDialog";
import OrderStatusUpdateDialog from "./OrderStatusUpdateDialog";


// Status config
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; className: string }
> = {
  PENDING: { label: "Pending", icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" },
  CONFIRMED: { label: "Confirmed", icon: CheckCircle, className: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  PROCESSING: { label: "Processing", icon: RefreshCw, className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" },
  READY_TO_SHIP: { label: "Ready to Ship", icon: Package, className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30" },
  SHIPPED: { label: "Shipped", icon: Truck, className: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  IN_TRANSIT: { label: "In Transit", icon: Truck, className: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: MapPin, className: "bg-pink-500/10 text-pink-600 border-pink-500/30" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  COMPLETED: { label: "Completed", icon: CheckCircle, className: "bg-emerald-600/10 text-emerald-700 border-emerald-600/30" },
  CANCELLED: { label: "Cancelled", icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/30" },
  RETURNED: { label: "Returned", icon: RefreshCw, className: "bg-red-500/10 text-red-600 border-red-500/30" },
  REFUNDED: { label: "Refunded", icon: RefreshCw, className: "bg-gray-500/10 text-gray-600 border-gray-500/30" },
};

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  UNPAID: "bg-red-500/10 text-red-600 border-red-500/30",
  PARTIAL: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  REFUNDED: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatCurrency = (amount: number) => `৳${amount?.toLocaleString() || 0}`;

export default function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(id!, { skip: !id });

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const order = response?.data;

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (isError || !order) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="p-12 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Order Not Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {(error as any)?.data?.message ||
                "The order you're looking for doesn't exist."}
            </p>
          </div>
          <Button onClick={() => navigate("/admin/orders")}>
            Back to Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusConfig = STATUS_CONFIG[order.orderStatus] || {
    label: order.orderStatus,
    icon: Clock,
    className: "",
  };
  const StatusIcon = statusConfig.icon;

  const handleDelete = async () => {
    if (!confirm(`Delete order ${order.orderNumber}? This cannot be undone.`)) return;

    try {
      await deleteOrder(order._id).unwrap();
      toast.success("Order deleted successfully");
      navigate("/admin/orders");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/orders")}
            className="rounded-full shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold font-mono">
                {order.orderNumber}
              </h1>
              <Badge
                variant="outline"
                className={cn("text-xs gap-1", statusConfig.className)}
              >
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  PAYMENT_STATUS_CLASS[order.paymentStatus] || ""
                )}
              >
                {order.paymentStatus}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pl-14 sm:pl-0">
          <Button size="sm" onClick={() => setStatusDialogOpen(true)}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Update Status
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button size="sm" variant="outline">
            <Printer className="h-3.5 w-3.5 mr-1.5" />
            Print
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <Separator />

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {formatCurrency(order.grandTotal)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Items</p>
            <p className="text-2xl font-bold mt-1">{order.items?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Paid / Due</p>
            <p className="text-lg font-bold mt-1">
              {formatCurrency(order.paidAmount)} /{" "}
              <span className="text-red-600">
                {formatCurrency(order.dueAmount)}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <p className="text-lg font-bold capitalize mt-1">
              {order.paymentMethod}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Order Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
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
                  {order.items?.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {item.productName}
                          </p>
                          {item.productSku && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              SKU: {item.productSku}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Totals */}
              <div className="border-t p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                )}
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(order.grandTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...(order.statusHistory || [])].reverse().map((entry, i) => {
                  const config = STATUS_CONFIG[entry.status] || {
                    label: entry.status,
                    icon: Clock,
                    className: "",
                  };
                  const Icon = config.icon;
                  const isLatest = i === 0;

                  return (
                    <div key={i} className="flex gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          isLatest
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 pb-4 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-medium text-sm">{config.label}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(entry.timestamp)}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {entry.note}
                          </p>
                        )}
                        {entry.changedByName && (
                          <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                            By: {entry.changedByName}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="font-semibold">
                  {order.companyInfo?.companyName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact Person</p>
                <p className="font-medium">
                  {order.companyInfo?.contactPerson}
                </p>
              </div>
              <div className="space-y-1 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">
                    {order.companyInfo?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{order.companyInfo?.phone}</span>
                </div>
                {order.companyInfo?.binOrTaxId && (
                  <div className="text-xs text-muted-foreground">
                    BIN/Tax ID: {order.companyInfo.binOrTaxId}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-medium">
                    {order.shippingAddress?.contactPerson}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress?.address}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress?.city}
                    {order.shippingAddress?.zone &&
                      `, ${order.shippingAddress.zone}`}
                  </p>
                  {order.shippingAddress?.phone && (
                    <p className="text-xs text-muted-foreground font-mono pt-1">
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment */}
          {order.shipmentTrackingIds &&
            order.shipmentTrackingIds.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {order.shipmentTrackingIds.map((tid) => (
                    <div
                      key={tid}
                      className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-lg"
                    >
                      <span className="font-mono text-xs">{tid}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          window.open(
                            `/track-shipment?trackingId=${tid}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* Notes */}
          {(order.customerNote || order.adminNote) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {order.customerNote && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Customer Note
                    </p>
                    <p className="text-muted-foreground">
                      {order.customerNote}
                    </p>
                  </div>
                )}
                {order.adminNote && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Admin Note
                    </p>
                    <p className="text-muted-foreground">{order.adminNote}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ==================== DIALOGS ==================== */}
      <OrderEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        order={order}
      />

      <OrderStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        orderId={order._id}
        currentStatus={order.orderStatus as OrderStatus}
        orderNumber={order.orderNumber}
      />
    </div>
  );
}