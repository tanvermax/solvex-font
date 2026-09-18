// src/components/admin/RFQ/RFQRejectDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, Loader2 } from "lucide-react";

interface RFQRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: any;
  isUpdating: boolean;
  onConfirm: (note: string) => void;
}

export default function RFQRejectDialog({
  open,
  onOpenChange,
  rfq,
  isUpdating,
  onConfirm,
}: RFQRejectDialogProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setNote("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            Reject RFQ
          </DialogTitle>
          <DialogDescription>
            Reject this RFQ request. Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {rfq && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">{rfq.companyName}</p>
              <p className="text-xs text-muted-foreground">{rfq.workEmail}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Rejection</label>
            <Textarea
              placeholder="Please provide a reason for rejection..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => onConfirm(note)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Rejecting...
              </>
            ) : (
              "Reject RFQ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}