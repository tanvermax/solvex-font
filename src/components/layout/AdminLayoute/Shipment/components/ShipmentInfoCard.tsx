// src/components/layout/AdminLayoute/Shipment/components/ShipmentInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, User, Building } from "lucide-react";
import type { Shipment } from "@/redux/features/shipment/shipment.api";

export default function ShipmentInfoCard({ shipment }: { shipment: Shipment }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Customer & Delivery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Customer
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium text-sm">{shipment.customer.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{shipment.customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{shipment.customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Shipping Address
          </p>
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm space-y-0.5">
              {shipment.shippingAddress.contactPerson && (
                <p className="font-medium">
                  {shipment.shippingAddress.contactPerson}
                </p>
              )}
              <p className="text-muted-foreground">
                {shipment.shippingAddress.address}
              </p>
              <p className="text-muted-foreground">
                {shipment.shippingAddress.city}
                {shipment.shippingAddress.zone && `, ${shipment.shippingAddress.zone}`}
              </p>
              <p className="text-muted-foreground">
                {shipment.shippingAddress.country || "Bangladesh"}
              </p>
              {shipment.shippingAddress.phone && (
                <p className="text-muted-foreground font-mono text-xs pt-1">
                  {shipment.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}