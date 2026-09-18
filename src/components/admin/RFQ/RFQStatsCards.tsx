// src/components/admin/RFQ/RFQStatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";

interface RFQStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    quoted: number;
  };
}

export default function RFQStatsCards({ stats }: RFQStatsCardsProps) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: FileSpreadsheet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      valueColor: "text-yellow-600",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      valueColor: "text-green-600",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      valueColor: "text-red-600",
    },
    {
      label: "Quoted",
      value: stats.quoted,
      icon: Send,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      valueColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.valueColor || ""}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-full ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}