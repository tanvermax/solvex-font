// src/components/order/OrderDialog.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Package,
  User,
  MapPin,
  Building,
  Send,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import OrderQuantityInput from "./OrderQuantityInput";
import OrderSuccessDialog from "./OrderSuccessDialog";
import { useCreateOrderMutation } from "@/redux/features/order/Order.api";
import { useAppSelector } from "@/redux/hook";
import { useCurrentUser } from "@/redux/features/auth/auth.slice";

// ============================================
// Schema
// ============================================
const orderSchema = z.object({
  quantity: z.coerce.number().min(1, "Minimum 1 required"),
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  binOrTaxId: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zone: z.string().optional(),
  paymentMethod: z.enum(["CASH", "LC", "CREDIT", "ONLINE"]).default("CASH"),
  customerNote: z.string().optional(),
});

type FormValues = z.infer<typeof orderSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    moq?: number;
    stock?: number;
    unit?: string;
    sku?: string;
    image?: string;
  } | null;
}

export default function OrderDialog({ open, onOpenChange, product }: Props) {
  const authUser = useAppSelector(useCurrentUser);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{
    orderNumber: string;
    orderId: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      quantity: product?.moq || 1,
      companyName: authUser?.companyName || "",
      contactPerson: authUser?.name || "",
      email: authUser?.email || "",
      phone: authUser?.phone?.toString() || "",
      binOrTaxId: authUser?.binOrTaxId || "",
      address: authUser?.address || "",
      city: "",
      zone: "",
      paymentMethod: "CASH",
      customerNote: "",
    },
  });

  // Reset form when dialog opens with new product
  useEffect(() => {
    if (open && product) {
      form.reset({
        quantity: product.moq || 1,
        companyName: authUser?.companyName || "",
        contactPerson: authUser?.name || "",
        email: authUser?.email || "",
        phone: authUser?.phone?.toString() || "",
        binOrTaxId: authUser?.binOrTaxId || "",
        address: authUser?.address || "",
        city: "",
        zone: "",
        paymentMethod: "CASH",
        customerNote: "",
      });
    }
  }, [open, product, authUser, form]);

  const watchQuantity = form.watch("quantity");

  // ============================================
  // Pricing
  // ============================================
  const unitPrice = product?.discountPrice || product?.price || 0;
  const subtotal = unitPrice * (watchQuantity || 1);
  const total = subtotal;

  // ============================================
  // Submit
  // ============================================
  const onSubmit = async (data: FormValues) => {
    if (!product) {
      toast.error("Product not selected");
      return;
    }

    try {
      const result = await createOrder({
        companyInfo: {
          companyName: data.companyName,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
          binOrTaxId: data.binOrTaxId,
        },
        shippingAddress: {
          address: data.address,
          city: data.city,
          zone: data.zone,
          phone: data.phone,
          contactPerson: data.contactPerson,
        },
        items: [
          {
            productId: product._id,
            productName: product.name,
            quantity: data.quantity,
            unit: product.unit || "pcs",
            unitPrice,
            discount: 0,
            taxRate: 0,
            total: unitPrice * data.quantity,
          },
        ],
        paymentMethod: data.paymentMethod,
        priority: "STANDARD",
        customerNote: data.customerNote,
      }).unwrap();

      // Success
      setCreatedOrder({
        orderNumber: result.data.orderNumber,
        orderId: result.data._id,
      });
      onOpenChange(false);
      setSuccessDialogOpen(true);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to place order");
    }
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Fill in your details to place this order
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* ============================================ */}
              {/* PRODUCT SUMMARY */}
              {/* ============================================ */}
              <div className="rounded-xl border bg-muted/30 p-4 space-y-4">
                <div className="flex items-start gap-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Package className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2">
                      {product.name}
                    </p>
                    {product.sku && (
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        SKU: {product.sku}
                      </p>
                    )}
                    <p className="text-sm font-bold text-primary mt-1">
                      ৳{unitPrice.toLocaleString()}
                      <span className="text-xs text-muted-foreground font-normal ml-1">
                        / {product.unit || "piece"}
                      </span>
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Quantity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-2">
                      {product.moq && (
                        <Badge variant="outline" className="text-[10px]">
                          MOQ: {product.moq}
                        </Badge>
                      )}
                      {product.stock !== undefined && (
                        <Badge variant="outline" className="text-[10px]">
                          Stock: {product.stock}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <OrderQuantityInput
                    value={watchQuantity}
                    onChange={(val) => form.setValue("quantity", val)}
                    min={product.moq || 1}
                    max={product.stock || undefined}
                    disabled={isLoading}
                  />
                  {form.formState.errors.quantity && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.quantity.message}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* ============================================ */}
              {/* COMPANY INFO */}
              {/* ============================================ */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Company Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Contact Person *</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+880 17XX-XXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="binOrTaxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">
                        BIN / Tax ID (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your business ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ============================================ */}
              {/* SHIPPING ADDRESS */}
              {/* ============================================ */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Shipping Address</h3>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street, building, area"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dhaka" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Zone</FormLabel>
                        <FormControl>
                          <Input placeholder="Gulshan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ============================================ */}
              {/* PAYMENT METHOD */}
              {/* ============================================ */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Payment Method</FormLabel>
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
                        <SelectItem value="CASH">
                          Advance / Bank Transfer
                        </SelectItem>
                        <SelectItem value="LC">
                          Letter of Credit (L/C)
                        </SelectItem>
                        <SelectItem value="CREDIT">
                          30-Day Corporate Credit
                        </SelectItem>
                        <SelectItem value="ONLINE">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ============================================ */}
              {/* NOTE */}
              {/* ============================================ */}
              <FormField
                control={form.control}
                name="customerNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Order Note (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Special instructions..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ============================================ */}
              {/* INFO */}
              {/* ============================================ */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Our team will review your order and contact you to confirm
                  pricing and delivery timeline.
                </p>
              </div>

              {/* ============================================ */}
              {/* ACTIONS */}
              {/* ============================================ */}
              <div className="flex justify-end gap-2 pt-2 border-t">
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
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* SUCCESS DIALOG */}
      {createdOrder && (
        <OrderSuccessDialog
          open={successDialogOpen}
          onOpenChange={setSuccessDialogOpen}
          orderNumber={createdOrder.orderNumber}
          orderId={createdOrder.orderId}
        />
      )}
    </>
  );
}