// src/pages/admin/RFQ/AdminRFQAnalyticsPage.tsx
import { useState } from "react";
import {
  FileSpreadsheet,
  Clock,
  CheckCircle,
  DollarSign,
  Users,

  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,

  Target,
  Send,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// 🔥 Import API
import { useGetRFQAnalyticsQuery } from "@/redux/features/rfq/rfq.api";

const COLORS = [
  "#0F52BA",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  APPROVED: {
    label: "Approved",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  QUOTED: {
    label: "Quoted",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  CONVERTED_TO_ORDER: {
    label: "Converted",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
  },
};

export default function AdminRFQAnalyticsPage() {
  const [dateRange, setDateRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("overview");

  // 🔥 API Call
  const { data, isLoading, error, refetch } = useGetRFQAnalyticsQuery({
    dateRange,
  });

  const analyticsData = data?.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num || 0);
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

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status];
    if (!config) return <Badge>{status}</Badge>;
    return (
      <Badge
        className={cn(
          "flex items-center gap-1.5 px-2 py-0.5 text-xs",
          config.bgColor,
          config.color
        )}
        variant="outline"
      >
        {config.label}
      </Badge>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  // Error
  if (error || !analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">No Data Available</h2>
        <p className="text-muted-foreground mt-2">
          Unable to load analytics data. Please try again.
        </p>
        <Button className="mt-6" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-background to-background/50 min-h-screen">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">RFQ Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track RFQ performance and conversion metrics
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* ===== OVERVIEW STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total RFQs
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(analyticsData.overview?.totalRFQs)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(analyticsData.overview?.totalValue)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview?.conversionRate || 0}%
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Response
                </p>
                <p className="text-2xl font-bold">
                  {analyticsData.overview?.avgResponseTime || 0}h
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== STATUS BREAKDOWN ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Pending", count: analyticsData.overview?.pendingCount || 0, color: "yellow" },
          { label: "Approved", count: analyticsData.overview?.approvedCount || 0, color: "green" },
          { label: "Rejected", count: analyticsData.overview?.rejectedCount || 0, color: "red" },
          { label: "Quoted", count: analyticsData.overview?.quotedCount || 0, color: "purple" },
          { label: "Converted", count: analyticsData.overview?.convertedCount || 0, color: "indigo" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-xl font-bold text-${item.color}-600`}>
                    {item.count}
                  </p>
                </div>
                <Badge className={`bg-${item.color}-500/10 text-${item.color}-600`}>
                  {item.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== TABS ===== */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customers
          </TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>RFQ Trend</CardTitle>
                <CardDescription>
                  Daily RFQ submissions and value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {analyticsData.trends?.daily?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData.trends.daily}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#0F52BA"
                          fill="#0F52BA"
                          fillOpacity={0.2}
                          name="RFQs"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RFQ by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {analyticsData.performance?.byStatus?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analyticsData.performance.byStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${entry.count}`}
                          outerRadius={80}
                          dataKey="count"
                        >
                          {analyticsData.performance.byStatus.map(
                            (_: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RFQ by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {analyticsData.performance?.byPriority?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analyticsData.performance.byPriority}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${entry.count}`}
                          outerRadius={80}
                          dataKey="count"
                        >
                          {analyticsData.performance.byPriority.map(
                            (_: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[(index + 3) % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== TRENDS TAB ===== */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly RFQ Performance</CardTitle>
              <CardDescription>
                Monthly RFQ submissions and value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {analyticsData.trends?.monthly?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.trends.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="count" fill="#0F52BA" name="RFQs" />
                      <Bar dataKey="value" fill="#10B981" name="Value" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== CATEGORIES TAB ===== */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>RFQ by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {analyticsData.performance?.byCategory?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.performance.byCategory}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#0F52BA" name="RFQs" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {analyticsData.performance?.byCategory?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analyticsData.performance.byCategory}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label={(entry: any) =>
                            `${entry.name}: ${formatCurrency(entry.value)}`
                          }
                        >
                          {analyticsData.performance.byCategory.map(
                            (_: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[(index + 2) % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== CUSTOMERS TAB ===== */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by RFQ</CardTitle>
              <CardDescription>Most active RFQ customers</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.performance?.byCustomer?.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.performance.byCustomer.map(
                    (customer: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer.count} RFQs • {customer.conversion}%
                              conversion
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {formatCurrency(customer.value)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  No customer data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== RECENT ACTIVITIES ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Recent RFQ Activities</CardTitle>
          <CardDescription>Latest RFQ events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsData.recentActivities?.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.recentActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {activity.status === "CONVERTED_TO_ORDER" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {activity.status === "QUOTED" && (
                        <Send className="h-5 w-5 text-purple-500" />
                      )}
                      {activity.status === "APPROVED" && (
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                      )}
                      {activity.status === "REJECTED" && (
                        <ThumbsDown className="h-5 w-5 text-red-500" />
                      )}
                      {activity.status === "PENDING" && (
                        <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{activity.rfqNumber}</p>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.customer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatCurrency(activity.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No recent activities
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}