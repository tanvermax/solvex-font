// src/components/layout/AdminLayoute/Shipment/AdminShipmentsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  RefreshCw,
  Package,
  AlertCircle,
} from "lucide-react";
import {
  useGetAllShipmentsQuery,
  useGetShipmentStatsQuery,
  type Shipment,
  type ShipmentStatus,
} from "@/redux/features/shipment/shipment.api";
import ShipmentStatsCards from "@/components/shipment/ShipmentStatsCards";
import ShipmentFilters from "@/components/shipment/ShipmentFilters";
import ShipmentTable from "@/components/shipment/ShipmentTable";
import ShipmentStatusUpdateDialog from "@/components/shipment/ShipmentStatusUpdateDialog";

export default function AdminShipmentsPage() {
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [page, setPage] = useState(1);

  // Dialog state
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // API
  const {
    data: shipmentsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllShipmentsQuery({
    search: search || undefined,
    status: status !== "ALL" ? (status as ShipmentStatus) : undefined,
    priority: priority !== "ALL" ? (priority as any) : undefined,
    page,
    limit: 20,
  });

  const { data: statsData, isLoading: statsLoading } = useGetShipmentStatsQuery();

  
  const shipments = shipmentsData?.data || [];
  const meta = shipmentsData?.meta;

  const handleClearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setPage(1);
  };

  const handleStatusCardClick = (statusKey: string) => {
    setStatus(statusKey === "ALL" ? "ALL" : statusKey);
    setPage(1);
  };

  const handleViewDetails = (shipment: Shipment) => {
    navigate(`/admin/shipments/${shipment._id}`);
  };

  const handleUpdateStatus = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setStatusDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Shipment Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage all shipments in your logistics network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/admin/shipments/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <ShipmentStatsCards
        stats={statsData?.data}
        isLoading={statsLoading}
        activeStatus={status}
        onStatusClick={handleStatusCardClick}
      />

      {/* ===== FILTERS ===== */}
      <ShipmentFilters
      
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(v) => {
          setPriority(v);
          setPage(1);
        }}
        onClear={handleClearFilters}
      />

      {/* ===== TABLE ===== */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">No Shipments Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {search || status !== "ALL" || priority !== "ALL"
                  ? "Try adjusting your filters"
                  : "Create your first shipment to get started"}
              </p>
              {(search || status !== "ALL" || priority !== "ALL") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <ShipmentTable
                shipments={shipments}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
              />

              {/* Pagination */}
              {meta && meta.totalPage > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <span className="text-xs font-medium px-3">
                      Page {page} of {meta.totalPage}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= meta.totalPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ===== STATUS UPDATE DIALOG ===== */}
      <ShipmentStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        shipmentId={selectedShipment?._id}
        currentStatus={selectedShipment?.currentStatus as ShipmentStatus}
        trackingId={selectedShipment?.trackingId}
      />
    </div>
  );
}