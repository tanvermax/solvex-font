// src/components/layout/AdminLayoute/Shipment/components/ShipmentStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Clock,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

export type ShipmentStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const SHIPMENT_STATUS_CONFIG: Record<ShipmentStatus, StatusConfig> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-500/30",
  },
  PICKED_UP: {
    label: "Picked Up",
    icon: Package,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-500/30",
  },
  IN_TRANSIT: {
    label: "In Transit",
    icon: Truck,
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-500/30",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    icon: MapPin,
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-500/30",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-500/30",
  },
  RETURNED: {
    label: "Returned",
    icon: RotateCcw,
    bgColor: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-500/30",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-600 dark:text-gray-400",
    borderColor: "border-gray-500/30",
  },
};

export const STATUS_ORDER: ShipmentStatus[] = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

interface Props {
  status: ShipmentStatus;
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
}

export default function ShipmentStatusBadge({
  status,
  size = "default",
  showIcon = true,
}: Props) {
  const config = SHIPMENT_STATUS_CONFIG[status];
  if (!config) return <Badge>{status}</Badge>;

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    default: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  }[size];

  const iconSize = {
    sm: "h-2.5 w-2.5",
    default: "h-3 w-3",
    lg: "h-4 w-4",
  }[size];

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        sizeClasses,
        config.bgColor,
        config.textColor,
        config.borderColor
      )}
    >
      {showIcon && <Icon className={iconSize} />}
      {config.label}
    </Badge>
  );
}