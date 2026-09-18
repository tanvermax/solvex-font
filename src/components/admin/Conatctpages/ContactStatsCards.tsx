// src/components/admin/Contact/ContactStatsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ContactStatsCardsProps {
  stats: {
    total: number;
    newCount: number;
    inProgress: number;
    replied: number;
    resolved: number;
    critical: number;
  };
}

export default function ContactStatsCards({ stats }: ContactStatsCardsProps) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: MessageSquare,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "New",
      value: stats.newCount,
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      valueColor: "text-yellow-600",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Loader2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      valueColor: "text-blue-600",
    },
    {
      label: "Replied",
      value: stats.replied,
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      valueColor: "text-purple-600",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      valueColor: "text-green-600",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: Clock,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      valueColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <div
                  className={`h-10 w-10 rounded-full ${card.bgColor} flex items-center justify-center`}
                >
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