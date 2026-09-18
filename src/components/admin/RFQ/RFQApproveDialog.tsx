// src/components/admin/RFQ/RFQApproveDialog.tsx
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";

interface RFQApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: any;
  isUpdating: boolean;
  onConfirm: (note: string, price: string) => void;
}

export default function RFQApproveDialog({
  open,
  onOpenChange,
  rfq,
  isUpdating,
  onConfirm,
}: RFQApproveDialogProps) {
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNote("");
      setPrice("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Approve RFQ
          </DialogTitle>
          <DialogDescription>
            Approve this RFQ request. You can add notes and set a quoted price.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {rfq && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">{rfq.companyName}</p>
              <p className="text-xs text-muted-foreground">{rfq.workEmail}</p>
              <p className="text-xs text-muted-foreground">{rfq.rfqNumber}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quoted Price (Optional)</label>
            <Input
              type="number"
              placeholder="Enter quoted price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Note (Optional)</label>
            <Textarea
              placeholder="Add notes about this approval..."
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
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onConfirm(note, price)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve RFQ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}