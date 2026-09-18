// src/pages/admin/Shipments/AdminShipmentsPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  MoreVertical,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  Printer,
  User,
  Phone,
  Mail,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types
interface Shipment {
  id: string;
  trackingId: string;
  orderId: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  status:
    | "PENDING"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "RETURNED"
    | "CANCELLED";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  estimatedDelivery: string;
  actualDelivery?: string;
  carrier: string;
  trackingUrl?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    sku: string;
  }[];
  weight: number;
  weightUnit: "kg" | "lbs";
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Shipment Status Configuration
const SHIPMENT_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    icon: any;
    variant: "default" | "success" | "warning" | "danger" | "info";
    bgColor: string;
    borderColor: string;
  }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-500",
    icon: Clock,
    variant: "warning",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  PICKED_UP: {
    label: "Picked Up",
    color: "text-blue-500",
    icon: Package,
    variant: "info",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  IN_TRANSIT: {
    label: "In Transit",
    color: "text-purple-500",
    icon: Truck,
    variant: "info",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "text-orange-500",
    icon: MapPin,
    variant: "warning",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-500",
    icon: CheckCircle,
    variant: "success",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  RETURNED: {
    label: "Returned",
    color: "text-red-500",
    icon: RefreshCw,
    variant: "danger",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-gray-500",
    icon: XCircle,
    variant: "default",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
  },
};

// Mock Data - Replace with actual API call
const fetchShipments = async (
  filters?: any
): Promise<{ shipments: Shipment[]; total: number }> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockShipments: Shipment[] = [
    {
      id: "ship-001",
      trackingId: "TRK-2026-09-08-001",
      orderId: "ord-001",
      orderNumber: "ORD-100001",
      customer: {
        id: "cust-001",
        name: "Md. Shahidul Islam",
        email: "shahidul@example.com",
        phone: "+880 1712-345678",
      },
      status: "IN_TRANSIT",
      shippingAddress: {
        street: "125, New Elephant Road",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1205",
      },
      estimatedDelivery: "2026-09-10T18:00:00Z",
      carrier: "SA Paribahan",
      items: [
        {
          id: "item-001",
          name: "Industrial Hydraulic Pump",
          quantity: 2,
          sku: "IHP-2024-001",
        },
        {
          id: "item-002",
          name: "Heavy Duty Steel Roller",
          quantity: 1,
          sku: "HDSR-2024-002",
        },
      ],
      weight: 15.5,
      weightUnit: "kg",
      createdAt: "2026-09-07T10:00:00Z",
      updatedAt: "2026-09-08T08:00:00Z",
    },
    {
      id: "ship-002",
      trackingId: "TRK-2026-09-08-002",
      orderId: "ord-002",
      orderNumber: "ORD-100002",
      customer: {
        id: "cust-002",
        name: "Fatima Akhter",
        email: "fatima@example.com",
        phone: "+880 1812-987654",
      },
      status: "DELIVERED",
      shippingAddress: {
        street: "45, Kazi Nazrul Islam Avenue",
        city: "Chittagong",
        state: "Chittagong",
        country: "Bangladesh",
        zipCode: "4000",
      },
      estimatedDelivery: "2026-09-06T18:00:00Z",
      actualDelivery: "2026-09-06T15:30:00Z",
      carrier: "DHL Express",
      items: [
        {
          id: "item-003",
          name: "Industrial Grease 5L",
          quantity: 3,
          sku: "IG-2024-003",
        },
      ],
      weight: 2.8,
      weightUnit: "kg",
      createdAt: "2026-09-05T09:00:00Z",
      updatedAt: "2026-09-06T15:30:00Z",
    },
    {
      id: "ship-003",
      trackingId: "TRK-2026-09-08-003",
      orderId: "ord-003",
      orderNumber: "ORD-100003",
      customer: {
        id: "cust-003",
        name: "Kamal Hossain",
        email: "kamal@example.com",
        phone: "+880 1912-456789",
      },
      status: "PENDING",
      shippingAddress: {
        street: "88, Motijheel Commercial Area",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1000",
      },
      estimatedDelivery: "2026-09-12T18:00:00Z",
      carrier: "SA Paribahan",
      items: [
        {
          id: "item-004",
          name: "Conveyor Belt System",
          quantity: 1,
          sku: "CBS-2024-004",
        },
      ],
      weight: 45.0,
      weightUnit: "kg",
      createdAt: "2026-09-08T11:00:00Z",
      updatedAt: "2026-09-08T11:00:00Z",
    },
    {
      id: "ship-004",
      trackingId: "TRK-2026-09-08-004",
      orderId: "ord-004",
      orderNumber: "ORD-100004",
      customer: {
        id: "cust-004",
        name: "Nadia Sultana",
        email: "nadia@example.com",
        phone: "+880 1712-345678",
      },
      status: "OUT_FOR_DELIVERY",
      shippingAddress: {
        street: "22, Gulshan Avenue",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1212",
      },
      estimatedDelivery: "2026-09-09T18:00:00Z",
      carrier: "Pathao Delivery",
      items: [
        {
          id: "item-005",
          name: "Air Compressor 50L",
          quantity: 1,
          sku: "AC-2024-005",
        },
        {
          id: "item-006",
          name: "Air Hose Pipe",
          quantity: 2,
          sku: "AHP-2024-006",
        },
      ],
      weight: 12.3,
      weightUnit: "kg",
      createdAt: "2026-09-07T14:00:00Z",
      updatedAt: "2026-09-08T09:00:00Z",
    },
    {
      id: "ship-005",
      trackingId: "TRK-2026-09-08-005",
      orderId: "ord-005",
      orderNumber: "ORD-100005",
      customer: {
        id: "cust-005",
        name: "Rafiqul Islam",
        email: "rafiqul@example.com",
        phone: "+880 1612-789012",
      },
      status: "RETURNED",
      shippingAddress: {
        street: "56, Mirpur Road",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        zipCode: "1216",
      },
      estimatedDelivery: "2026-09-05T18:00:00Z",
      actualDelivery: "2026-09-04T10:00:00Z",
      carrier: "SA Paribahan",
      items: [
        {
          id: "item-007",
          name: "Electric Motor 5HP",
          quantity: 1,
          sku: "EM-2024-007",
        },
      ],
      weight: 8.7,
      weightUnit: "kg",
      createdAt: "2026-09-03T08:00:00Z",
      updatedAt: "2026-09-06T12:00:00Z",
      notes: "Customer returned due to damage",
    },
  ];

  // Apply filters
  let filtered = mockShipments;

  if (filters?.status && filters.status !== "ALL") {
    filtered = filtered.filter((s) => s.status === filters.status);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.trackingId.toLowerCase().includes(search) ||
        s.orderNumber.toLowerCase().includes(search) ||
        s.customer.name.toLowerCase().includes(search) ||
        s.customer.email.toLowerCase().includes(search)
    );
  }

  return {
    shipments: filtered,
    total: filtered.length,
  };
};

