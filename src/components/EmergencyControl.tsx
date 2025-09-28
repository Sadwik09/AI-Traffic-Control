import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Siren, Truck, Phone, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmergencyVehicleType = "ambulance" | "fire-truck" | "police" | null;

interface EmergencyControlProps {
  activeEmergency: EmergencyVehicleType;
  onEmergencyTrigger: (type: EmergencyVehicleType) => void;
  emergencyTimeRemaining: number;
  className?: string;
}

export const EmergencyControl = ({
  activeEmergency,
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

  return (
    <Card className={cn("dashboard-card", className)}>
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-danger" />
        <h3 className="text-lg font-semibold">Emergency Control</h3>
        {activeEmergency && (
          <Badge className="pulse-glow bg-danger/20 text-danger border-danger/40">
            ACTIVE: {emergencyTimeRemaining}s
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {emergencyTypes.map(({ type, label, icon: Icon, color }) => (
          <Button
            key={type}
            variant={activeEmergency === type ? "destructive" : "outline"}
            className={cn(
              "w-full justify-start gap-2 h-12",
              activeEmergency === type && "pulse-glow"
            )}
            onClick={() => onEmergencyTrigger(activeEmergency === type ? null : type)}
          >
            <Icon className="w-4 h-4" />
            {label}
            {activeEmergency === type && (
              <Badge variant="destructive" className="ml-auto">
                {emergencyTimeRemaining}s
              </Badge>
            )}
          </Button>
        ))}

        <div className="mt-4 p-3 bg-muted/30 rounded border border-border">
          <p className="text-xs text-muted-foreground">
            Emergency vehicles override all signals. All lights turn RED except emergency route.
          </p>
        </div>
      </div>
    </Card>
  );
};