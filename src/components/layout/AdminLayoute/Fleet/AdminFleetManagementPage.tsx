// src/pages/admin/Fleet/AdminFleetManagementPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Fuel,
  Wrench,
  Gauge,
  Navigation,
  Users,
  Package,
  Route,
  Star,
  StarOff,
  Award,
  ClipboardCheck,
  Car,
  AlertTriangle,
  Battery,
  Thermometer,
  Shield,
  Map,
  Home,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface Vehicle {
  id: string;
  registrationNumber: string;
  type: "TRUCK" | "VAN" | "PICKUP" | "TRAILER" | "CONTAINER" | "CARGO";
  brand: string;
  model: string;
  year: number;
  color: string;
  capacity: number;
  capacityUnit: "kg" | "lbs" | "tons";
  fuelType: "DIESEL" | "PETROL" | "CNG" | "ELECTRIC" | "HYBRID";
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "REPAIR" | "AVAILABLE" | "ON_TRIP";
  location: {
    lat: number;
    lng: number;
    address: string;
    lastUpdated: string;
  };
  driver?: {
    id: string;
    name: string;
    phone: string;
    licenseNumber: string;
    rating: number;
    avatar?: string;
  };
  mileage: number;
  lastService: string;
  nextService: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  fuelLevel: number;
  fuelConsumption: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  trips: number;
  totalDistance: number;
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  rating: number;
  status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "ON_LEAVE";
  experience: number;
  avatar?: string;
  assignedVehicle?: string;
  notes?: string;
  createdAt: string;
}

// Zod Schema for Vehicle
const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  type: z.enum(["TRUCK", "VAN", "PICKUP", "TRAILER", "CONTAINER", "CARGO"]),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year"),
  color: z.string().min(1, "Color is required"),
  capacity: z.number().min(0.1, "Capacity must be greater than 0"),
  capacityUnit: z.enum(["kg", "lbs", "tons"]),
  fuelType: z.enum(["DIESEL", "PETROL", "CNG", "ELECTRIC", "HYBRID"]),
  driverId: z.string().optional(),
  mileage: z.number().min(0, "Mileage must be positive"),
  lastService: z.string().min(1, "Last service date is required"),
  nextService: z.string().min(1, "Next service date is required"),
  insuranceExpiry: z.string().min(1, "Insurance expiry date is required"),
  registrationExpiry: z.string().min(1, "Registration expiry date is required"),
  fuelLevel: z.number().min(0, "Fuel level must be between 0 and 100").max(100, "Fuel level must be between 0 and 100"),
  fuelConsumption: z.number().min(0, "Fuel consumption must be positive"),
  notes: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Mock Data
