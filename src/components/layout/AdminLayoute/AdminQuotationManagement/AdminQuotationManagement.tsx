import { 
  useGetAllQuotationsQuery, 
  useUpdateQuotationStatusMutation 
} from "@/redux/features/admin/admin.api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AdminQuotationManagement() {
  const { data: quotationData, isLoading } = useGetAllQuotationsQuery(undefined);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateQuotationStatusMutation();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const quotations = quotationData?.data || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quotation (RFQ) Requests</h1>
        <p className="text-sm text-muted-foreground">Manage and respond to buyer B2B bulk purchase quotes.</p>
      </div>

      <div className="border rounded-xl bg-card shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer / Company</TableHead>
                <TableHead>Product / Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No quotation requests found.
                  </TableCell>
                </TableRow>
              ) : (
                quotations.map((item: any) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      <div>{item.companyName || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                    </TableCell>
                    <TableCell>{item.productName || item.product}</TableCell>
                    <TableCell>{item.quantity} Units</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Approved" ? "default" : item.status === "Rejected" ? "destructive" : "outline"}>
                        {item.status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(item._id, "Approved")}
                        className="h-8 gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50"
                      >
                        <CheckCircle2 className="size-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(item._id, "Rejected")}
                        className="h-8 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="size-3.5" /> Reject
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