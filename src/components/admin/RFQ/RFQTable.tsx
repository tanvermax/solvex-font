// src/components/admin/RFQ/RFQTable.tsx
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  Send,
  MoreVertical,
  Trash2,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: AlertCircle,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
  },
  QUOTED: {
    label: "Quoted",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: Send,
  },
  CONVERTED_TO_ORDER: {
    label: "Converted",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    icon: CheckCircle2,
  },
};

interface RFQTableProps {
  rfqs: any[];
  onApprove: (rfq: any) => void;
  onReject: (rfq: any) => void;
  onDelete: (rfq: any) => void;
  isUpdating: boolean;
}

export default function RFQTable({
  rfqs,
  onApprove,
  onReject,
  onDelete,
  isUpdating,
}: RFQTableProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status];
    if (!config) return <Badge variant="outline">{status}</Badge>;
    const Icon = config.icon;
    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 font-medium border",
          config.color
        )}
        variant="outline"
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; color: string }> = {
      URGENT: { label: "Urgent", color: "bg-red-500/10 text-red-600 border-red-500/20" },
      HIGH: { label: "High", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
      STANDARD: { label: "Standard", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    };
    const item = config[priority];
    if (!item) return null;
    return (
      <Badge className={cn("text-[10px] font-medium border", item.color)} variant="outline">
        {item.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (rfqs.length === 0) {
    return (
      <div className="border rounded-xl bg-card shadow-sm py-12">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <FileSpreadsheet className="h-12 w-12 text-muted-foreground/30" />
          <p>No RFQ requests found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">RFQ #</TableHead>
            <TableHead className="font-semibold">Company / Buyer</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Product Details</TableHead>
            <TableHead className="font-semibold text-center">Quantity</TableHead>
            <TableHead className="font-semibold hidden lg:table-cell">Priority</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rfqs.map((item: any) => (
            <TableRow
              key={item._id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => navigate(`/admin/quotations/${item._id}`)}
            >
              <TableCell>
                <div className="font-mono text-sm font-semibold text-primary">
                  {item.rfqNumber || `RFQ-${item._id?.slice(0, 6)}`}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {formatDate(item.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{item.companyName || "N/A"}</div>
                <div className="text-xs text-muted-foreground">{item.workEmail}</div>
                <div className="text-xs text-muted-foreground">{item.phone}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="max-w-[200px] truncate" title={item.productDetails}>
                  {item.productDetails?.slice(0, 60)}
                  {item.productDetails?.length > 60 ? "..." : ""}
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">
                {item.quantity}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {getPriorityBadge(item.priority)}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(item.status === "PENDING" || item.status === "UNDER_REVIEW") && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => onApprove(item)}
                        className="h-8 gap-1 border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => onReject(item)}
                        className="h-8 gap-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reject</span>
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/admin/quotations/${item._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(`/admin/quotations/${item._id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {(item.status === "PENDING" || item.status === "UNDER_REVIEW") && (
                        <>
                          <DropdownMenuItem onClick={() => onApprove(item)}>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(item)}>
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}