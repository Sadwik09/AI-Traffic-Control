import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Siren, Truck, Phone, AlertTriangle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmergencyVehicleType = "ambulance" | "fire-truck" | "police" | null;
export type EmergencyDirection = "north" | "south" | "east" | "west" | null;

interface EmergencyControlProps {
  activeEmergency: EmergencyVehicleType;
  emergencyDirection: EmergencyDirection;
  onEmergencyTrigger: (type: EmergencyVehicleType, direction?: EmergencyDirection) => void;
  emergencyTimeRemaining: number;
  className?: string;
}

export const EmergencyControl = ({
  activeEmergency,
  emergencyDirection,
  onEmergencyTrigger,
  emergencyTimeRemaining,
  className
}: EmergencyControlProps) => {
  const emergencyTypes = [
    { 
      type: "ambulance" as const, 
      label: "Ambulance", 
      icon: Siren, 
      color: "bg-red-500/20 border-red-500/40 text-red-400" 
    },
    { 
      type: "fire-truck" as const, 
      label: "Fire Truck", 
      icon: Truck, 
      color: "bg-orange-500/20 border-orange-500/40 text-orange-400" 
    },
    { 
      type: "police" as const, 
      label: "Police", 
      icon: Phone, 
      color: "bg-blue-500/20 border-blue-500/40 text-blue-400" 
    }
  ];

  const directions = [
    { dir: "north" as const, label: "North", icon: ArrowUp },
    { dir: "south" as const, label: "South", icon: ArrowDown },
    { dir: "east" as const, label: "East", icon: ArrowRight },
    { dir: "west" as const, label: "West", icon: ArrowLeft }
  ];

  return (
    <Card className={cn("dashboard-card", className)}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-danger" />
        <h3 className="text-lg font-semibold">Emergency Control</h3>
        {activeEmergency && emergencyDirection && (
          <Badge className="pulse-glow bg-danger/20 text-danger border-danger/40">
            ACTIVE: {emergencyTimeRemaining}s
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {/* Emergency Type Selection */}
        {!activeEmergency && (
          <>
            <p className="text-sm text-muted-foreground mb-2">Select Emergency Type:</p>
            {emergencyTypes.map(({ type, label, icon: Icon, color }) => (
              <Button
                key={type}
                variant="outline"
                className="w-full justify-start gap-2 h-12"
                onClick={() => onEmergencyTrigger(type)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </>
        )}

        {/* Direction Selection */}
        {activeEmergency && !emergencyDirection && (
          <>
            <div className="p-3 bg-danger/10 border border-danger/20 rounded">
              <p className="text-sm font-semibold text-danger">Emergency Active: {activeEmergency}</p>
            </div>
            <p className="text-sm text-muted-foreground">Select Direction:</p>
            <div className="grid grid-cols-2 gap-2">
              {directions.map(({ dir, label, icon: Icon }) => (
                <Button
                  key={dir}
                  variant="outline"
                  className="h-16 flex flex-col gap-1"
                  onClick={() => onEmergencyTrigger(activeEmergency, dir)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Active Emergency Display */}
        {activeEmergency && emergencyDirection && (
          <>
            <div className="p-3 bg-danger/10 border border-danger/20 rounded pulse-glow">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-danger">
                  {emergencyTypes.find(e => e.type === activeEmergency)?.label} - {emergencyDirection.toUpperCase()}
                </p>
                <Badge variant="destructive">{emergencyTimeRemaining}s</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {emergencyDirection.charAt(0).toUpperCase() + emergencyDirection.slice(1)} lane GREEN, all others RED
              </p>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onEmergencyTrigger(null)}
            >
              Cancel Emergency
            </Button>
          </>
        )}

        <div className="mt-4 p-3 bg-muted/30 rounded border border-border">
          <p className="text-xs text-muted-foreground">
            Emergency vehicles override all signals. Selected direction turns GREEN while all others turn RED.
          </p>
        </div>
      </div>
    </Card>
  );
};