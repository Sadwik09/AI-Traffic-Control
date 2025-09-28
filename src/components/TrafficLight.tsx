import { cn } from "@/lib/utils";

export type TrafficLightState = "green" | "yellow" | "red" | "off";

interface TrafficLightProps {
  state: TrafficLightState;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const TrafficLight = ({ state, className, size = "md" }: TrafficLightProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const getStateClass = (lightColor: TrafficLightState) => {
    if (state === lightColor) {
      switch (lightColor) {
        case "green":
          return "traffic-light-green";
        case "yellow":
          return "traffic-light-yellow";
        case "red":
          return "traffic-light-red";
        default:
          return "traffic-light-off";
      }
    }
    return "traffic-light-off";
  };

  return (
    <div className={cn("flex flex-col gap-1 p-2 bg-muted/50 rounded-lg border border-border", className)}>
      <div className={cn("traffic-light", sizeClasses[size], getStateClass("red"))} />
      <div className={cn("traffic-light", sizeClasses[size], getStateClass("yellow"))} />
      <div className={cn("traffic-light", sizeClasses[size], getStateClass("green"))} />
    </div>
  );
};