// src/pages/TrackShipment/ShipmentTrackPage.tsx
import { useState } from "react";
import { useSearchParams } from "react-router";
import {
  Search,
  Loader2,
  Package,
  AlertCircle,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetShipmentByTrackingIdQuery } from "@/redux/features/shipment/shipment.api";
import ShipmentStatusBadge, {
  STATUS_ORDER,
  SHIPMENT_STATUS_CONFIG,
  type ShipmentStatus,
} from "@/components/shipment/ShipmentStatusBadge";
import { cn } from "@/lib/utils";

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const formatDateTime = (date?: string) =>
  date
    ? new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function ShipmentTrackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get("trackingId") || "";
  const [input, setInput] = useState(initialId);
  const [trackingId, setTrackingId] = useState(initialId);
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, error } = useGetShipmentByTrackingIdQuery(
    trackingId,
    { skip: !trackingId }
  );

  const shipment = data?.data;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;
    setSearchParams({ trackingId: trimmed });
    setTrackingId(trimmed);
  };

  const handleCopy = () => {
    if (!shipment) return;
    navigator.clipboard.writeText(shipment.trackingId);
    setCopied(true);
    toast.success("Tracking ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const currentIndex = shipment
    ? STATUS_ORDER.indexOf(shipment.currentStatus as ShipmentStatus)
    : -1;

  return (
    <div className="min-h-[80vh] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Truck className="h-3.5 w-3.5" />
            Shipment Tracking
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your tracking ID to see real-time status updates
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter tracking ID (e.g., TRK-2025-000001)"
                  value={input}
                  onChange={(e) => setInput(e.target.value.toUpperCase())}
                  className="pl-9 font-mono"
                />
              </div>
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Track"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading */}
        {isLoading && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        )}

        {/* Error / Not Found */}
        {isError && (
          <Card className="border-destructive/30">
            <CardContent className="p-8 text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold">Shipment Not Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {(error as any)?.data?.message ||
                  "We couldn't find a shipment with that tracking ID. Please check and try again."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {shipment && !isLoading && (
          <div className="space-y-5">
            {/* Tracking Header */}
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-mono font-bold text-sm">
                          {shipment.trackingId}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Order: {shipment.orderNumber}
                      </p>
                    </div>
                  </div>
                  <ShipmentStatusBadge
                    status={shipment.currentStatus as ShipmentStatus}
                    size="lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            {shipment.currentStatus !== "CANCELLED" &&
              shipment.currentStatus !== "RETURNED" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Delivery Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Desktop horizontal */}
                    <div className="hidden md:block">
                      <div className="relative">
                        {/* Progress line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                        <div
                          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                          style={{
                            width: `${(currentIndex / (STATUS_ORDER.length - 1)) * 100}%`,
                          }}
                        />

                        {/* Steps */}
                        <div className="relative flex justify-between">
                          {STATUS_ORDER.map((status, index) => {
                            const config = SHIPMENT_STATUS_CONFIG[status];
                            const Icon = config.icon;
                            const isDone = index <= currentIndex;

                            return (
                              <div
                                key={status}
                                className="flex flex-col items-center gap-2 flex-1"
                              >
                                <div
                                  className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                                    isDone
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background border-border text-muted-foreground"
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <p
                                  className={cn(
                                    "text-[10px] font-medium text-center",
                                    isDone
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {config.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Mobile vertical */}
                    <div className="md:hidden space-y-3">
                      {STATUS_ORDER.map((status, index) => {
                        const config = SHIPMENT_STATUS_CONFIG[status];
                        const Icon = config.icon;
                        const isDone = index <= currentIndex;

                        return (
                          <div key={status} className="flex items-start gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center border-2 shrink-0",
                                isDone
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background border-border text-muted-foreground"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 pt-1">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  isDone
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {config.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Shipment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carrier</span>
                    <span className="font-medium">
                      {shipment.carrierName || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">
                      {shipment.serviceType || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">
                      {shipment.packageInfo?.weight}{" "}
                      {shipment.packageInfo?.weightUnit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Delivery
                    </span>
                    <span className="font-medium">
                      {formatDate(shipment.estimatedDeliveryDate)}
                    </span>
                  </div>
                  {shipment.actualDeliveryDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivered On
                      </span>
                      <span className="font-medium text-emerald-600">
                        {formatDate(shipment.actualDeliveryDate)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      <p className="font-medium">
                        {shipment.shippingAddress?.contactPerson ||
                          shipment.customer?.name}
                      </p>
                      <p className="text-muted-foreground">
                        {shipment.shippingAddress?.address}
                      </p>
                      <p className="text-muted-foreground">
                        {shipment.shippingAddress?.city}
                        {shipment.shippingAddress?.zone &&
                          `, ${shipment.shippingAddress.zone}`}
                      </p>
                      {shipment.shippingAddress?.phone && (
                        <p className="text-muted-foreground font-mono text-xs pt-1">
                          {shipment.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status History Timeline */}
            {shipment.statusHistory && shipment.statusHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tracking History</CardTitle>
                  <CardDescription>
                    Full update log for this shipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...shipment.statusHistory]
                      .reverse()
                      .map((entry, index) => {
                        const config =
                          SHIPMENT_STATUS_CONFIG[
                            entry.status as ShipmentStatus
                          ];
                        const Icon = config?.icon || Clock;
                        const isLatest = index === 0;

                        return (
                          <div key={index} className="flex gap-4">
                            {/* Timeline dot */}
                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                  isLatest
                                    ? `${config?.bgColor} ${config?.textColor}`
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              {index <
                                shipment.statusHistory.length - 1 && (
                                <div className="flex-1 w-px bg-border my-1" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <p className="font-medium text-sm">
                                  {config?.label || entry.status}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {formatDateTime(entry.updatedAt)}
                                </span>
                              </div>
                              {entry.location && (
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {entry.location}
                                </p>
                              )}
                              {entry.note && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {entry.note}
                                </p>
                              )}
                              {entry.updatedByName && (
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                  Updated by {entry.updatedByName}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Items */}
            {shipment.items && shipment.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Items in this Shipment
                  </CardTitle>
                  <CardDescription>
                    {shipment.items.length} product
                    {shipment.items.length > 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {shipment.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {item.productName}
                          </p>
                          {item.sku && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              SKU: {item.sku}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Qty: {item.quantity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!trackingId && !isLoading && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-base font-semibold">
                Enter Tracking ID to Begin
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                You can find your tracking ID in your order confirmation email
                or in your account dashboard.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}