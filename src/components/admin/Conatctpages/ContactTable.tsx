// src/components/admin/Contact/ContactTable.tsx
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
  MoreVertical,
  Eye,
  MessageSquare,
  Trash2,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  NEW: {
    label: "New",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Loader2,
  },
  REPLIED: {
    label: "Replied",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    icon: MessageSquare,
  },
  RESOLVED: {
    label: "Resolved",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Closed",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    icon: XCircle,
  },
};

const PRIORITY_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  standard: {
    label: "Standard",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  urgent: {
    label: "Urgent",
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  critical: {
    label: "Critical",
    color: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

interface ContactTableProps {
  contacts: any[];
  onView: (contact: any) => void;
  onDelete: (contact: any) => void;
}

export default function ContactTable({
  contacts,
  onView,
  onDelete,
}: ContactTableProps) {
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
    const config = PRIORITY_CONFIG[priority];
    if (!config) return null;
    return (
      <Badge
        className={cn("text-[10px] font-medium border", config.color)}
        variant="outline"
      >
        {config.label}
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

  if (contacts.length === 0) {
    return (
      <div className="border rounded-xl bg-card shadow-sm py-12">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MessageCircle className="h-12 w-12 text-muted-foreground/30" />
          <p>No contact messages found</p>
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
            <TableHead className="font-semibold">Ticket</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">
              Message
            </TableHead>
            <TableHead className="font-semibold">Priority</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((item: any) => (
            <TableRow
              key={item._id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onView(item)}
            >
              <TableCell>
                <div className="font-mono text-sm font-semibold text-primary">
                  {item.ticketNumber}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {formatDate(item.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.company}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="max-w-[250px] truncate" title={item.message}>
                  {item.message?.slice(0, 80)}
                  {item.message?.length > 80 ? "..." : ""}
                </div>
              </TableCell>
              <TableCell>{getPriorityBadge(item.priority)}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onView(item)}
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
                      <DropdownMenuItem onClick={() => onView(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View & Reply
                      </DropdownMenuItem>
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