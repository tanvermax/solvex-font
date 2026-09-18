// src/pages/admin/Shipments/AdminCreateShipmentPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Truck,
  Package,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Plus,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  FileText,
  Clock,
  DollarSign,
  Weight,
  Ruler,
  Boxes,
  Archive,
  Home,
  Globe,
  Send,
  Save,
  Printer,
  Eye,
} from "lucide-react";

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
  FormDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Types
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    sku: string;
    weight: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

interface Carrier {
  id: string;
  name: string;
  code: string;
  logo?: string;
  services: string[];
  estimatedDelivery: string;
  trackingUrlTemplate: string;
}

// Zod Schema
const createShipmentSchema = z.object({
  orderId: z.string().min(1, "Please select an order"),
  carrier: z.string().min(1, "Please select a carrier"),
  serviceType: z.string().min(1, "Please select a service type"),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
  weightUnit: z.enum(["kg", "lbs"]),
  estimatedDelivery: z.string().min(1, "Please select estimated delivery date"),
  notes: z.string().optional(),
  packageType: z.string().min(1, "Please select package type"),
  dimensions: z.object({
    length: z.number().min(0.1, "Length must be greater than 0"),
    width: z.number().min(0.1, "Width must be greater than 0"),
    height: z.number().min(0.1, "Height must be greater than 0"),
    unit: z.enum(["cm", "in"]),
  }),
  insurance: z.boolean().default(false),
  insuranceValue: z.number().optional(),
  specialInstructions: z.string().optional(),
});

type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

// Mock Data
const mockOrders: Order[] = [
  {
    id: "ord-001",
    orderNumber: "ORD-100001",
    customer: {
      id: "cust-001",
      name: "Md. Shahidul Islam",
      email: "shahidul@example.com",
      phone: "+880 1712-345678",
    },
    items: [
      {
        id: "item-001",
        name: "Industrial Hydraulic Pump",
        quantity: 2,
        sku: "IHP-2024-001",
        weight: 5.5,
      },
      {
        id: "item-002",
        name: "Heavy Duty Steel Roller",
        quantity: 1,
        sku: "HDSR-2024-002",
        weight: 8.2,
      },
    ],
    shippingAddress: {
      street: "125, New Elephant Road",
      city: "Dhaka",
      state: "Dhaka",
      country: "Bangladesh",
      zipCode: "1205",
    },
    total: 39315,
    status: "PROCESSING",
    createdAt: "2026-09-07T10:00:00Z",
  },
  {
    id: "ord-002",
    orderNumber: "ORD-100002",
    customer: {
      id: "cust-002",
      name: "Fatima Akhter",
      email: "fatima@example.com",
      phone: "+880 1812-987654",
    },
    items: [
      {
        id: "item-003",
        name: "Industrial Grease 5L",
        quantity: 3,
        sku: "IG-2024-003",
        weight: 0.9,
      },
    ],
    shippingAddress: {
      street: "45, Kazi Nazrul Islam Avenue",
      city: "Chittagong",
      state: "Chittagong",
      country: "Bangladesh",
      zipCode: "4000",
    },
    total: 1350,
    status: "PENDING",
    createdAt: "2026-09-08T09:00:00Z",
  },
  {
    id: "ord-003",
    orderNumber: "ORD-100003",
    customer: {
      id: "cust-003",
      name: "Kamal Hossain",
      email: "kamal@example.com",
      phone: "+880 1912-456789",
    },
    items: [
      {
        id: "item-004",
        name: "Conveyor Belt System",
        quantity: 1,
        sku: "CBS-2024-004",
        weight: 45.0,
      },
    ],
    shippingAddress: {
      street: "88, Motijheel Commercial Area",
      city: "Dhaka",
      state: "Dhaka",
      country: "Bangladesh",
      zipCode: "1000",
    },
    total: 85000,
    status: "PROCESSING",
    createdAt: "2026-09-08T11:00:00Z",
  },
];

