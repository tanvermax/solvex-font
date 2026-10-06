// src/components/layout/AdminLayoute/Order/components/OrderStatusUpdateDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  useUpdateOrderStatusMutation,
  type OrderStatus,
} from "@/redux/features/order/Order.api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId?: string;
  currentStatus?: OrderStatus;
  orderNumber?: string;
}

// Backend transition rules — sync করা আছে
const AllowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["READY_TO_SHIP", "CANCELLED"],
  READY_TO_SHIP: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["IN_TRANSIT", "RETURNED"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "RETURNED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "RETURNED"],
  DELIVERED: ["COMPLETED", "RETURNED"],
  COMPLETED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: ["REFUNDED"],
  REFUNDED: [],
} as any;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  READY_TO_SHIP: "Ready to Ship",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
  REFUNDED: "Refunded",
};

export default function OrderStatusUpdateDialog({
  open,
  onOpenChange,
  orderId,
  currentStatus,
  orderNumber,
}: Props) {
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [note, setNote] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (open) {
      setNewStatus("");
      setNote("");
      setDeliveryNote("");
    }
  }, [open]);

  const availableStatuses = currentStatus
    ? AllowedTransitions[currentStatus] || []
    : [];

  const handleSubmit = async () => {
    if (!orderId || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      await updateStatus({
        id: orderId,
        data: {
          status: newStatus,
          note: note || undefined,
          deliveryNote: deliveryNote || undefined,
        },
      }).unwrap();

      toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Order:{" "}
            <span className="font-mono font-semibold">{orderNumber}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Current */}
          {currentStatus && (
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div>
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                  {STATUS_LABELS[currentStatus]}
                </span>
              </div>
            </div>
          )}

          {/* New Status */}
          <div className="space-y-2">
            <Label>New Status *</Label>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.length === 0 ? (
                  <div className="p-3 text-xs text-muted-foreground text-center">
                    No transitions available from current status
                  </div>
                ) : (
                  availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status] || status}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Note (Optional)</Label>
            <Textarea
              placeholder="Add a note about this status change..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-20 resize-none"
            />
          </div>

          {/* Delivery Note (if DELIVERED) */}
          {newStatus === "DELIVERED" && (
            <div className="space-y-2">
              <Label>Delivery Note (Optional)</Label>
              <Input
                placeholder="e.g., Received by Md. Karim"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !newStatus}
          >
            {isLoading ? (
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}