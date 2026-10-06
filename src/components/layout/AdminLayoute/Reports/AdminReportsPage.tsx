// src/components/layout/AdminLayoute/Reports/AdminReportsPage.tsx
import { useState } from "react";
import {
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Truck,
  RefreshCw,
  Loader2,
  FileBarChart,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetReportQuery } from "@/redux/features/reports/reports.api";

const COLORS = [
  "#0F52BA",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  PROCESSING: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  READY_TO_SHIP: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  SHIPPED: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  IN_TRANSIT: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  OUT_FOR_DELIVERY: "bg-pink-500/10 text-pink-600 border-pink-500/30",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  COMPLETED: "bg-emerald-600/10 text-emerald-700 border-emerald-600/30",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/30",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatCurrency = (n: number) => `৳${n?.toLocaleString() || 0}`;
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("last30days");
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetReportQuery({ dateRange });

  const report = response?.data;

  // ============================================
  // EXPORT (demo)
  // ============================================
  const handleExport = async (format: string) => {
    setIsExporting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success(`${format.toUpperCase()} export coming soon`);
    } finally {
      setIsExporting(false);
    }
  };

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <FileBarChart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            No report data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const { summary, charts, topCustomers, recentOrders } = report;

  // ============================================
  // STATS CARDS
  // ============================================
  const statsCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Orders",
      value: summary.totalOrders,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "New Users",
      value: summary.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      label: "Shipments",
      value: summary.totalShipments,
      icon: Truck,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
  ];

  // Format user growth for chart
  const userGrowthData = charts.userGrowth.map((u) => ({
    month: MONTHS[u.month - 1],
    users: u.users,
  }));

  return (
    <div className="space-y-5">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Business intelligence and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("excel")}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* ==================== FILTER ==================== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 sm:max-w-xs">
              <Label className="text-xs mb-1.5 block">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== SUMMARY ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1 truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ==================== TABS ==================== */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        {/* ============ OVERVIEW TAB ============ */}
        <TabsContent value="overview" className="space-y-5">
          {/* Revenue Trend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Daily revenue and orders</CardDescription>
            </CardHeader>
            <CardContent>
              {charts.revenueTrend.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No data for this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={charts.revenueTrend}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="revenueGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0F52BA"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0F52BA"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `৳${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                      formatter={(v: any) => [
                        `৳${v.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0F52BA"
                      strokeWidth={2.5}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Two Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                {charts.orderStatus.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No orders in this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={charts.orderStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(entry: any) =>
                          `${entry.name}: ${entry.value}`
                        }
                      >
                        {charts.orderStatus.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Shipment Status</CardTitle>
              </CardHeader>
              <CardContent>
                {charts.shipmentStatus.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">
                    No shipments in this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={charts.shipmentStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={(entry: any) =>
                          `${entry.name}: ${entry.value}`
                        }
                      >
                        {charts.shipmentStatus.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[(i + 2) % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ PRODUCTS TAB ============ */}
        <TabsContent value="products" className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Products</CardTitle>
              <CardDescription>
                Best performing products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {charts.topProducts.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No product sales in this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={charts.topProducts}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      type="number"
                      fontSize={11}
                      tickFormatter={(v) => `৳${v / 1000}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      fontSize={11}
                    />
                    <Tooltip
                      formatter={(v: any) => [
                        `৳${v.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                    <Bar dataKey="revenue" fill="#0F52BA" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {charts.categoryDistribution.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No category data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <RePieChart>
                    <Pie
                      data={charts.categoryDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry: any) => entry.name}
                    >
                      {charts.categoryDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => [
                        `৳${v.toLocaleString()}`,
                        "Revenue",
                      ]}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ CUSTOMERS TAB ============ */}
        <TabsContent value="customers" className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              {userGrowthData.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No user data
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={userGrowthData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8B5CF6"
                      strokeWidth={2.5}
                      dot={{ fill: "#8B5CF6", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Customers</CardTitle>
              <CardDescription>
                Highest spending customers in this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topCustomers.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No customer data
                </div>
              ) : (
                <div className="space-y-2">
                  {topCustomers.map((customer, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {customer.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="font-bold text-sm">
                          {formatCurrency(customer.totalSpent)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ RECENT TAB ============ */}
        <TabsContent value="recent">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Orders</CardTitle>
              <CardDescription>
                Latest orders in this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No orders in this period
                </div>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 bg-muted/40 rounded-lg"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold text-primary">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {order.companyInfo?.companyName}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="font-bold text-sm">
                          {formatCurrency(order.grandTotal)}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] mt-1",
                            ORDER_STATUS_COLORS[order.orderStatus] || ""
                          )}
                        >
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}