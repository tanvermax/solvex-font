// src/components/layout/AdminLayoute/Order/components/OrderEditDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Edit } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useUpdateOrderMutation,
  type Order,
  type OrderPriority,
} from "@/redux/features/order/Order.api";

// ============================================
// 🔥 Schema
// ============================================
const editSchema = z.object({
  adminNote: z.string().optional(),
  priority: z.enum(["STANDARD", "HIGH", "URGENT"]),
  expectedDeliveryDate: z.string().optional(),
  shippingCost: z.coerce.number().min(0).optional(),
  discountAmount: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof editSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

// ISO date → YYYY-MM-DD (input type=date)
const toDateInput = (date?: string) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

export default function OrderEditDialog({
  open,
  onOpenChange,
  order,
}: Props) {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema) as any,
    defaultValues: {
      adminNote: order.adminNote || "",
      priority: order.priority || "STANDARD",
      expectedDeliveryDate: toDateInput(order.expectedDeliveryDate),
      shippingCost: order.shippingCost || 0,
      discountAmount: order.discountAmount || 0,
    },
  });

  // Dialog খুললে form reset করুন (fresh values)
  useEffect(() => {
    if (open) {
      form.reset({
        adminNote: order.adminNote || "",
        priority: order.priority || "STANDARD",
        expectedDeliveryDate: toDateInput(order.expectedDeliveryDate),
        shippingCost: order.shippingCost || 0,
        discountAmount: order.discountAmount || 0,
      });
    }
  }, [open, order, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateOrder({
        id: order._id,
        data: {
          adminNote: data.adminNote || undefined,
          priority: data.priority as OrderPriority,
          expectedDeliveryDate: data.expectedDeliveryDate || undefined,
          shippingCost: data.shippingCost,
          discountAmount: data.discountAmount,
        } as any,
      }).unwrap();

      toast.success("Order updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Edit Order
          </DialogTitle>
          <DialogDescription>
            Order:{" "}
            <span className="font-mono font-semibold">
              {order.orderNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expected Delivery */}
            <FormField
              control={form.control}
              name="expectedDeliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Delivery</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shipping Cost & Discount */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="shippingCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Cost (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Admin Note */}
            <FormField
              control={form.control}
              name="adminNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Note (Internal)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Internal note about this order..."
                      rows={3}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}