// src/components/layout/AdminLayoute/Shipment/components/ShipmentItemsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { Shipment } from "@/redux/features/shipment/shipment.api";

export default function ShipmentItemsCard({ shipment }: { shipment: Shipment }) {
  const items = shipment.items || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Package className="h-4 w-4" />
          Items
          <Badge variant="outline" className="ml-auto text-xs">
            {items.length} {items.length === 1 ? "item" : "items"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items recorded
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 py-2 border-b last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {item.productName}
                  </p>
                  {item.sku && (
                    <p className="text-[10px] text-muted-foreground font-mono">
                      SKU: {item.sku}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  Qty: {item.quantity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}