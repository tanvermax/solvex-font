// src/components/admin/Contact/ContactDeleteDialog.tsx
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

interface ContactDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: any;
  isDeleting: boolean;
  onConfirm: () => void;
}

export default function ContactDeleteDialog({
  open,
  onOpenChange,
  contact,
  isDeleting,
  onConfirm,
}: ContactDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Contact
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this contact message? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {contact && (
          <div className="py-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-mono text-sm font-semibold text-primary">
                {contact.ticketNumber}
              </p>
              <p className="text-sm font-medium mt-1">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.email}</p>
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
              "Delete Contact"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}