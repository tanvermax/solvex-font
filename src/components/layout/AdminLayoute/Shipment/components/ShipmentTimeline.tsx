// src/components/layout/AdminLayoute/Shipment/components/ShipmentTimeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
// import {
//   SHIPMENT_STATUS_CONFIG,
//   type ShipmentStatus,
// } from "./ShipmentStatusBadge";
import type { Shipment } from "@/redux/features/shipment/shipment.api";
import { SHIPMENT_STATUS_CONFIG } from "@/components/shipment/ShipmentStatusBadge";

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ShipmentTimeline({
  shipment,
}: {
  shipment: Shipment;
}) {
  const history = [...(shipment.statusHistory || [])].reverse();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Tracking History
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {history.length} updates
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No status updates yet
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((entry, index) => {
              const config = SHIPMENT_STATUS_CONFIG[entry.status];
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
                    {index < history.length - 1 && (
                      <div className="flex-1 w-px bg-border my-1 min-h-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p
                        className={cn(
                          "font-medium text-sm",
                          isLatest && config?.textColor
                        )}
                      >
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
        )}
      </CardContent>
    </Card>
  );
}