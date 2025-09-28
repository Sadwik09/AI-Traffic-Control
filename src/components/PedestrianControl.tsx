import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PedestrianControlProps {
  pedestrianRequests: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
  };
  onPedestrianRequest: (direction: "north" | "south" | "east" | "west") => void;
  pedestrianPhaseActive: boolean;
  pedestrianTimeRemaining: number;
  className?: string;
}

export const PedestrianControl = ({
  pedestrianRequests,
  onPedestrianRequest,
  pedestrianPhaseActive,
  pedestrianTimeRemaining,
  className
}: PedestrianControlProps) => {
  const directions = [
    { key: "north" as const, label: "North Crossing", position: "top-2 left-1/2 -translate-x-1/2" },
    { key: "south" as const, label: "South Crossing", position: "bottom-2 left-1/2 -translate-x-1/2" },
    { key: "east" as const, label: "East Crossing", position: "right-2 top-1/2 -translate-y-1/2" },
    { key: "west" as const, label: "West Crossing", position: "left-2 top-1/2 -translate-y-1/2" }
  ];

  const totalRequests = Object.values(pedestrianRequests).filter(Boolean).length;

  return (
    <Card className={cn("dashboard-card", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Pedestrian Control</h3>
        </div>
        {totalRequests > 0 && (
          <Badge className="bg-warning/20 text-warning border-warning/40">
            {totalRequests} Request{totalRequests !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Intersection Visualization */}
      <div className="relative w-48 h-48 mx-auto mb-4 bg-muted/20 rounded-lg border border-border">
        {/* Roads */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-full bg-muted/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-full bg-muted/40" />
        </div>

        {/* Pedestrian Buttons */}
        {directions.map(({ key, position }) => (
          <button
            key={key}
            className={cn(
              "absolute w-6 h-6 rounded-full border-2 transition-all duration-200",
              position,
              pedestrianRequests[key]
                ? "bg-warning border-warning pulse-glow"
                : "bg-muted border-border hover:bg-muted/70"
            )}
            onClick={() => onPedestrianRequest(key)}
          >
            <Users className="w-3 h-3 m-auto" />
          </button>
        ))}

        {/* Center status */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold",
            pedestrianPhaseActive
              ? "bg-success/20 border-success text-success"
              : totalRequests > 0
              ? "bg-warning/20 border-warning text-warning"
              : "bg-muted border-border text-muted-foreground"
          )}>
            {pedestrianPhaseActive ? pedestrianTimeRemaining : totalRequests}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-2">
        {directions.map(({ key, label }) => (
          <Button
            key={key}
            variant={pedestrianRequests[key] ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full justify-between",
              pedestrianRequests[key] && "bg-warning/20 border-warning/40 text-warning hover:bg-warning/30"
            )}
            onClick={() => onPedestrianRequest(key)}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              {label}
            </span>
            {pedestrianRequests[key] && (
              <Badge variant="secondary" className="text-xs">
                Requested
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {pedestrianPhaseActive && (
        <div className="mt-3 p-2 bg-success/10 border border-success/20 rounded">
          <div className="flex items-center gap-2 text-success text-sm">
            <Clock className="w-4 h-4" />
            Pedestrian Crossing Active: {pedestrianTimeRemaining}s
          </div>
        </div>
      )}
    </Card>
  );
};