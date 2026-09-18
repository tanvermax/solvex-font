import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/admin.api";
import { 
  Package, 
  CheckCircle2, 
  FileSpreadsheet, 
  Truck, 
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Circle,
  Sparkles,
  Calendar,
  BarChart3,
  Activity,
  Target,
  Award,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const AdminOverviewPage = () => {
  const { data: statsData, isLoading } = useGetAdminDashboardStatsQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0F52BA] to-blue-400 blur-2xl opacity-20 animate-pulse" />
          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-[#0F52BA]/20 border-t-[#0F52BA]">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400/30 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700">Loading Dashboard...</p>
          <p className="text-sm text-muted-foreground">Fetching real-time B2B analytics</p>
        </div>
      </div>
    );
  }

  const overview = statsData?.data?.overview || statsData?.overview;
  const recentQuotations = statsData?.data?.recentQuotations || [];
  const activeShipments = statsData?.data?.activeShipments || [];

  // Chart Data
  const chartData = statsData?.data?.categories?.map((cat: any) => ({
    name: cat._id || cat.name,
    products: cat.productCount || cat.count,
  })) || [];

  // Revenue trend data
  const revenueTrend = statsData?.data?.revenueTrend || [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 150000 },
    { month: 'Mar', revenue: 180000 },
    { month: 'Apr', revenue: 140000 },
    { month: 'May', revenue: 200000 },
    { month: 'Jun', revenue: 250000 },
  ];

  // Stats Cards Data
  const statsCards = [
    {
      title: "Pending RFQs",
      value: overview?.pendingQuotations ?? 0,
      icon: FileSpreadsheet,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
      trend: "+12%",
      trendUp: true,
      description: "Awaiting approval",
    },
    {
      title: "Active Shipments",
      value: overview?.activeShipments ?? 0,
      icon: Truck,
      color: "from-blue-500 to-[#0F52BA]",
      bgColor: "bg-blue-500/10",
      iconColor: "text-[#0F52BA]",
      trend: "+8%",
      trendUp: true,
      description: "In transit",
    },
    {
      title: "Delivered Orders",
      value: overview?.completedOrders ?? 0,
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      trend: "+23%",
      trendUp: true,
      description: "Completed deliveries",
    },
    {
      title: "Total Revenue",
      value: `৳${(overview?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      trend: "+15%",
      trendUp: true,
      description: "This month",
    },
    {
      title: "Total Products",
      value: overview?.totalProducts ?? 0,
      icon: Package,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-500/10",
      iconColor: "text-rose-500",
      trend: "+5%",
      trendUp: true,
      description: "Active listings",
    },
    {
      title: "Corporate Clients",
      value: overview?.totalClients ?? 0,
      icon: Building2,
      color: "from-cyan-500 to-sky-500",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      trend: "+18%",
      trendUp: true,
      description: "Active accounts",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-600 border-green-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
      dispatched: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      "in-transit": "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
    return colors[status?.toLowerCase()] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
      dispatched: "bg-blue-500",
      delivered: "bg-emerald-500",
      "in-transit": "bg-purple-500",
    };
    return colors[status?.toLowerCase()] || "bg-gray-500";
  };

  return (
    <motion.div 
      initial="initial"
    animate="animate"
    variants={staggerContainer}
    className="space-y-8 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen"
 >
      {/* ===== HEADER ===== */}
      <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-linear-to-br from-[#0F52BA] to-blue-600 shadow-lg shadow-[#0F52BA]/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                B2B Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                <span className="text-xs text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground/70">Real-time B2B analytics</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-[#0F52BA] to-blue-600 text-white border-0 px-4 py-1.5 text-xs font-semibold shadow-md shadow-[#0F52BA]/20">
            <Activity className="h-3 w-3 mr-1.5" />
            Live Overview
          </Badge>
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:border-[#0F52BA] hover:bg-[#0F52BA]/5">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* ===== STATS GRID ===== */}
      <motion.div variants={fadeInUp} className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="relative overflow-hidden border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        {stat.title}
                      </p>
                      <p className="text-xl font-bold text-slate-800 tracking-tight">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-[10px] font-medium",
                          stat.trendUp ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {stat.trendUp ? <TrendingUp className="h-2.5 w-2.5 inline mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 inline mr-0.5" />}
                          {stat.trend}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70">
                          {stat.description}
                        </span>
                      </div>
                    </div>
                    <div className={cn("p-2 rounded-xl", stat.bgColor)}>
                      <Icon className={cn("h-4 w-4", stat.iconColor)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ===== CHARTS SECTION ===== */}
      <motion.div variants={fadeInUp} className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#0F52BA]" />
                Revenue Overview
              </CardTitle>
              <CardDescription className="text-xs">Monthly revenue trend</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-200">
                <Circle className="h-1.5 w-1.5 fill-emerald-500 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[260px] px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0F52BA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" tickFormatter={(value) => `৳${value/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    backdropFilter: 'blur(8px)',
                  }}
                  formatter={(value) => [`৳${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ fontWeight: 600, color: '#0f172a' }}
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
          </CardContent>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid gap-4 grid-cols-2">
          <Card className="shadow-sm border-slate-200/60 bg-gradient-to-br from-blue-50/50 to-white">
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Target className="h-3 w-3 inline mr-1 text-[#0F52BA]" />
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-slate-800">68.4%</p>
                <div className="flex items-center gap-2">
                  <Progress value={68.4} className="h-1.5" />
                  <span className="text-[10px] font-medium text-emerald-600">+5.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/60 bg-gradient-to-br from-emerald-50/50 to-white">
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Award className="h-3 w-3 inline mr-1 text-emerald-500" />
                  Avg. Response Time
                </p>
                <p className="text-2xl font-bold text-slate-800">2.4h</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>−18% faster</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/60 bg-gradient-to-br from-purple-50/50 to-white">
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Users className="h-3 w-3 inline mr-1 text-purple-500" />
                  Active Users
                </p>
                <p className="text-2xl font-bold text-slate-800">1,247</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600">+8.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/60 bg-gradient-to-br from-amber-50/50 to-white">
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Zap className="h-3 w-3 inline mr-1 text-amber-500" />
                  Pending Actions
                </p>
                <p className="text-2xl font-bold text-slate-800">23</p>
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>Requires attention</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* ===== TABLES SECTION ===== */}
      <motion.div variants={fadeInUp} className="grid gap-6 lg:grid-cols-2">
        {/* Recent RFQs */}
        <Card className="shadow-sm border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white border-b border-slate-100/80 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-amber-500" />
                  Recent RFQs
                </CardTitle>
                <CardDescription className="text-xs">Latest quotation requests</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl text-[#0F52BA] hover:bg-[#0F52BA]/5">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="text-xs font-semibold text-slate-600">Company</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Items</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileSpreadsheet className="h-8 w-8 text-muted-foreground/30" />
                        <span className="text-sm">No pending RFQs</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentQuotations.slice(0, 5).map((item: any, index: number) => (
                    <TableRow 
                      key={item._id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] font-medium bg-[#0F52BA]/10 text-[#0F52BA]">
                              {item.companyName?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{item.companyName || "Corporate Buyer"}</p>
                            <p className="text-[10px] text-muted-foreground">{item.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground/50" />
                          <span className="font-semibold">{item.quantity}</span>
                          <span className="text-xs text-muted-foreground">units</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-1.5 w-1.5 rounded-full", getStatusDot(item.status || "pending"))} />
                          <Badge 
                            className={cn(
                              "text-[10px] font-medium border-0",
                              getStatusColor(item.status || "pending")
                            )}
                          >
                            {item.status || "Pending"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Shipments */}
        <Card className="shadow-sm border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50/80 to-white border-b border-slate-100/80 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-500" />
                  Active Shipments
                </CardTitle>
                <CardDescription className="text-xs">Real-time fleet tracking</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl text-[#0F52BA] hover:bg-[#0F52BA]/5">
                View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="text-xs font-semibold text-slate-600">Tracking ID</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Destination</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Truck className="h-8 w-8 text-muted-foreground/30" />
                        <span className="text-sm">No active shipments</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  activeShipments.slice(0, 5).map((item: any) => (
                    <TableRow 
                      key={item._id || item.trackingId} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Package className="h-3.5 w-3.5 text-emerald-500" />
                          </div>
                          <span className="font-mono text-sm font-semibold text-[#0F52BA]">{item.trackingId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-muted-foreground/50" />
                          <span className="text-sm text-slate-600">{item.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border-0 font-medium text-[10px]">
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {item.status || "Dispatched"}
                          </div>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminOverviewPage;