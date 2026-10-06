// src/components/layout/AdminLayoute/Shipment/AdminCreateShipmentPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Truck,
  Package,
  Send,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateShipmentMutation } from "@/redux/features/shipment/shipment.api";
import { useGetAllOrdersQuery } from "@/redux/features/order/Order.api";

// ============================================
// Schema
// ============================================
const createShipmentSchema = z.object({
  orderId: z.string().min(1, "Order is required"),
  carrierName: z.string().optional(),
  carrierContact: z.string().optional(),
  serviceType: z.string().optional(),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
  vehicleNumber: z.string().optional(),
  packageType: z.string().min(1, "Package type is required"),
  weight: z.coerce.number().min(0.01, "Weight is required"),
  weightUnit: z.enum(["kg", "lbs"]).default("kg"),
  length: z.coerce.number().min(0).default(0),
  width: z.coerce.number().min(0).default(0),
  height: z.coerce.number().min(0).default(0),
  dimensionUnit: z.enum(["cm", "in"]).default("cm"),
  estimatedDeliveryDate: z.string().optional(),
  priority: z.enum(["STANDARD", "HIGH", "URGENT"]).default("STANDARD"),
  specialInstructions: z.string().optional(),
  adminNote: z.string().optional(),
});

type FormValues = z.infer<typeof createShipmentSchema>;

const PACKAGE_TYPES = ["Box", "Crate", "Pallet", "Tube", "Envelope", "Bag", "Drum"];

export default function AdminCreateShipmentPage() {
  const navigate = useNavigate();
  const [createShipment, { isLoading }] = useCreateShipmentMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(createShipmentSchema) as any,
    defaultValues: {
      orderId: "",
      carrierName: "",
      carrierContact: "",
      serviceType: "",
      driverName: "",
      driverContact: "",
      vehicleNumber: "",
      packageType: "Box",
      weight: 0,
      weightUnit: "kg",
      length: 0,
      width: 0,
      height: 0,
      dimensionUnit: "cm",
      estimatedDeliveryDate: "",
      priority: "STANDARD",
      specialInstructions: "",
      adminNote: "",
    },
  });

  // 🔥 Load orders (shipped/processing only)
  const { data: ordersData, isLoading: ordersLoading, error } = useGetAllOrdersQuery({
    status: "PENDING,CONFIRMED,PROCESSING,READY_TO_SHIP" as any,

    limit: 100,
  });

  const orders = ordersData?.data || [];
  const watchOrderId = form.watch("orderId");
  const selectedOrder = orders.find((o: any) => o._id === watchOrderId);


  useEffect(() => {
  console.log("📦 Orders Data:", ordersData);
  console.log("🔴 Orders Error:", error);
  console.log("⏳ Loading:", ordersLoading);
}, [ordersData, error, ordersLoading]);


  // Auto-fill from selected order
  useEffect(() => {
    if (selectedOrder) {
      // Auto weight estimate from order items
      const totalWeight = selectedOrder.items?.reduce(
        (sum: number, item: any) => sum + (item.quantity || 0) * 0.5,
        0
      );
      form.setValue("weight", totalWeight || 1);
    }
  }, [selectedOrder, form]);

  const onSubmit = async (data: FormValues) => {
    if (!selectedOrder) {
      toast.error("Please select an order");
      return;
    }

    try {
      const result = await createShipment({
        orderId: data.orderId,
        customer: {
          name: selectedOrder.companyInfo?.contactPerson || "",
          email: selectedOrder.companyInfo?.email || "",
          phone: selectedOrder.companyInfo?.phone || "",
        },
        shippingAddress: {
          address: selectedOrder.shippingAddress?.address || "",
          city: selectedOrder.shippingAddress?.city || "",
          zone: selectedOrder.shippingAddress?.zone,
          phone: selectedOrder.shippingAddress?.phone,
          contactPerson: selectedOrder.shippingAddress?.contactPerson,
        },
        items: selectedOrder.items?.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          sku: item.productSku,
          quantity: item.quantity,
        })),
        carrierName: data.carrierName,
        carrierContact: data.carrierContact,
        serviceType: data.serviceType,
        driverName: data.driverName,
        driverContact: data.driverContact,
        vehicleNumber: data.vehicleNumber,
        packageInfo: {
          packageType: data.packageType,
          weight: data.weight,
          weightUnit: data.weightUnit,
          dimensions: {
            length: data.length,
            width: data.width,
            height: data.height,
            unit: data.dimensionUnit,
          },
        },
        priority: data.priority,
        estimatedDeliveryDate: data.estimatedDeliveryDate || undefined,
        specialInstructions: data.specialInstructions,
        adminNote: data.adminNote,
      }).unwrap();

      toast.success(`Shipment created: ${result.data.trackingId}`);
      navigate("/admin/shipments");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create shipment");
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/shipments")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Shipment</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new shipment for a confirmed order
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Order Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                Select the order to ship
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="orderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={ordersLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              ordersLoading
                                ? "Loading orders..."
                                : "Select an order to ship"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {orders.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground text-center">
                            No processing orders found
                          </div>
                        ) : (
                          orders.map((order: any) => (
                            <SelectItem key={order._id} value={order._id}>
                              {order.orderNumber} —{" "}
                              {order.companyInfo?.companyName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Preview */}
              {selectedOrder && (
                <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order</span>
                    <span className="font-medium">
                      {selectedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">
                      {selectedOrder.companyInfo?.companyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ship To</span>
                    <span className="font-medium text-right max-w-[60%]">
                      {selectedOrder.shippingAddress?.address},{" "}
                      {selectedOrder.shippingAddress?.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">
                      {selectedOrder.items?.length || 0} products
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Carrier & Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="carrierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., SA Paribahan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="driverName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Driver name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="driverContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., DHA-GA-1234" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Package & Priority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type *</FormLabel>
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
                          {PACKAGE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
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
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lbs">lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Delivery</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Handle with care, fragile items..."
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
                    <FormLabel>Admin Note (Internal)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Internal notes..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/shipments")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Shipment
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}