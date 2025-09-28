import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "success" | "warning" | "danger" | "default";
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  variant = "default",
  icon,
  className 
}: MetricCardProps) => {
  const variantClasses = {
    success: "metric-success",
    warning: "metric-warning", 
    danger: "metric-danger",
    default: ""
  };

  const trendColor = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={cn(
      "dashboard-card fade-in-up",
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <span className={cn("text-xs font-medium", trendColor[trend])}>
                {change}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};