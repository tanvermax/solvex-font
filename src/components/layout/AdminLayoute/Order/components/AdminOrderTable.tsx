// src/components/layout/AdminLayoute/Order/components/AdminOrderTable.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Loader2,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useDeleteOrderMutation,
  type Order,
  type OrderStatus,
} from "@/redux/features/order/Order.api";

// Status config
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  PROCESSING: {
    label: "Processing",
    icon: RefreshCw,
    className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  },
  READY_TO_SHIP: {
    label: "Ready to Ship",
    icon: Package,
    className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    className: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  },
  IN_TRANSIT: {
    label: "In Transit",
    icon: Truck,
    className: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: Package,
    className: "bg-pink-500/10 text-pink-600 border-pink-500/30",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-emerald-600/10 text-emerald-700 border-emerald-600/30",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 border-red-500/30",
  },
  RETURNED: {
    label: "Returned",
    icon: RefreshCw,
    className: "bg-red-500/10 text-red-600 border-red-500/30",
  },
  REFUNDED: {
    label: "Refunded",
    icon: RefreshCw,
    className: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  },
};

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  UNPAID: "bg-red-500/10 text-red-600 border-red-500/30",
  PARTIAL: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  REFUNDED: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

interface Props {
  orders: Order[];
}

export default function AdminOrderTable({ orders }: Props) {
  const navigate = useNavigate();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (order: Order) => {
    if (
      !confirm(
        `Delete order ${order.orderNumber}?\n\nThis cannot be undone.`
      )
    )
      return;

    setDeletingId(order._id);
    try {
      await deleteOrder(order._id).unwrap();
      toast.success("Order deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Order number copied");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount: number) =>
    `৳${amount.toLocaleString()}`;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead className="hidden md:table-cell">Customer</TableHead>
            <TableHead className="hidden lg:table-cell">Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Payment</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.orderStatus] || {
              label: order.orderStatus,
              icon: Clock,
              className: "",
            };
            const StatusIcon = statusConfig.icon;
            const isDeletingThis = deletingId === order._id;

            return (
              <TableRow
                key={order._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/admin/orders/${order._id}`)}
              >
                {/* Order Number */}
                <TableCell>
                  <div>
                    <p className="font-mono text-xs font-semibold text-primary">
                      {order.orderNumber}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </TableCell>

                {/* Customer */}
                <TableCell className="hidden md:table-cell">
                  <div>
                    <p className="font-medium text-sm truncate max-w-[150px]">
                      {order.companyInfo?.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {order.companyInfo?.email}
                    </p>
                  </div>
                </TableCell>

                {/* Items */}
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className="text-xs">
                    {order.items?.length || 0} items
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] gap-1 font-medium",
                      statusConfig.className
                    )}
                  >
                    <StatusIcon className="h-2.5 w-2.5" />
                    {statusConfig.label}
                  </Badge>
                </TableCell>

                {/* Payment */}
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-medium",
                      PAYMENT_STATUS_CLASS[order.paymentStatus] || ""
                    )}
                  >
                    {order.paymentStatus}
                  </Badge>
                </TableCell>

                {/* Total */}
                <TableCell className="text-right">
                  <span className="font-bold text-sm">
                    {formatCurrency(order.grandTotal)}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          {isDeletingThis ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleCopyNumber(order.orderNumber)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Number
                        </DropdownMenuItem>

                        {order.shipmentTrackingIds &&
                          order.shipmentTrackingIds.length > 0 && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  `/track-shipment?trackingId=${order.shipmentTrackingIds?.[0]}`,
                                  "_blank"
                                )
                              }
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Shipment
                            </DropdownMenuItem>
                          )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(order)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}