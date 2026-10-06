// src/components/layout/AdminLayoute/Shipment/components/ShipmentTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Edit, Printer, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import ShipmentStatusBadge, {
  type ShipmentStatus,
} from "./ShipmentStatusBadge";
import type { Shipment } from "@/redux/features/shipment/shipment.api";

interface Props {
  shipments: Shipment[];
  onViewDetails: (shipment: Shipment) => void;
  onUpdateStatus: (shipment: Shipment) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ShipmentTable({
  shipments,
  onViewDetails,
  onUpdateStatus,
}: Props) {
  const navigate = useNavigate();

  return (


    
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking ID</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="hidden md:table-cell">Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Carrier</TableHead>
            <TableHead className="hidden md:table-cell">
              Est. Delivery
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            // ShipmentTable.tsx
            <TableRow
              key={shipment._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => {
                // ✅ যদি dropdown বা button-এ click হয় — skip
                const target = e.target as HTMLElement;
                if (
                  target.closest("button") ||
                  target.closest("[role=menuitem]")
                ) {
                  return;
                }
                onViewDetails(shipment);
              }}
            >
              <TableCell>
                <div>
                  <p className="font-mono text-xs font-semibold text-primary">
                    {shipment.trackingId}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {shipment.items?.length || 0} items
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-medium text-sm">{shipment.orderNumber}</p>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div>
                  <p className="font-medium text-sm">
                    {shipment.customer?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {shipment.customer?.phone}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <ShipmentStatusBadge
                  status={shipment.currentStatus as ShipmentStatus}
                  size="sm"
                />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm">{shipment.carrierName || "—"}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="text-sm">
                  <p>{formatDate(shipment.estimatedDeliveryDate)}</p>
                  {shipment.actualDeliveryDate && (
                    <p className="text-[10px] text-emerald-600">
                      Delivered: {formatDate(shipment.actualDeliveryDate)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(shipment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(shipment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(shipment)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            `/track-shipment?trackingId=${shipment.trackingId}`,
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Public View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Label
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
