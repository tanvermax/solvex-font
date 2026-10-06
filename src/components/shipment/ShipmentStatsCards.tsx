// src/components/layout/AdminLayoute/Shipment/components/ShipmentStatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  RotateCcw,
} from "lucide-react";

interface Props {
  stats?: {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    returned: number;
    deliveryRate: number;
  };
  isLoading?: boolean;
  activeStatus?: string;
  onStatusClick?: (status: string) => void;
}

export default function ShipmentStatsCards({
  stats,
  isLoading,
  activeStatus,
  onStatusClick,
}: Props) {
  const cards = [
    {
      key: "ALL",
      label: "Total Shipments",
      value: stats?.total || 0,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      key: "PENDING",
      label: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-500/10",
    },
    {
      key: "IN_TRANSIT",
      label: "In Transit",
      value: stats?.inTransit || 0,
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      value: stats?.delivered || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      key: "RETURNED",
      label: "Returned",
      value: stats?.returned || 0,
      icon: RotateCcw,
      color: "text-red-600",
      bg: "bg-red-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatus === card.key;

        return (
          <Card
            key={card.key}
            onClick={() => onStatusClick?.(card.key)}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md",
              isActive && "ring-2 ring-primary/60 shadow-md"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    card.bg
                  )}
                >
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}