const mockCarriers: Carrier[] = [
  {
    id: "car-001",
    name: "SA Paribahan",
    code: "SA",
    services: ["Standard", "Express", "Same Day"],
    estimatedDelivery: "2-3 business days",
    trackingUrlTemplate: "https://tracking.sap.com/{trackingId}",
  },
  {
    id: "car-002",
    name: "DHL Express",
    code: "DHL",
    services: ["Express", "Priority", "Economy"],
    estimatedDelivery: "1-2 business days",
    trackingUrlTemplate: "https://www.dhl.com/en/express/tracking.html?AWB={trackingId}",
  },
  {
    id: "car-003",
    name: "Pathao Delivery",
    code: "PATH",
    services: ["Standard", "Express", "Same Day"],
    estimatedDelivery: "1-3 business days",
    trackingUrlTemplate: "https://pathao.com/track/{trackingId}",
  },
  {
    id: "car-004",
    name: "RedX Delivery",
    code: "REDX",
    services: ["Standard", "Priority"],
    estimatedDelivery: "1-2 business days",
    trackingUrlTemplate: "https://redx.com.bd/track/{trackingId}",
  },
];

const PACKAGE_TYPES = [
  "Box",
  "Crate",
  "Pallet",
  "Tube",
  "Envelope",
  "Bag",
  "Drum",
  "Other",
];

const WEIGHT_UNITS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "lbs", label: "Pounds (lbs)" },
];

const DIMENSION_UNITS = [
  { value: "cm", label: "Centimeters (cm)" },
  { value: "in", label: "Inches (in)" },
];

