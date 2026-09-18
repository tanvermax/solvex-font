// src/components/admin/RFQ/RFQDeleteDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface RFQDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: any;
  isDeleting: boolean;
  onConfirm: () => void;
}

export default function RFQDeleteDialog({
  open,
  onOpenChange,
  rfq,
  isDeleting,
  onConfirm,
}: RFQDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete RFQ
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this RFQ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {rfq && (
          <div className="py-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">{rfq.companyName}</p>
              <p className="text-xs text-muted-foreground">{rfq.rfqNumber}</p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete RFQ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}