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
  DollarSign
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const AdminOverviewPage = () => {
  // B2B Admin API থেকে Analytics & Overview Stats ডাটা নেওয়া হচ্ছে
  const { data: statsData, isLoading } = useGetAdminDashboardStatsQuery(undefined);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F52BA]"></div>
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading B2B Analytics...</p>
      </div>
    );
  }

  const overview = statsData?.data?.overview || statsData?.overview;
  const recentQuotations = statsData?.data?.recentQuotations || [];
  const activeShipments = statsData?.data?.activeShipments || [];

  // B2B Key Performance Indicators (KPIs)
  const cards = [
    {
      title: "Pending RFQs",
      value: overview?.pendingQuotations ?? 0,
      icon: FileSpreadsheet,
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-500",
    },
    {
      title: "Active Shipments",
      value: overview?.activeShipments ?? 0,
      icon: Truck,
      color: "from-blue-500/10 to-[#0F52BA]/5",
      iconColor: "text-[#0F52BA]",
    },
    {
      title: "Delivered Orders",
      value: overview?.completedOrders ?? 0,
      icon: CheckCircle2,
      color: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-500",
    },
    {
      title: "Total B2B Products",
      value: overview?.totalProducts ?? 0,
      icon: Package,
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
  ];

  // B2B Category-wise product density
  const chartData = statsData?.data?.categories?.map((cat: any) => ({
    name: cat._id || cat.name,
    products: cat.productCount || cat.count,
  })) || [];

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">B2B Admin Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time quotation requests, active shipments, and inventory stats.</p>
        </div>
        <Badge variant="outline" className="w-fit border-[#0F52BA]/30 text-[#0F52BA] bg-[#0F52BA]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          Live B2B Overview
        </Badge>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
              <div className={`p-6 bg-gradient-to-br ${item.color} h-full flex flex-col justify-between`}>
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </span>
                  <div className={`p-2 rounded-xl bg-white shadow-sm ${item.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {item.value}
                  </h2>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Graphical Chart & Financial Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recharts Bar Chart */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">B2B Products by Industry/Category</CardTitle>
            <CardDescription>Visual distribution of catalog items available for bulk ordering</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pr-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    cursor={{ fill: 'rgba(15, 82, 186, 0.04)' }}
                  />
                  <Bar dataKey="products" radius={[4, 4, 0, 0]}>
                    {chartData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0F52BA' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No category distribution data available</div>
            )}
          </CardContent>
        </Card>

        {/* B2B Revenue Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="shadow-sm border-slate-200/60 relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0F52BA]" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="size-4 text-[#0F52BA]" /> Total Estimated Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-baseline">
                <span className="text-[#0F52BA] mr-1.5 text-2xl font-bold">৳</span>
                {overview?.totalRevenue?.toLocaleString() ?? "0.00"}
              </h1>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/60 relative overflow-hidden bg-gradient-to-br from-white to-emerald-50/30 group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="size-4 text-emerald-600" /> Total Corporate Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {overview?.totalClients ?? 0}
              </h1>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid for Recent RFQs & Fleet Tracking */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent RFQs */}
        <Card className="shadow-sm border-slate-200/60 overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-[#0F52BA]" /> Recent RFQ Submissions
              </CardTitle>
            </div>
            <Badge className="bg-[#0F52BA] hover:bg-[#0b3e8f] text-white font-bold">Action Needed</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Company</TableHead>
                  <TableHead className="font-semibold text-slate-700">Quantity</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground text-sm">
                      No pending quotation requests.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentQuotations.slice(0, 5).map((item: any) => (
                    <TableRow key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-medium text-slate-800">
                        <div>{item.companyName || "Corporate Buyer"}</div>
                        <div className="text-xs text-muted-foreground">{item.email}</div>
                      </TableCell>
                      <TableCell className="font-semibold">{item.quantity} units</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Approved" ? "default" : "outline"} className="capitalize">
                          {item.status || "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Fleet & Logistics Status */}
        <Card className="shadow-sm border-slate-200/60 overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" /> Active Shipments
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Tracking ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Destination</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground text-sm">
                      No shipments currently in-transit.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeShipments.slice(0, 5).map((item: any) => (
                    <TableRow key={item._id || item.trackingId} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-bold text-primary">{item.trackingId}</TableCell>
                      <TableCell className="text-slate-700">{item.destination}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold capitalize">
                          {item.status || "Dispatched"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;