export default function AdminCreateShipmentPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingTracking, setIsGeneratingTracking] = useState(false);
  const [generatedTrackingId, setGeneratedTrackingId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema) as any,
    defaultValues: {
      orderId: "",
      carrier: "",
      serviceType: "",
      weight: 0,
      weightUnit: "kg",
      estimatedDelivery: "",
      notes: "",
      packageType: "",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: "cm",
      },
      insurance: false,
      insuranceValue: 0,
      specialInstructions: "",
    },
  });

  const watchOrderId = form.watch("orderId");
  const watchCarrier = form.watch("carrier");

  // Load orders and carriers
  useEffect(() => {
    loadOrders();
    loadCarriers();
  }, []);

  // Load selected order details
  useEffect(() => {
    if (watchOrderId) {
      const order = orders.find((o) => o.id === watchOrderId);
      setSelectedOrder(order || null);
      if (order) {
        // Auto-calculate weight from items
        const totalWeight = order.items.reduce(
          (sum, item) => sum + item.weight * item.quantity,
          0
        );
        form.setValue("weight", totalWeight);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [watchOrderId, orders, form]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOrders(mockOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const loadCarriers = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCarriers(mockCarriers);
    } catch (error) {
      console.error("Failed to load carriers:", error);
      toast.error("Failed to load carriers");
    }
  };

  const generateTrackingId = async () => {
    setIsGeneratingTracking(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const trackingId = `TRK-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 10000)
      ).padStart(4, "0")}`;
      setGeneratedTrackingId(trackingId);
      toast.success("Tracking ID generated successfully");
    } catch (error) {
      console.error("Failed to generate tracking ID:", error);
      toast.error("Failed to generate tracking ID");
    } finally {
      setIsGeneratingTracking(false);
    }
  };

  const onSubmit = async (data: CreateShipmentFormValues) => {
    if (!generatedTrackingId) {
      toast.warning("Please generate a tracking ID first");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Shipment Data:", {
        ...data,
        trackingId: generatedTrackingId,
        order: selectedOrder,
        createdAt: new Date().toISOString(),
        status: "PENDING",
      });

      toast.success("Shipment created successfully");
      navigate("/admin/shipments");
    } catch (error) {
      console.error("Failed to create shipment:", error);
      toast.error("Failed to create shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter orders based on search
  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              Create a new shipment for an order
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/shipments")}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting || !generatedTrackingId}
          >
            {isSubmitting ? (
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
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ===== ORDER SELECTION ===== */}
          <Card>
            <CardHeader>
              <CardTitle>Select Order</CardTitle>
              <CardDescription>
                Choose an order to create a shipment for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="orderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Search and select an order..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <div className="p-2">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                      setSearchTerm(e.target.value)
                                    }
                                    className="pl-9"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              <Separator />
                              {filteredOrders.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                  No orders found
                                </div>
                              ) : (
                                filteredOrders.map((order) => (
                                  <SelectItem key={order.id} value={order.id}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {order.orderNumber}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {order.customer.name} •{" "}
                                        {order.items.length} items •{" "}
                                        {formatCurrency(order.total)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={loadOrders}
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Order Details Preview */}
                {selectedOrder && (
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {selectedOrder.orderNumber}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            selectedOrder.status === "PROCESSING"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          )}
                        >
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(selectedOrder.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedOrder.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{selectedOrder.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{selectedOrder.customer.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Shipping Address</span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6 space-y-0.5">
                          <p>{selectedOrder.shippingAddress.street}</p>
                          <p>
                            {selectedOrder.shippingAddress.city},{" "}
                            {selectedOrder.shippingAddress.state}
                          </p>
                          <p>
                            {selectedOrder.shippingAddress.country} -{" "}
                            {selectedOrder.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Items</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">SKU</TableHead>
                            <TableHead className="text-right">Weight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-center">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.sku}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.weight} kg
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-right font-medium"
                            >
                              Total Weight
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {selectedOrder.items.reduce(
                                (sum, item) => sum + item.weight * item.quantity,
                                0
                              )}{" "}
                              kg
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-muted-foreground">
                        Order Total
                      </span>
                      <span className="font-bold text-lg">
                        {formatCurrency(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ===== SHIPMENT DETAILS ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Details</CardTitle>
                <CardDescription>
                  Enter the shipment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Carrier Selection */}
                <FormField
                  control={form.control}
                  name="carrier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a carrier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carriers.map((carrier) => (
                            <SelectItem key={carrier.id} value={carrier.id}>
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                <span>{carrier.name}</span>
                                <Badge variant="outline" className="ml-2">
                                  {carrier.estimatedDelivery}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the shipping carrier for this shipment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Type */}
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {watchCarrier &&
                            carriers
                              .find((c) => c.id === watchCarrier)
                              ?.services.map((service) => (
                                <SelectItem key={service} value={service}>
                                  {service}
                                </SelectItem>
                              ))}
                          {!watchCarrier && (
                            <SelectItem value="standard">Standard</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="0.0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
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
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {WEIGHT_UNITS.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Package Type */}
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select package type" />
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

                {/* Estimated Delivery */}
                <FormField
                  control={form.control}
                  name="estimatedDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Delivery Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Expected delivery date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Dimensions */}
              <Card>
                <CardHeader>
                  <CardTitle>Package Dimensions</CardTitle>
                  <CardDescription>
                    Enter the package dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dimensions.length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="dimensions.unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIMENSION_UNITS.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle>Insurance</CardTitle>
                  <CardDescription>
                    Optional insurance for the shipment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="insurance"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Shipment Insurance
                          </FormLabel>
                          <FormDescription>
                            Protect your shipment with insurance
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <span
                              className={cn(
                                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                                field.value
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              )}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("insurance") && (
                    <FormField
                      control={form.control}
                      name="insuranceValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Value</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Enter insurance value"
                                className="pl-9"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the value to be insured
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Instructions</CardTitle>
                  <CardDescription>
                    Additional instructions for the carrier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="E.g., Handle with care, Fragile items, etc."
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ===== NOTES ===== */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Internal notes for this shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes..."
                        className="h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* ===== TRACKING ID GENERATION ===== */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Tracking ID</CardTitle>
              <CardDescription>
                Generate a unique tracking ID for this shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateTrackingId}
                  disabled={isGeneratingTracking || !watchOrderId}
                  className="w-full sm:w-auto"
                >
                  {isGeneratingTracking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Tracking ID
                    </>
                  )}
                </Button>
                <div className="flex-1">
                  {generatedTrackingId ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          {generatedTrackingId}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Tracking ID generated successfully
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-dashed">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No tracking ID generated yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <FormDescription className="mt-2">
                Generate a unique tracking ID for this shipment. This ID will be used to track the shipment.
              </FormDescription>
            </CardContent>
          </Card>

          {/* ===== FORM ACTIONS ===== */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/shipments")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Save as draft logic
                toast.info("Shipment saved as draft");
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !generatedTrackingId}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
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