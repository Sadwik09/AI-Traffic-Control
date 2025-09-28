import { TrafficLight, TrafficLightState } from "./TrafficLight";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, ArrowRight } from "lucide-react";

interface IntersectionData {
  id: string;
  name: string;
  northSouth: TrafficLightState;
  eastWest: TrafficLightState;
  vehicleCount: number;
  coordination: "synchronized" | "independent" | "delayed";
}

interface MultiIntersectionViewProps {
  intersections: IntersectionData[];
  greenWaveActive: boolean;
  className?: string;
}

export const MultiIntersectionView = ({
  intersections,
  greenWaveActive,
  className
}: MultiIntersectionViewProps) => {
  const getCoordinationColor = (coordination: IntersectionData["coordination"]) => {
    switch (coordination) {
      case "synchronized": return "bg-success/20 text-success border-success/40";
      case "delayed": return "bg-warning/20 text-warning border-warning/40";
      case "independent": return "bg-muted/20 text-muted-foreground border-muted";
    }
  };

  return (
    <Card className={cn("dashboard-card", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Multi-Intersection Network</h3>
        </div>
        {greenWaveActive && (
          <Badge className="bg-success/20 text-success border-success/40 pulse-glow">
            Green Wave Active
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {/* Network Flow Visualization */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
          {intersections.map((intersection, index) => (
            <div key={intersection.id} className="flex items-center">
              {/* Intersection */}
              <div className="text-center">
                <div className="relative mb-2">
                  <div className="w-16 h-16 bg-muted/40 rounded border border-border flex items-center justify-center">
                    <div className="flex gap-1">
                      <TrafficLight state={intersection.northSouth} size="sm" />
                      <TrafficLight state={intersection.eastWest} size="sm" />
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Badge 
                      className={getCoordinationColor(intersection.coordination)}
                    >
                      {intersection.vehicleCount}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs font-medium">{intersection.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {intersection.coordination}
                </div>
              </div>

              {/* Flow Arrow */}
              {index < intersections.length - 1 && (
                <div className="mx-4 flex flex-col items-center">
                  <ArrowRight 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      greenWaveActive && intersection.coordination === "synchronized"
                        ? "text-success"
                        : "text-muted-foreground"
                    )}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {greenWaveActive ? "Synced" : "Flow"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Coordination Status */}
        <div className="grid grid-cols-3 gap-3">
          {intersections.map((intersection) => (
            <Card key={intersection.id} className="p-3 border border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{intersection.name}</span>
                  <Badge 
                    className={getCoordinationColor(intersection.coordination)}
                  >
                    {intersection.coordination}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Vehicles:</span>
                  <span>{intersection.vehicleCount}</span>
                </div>
                
                <div className="flex gap-1 justify-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    intersection.northSouth === "green" ? "bg-success" :
                    intersection.northSouth === "yellow" ? "bg-warning" : "bg-danger"
                  )} />
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    intersection.eastWest === "green" ? "bg-success" :
                    intersection.eastWest === "yellow" ? "bg-warning" : "bg-danger"
                  )} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Synchronized:</span>
              <span>{intersections.filter(i => i.coordination === "synchronized").length}/{intersections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Vehicles:</span>
              <span>{intersections.reduce((sum, i) => sum + i.vehicleCount, 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};