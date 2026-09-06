import { 
  useGetAllShipmentsQuery, 
  useCreateShipmentTrackingMutation,
  useUpdateShipmentStatusMutation 
} from "@/redux/features/admin/admin.api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Loader2, Plus, Truck, PackageCheck } from "lucide-react";

export default function AdminShipmentTracking() {
  const { data: shipmentData, isLoading } = useGetAllShipmentsQuery(undefined);
  const [createShipment, { isLoading: isCreating }] = useCreateShipmentTrackingMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateShipmentStatusMutation();

  const [trackingId, setTrackingId] = useState("");
  const [destination, setDestination] = useState("");

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId || !destination) return;

    try {
      await createShipment({ trackingId, destination, status: "Dispatched" }).unwrap();
      setTrackingId("");
      setDestination("");
    } catch (err) {
      console.error("Failed to create tracking:", err);
    }
  };

  const handleStatusUpdate = async (tId: string, status: string) => {
    try {
      await updateStatus({ trackingId: tId, status }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const shipments = shipmentData?.data || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fleet & Shipment Logistics</h1>
        <p className="text-sm text-muted-foreground">Create tracking IDs and update real-time dispatch status.</p>
      </div>

      {/* NEW SHIPMENT FORM */}
      <form onSubmit={handleCreateShipment} className="p-4 border rounded-xl bg-card flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Tracking ID (e.g. TRK-8890)"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Destination City / Port"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="max-w-xs"
        />
        <Button disabled={isCreating} className="bg-[#0F52BA] hover:bg-[#0b3e8f]">
          {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 mr-1" />}
          Create Tracking
        </Button>
      </form>

      {/* SHIPMENT TABLE */}
      <div className="border rounded-xl bg-card shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update Logistics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No active shipments found.
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((item: any) => (
                  <TableRow key={item._id || item.trackingId}>
                    <TableCell className="font-bold text-primary">{item.trackingId}</TableCell>
                    <TableCell>{item.destination}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.status || "In-Transit"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(item.trackingId, "In-Transit")}
                        className="h-8 gap-1"
                      >
                        <Truck className="size-3.5" /> In-Transit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => handleStatusUpdate(item.trackingId, "Delivered")}
                        className="h-8 gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                      >
                        <PackageCheck className="size-3.5" /> Delivered
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}