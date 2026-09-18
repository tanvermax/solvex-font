// src/components/admin/Contact/ContactDetailsDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Building,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  User,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: any;
  onUpdateStatus: (status: string) => void;
  onReply: (message: string) => void;
  isUpdating: boolean;
  isReplying: boolean;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  NEW: {
    label: "New",
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  REPLIED: {
    label: "Replied",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
  RESOLVED: {
    label: "Resolved",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  CLOSED: {
    label: "Closed",
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  },
};

export default function ContactDetailsDialog({
  open,
  onOpenChange,
  contact,
  onUpdateStatus,
  onReply,
  isUpdating,
  isReplying,
}: ContactDetailsDialogProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [newStatus, setNewStatus] = useState(contact?.status || "NEW");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReply = () => {
    if (!replyMessage.trim()) return;
    onReply(replyMessage);
    setReplyMessage("");
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-mono">
                {contact.ticketNumber}
              </DialogTitle>
              <DialogDescription>
                Submitted on {formatDate(contact.createdAt)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {contact.priority && (
                <Badge
                  className={cn(
                    "text-xs border",
                    contact.priority === "critical"
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : contact.priority === "urgent"
                      ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  )}
                  variant="outline"
                >
                  {contact.priority.toUpperCase()}
                </Badge>
              )}
              <Badge
                className={cn(
                  "text-xs border",
                  STATUS_CONFIG[contact.status]?.color
                )}
                variant="outline"
              >
                {STATUS_CONFIG[contact.status]?.label || contact.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{contact.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-primary hover:underline"
                >
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${contact.phone}`}
                  className="text-primary hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{contact.company}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">{contact.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(contact.updatedAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Original Message */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Original Message
            </h4>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Previous Replies */}
          {contact.replies && contact.replies.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Previous Replies ({contact.replies.length})
                </h4>
                <div className="space-y-3">
                  {contact.replies.map((reply: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-green-600">
                          {reply.repliedByName || "Admin"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(reply.repliedAt)}
                        </span>
                      </div>
                      <p className="text-sm">{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Update Status */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Update Status
            </h4>
            <div className="flex gap-2">
              <Select
                value={newStatus}
                onValueChange={setNewStatus}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="REPLIED">Replied</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => onUpdateStatus(newStatus)}
                disabled={isUpdating || newStatus === contact.status}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>

          {/* Reply Box */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Send Reply
            </h4>
            <Textarea
              placeholder="Type your reply message here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="h-24 mb-3"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Reply will be saved to ticket and status will change to "Replied"
              </div>
              <Button
                onClick={handleReply}
                disabled={isReplying || !replyMessage.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {isReplying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}