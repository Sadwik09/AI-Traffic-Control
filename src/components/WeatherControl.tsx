import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export type WeatherCondition = "clear" | "cloudy" | "rain" | "snow" | "fog";

interface WeatherControlProps {
  currentWeather: WeatherCondition;
  onWeatherChange: (weather: WeatherCondition) => void;
  weatherImpact: number;
  className?: string;
}

export const WeatherControl = ({
  currentWeather,
  onWeatherChange,
  weatherImpact,
  className
}: WeatherControlProps) => {
  const weatherTypes = [
    { 
      type: "clear" as const, 
      label: "Clear", 
      icon: Sun, 
      color: "text-yellow-400", 
      impact: 1.0,
      description: "Normal conditions" 
    },
    { 
      type: "cloudy" as const, 
      label: "Cloudy", 
      icon: Cloud, 
      color: "text-gray-400", 
      impact: 0.95,
      description: "Slightly reduced visibility" 
    },
    { 
      type: "rain" as const, 
      label: "Rain", 
      icon: CloudRain, 
      color: "text-blue-400", 
      impact: 0.8,
      description: "Slower traffic, increased caution" 
    },
    { 
      type: "snow" as const, 
      label: "Snow", 
      icon: CloudSnow, 
      color: "text-blue-200", 
      impact: 0.6,
      description: "Significantly slower traffic" 
    },
    { 
      type: "fog" as const, 
      label: "Fog", 
      icon: Wind, 
      color: "text-gray-300", 
      impact: 0.7,
      description: "Reduced visibility, slower speeds" 
    }
  ];

  const currentWeatherData = weatherTypes.find(w => w.type === currentWeather);

  const getImpactColor = (impact: number) => {
    if (impact >= 0.9) return "text-success";
    if (impact >= 0.7) return "text-warning";
    return "text-danger";
  };

  return (
    <Card className={cn("dashboard-card", className)}>
      <div className="flex items-center gap-2 mb-4">
        {currentWeatherData && (
          <currentWeatherData.icon className={cn("w-5 h-5", currentWeatherData.color)} />
        )}
        <h3 className="text-lg font-semibold">Weather Conditions</h3>
        <Badge className={cn("ml-auto", getImpactColor(weatherImpact))}>
          {(weatherImpact * 100).toFixed(0)}% Flow
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {weatherTypes.map(({ type, label, icon: Icon, color, impact }) => (
          <Button
            key={type}
            variant={currentWeather === type ? "default" : "outline"}
            size="sm"
            className={cn(
              "justify-start gap-2 h-10",
              currentWeather === type && "bg-primary/20 border-primary/40"
            )}
            onClick={() => onWeatherChange(type)}
          >
            <Icon className={cn("w-4 h-4", color)} />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>

      {currentWeatherData && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Traffic Impact:</span>
            <span className={cn("text-sm font-medium", getImpactColor(currentWeatherData.impact))}>
              {currentWeatherData.impact === 1.0 ? "Normal" : `${(currentWeatherData.impact * 100).toFixed(0)}%`}
            </span>
          </div>
          
          <div className="p-2 bg-muted/20 rounded border border-border">
            <p className="text-xs text-muted-foreground">
              {currentWeatherData.description}
            </p>
          </div>

          <div className="w-full bg-muted/30 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                currentWeatherData.impact >= 0.9 ? "bg-success" :
                currentWeatherData.impact >= 0.7 ? "bg-warning" : "bg-danger"
              )}
              style={{ width: `${currentWeatherData.impact * 100}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};