export default function AdminShipmentsPage() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] =
    useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Load shipments
  useEffect(() => {
    loadShipments();
  }, [searchTerm, statusFilter]);

  const loadShipments = async () => {
    try {
      setIsLoading(true);
      const filters = {
        status: statusFilter,
        search: searchTerm || undefined,
      };
      const data = await fetchShipments(filters);
      setShipments(data.shipments);
    } catch (error) {
      console.error("Failed to load shipments:", error);
      toast.error("Failed to load shipments");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedShipment || !newStatus || newStatus === selectedShipment.status)
      return;

    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedShipment = {
        ...selectedShipment,
        status: newStatus as Shipment["status"],
        updatedAt: new Date().toISOString(),
        ...(newStatus === "DELIVERED"
          ? { actualDelivery: new Date().toISOString() }
          : {}),
      };

      // Update in list
      setShipments((prev) =>
        prev.map((s) =>
          s.id === updatedShipment.id ? updatedShipment : s
        )
      );

      setIsStatusUpdateDialogOpen(false);
      setStatusNote("");
      toast.success(`Shipment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update shipment status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status component
  const StatusBadge = ({
    status,
    size = "default",
  }: {
    status: string;
    size?: "default" | "sm";
  }) => {
    const config = SHIPMENT_STATUS_CONFIG[status];
    if (!config) return <Badge>{status}</Badge>;

    const Icon = config.icon;
    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 font-medium",
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-xs",
          config.bgColor,
          config.borderColor,
          config.color
        )}
        variant="outline"
      >
        <Icon
          className={cn(
            "h-3 w-3",
            size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"
          )}
        />
        {config.label}
      </Badge>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Shipment Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage all shipments in your logistics network
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={loadShipments}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          {/* Export Button */}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Create Shipment Button */}
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/admin/shipments/create")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Shipment
          </Button>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking ID, order number, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {Object.entries(SHIPMENT_STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(SHIPMENT_STATUS_CONFIG).map(([key, config]) => {
          const count = shipments.filter((s) => s.status === key).length;
          if (count === 0 && key !== "PENDING") return null;
          return (
            <Card key={key} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {config.label}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      config.bgColor
                    )}
                  >
                    <config.icon className={cn("h-5 w-5", config.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ===== TABLE ===== */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>
                Total {shipments.length} shipments found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Last updated: {formatDateTime(new Date().toISOString())}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {shipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Shipments Found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Customer
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Carrier
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Est. Delivery
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow
                      key={shipment.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setIsDetailsDialogOpen(true);
                      }}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-primary">
                            {shipment.trackingId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {shipment.id.slice(0, 8)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shipment.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.items.length} items
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p className="font-medium">{shipment.customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.customer.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={shipment.status} size="sm" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {shipment.carrier}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <p>{formatDate(shipment.estimatedDelivery)}</p>
                          {shipment.actualDelivery && (
                            <p className="text-xs text-green-600">
                              Delivered: {formatDate(shipment.actualDelivery)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedShipment(shipment);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedShipment(shipment);
                                  setNewStatus(shipment.status);
                                  setIsStatusUpdateDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Update Status
                              </DropdownMenuItem>
                              {shipment.trackingUrl && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(shipment.trackingUrl, "_blank")
                                  }
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Shipment
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print Label
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== SHIPMENT DETAILS DIALOG ===== */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedShipment && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">
                      Shipment Details
                    </DialogTitle>
                    <DialogDescription>
                      Tracking ID: {selectedShipment.trackingId}
                    </DialogDescription>
                  </div>
                  <StatusBadge status={selectedShipment.status} />
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedShipment.customer.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{selectedShipment.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{selectedShipment.customer.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Shipping Address</span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6 space-y-0.5">
                          <p>{selectedShipment.shippingAddress.street}</p>
                          <p>
                            {selectedShipment.shippingAddress.city},{" "}
                            {selectedShipment.shippingAddress.state}
                          </p>
                          <p>
                            {selectedShipment.shippingAddress.country} -{" "}
                            {selectedShipment.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        Shipment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order</span>
                        <span className="font-medium">
                          {selectedShipment.orderNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carrier</span>
                        <span className="font-medium">
                          {selectedShipment.carrier}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">
                          {selectedShipment.weight} {selectedShipment.weightUnit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">
                          {formatDateTime(selectedShipment.createdAt)}
                        </span>
                      </div>
                      {selectedShipment.notes && (
                        <div className="pt-2 border-t">
                          <p className="text-muted-foreground text-xs">
                            Notes: {selectedShipment.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        Delivery Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Estimated Delivery
                        </span>
                        <span className="font-medium">
                          {formatDate(selectedShipment.estimatedDelivery)}
                        </span>
                      </div>
                      {selectedShipment.actualDelivery && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Actual Delivery
                          </span>
                          <span className="font-medium text-green-600">
                            {formatDate(selectedShipment.actualDelivery)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Updated
                        </span>
                        <span className="font-medium">
                          {formatDateTime(selectedShipment.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Items</CardTitle>
                    <CardDescription>
                      {selectedShipment.items.length} items in this shipment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">SKU</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedShipment.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.sku}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      setNewStatus(selectedShipment.status);
                      setIsStatusUpdateDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Status
                  </Button>
                  <Button
                    onClick={() => {
                      // Navigate to order details
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Order
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== STATUS UPDATE DIALOG ===== */}
      <Dialog
        open={isStatusUpdateDialogOpen}
        onOpenChange={setIsStatusUpdateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
            <DialogDescription>
              Change the current status of this shipment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              {selectedShipment && (
                <Badge variant="outline" className="px-3 py-1.5">
                  {SHIPMENT_STATUS_CONFIG[selectedShipment.status]?.label ||
                    selectedShipment.status}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SHIPMENT_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Note (Optional)</Label>
              <Textarea
                placeholder="Add a note about this status change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={
                isUpdating ||
                !newStatus ||
                newStatus === selectedShipment?.status
              }
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}