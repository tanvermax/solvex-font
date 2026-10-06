// src/components/layout/AdminLayoute/Shipment/components/ShipmentStatusUpdateDialog.tsx
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUpdateShipmentStatusMutation } from "@/redux/features/shipment/shipment.api";
import ShipmentStatusBadge, {
  SHIPMENT_STATUS_CONFIG,
  type ShipmentStatus,
} from "./ShipmentStatusBadge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId?: string;
  currentStatus?: ShipmentStatus;
  trackingId?: string;
}

// 🔥 Allowed transitions (backend-এর সাথে sync)
const AllowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
  PENDING: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "RETURNED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED"],
  RETURNED: [],
  CANCELLED: [],
};

export default function ShipmentStatusUpdateDialog({
  open,
  onOpenChange,
  shipmentId,
  currentStatus,
  trackingId,
}: Props) {
  const [newStatus, setNewStatus] = useState<ShipmentStatus | "">("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [updateStatus, { isLoading }] = useUpdateShipmentStatusMutation();

  // Reset on open
  useEffect(() => {
    if (open) {
      setNewStatus("");
      setLocation("");
      setNote("");
    }
  }, [open]);

  const availableStatuses = currentStatus
    ? AllowedTransitions[currentStatus] || []
    : [];

  const handleSubmit = async () => {
    if (!shipmentId || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      await updateStatus({
        id: shipmentId,
        data: {
          status: newStatus,
          location: location || undefined,
          note: note || undefined,
        },
      }).unwrap();

      toast.success(`Status updated to ${SHIPMENT_STATUS_CONFIG[newStatus].label}`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Shipment Status</DialogTitle>
          <DialogDescription>
            Tracking I: <span className="font-mono">{trackingId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Current Status */}
          {currentStatus && (
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div>
                <ShipmentStatusBadge status={currentStatus} />
              </div>
            </div>
          )}

          {/* New Status */}
          <div className="space-y-2">
            <Label>New Status *</Label>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as ShipmentStatus)}
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
                      {SHIPMENT_STATUS_CONFIG[status].label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location (Optional)</Label>
            <Input
              placeholder="e.g., Dhaka Sorting Hub"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
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
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}