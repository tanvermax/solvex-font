// src/components/layout/AdminLayoute/Shipment/components/ShipmentEditDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Truck } from "lucide-react";
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
  useUpdateShipmentMutation,
  type Shipment,
} from "@/redux/features/shipment/shipment.api";

// ============================================
// Schema — only allowed fields
// ============================================
const editSchema = z.object({
  carrierName: z.string().optional(),
  carrierContact: z.string().optional(),
  serviceType: z.string().optional(),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
  vehicleNumber: z.string().optional(),
  priority: z.enum(["STANDARD", "HIGH", "URGENT"]),
  estimatedDeliveryDate: z.string().optional(),
  specialInstructions: z.string().optional(),
  adminNote: z.string().optional(),
});

type FormValues = z.infer<typeof editSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment;
}

// Format date to YYYY-MM-DD for input
const toDateInput = (date?: string) =>
  date ? new Date(date).toISOString().split("T")[0] : "";

export default function ShipmentEditDialog({
  open,
  onOpenChange,
  shipment,
}: Props) {
  const [updateShipment, { isLoading }] = useUpdateShipmentMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(editSchema) as any,
    defaultValues: {
      carrierName: shipment.carrierName || "",
      carrierContact: shipment.carrierContact || "",
      serviceType: shipment.serviceType || "",
      driverName: shipment.driverName || "",
      driverContact: shipment.driverContact || "",
      vehicleNumber: shipment.vehicleNumber || "",
      priority: shipment.priority || "STANDARD",
      estimatedDeliveryDate: toDateInput(shipment.estimatedDeliveryDate),
      specialInstructions: shipment.specialInstructions || "",
      adminNote: shipment.adminNote || "",
    },
  });

  // Reset when shipment changes
  useEffect(() => {
    if (open) {
      form.reset({
        carrierName: shipment.carrierName || "",
        carrierContact: shipment.carrierContact || "",
        serviceType: shipment.serviceType || "",
        driverName: shipment.driverName || "",
        driverContact: shipment.driverContact || "",
        vehicleNumber: shipment.vehicleNumber || "",
        priority: shipment.priority || "STANDARD",
        estimatedDeliveryDate: toDateInput(shipment.estimatedDeliveryDate),
        specialInstructions: shipment.specialInstructions || "",
        adminNote: shipment.adminNote || "",
      });
    }
  }, [open, shipment, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateShipment({
        id: shipment._id,
        data: {
          carrierName: data.carrierName || undefined,
          carrierContact: data.carrierContact || undefined,
          serviceType: data.serviceType || undefined,
          driverName: data.driverName || undefined,
          driverContact: data.driverContact || undefined,
          vehicleNumber: data.vehicleNumber || undefined,
          priority: data.priority,
          estimatedDeliveryDate: data.estimatedDeliveryDate || undefined,
          specialInstructions: data.specialInstructions || undefined,
          adminNote: data.adminNote || undefined,
        },
      }).unwrap();

      toast.success("Shipment updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update shipment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Edit Shipment
          </DialogTitle>
          <DialogDescription>
            Tracking: <span className="font-mono">{shipment.trackingId}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Carrier */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Carrier & Service</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="carrierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Carrier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SA Paribahan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carrierContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Carrier Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone / email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Service Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Express">Express</SelectItem>
                        <SelectItem value="Same Day">Same Day</SelectItem>
                        <SelectItem value="Economy">Economy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Driver */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-semibold">Driver & Vehicle</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Driver Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Driver name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="driverContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Driver Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Vehicle Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., DHA-GA-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Timeline */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-semibold">Timeline & Priority</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Priority</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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

                <FormField
                  control={form.control}
                  name="estimatedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        Estimated Delivery
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-semibold">Notes</h4>

              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Special Instructions
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Handle with care..."
                        rows={2}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Admin Note</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Internal note..."
                        rows={2}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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