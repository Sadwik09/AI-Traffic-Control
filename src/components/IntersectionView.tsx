import { TrafficLight, TrafficLightState } from "./TrafficLight";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IntersectionViewProps {
  northSouth: TrafficLightState;
  eastWest: TrafficLightState;
  vehicleCount: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  className?: string;
}

export const IntersectionView = ({ 
  northSouth, 
  eastWest, 
  vehicleCount, 
  className 
}: IntersectionViewProps) => {
  return (
    <Card className={cn("dashboard-card p-8", className)}>
      <h3 className="text-lg font-semibold mb-6 text-center">Main Intersection</h3>
      
      <div className="relative w-64 h-64 mx-auto">
        {/* Intersection Roads */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Vertical Road */}
          <div className="w-16 h-full bg-muted/30 border-x-2 border-dashed border-border" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Horizontal Road */}
          <div className="h-16 w-full bg-muted/30 border-y-2 border-dashed border-border" />
        </div>
        
        {/* Traffic Lights */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <TrafficLight state={northSouth} size="sm" />
          <div className="text-xs text-center mt-1 text-muted-foreground">N: {vehicleCount.north}</div>
        </div>
        
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <TrafficLight state={northSouth} size="sm" />
          <div className="text-xs text-center mt-1 text-muted-foreground">S: {vehicleCount.south}</div>
        </div>
        
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <TrafficLight state={eastWest} size="sm" />
          <div className="text-xs text-center mt-1 text-muted-foreground">W: {vehicleCount.west}</div>
        </div>
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <TrafficLight state={eastWest} size="sm" />
          <div className="text-xs text-center mt-1 text-muted-foreground">E: {vehicleCount.east}</div>
        </div>
        
        {/* Center Junction */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/20 rounded border border-primary/40" />
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground text-center">
        Total Vehicles: {Object.values(vehicleCount).reduce((a, b) => a + b, 0)}
      </div>
    </Card>
  );
};