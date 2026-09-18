// src/pages/admin/Fleet/AdminRouteOptimizationPage.tsx
import { useState, useEffect } from "react";
import {
  Route,
  MapPin,
  Navigation,
  Truck,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Users,
  Package,
  Fuel,
  Gauge,
  Zap,
  Award,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft,
  Home,
  Building,
  Store,
  Warehouse,
  Pin,
  LocateFixed,
  Move,
  Grid,
  Layers,
  Minimize,
  Maximize,
  Settings,
  Globe,
  Map,
  Compass,
  Waypoints,
  BarChart3,
  PieChart,
  LineChart,
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
interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "warehouse" | "customer" | "hub" | "store";
  contact?: string;
  phone?: string;
  priority: number;
  timeWindow?: {
    start: string;
    end: string;
  };
  deliveryInfo?: {
    weight: number;
    items: number;
    specialInstructions?: string;
  };
}

interface Route {
  id: string;
  name: string;
  description: string;
  startLocation: Location;
  endLocation: Location;
  waypoints: Location[];
  totalDistance: number;
  totalTime: number;
  estimatedFuel: number;
  estimatedCost: number;
  status: "OPTIMAL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";
  vehicleId: string;
  driverId: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

interface OptimizedRoute {
  route: Route;
  path: Location[];
  distance: number;
  time: number;
  fuel: number;
  cost: number;
  stops: number;
  efficiency: number;
  suggestedVehicle: string;
  suggestedDriver: string;
}

// Mock Data
const mockLocations: Location[] = [
  {
    id: "loc-001",
    name: "Main Warehouse",
    address: "125, New Elephant Road, Dhaka-1205",
    lat: 23.8103,
    lng: 90.4125,
    type: "warehouse",
    contact: "Md. Rahman",
    phone: "+880 1712-345678",
    priority: 1,
  },
  {
    id: "loc-002",
    name: "Islam Industries",
    address: "45, Industrial Area, Savar, Dhaka",
    lat: 23.8584,
    lng: 90.2664,
    type: "customer",
    contact: "Mr. Islam",
    phone: "+880 1812-987654",
    priority: 2,
    timeWindow: {
      start: "09:00",
      end: "17:00",
    },
    deliveryInfo: {
      weight: 250,
      items: 5,
      specialInstructions: "Fragile items, handle with care",
    },
  },
  {
    id: "loc-003",
    name: "Akhter Group",
    address: "88, Motijheel Commercial Area, Dhaka-1000",
    lat: 23.7330,
    lng: 90.4196,
    type: "customer",
    contact: "Mr. Akhter",
    phone: "+880 1912-456789",
    priority: 1,
    timeWindow: {
      start: "10:00",
      end: "18:00",
    },
    deliveryInfo: {
      weight: 150,
      items: 3,
    },
  },
  {
    id: "loc-004",
    name: "Hossain & Brothers",
    address: "22, Gulshan Avenue, Dhaka-1212",
    lat: 23.7911,
    lng: 90.4144,
    type: "customer",
    contact: "Mr. Hossain",
    phone: "+880 1712-345678",
    priority: 3,
    timeWindow: {
      start: "11:00",
      end: "19:00",
    },
    deliveryInfo: {
      weight: 380,
      items: 8,
      specialInstructions: "Call 30 min before arrival",
    },
  },
  {
    id: "loc-005",
    name: "Sultana Enterprise",
    address: "56, Mirpur Road, Dhaka-1216",
    lat: 23.8069,
    lng: 90.3669,
    type: "customer",
    contact: "Mrs. Sultana",
    phone: "+880 1612-789012",
    priority: 2,
    timeWindow: {
      start: "09:00",
      end: "16:00",
    },
    deliveryInfo: {
      weight: 120,
      items: 2,
    },
  },
  {
    id: "loc-006",
    name: "Distribution Hub - Chittagong",
    address: "15, Chittagong Port Area, Chittagong-4000",
    lat: 22.3569,
    lng: 91.7832,
    type: "hub",
    contact: "Mr. Kamal",
    phone: "+880 1812-345678",
    priority: 1,
  },
  {
    id: "loc-007",
    name: "Rafiq Traders",
    address: "33, New Market, Chittagong-4000",
    lat: 22.3384,
    lng: 91.8316,
    type: "customer",
    contact: "Mr. Rafiq",
    phone: "+880 1912-456789",
    priority: 3,
    deliveryInfo: {
      weight: 90,
      items: 2,
    },
  },
];

const mockRoutes: Route[] = [
  {
    id: "route-001",
    name: "Dhaka City Delivery Route",
    description: "Daily delivery route covering Dhaka city customers",
    startLocation: mockLocations[0],
    endLocation: mockLocations[0],
    waypoints: [mockLocations[1], mockLocations[2], mockLocations[3], mockLocations[4]],
    totalDistance: 45.6,
    totalTime: 4.5,
    estimatedFuel: 8.2,
    estimatedCost: 2850,
    status: "OPTIMAL",
    vehicleId: "veh-001",
    driverId: "drv-001",
    createdAt: "2026-09-08T08:00:00Z",
    notes: "Optimized route for maximum efficiency",
  },
  {
    id: "route-002",
    name: "Chittagong Delivery Route",
    description: "Delivery route for Chittagong region",
    startLocation: mockLocations[5],
    endLocation: mockLocations[5],
    waypoints: [mockLocations[6]],
    totalDistance: 28.3,
    totalTime: 2.8,
    estimatedFuel: 5.1,
    estimatedCost: 1850,
    status: "PENDING",
    vehicleId: "veh-002",
    driverId: "drv-002",
    createdAt: "2026-09-08T09:00:00Z",
  },
];

// Zod Schema for Route Optimization
const routeOptimizationSchema = z.object({
  name: z.string().min(1, "Route name is required"),
  description: z.string().optional(),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  waypoints: z.array(z.string()).min(1, "At least one waypoint is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
  priority: z.enum(["TIME", "DISTANCE", "COST", "BALANCED"]),
  notes: z.string().optional(),
});

type RouteOptimizationFormValues = z.infer<typeof routeOptimizationSchema>;

export default function AdminRouteOptimizationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const form = useForm<RouteOptimizationFormValues>({
    resolver: zodResolver(routeOptimizationSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      startLocation: "",
      endLocation: "",
      waypoints: [],
      vehicleId: "",
      driverId: "",
      priority: "BALANCED",
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
      setLocations(mockLocations);
      setRoutes(mockRoutes);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load route data");
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeRoute = async (data: RouteOptimizationFormValues) => {
    setIsOptimizing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Find selected locations
      const startLoc = locations.find((l) => l.id === data.startLocation);
      const endLoc = locations.find((l) => l.id === data.endLocation);
      const waypointLocs = data.waypoints.map((id) =>
        locations.find((l) => l.id === id)
      ).filter(Boolean) as Location[];

      if (!startLoc || !endLoc) {
        toast.error("Invalid start or end location");
        return;
      }

      // Calculate route (mock calculation)
      const totalDistance = 25 + Math.random() * 50;
      const totalTime = 2 + Math.random() * 4;
      const fuel = totalDistance * 0.18;
      const cost = totalDistance * 62;

      const optimizedRouteData: OptimizedRoute = {
        route: {
          id: `route-${Date.now()}`,
          name: data.name,
          description: data.description || "",
          startLocation: startLoc,
          endLocation: endLoc,
          waypoints: waypointLocs,
          totalDistance: Math.round(totalDistance * 10) / 10,
          totalTime: Math.round(totalTime * 10) / 10,
          estimatedFuel: Math.round(fuel * 10) / 10,
          estimatedCost: Math.round(cost),
          status: "OPTIMAL",
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          createdAt: new Date().toISOString(),
          notes: data.notes,
        },
        path: [startLoc, ...waypointLocs, endLoc],
        distance: Math.round(totalDistance * 10) / 10,
        time: Math.round(totalTime * 10) / 10,
        fuel: Math.round(fuel * 10) / 10,
        cost: Math.round(cost),
        stops: waypointLocs.length + 2,
        efficiency: Math.round(80 + Math.random() * 15),
        suggestedVehicle: "Scania R450",
        suggestedDriver: "Md. Jahirul Islam",
      };

      setOptimizedRoute(optimizedRouteData);
      toast.success("Route optimized successfully");
    } catch (error) {
      console.error("Failed to optimize route:", error);
      toast.error("Failed to optimize route");
    } finally {
      setIsOptimizing(false);
    }
  };

  const saveRoute = async () => {
    if (!optimizedRoute) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setRoutes([optimizedRoute.route, ...routes]);
      setIsOptimizeDialogOpen(false);
      setOptimizedRoute(null);
      toast.success("Route saved successfully");
    } catch (error) {
      console.error("Failed to save route:", error);
      toast.error("Failed to save route");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDistance = (distance: number) => {
    return distance < 1
      ? `${(distance * 1000).toFixed(0)} m`
      : `${distance.toFixed(1)} km`;
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case "warehouse":
        return Warehouse;
      case "customer":
        return Building;
      case "hub":
        return Store;
      case "store":
        return Store;
      default:
        return MapPin;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPTIMAL":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Optimal
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <RefreshCw className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || route.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
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
          <h1 className="text-2xl font-bold">Route Optimization</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Optimize delivery routes for maximum efficiency and cost savings
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
            onClick={() => setIsOptimizeDialogOpen(true)}
          >
            <Route className="h-4 w-4 mr-2" />
            Optimize Route
          </Button>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Routes
                </p>
                <p className="text-2xl font-bold">{routes.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Route className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Optimized
                </p>
                <p className="text-2xl font-bold">
                  {routes.filter((r) => r.status === "OPTIMAL").length}
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
                  Total Distance
                </p>
                <p className="text-2xl font-bold">
                  {routes.reduce((sum, r) => sum + r.totalDistance, 0).toFixed(1)} km
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Cost
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    routes.reduce((sum, r) => sum + r.estimatedCost, 0)
                  )}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes..."
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
            <SelectItem value="OPTIMAL">Optimal</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== ROUTES LIST ===== */}
      {filteredRoutes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Route className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Routes Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "ALL"
                ? "Try adjusting your search or filter criteria"
                : "Create your first optimized route to get started"}
            </p>
            {(searchTerm || statusFilter !== "ALL") && (
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
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <Card
              key={route.id}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                setSelectedRoute(route);
                setIsDetailsDialogOpen(true);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold">{route.name}</h3>
                      {getStatusBadge(route.status)}
                      <Badge variant="outline" className="text-xs">
                        {route.waypoints.length + 2} stops
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {route.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {formatDistance(route.totalDistance)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(route.totalTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        {route.estimatedFuel} L
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(route.estimatedCost)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoute(route);
                        setIsDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ===== OPTIMIZE ROUTE DIALOG ===== */}
      <Dialog
        open={isOptimizeDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsOptimizeDialogOpen(false);
            setOptimizedRoute(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Optimize Delivery Route</DialogTitle>
            <DialogDescription>
              Enter route details to find the most efficient path
            </DialogDescription>
          </DialogHeader>

          {!optimizedRoute ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(optimizeRoute)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Dhaka Delivery Route" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Optimization Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TIME">Minimize Time</SelectItem>
                            <SelectItem value="DISTANCE">Minimize Distance</SelectItem>
                            <SelectItem value="COST">Minimize Cost</SelectItem>
                            <SelectItem value="BALANCED">Balanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the route" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select start location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name}
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
                    name="endLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select end location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="waypoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waypoints (Delivery Locations)</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const current = field.value || [];
                          if (!current.includes(value)) {
                            field.onChange([...current, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Add delivery locations" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations
                            .filter(
                              (loc) =>
                                loc.type === "customer" &&
                                !field.value?.includes(loc.id)
                            )
                            .map((loc) => (
                              <SelectItem key={loc.id} value={loc.id}>
                                {loc.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((id) => {
                          const loc = locations.find((l) => l.id === id);
                          return loc ? (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {loc.name}
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter((v) => v !== id)
                                  );
                                }}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="veh-001">Scania R450 (DHA-12-3456)</SelectItem>
                            <SelectItem value="veh-002">Toyota Hiace (DHA-98-7654)</SelectItem>
                            <SelectItem value="veh-003">Ford Ranger (DHA-55-7890)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="driverId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select driver" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="drv-001">Md. Jahirul Islam</SelectItem>
                            <SelectItem value="drv-002">Md. Kamal Hossain</SelectItem>
                            <SelectItem value="drv-003">Md. Rahim Uddin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes for this route..."
                          className="h-16"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOptimizeDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isOptimizing}>
                    {isOptimizing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Route className="h-4 w-4 mr-2" />
                        Optimize Route
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            // Optimized Route Results
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-600">
                    Route Optimized!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Found the most efficient route
                  </p>
                </div>
                <Badge className="bg-green-500/10 text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Optimal
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <Navigation className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold">
                    {formatDistance(optimizedRoute.distance)}
                  </p>
                  <p className="text-xs text-muted-foreground">Distance</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">
                    {formatTime(optimizedRoute.time)}
                  </p>
                  <p className="text-xs text-muted-foreground">Time</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <Fuel className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">
                    {optimizedRoute.fuel.toFixed(1)} L
                  </p>
                  <p className="text-xs text-muted-foreground">Fuel</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <DollarSign className="h-5 w-5 text-green-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">
                    {formatCurrency(optimizedRoute.cost)}
                  </p>
                  <p className="text-xs text-muted-foreground">Cost</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Route Path</h4>
                <div className="space-y-2">
                  {optimizedRoute.path.map((loc, index) => (
                    <div
                      key={loc.id}
                      className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{loc.name}</p>
                        <p className="text-xs text-muted-foreground">{loc.address}</p>
                      </div>
                      {index < optimizedRoute.path.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Suggested Vehicle</p>
                  <p className="font-medium">{optimizedRoute.suggestedVehicle}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Suggested Driver</p>
                  <p className="font-medium">{optimizedRoute.suggestedDriver}</p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOptimizedRoute(null);
                    setIsOptimizeDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOptimizedRoute(null)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-optimize
                </Button>
                <Button type="button" onClick={saveRoute}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Route
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== ROUTE DETAILS DIALOG ===== */}
      <Dialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRoute && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedRoute.name}</DialogTitle>
                    <DialogDescription>
                      {selectedRoute.description}
                    </DialogDescription>
                  </div>
                  {getStatusBadge(selectedRoute.status)}
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Route Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-bold">{formatDistance(selectedRoute.totalDistance)}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-bold">{formatTime(selectedRoute.totalTime)}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Fuel</p>
                    <p className="font-bold">{selectedRoute.estimatedFuel} L</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-bold">{formatCurrency(selectedRoute.estimatedCost)}</p>
                  </div>
                </div>

                <Separator />

                {/* Route Path */}
                <div>
                  <h4 className="font-medium mb-3">Route Path</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <Home className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{selectedRoute.startLocation.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedRoute.startLocation.address}
                        </p>
                      </div>
                    </div>

                    {selectedRoute.waypoints.map((loc, index) => (
                      <div
                        key={loc.id}
                        className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{loc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {loc.address}
                          </p>
                          {loc.deliveryInfo && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>Weight: {loc.deliveryInfo.weight} kg</span>
                              <span>Items: {loc.deliveryInfo.items}</span>
                              {loc.timeWindow && (
                                <span>
                                  {loc.timeWindow.start} - {loc.timeWindow.end}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <MapPin className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">{selectedRoute.endLocation.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedRoute.endLocation.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Route Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-medium">Scania R450 (DHA-12-3456)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Driver</p>
                    <p className="font-medium">Md. Jahirul Islam</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(selectedRoute.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stops</p>
                    <p className="font-medium">{selectedRoute.waypoints.length + 2}</p>
                  </div>
                </div>

                {selectedRoute.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedRoute.notes}</p>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    <Navigation className="h-4 w-4 mr-2" />
                    Start Route
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}