import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

interface ControlPanelProps {
  isRunning: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
  adaptiveMode: boolean;
  onAdaptiveModeChange: (enabled: boolean) => void;
  cycleTime: number;
  onCycleTimeChange: (value: number[]) => void;
  minGreenTime: number;
  onMinGreenTimeChange: (value: number[]) => void;
}

export const ControlPanel = ({
  isRunning,
  onToggleSimulation,
  onReset,
  adaptiveMode,
  onAdaptiveModeChange,
  cycleTime,
  onCycleTimeChange,
  minGreenTime,
  onMinGreenTimeChange
}: ControlPanelProps) => {
  return (
    <Card className="dashboard-card">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Control Panel</h3>
      </div>
      
      <div className="space-y-6">
        {/* Simulation Controls */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Simulation Control</Label>
          <div className="flex gap-2">
            <Button 
              onClick={onToggleSimulation}
              variant={isRunning ? "destructive" : "default"}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button onClick={onReset} variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Adaptive Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="adaptive-mode" className="text-sm font-medium">
              Adaptive Timing
            </Label>
            <Switch
              id="adaptive-mode"
              checked={adaptiveMode}
              onCheckedChange={onAdaptiveModeChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Automatically adjusts timing based on traffic flow
          </p>
        </div>

        {/* Cycle Time */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Cycle Time: {cycleTime}s
          </Label>
          <Slider
            value={[cycleTime]}
            onValueChange={onCycleTimeChange}
            max={120}
            min={30}
            step={5}
            disabled={adaptiveMode}
          />
        </div>

        {/* Min Green Time */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Min Green Time: {minGreenTime}s
          </Label>
          <Slider
            value={[minGreenTime]}
            onValueChange={onMinGreenTimeChange}
            max={30}
            min={5}
            step={1}
          />
        </div>
      </div>
    </Card>
  );
};