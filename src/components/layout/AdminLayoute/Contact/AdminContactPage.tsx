// src/pages/admin/Contact/AdminContactPage.tsx
import { useState } from "react";
import { RefreshCw, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  useGetAllContactsQuery,
  useGetContactStatsQuery,
  useUpdateContactStatusMutation,
  useReplyToContactMutation,
  useDeleteContactMutation,
} from "@/redux/features/contact/contact.api";
import ContactStatsCards from "@/components/admin/Conatctpages/ContactStatsCards";
import ContactFilters from "@/components/admin/Conatctpages/ContactFilters";
import ContactTable from "@/components/admin/Conatctpages/ContactTable";
import ContactDetailsDialog from "@/components/admin/Conatctpages/ContactDetailsDialog";
import ContactDeleteDialog from "@/components/admin/Conatctpages/ContactDeleteDialog";

export default function AdminContactPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 🔥 API Hooks
  const {
    data: contactsData,
    isLoading,
    refetch,
  } = useGetAllContactsQuery({
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
    search: searchTerm || undefined,
  });

  const { data: statsData } = useGetContactStatsQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateContactStatusMutation();
  const [replyToContact, { isLoading: isReplying }] =
    useReplyToContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const contacts = contactsData?.data || [];
  const stats = statsData?.data || {
    total: 0,
    newCount: 0,
    inProgress: 0,
    replied: 0,
    resolved: 0,
    critical: 0,
  };

  // 🔥 Handle Status Update
  const handleUpdateStatus = async (status: string) => {
    if (!selectedContact) return;
    try {
      await updateStatus({
        id: selectedContact._id,
        status,
      }).unwrap();
      toast.success("Status updated successfully");
      // Update local selected contact
      setSelectedContact({ ...selectedContact, status });
      refetch();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  // 🔥 Handle Reply
  const handleReply = async (message: string) => {
    if (!selectedContact) return;
    try {
      const result = await replyToContact({
        id: selectedContact._id,
        message,
      }).unwrap();
      toast.success("Reply sent successfully");
      // Update local state
      setSelectedContact({
        ...selectedContact,
        status: "REPLIED",
        replies: result.data.replies,
      });
      refetch();
    } catch (error: any) {
      console.error("Failed to send reply:", error);
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };

  // 🔥 Handle Delete
  const handleDelete = async () => {
    if (!selectedContact) return;
    try {
      await deleteContact(selectedContact._id).unwrap();
      toast.success("Contact deleted successfully");
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to delete contact:", error);
      toast.error(error?.data?.message || "Failed to delete contact");
    }
  };

  // Open Dialogs
  const openDetailsDialog = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailsDialogOpen(true);
  };

  const openDeleteDialog = (contact: any) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading contact messages...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-background/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Contact Messages
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage customer inquiries and support tickets
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
      <ContactStatsCards stats={stats} />

      {/* Filters */}
      <ContactFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Table */}
      <ContactTable
        contacts={contacts}
        onView={openDetailsDialog}
        onDelete={openDeleteDialog}
      />

      {/* Details & Reply Dialog */}
      <ContactDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        contact={selectedContact}
        onUpdateStatus={handleUpdateStatus}
        onReply={handleReply}
        isUpdating={isUpdating}
        isReplying={isReplying}
      />

      {/* Delete Dialog */}
      <ContactDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        contact={selectedContact}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}