const mockVehicles: Vehicle[] = [
  {
    id: "veh-001",
    registrationNumber: "DHA-12-3456",
    type: "TRUCK",
    brand: "Scania",
    model: "R450",
    year: 2022,
    color: "White",
    capacity: 12,
    capacityUnit: "tons",
    fuelType: "DIESEL",
    status: "ACTIVE",
    location: {
      lat: 23.8103,
      lng: 90.4125,
      address: "Dhaka, Bangladesh",
      lastUpdated: new Date().toISOString(),
    },
    driver: {
      id: "drv-001",
      name: "Md. Jahirul Islam",
      phone: "+880 1712-345678",
      licenseNumber: "DL-2024-001",
      rating: 4.8,
    },
    mileage: 45000,
    lastService: "2026-08-15",
    nextService: "2026-09-15",
    insuranceExpiry: "2027-01-15",
    registrationExpiry: "2027-06-15",
    fuelLevel: 75,
    fuelConsumption: 18.5,
    notes: "Regular maintenance schedule",
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
    trips: 45,
    totalDistance: 12500,
  },
  {
    id: "veh-002",
    registrationNumber: "DHA-98-7654",
    type: "VAN",
    brand: "Toyota",
    model: "Hiace",
    year: 2023,
    color: "Silver",
    capacity: 1.5,
    capacityUnit: "tons",
    fuelType: "DIESEL",
    status: "ON_TRIP",
    location: {
      lat: 22.3569,
      lng: 91.7832,
      address: "Chittagong, Bangladesh",
      lastUpdated: new Date().toISOString(),
    },
    driver: {
      id: "drv-002",
      name: "Md. Kamal Hossain",
      phone: "+880 1812-987654",
      licenseNumber: "DL-2024-002",
      rating: 4.5,
    },
    mileage: 28000,
    lastService: "2026-07-20",
    nextService: "2026-10-20",
    insuranceExpiry: "2027-02-20",
    registrationExpiry: "2027-07-20",
    fuelLevel: 45,
    fuelConsumption: 12.5,
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
    trips: 32,
    totalDistance: 8500,
  },
  {
    id: "veh-003",
    registrationNumber: "DHA-55-7890",
    type: "PICKUP",
    brand: "Ford",
    model: "Ranger",
    year: 2021,
    color: "Black",
    capacity: 800,
    capacityUnit: "kg",
    fuelType: "PETROL",
    status: "MAINTENANCE",
    location: {
      lat: 23.8103,
      lng: 90.4125,
      address: "Dhaka, Bangladesh",
      lastUpdated: new Date().toISOString(),
    },
    mileage: 52000,
    lastService: "2026-06-10",
    nextService: "2026-09-10",
    insuranceExpiry: "2026-12-10",
    registrationExpiry: "2027-05-10",
    fuelLevel: 20,
    fuelConsumption: 8.5,
    notes: "Scheduled maintenance - brake pad replacement",
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
    trips: 28,
    totalDistance: 6200,
  },
  {
    id: "veh-004",
    registrationNumber: "DHA-33-4567",
    type: "TRAILER",
    brand: "Volvo",
    model: "FH16",
    year: 2022,
    color: "Blue",
    capacity: 25,
    capacityUnit: "tons",
    fuelType: "DIESEL",
    status: "AVAILABLE",
    location: {
      lat: 23.8103,
      lng: 90.4125,
      address: "Dhaka, Bangladesh",
      lastUpdated: new Date().toISOString(),
    },
    mileage: 32000,
    lastService: "2026-08-05",
    nextService: "2026-09-05",
    insuranceExpiry: "2027-01-05",
    registrationExpiry: "2027-06-05",
    fuelLevel: 90,
    fuelConsumption: 22.5,
    createdAt: "2026-04-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
    trips: 15,
    totalDistance: 4500,
  },
];

const mockDrivers: Driver[] = [
  {
    id: "drv-001",
    name: "Md. Jahirul Islam",
    email: "jahirul@example.com",
    phone: "+880 1712-345678",
    licenseNumber: "DL-2024-001",
    licenseExpiry: "2027-12-31",
    rating: 4.8,
    status: "ON_TRIP",
    experience: 8,
    assignedVehicle: "veh-001",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "drv-002",
    name: "Md. Kamal Hossain",
    email: "kamal@example.com",
    phone: "+880 1812-987654",
    licenseNumber: "DL-2024-002",
    licenseExpiry: "2027-11-30",
    rating: 4.5,
    status: "ON_TRIP",
    experience: 6,
    assignedVehicle: "veh-002",
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "drv-003",
    name: "Md. Rahim Uddin",
    email: "rahim@example.com",
    phone: "+880 1912-456789",
    licenseNumber: "DL-2024-003",
    licenseExpiry: "2027-10-31",
    rating: 4.9,
    status: "AVAILABLE",
    experience: 10,
    createdAt: "2024-03-15T10:00:00Z",
  },
];

const VEHICLE_TYPES = ["TRUCK", "VAN", "PICKUP", "TRAILER", "CONTAINER", "CARGO"];
const FUEL_TYPES = ["DIESEL", "PETROL", "CNG", "ELECTRIC", "HYBRID"];
const CAPACITY_UNITS = ["kg", "lbs", "tons"];

