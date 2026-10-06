// src/components/layout/AdminLayoute/Overview/Adminoverviewpage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/admin.api";
import {
  Package,
  Truck,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  Users,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

// ============================================
// Status Badge Config
// ============================================
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

export default function AdminOverviewPage() {
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminDashboardStatsQuery(undefined);

  const stats = response?.data;

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  const overview = stats?.overview;
  const revenueTrend = stats?.revenueTrend || [];
  const recentOrders = stats?.recentOrders || [];
  const recentShipments = stats?.recentShipments || [];

  // ============================================
  // TOP STATS (4 cards)
  // ============================================
  const topStats = [
    {
      title: "Total Revenue",
      value: `৳${(overview?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      sub: `${overview?.completedOrders || 0} completed orders`,
      link: "/admin/orders",
    },
    {
      title: "Total Orders",
      value: overview?.totalOrders || 0,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: `${overview?.pendingOrders || 0} pending`,
      link: "/admin/orders",
    },
    {
      title: "Active Shipments",
      value: overview?.activeShipments || 0,
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      sub: `${overview?.deliveredOrders || 0} delivered`,
      link: "/admin/shipments",
    },
    {
      title: "Pending RFQs",
      value: overview?.pendingQuotations || 0,
      icon: FileSpreadsheet,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      sub: "Awaiting review",
      link: "/admin/quotations",
    },
  ];

  // ============================================
  // SECONDARY STATS (4 cards)
  // ============================================
  const secondaryStats = [
    {
      label: "Processing",
      value: overview?.processingOrders || 0,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Completed",
      value: overview?.completedOrders || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Products",
      value: overview?.totalProducts || 0,
      icon: Package,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
    {
      label: "Users",
      value: overview?.totalUsers || 0,
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ==================== HEADER ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Overview of your B2B operations
          </p>
        </div>
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
      </div>

      {/* ==================== TOP STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              onClick={() => navigate(stat.link)}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/40"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1 truncate">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      {stat.sub}
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

      {/* ==================== SECONDARY STATS ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {secondaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    stat.bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold truncate">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ==================== REVENUE CHART ==================== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Last 6 months performance
            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1 text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
            <TrendingUp className="h-3 w-3" />
            Live
          </Badge>
        </CardHeader>
        <CardContent>
          {revenueTrend.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <TrendingUp className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                No revenue data yet
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={revenueTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
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
                <XAxis
                  dataKey="month"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94a3b8"
                  tickFormatter={(v) => `৳${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ==================== RECENT ACTIVITY ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Recent Orders
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/admin/orders")}
            >
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Order</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order: any) => (
                    <TableRow
                      key={order._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        navigate(`/admin/orders/${order._id}`)
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-mono text-xs font-semibold text-primary">
                            {order.orderNumber}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                            {order.companyInfo?.companyName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="font-medium text-sm">
                          ৳{order.grandTotal?.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-medium",
                            ORDER_STATUS_COLORS[order.orderStatus] || ""
                          )}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Shipments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4 text-purple-600" />
              Recent Shipments
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => navigate("/admin/shipments")}
            >
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentShipments.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No shipments yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Tracking</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">
                      Customer
                    </TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentShipments.map((shipment: any) => (
                    <TableRow
                      key={shipment._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        navigate(`/admin/shipments/${shipment._id}`)
                      }
                    >
                      <TableCell>
                        <p className="font-mono text-xs font-semibold text-primary">
                          {shipment.trackingId}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <p className="text-sm truncate max-w-[140px]">
                          {shipment.customer?.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium bg-purple-500/10 text-purple-600 border-purple-500/30"
                        >
                          {shipment.currentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}