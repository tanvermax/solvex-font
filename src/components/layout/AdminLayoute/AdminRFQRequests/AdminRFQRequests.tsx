// src/pages/admin/RFQ/AdminRFQRequests.tsx
import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  useGetAllRFQsQuery,
  useUpdateRFQStatusMutation,
  useDeleteRFQMutation,
} from "@/redux/features/rfq/rfq.api";

// 🔥 Import Reusable Components
import RFQStatsCards from "@/components/admin/RFQ/RFQStatsCards";
import RFQFilters from "@/components/admin/RFQ/RFQFilters";
import RFQTable from "@/components/admin/RFQ/RFQTable";
import RFQApproveDialog from "@/components/admin/RFQ/RFQApproveDialog";
import RFQRejectDialog from "@/components/admin/RFQ/RFQRejectDialog";
import RFQDeleteDialog from "@/components/admin/RFQ/RFQDeleteDialog";

export default function AdminRFQRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // API
  const {
    data: rfqData,
    isLoading,
    refetch,
  } = useGetAllRFQsQuery({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateRFQStatusMutation();
  const [deleteRFQ, { isLoading: isDeleting }] = useDeleteRFQMutation();

  const rfqs = (rfqData?.data as any) || [];

  // Stats
  const stats = {
    total: rfqs.length,
    pending: rfqs.filter((r: any) => r.status === "PENDING").length,
    approved: rfqs.filter((r: any) => r.status === "APPROVED").length,
    rejected: rfqs.filter((r: any) => r.status === "REJECTED").length,
    quoted: rfqs.filter((r: any) => r.status === "QUOTED").length,
  };

  // 🔥 Handle Approve
  const handleApprove = async (note: string, price: string) => {
    if (!selectedRFQ) return;
    try {
      const payload: any = {
        status: "APPROVED",
        adminNote: note || "Approved by admin",
      };
      if (price) payload.quotedPrice = parseFloat(price);
      
      console.log("payload", payload);
      console.log("selectedRFQ", selectedRFQ);

      await updateStatus({
        id: selectedRFQ._id,
        ...payload,
      }).unwrap();

      toast.success("RFQ approved successfully");
      setIsApproveDialogOpen(false);
      // 🔥 refetch না করে optimistic update
      refetch();
    } catch (err: any) {
      console.error("Failed to approve:", err);
      toast.error(err?.data?.message || "Failed to approve RFQ");
    }
  };

  // 🔥 Handle Reject
  const handleReject = async (note: string) => {
    if (!selectedRFQ) return;
    try {
      await updateStatus({
        id: selectedRFQ._id,
        status: "REJECTED",
        adminNote: note || "Rejected by admin",
      }).unwrap();

      toast.success("RFQ rejected successfully");
      setIsRejectDialogOpen(false);
      refetch();
    } catch (err: any) {
      console.error("Failed to reject:", err);
      toast.error(err?.data?.message || "Failed to reject RFQ");
    }
  };

  // 🔥 Handle Delete
  const handleDelete = async () => {
    if (!selectedRFQ) return;
    try {
      await deleteRFQ(selectedRFQ._id).unwrap();
      toast.success("RFQ deleted successfully");
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (err: any) {
      console.error("Failed to delete:", err);
      toast.error(err?.data?.message || "Failed to delete RFQ");
    }
  };

  // Open Dialogs
  const openApproveDialog = (rfq: any) => {
    setSelectedRFQ(rfq);
    setIsApproveDialogOpen(true);
  };

  const openRejectDialog = (rfq: any) => {
    setSelectedRFQ(rfq);
    setIsRejectDialogOpen(true);
  };

  const openDeleteDialog = (rfq: any) => {
    setSelectedRFQ(rfq);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading RFQ requests...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-background/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RFQ Requests</h1>
          <p className="text-sm text-muted-foreground">
            Manage and respond to buyer B2B bulk purchase RFQs
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <RFQStatsCards stats={stats} />

      {/* Filters */}
      <RFQFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Table */}
      <RFQTable
        rfqs={rfqs}
        onApprove={openApproveDialog}
        onReject={openRejectDialog}
        onDelete={openDeleteDialog}
        isUpdating={isUpdating}
      />

      {/* Dialogs */}
      <RFQApproveDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
        rfq={selectedRFQ}
        isUpdating={isUpdating}
        onConfirm={handleApprove}
      />

      <RFQRejectDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        rfq={selectedRFQ}
        isUpdating={isUpdating}
        onConfirm={handleReject}
      />

      <RFQDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        rfq={selectedRFQ}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
