// src/components/layout/AdminLayoute/Shipment/components/ShipmentCarrierCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, User, Phone, Hash, Clock } from "lucide-react";
import type { Shipment } from "@/redux/features/shipment/shipment.api";

const PRIORITY_COLORS: Record<string, string> = {
  STANDARD: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  HIGH: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  URGENT: "bg-red-500/10 text-red-600 border-red-500/30",
};

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export default function ShipmentCarrierCard({
  shipment,
}: {
  shipment: Shipment;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Carrier & Logistics
          <Badge
            variant="outline"
            className={`ml-auto text-[10px] ${
              PRIORITY_COLORS[shipment.priority] || ""
            }`}
          >
            {shipment.priority}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Carrier" value={shipment.carrierName} />
        <Row label="Carrier Contact" value={shipment.carrierContact} />
        <Row label="Service Type" value={shipment.serviceType} />
        <Row label="Driver Name" value={shipment.driverName} icon={User} />
        <Row label="Driver Contact" value={shipment.driverContact} icon={Phone} />
        <Row label="Vehicle Number" value={shipment.vehicleNumber} icon={Hash} />

        <div className="border-t pt-3 mt-3">
          <Row
            label="Est. Delivery"
            value={formatDate(shipment.estimatedDeliveryDate)}
            icon={Clock}
          />
          {shipment.actualDeliveryDate && (
            <Row
              label="Actual Delivery"
              value={formatDate(shipment.actualDeliveryDate)}
              icon={Clock}
              highlight
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value?: string;
  icon?: any;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        <span className="text-xs">{label}</span>
      </div>
      <span
        className={`font-medium text-right ${
          highlight ? "text-emerald-600" : ""
        } ${!value ? "text-muted-foreground italic" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}