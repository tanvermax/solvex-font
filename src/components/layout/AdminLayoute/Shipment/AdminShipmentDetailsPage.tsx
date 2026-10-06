// src/components/layout/AdminLayoute/Shipment/AdminShipmentDetailsPage.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

import {
  useGetShipmentByIdQuery,
  useDeleteShipmentMutation,
  type Shipment,
  type ShipmentStatus,
} from "@/redux/features/shipment/shipment.api";

import ShipmentDetailsHeader from "./components/ShipmentDetailsHeader";
import ShipmentInfoCard from "./components/ShipmentInfoCard";
import ShipmentItemsCard from "./components/ShipmentItemsCard";
import ShipmentPackageCard from "./components/ShipmentPackageCard";
import ShipmentCarrierCard from "./components/ShipmentCarrierCard";
import ShipmentTimeline from "./components/ShipmentTimeline";
import ShipmentEditDialog from "./components/ShipmentEditDialog";
import { toast } from "sonner";
import ShipmentStatusUpdateDialog from "@/components/shipment/ShipmentStatusUpdateDialog";

export default function AdminShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // API
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetShipmentByIdQuery(id!, { skip: !id });

  const [deleteShipment, { isLoading: isDeleting }] = useDeleteShipmentMutation();

  const shipment = response?.data;

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
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================
  if (isError || !shipment) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="p-12 text-center space-y-4">
          <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Shipment Not Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {(error as any)?.data?.message ||
                "The shipment you're looking for doesn't exist or was deleted."}
            </p>
          </div>
          <Button onClick={() => navigate("/admin/shipments")}>
            Back to Shipments
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ============================================
  // DELETE
  // ============================================
  const handleDelete = async () => {
    if (!confirm(`Delete shipment ${shipment.trackingId}? This cannot be undone.`)) return;

    try {
      await deleteShipment(shipment._id).unwrap();
      toast.success("Shipment deleted");
      navigate("/admin/shipments");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete shipment");
    }
  };

  // ============================================
  // MAIN
  // ============================================
  return (
    <div className="space-y-5">
      {/* Header */}
      <ShipmentDetailsHeader
        shipment={shipment}
        onEdit={() => setEditDialogOpen(true)}
        onUpdateStatus={() => setStatusDialogOpen(true)}
        onDelete={handleDelete}
      />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main info */}
        <div className="lg:col-span-2 space-y-5">
          <ShipmentInfoCard shipment={shipment} />
          <ShipmentItemsCard shipment={shipment} />
          <ShipmentTimeline shipment={shipment} />
        </div>

        {/* Right — sidebar */}
        <div className="space-y-5">
          <ShipmentCarrierCard shipment={shipment} />
          <ShipmentPackageCard shipment={shipment} />
        </div>
      </div>

      {/* Dialogs */}
      <ShipmentEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        shipment={shipment}
      />

      <ShipmentStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        shipmentId={shipment._id}
        currentStatus={shipment.currentStatus as ShipmentStatus}
        trackingId={shipment.trackingId}
      />
    </div>
  );
}