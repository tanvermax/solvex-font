// src/components/order/OrderSuccessDialog.tsx
import { CheckCircle2, Copy, Eye, Home, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  orderId: string;
}

export default function OrderSuccessDialog({
  open,
  onOpenChange,
  orderNumber,
  orderId,
}: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success("Order number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewOrder = () => {
    onOpenChange(false);
    navigate(`/dashboard/orders/${orderId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center items-center pt-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl">Order Placed!</DialogTitle>
          <DialogDescription className="text-center">
            Your order has been received. Our team will contact you shortly.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="rounded-xl bg-muted/50 border border-border/60 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Order Number
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="font-mono font-bold text-lg text-primary">
                {orderNumber}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Save this number for tracking your order
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              onOpenChange(false);
              navigate("/");
            }}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={handleViewOrder}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}