// src/components/layout/AdminLayoute/Shipment/components/ShipmentPackageCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Weight, Ruler, ShieldCheck } from "lucide-react";
import type { Shipment } from "@/redux/features/shipment/shipment.api";

export default function ShipmentPackageCard({
  shipment,
}: {
  shipment: Shipment;
}) {
  const pkg = shipment.packageInfo;
  if (!pkg) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Box className="h-4 w-4" />
          Package Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Package Type" value={pkg.packageType} icon={Box} />

        <Row
          label="Weight"
          value={`${pkg.weight} ${pkg.weightUnit}`}
          icon={Weight}
        />

        {pkg.dimensions && (
          <Row
            label="Dimensions"
            value={`${pkg.dimensions.length} × ${pkg.dimensions.width} × ${pkg.dimensions.height} ${pkg.dimensions.unit}`}
            icon={Ruler}
          />
        )}

        <Row
          label="Insurance"
          value={pkg.insurance ? "Yes" : "No"}
          icon={ShieldCheck}
        />

        {pkg.insurance && pkg.insuranceValue && (
          <Row
            label="Insurance Value"
            value={`৳${pkg.insuranceValue.toLocaleString()}`}
            icon={ShieldCheck}
          />
        )}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}