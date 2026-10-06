// src/components/layout/AdminLayoute/Shipment/components/ShipmentDetailsHeader.tsx
import { ArrowLeft, Edit, Trash2, Printer, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { Shipment } from "@/redux/features/shipment/shipment.api";
import ShipmentStatusBadge, { ShipmentStatus } from "@/components/shipment/ShipmentStatusBadge";

interface Props {
  shipment: Shipment;
  onEdit: () => void;
  onUpdateStatus: () => void;
  onDelete?: () => void;
}

export default function ShipmentDetailsHeader({
  shipment,
  onEdit,
  onUpdateStatus,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/shipments")}
          className="rounded-full shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-tight">
              {shipment.trackingId}
            </h1>
            <ShipmentStatusBadge
              status={shipment.currentStatus as ShipmentStatus}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Order: <span className="font-medium text-foreground">{shipment.orderNumber}</span>
            {" · "}
            Created: {new Date(shipment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pl-14">
        <Button size="sm" onClick={onUpdateStatus}>
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Update Status
        </Button>
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Edit Details
        </Button>
        <Button size="sm" variant="outline">
          <Printer className="h-3.5 w-3.5 mr-1.5" />
          Print Label
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            window.open(
              `/track-shipment?trackingId=${shipment.trackingId}`,
              "_blank"
            )
          }
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Public View
        </Button>
        {onDelete && (
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10 ml-auto"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete
          </Button>
        )}
      </div>

      <Separator />
    </div>
  );
}