const VEHICLE_STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    icon: any;
    variant: "success" | "warning" | "danger" | "info" | "default";
  }
> = {
  ACTIVE: {
    label: "Active",
    color: "text-green-600 bg-green-50 dark:bg-green-950/20",
    icon: CheckCircle,
    variant: "success",
  },
  INACTIVE: {
    label: "Inactive",
    color: "text-gray-600 bg-gray-50 dark:bg-gray-950/20",
    icon: XCircle,
    variant: "default",
  },
  MAINTENANCE: {
    label: "Maintenance",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20",
    icon: Wrench,
    variant: "warning",
  },
  REPAIR: {
    label: "Repair",
    color: "text-red-600 bg-red-50 dark:bg-red-950/20",
    icon: AlertTriangle,
    variant: "danger",
  },
  AVAILABLE: {
    label: "Available",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
    icon: CheckCircle,
    variant: "info",
  },
  ON_TRIP: {
    label: "On Trip",
    color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20",
    icon: Navigation,
    variant: "info",
  },
};

export default function AdminFleetManagementPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicles");

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      registrationNumber: "",
      type: "TRUCK",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      capacity: 0,
      capacityUnit: "kg",
      fuelType: "DIESEL",
      driverId: "",
      mileage: 0,
      lastService: "",
      nextService: "",
      insuranceExpiry: "",
      registrationExpiry: "",
      fuelLevel: 50,
      fuelConsumption: 0,
      notes: "",
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setVehicles(mockVehicles);
      setDrivers(mockDrivers);
    } catch (error) {
      console.error("Failed to load fleet data:", error);
      toast.error("Failed to load fleet data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = async (data: VehicleFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newVehicle: Vehicle = {
        id: `veh-${Date.now()}`,
        ...data,
        status: "AVAILABLE",
        location: {
          lat: 23.8103,
          lng: 90.4125,
          address: "Dhaka, Bangladesh",
          lastUpdated: new Date().toISOString(),
        },
        trips: 0,
        totalDistance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;
      setVehicles([newVehicle, ...vehicles]);
      setIsAddDialogOpen(false);
      form.reset();
      toast.success("Vehicle added successfully");
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      toast.error("Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVehicle = async (data: VehicleFormValues) => {
    if (!selectedVehicle) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedVehicles = vehicles.map((v) =>
        v.id === selectedVehicle.id
          ? { ...v, ...data, updatedAt: new Date().toISOString() }
          : v
      );
      setVehicles(updatedVehicles);
      setIsEditDialogOpen(false);
      toast.success("Vehicle updated successfully");
    } catch (error) {
      console.error("Failed to update vehicle:", error);
      toast.error("Failed to update vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVehicles(vehicles.filter((v) => v.id !== selectedVehicle.id));
      setIsDeleteDialogOpen(false);
      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      toast.error("Failed to delete vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = VEHICLE_STATUS_CONFIG[status];
    if (!config) return <Badge>{status}</Badge>;
    const Icon = config.icon;
    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
          config.color
        )}
        variant="outline"
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "ALL" || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your vehicles, drivers, and fleet operations
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90"
            onClick={() => {
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="vehicles" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Drivers
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* ===== VEHICLES TAB ===== */}
        <TabsContent value="vehicles" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Vehicles
                    </p>
                    <p className="text-2xl font-bold">{vehicles.length}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Available
                    </p>
                    <p className="text-2xl font-bold">
                      {vehicles.filter((v) => v.status === "AVAILABLE" || v.status === "ACTIVE").length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      On Trip
                    </p>
                    <p className="text-2xl font-bold">
                      {vehicles.filter((v) => v.status === "ON_TRIP").length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Maintenance
                    </p>
                    <p className="text-2xl font-bold">
                      {vehicles.filter((v) => v.status === "MAINTENANCE" || v.status === "REPAIR").length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by registration, brand, model..."
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
                {Object.entries(VEHICLE_STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Vehicles Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Vehicles</CardTitle>
                  <CardDescription>
                    {filteredVehicles.length} vehicles found
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredVehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Vehicles Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                      setTypeFilter("ALL");
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
                        <TableHead>Vehicle</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Registration
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Driver
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Fuel
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Next Service
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.map((vehicle) => (
                        <TableRow
                          key={vehicle.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Car className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {vehicle.brand} {vehicle.model}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.type} • {vehicle.year}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              <p className="font-medium">
                                {vehicle.registrationNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {vehicle.color}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {vehicle.driver ? (
                              <div>
                                <p className="font-medium">
                                  {vehicle.driver.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.driver.phone}
                                </p>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Not assigned
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(vehicle.status)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Fuel className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {vehicle.fuelLevel}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                  className={cn(
                                    "h-1.5 rounded-full transition-all",
                                    vehicle.fuelLevel > 60
                                      ? "bg-green-500"
                                      : vehicle.fuelLevel > 30
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  )}
                                  style={{ width: `${vehicle.fuelLevel}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div>
                              <p className="text-sm">
                                {formatDate(vehicle.nextService)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {vehicle.mileage.toLocaleString()} km
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedVehicle(vehicle);
                                    setIsDetailsDialogOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedVehicle(vehicle);
                                    form.reset(vehicle);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedVehicle(vehicle);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== DRIVERS TAB ===== */}
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Drivers</CardTitle>
              <CardDescription>
                Manage your drivers and their assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((driver) => (
                  <Card key={driver.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {driver.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{driver.rating}</span>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                          <span>License: {driver.licenseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Expires: {formatDate(driver.licenseExpiry)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{driver.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              driver.status === "AVAILABLE"
                                ? "bg-green-500/10 text-green-500"
                                : driver.status === "ON_TRIP"
                                ? "bg-purple-500/10 text-purple-500"
                                : driver.status === "ON_LEAVE"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-gray-500/10 text-gray-500"
                            )}
                          >
                            {driver.status}
                          </Badge>
                          {driver.assignedVehicle && (
                            <Badge variant="outline" className="text-xs">
                              Vehicle Assigned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MAINTENANCE TAB ===== */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Upcoming and scheduled maintenance for vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles
                  .filter((v) => v.status === "MAINTENANCE" || v.status === "REPAIR")
                  .map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {vehicle.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Next: {formatDate(vehicle.nextService)}
                        </p>
                      </div>
                    </div>
                  ))}
                {vehicles.filter((v) => v.status === "MAINTENANCE" || v.status === "REPAIR")
                  .length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">All Vehicles in Good Condition</h3>
                    <p className="text-sm text-muted-foreground">
                      No vehicles currently in maintenance or repair
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ANALYTICS TAB ===== */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Performance</CardTitle>
                <CardDescription>
                  Key performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">
                      {vehicles.reduce((acc, v) => acc + v.trips, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">
                      {(vehicles.reduce((acc, v) => acc + v.totalDistance, 0) / 1000).toFixed(1)}k
                    </p>
                    <p className="text-sm text-muted-foreground">Total Distance (km)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Fuel Efficiency</CardTitle>
                <CardDescription>
                  Average fuel consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">
                          {vehicle.brand} {vehicle.model}
                        </span>
                        <span className="text-sm font-medium">
                          {vehicle.fuelConsumption} km/L
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.min((vehicle.fuelConsumption / 25) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ===== ADD VEHICLE DIALOG ===== */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Enter the vehicle details to add to the fleet
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddVehicle)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="DHA-12-3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VEHICLE_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0) + type.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Scania" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="R450" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2024"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="White" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                  name="capacityUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity Unit</FormLabel>
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
                          {CAPACITY_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FUEL_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0) + type.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Vehicle"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ===== DELETE VEHICLE DIALOG ===== */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vehicle? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="py-4">
              <p className="font-medium">{selectedVehicle.registrationNumber}</p>
              <p className="text-sm text-muted-foreground">
                {selectedVehicle.brand} {selectedVehicle.model}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteVehicle}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Vehicle"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}