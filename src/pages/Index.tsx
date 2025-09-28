import { MetricCard } from "@/components/MetricCard";
import { IntersectionView } from "@/components/IntersectionView";
import { ControlPanel } from "@/components/ControlPanel";
import { useTrafficSimulation } from "@/hooks/useTrafficSimulation";
import { 
  Clock, 
  Car, 
  Timer, 
  TrendingUp,
  Activity,
  BarChart3
} from "lucide-react";

const Index = () => {
  const {
    isRunning,
    currentTime,
    northSouthState,
    eastWestState,
    vehicleCount,
    metrics,
    adaptiveMode,
    cycleTime,
    minGreenTime,
    toggleSimulation,
    resetSimulation,
    setAdaptiveMode,
    setCycleTime,
    setMinGreenTime,
  } = useTrafficSimulation();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCongestionVariant = (index: number) => {
    if (index < 30) return "success";
    if (index < 70) return "warning";
    return "danger";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Traffic Management System
          </h1>
          <p className="text-muted-foreground">
            Adaptive signal control with real-time optimization
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Runtime"
            value={formatTime(currentTime)}
            icon={<Clock className="w-5 h-5" />}
            variant="default"
          />
          
          <MetricCard
            title="Vehicles/Min"
            value={metrics.vehiclesPerMinute.toFixed(1)}
            trend="up"
            change="+12.5%"
            icon={<Car className="w-5 h-5" />}
            variant="success"
          />
          
          <MetricCard
            title="Avg Wait Time"
            value={`${metrics.avgWaitTime.toFixed(1)}s`}
            trend="down"
            change="-8.2%"
            icon={<Timer className="w-5 h-5" />}
            variant={metrics.avgWaitTime > 15 ? "warning" : "success"}
          />
          
          <MetricCard
            title="Congestion Index"
            value={`${metrics.congestionIndex.toFixed(0)}%`}
            trend={metrics.congestionIndex > 50 ? "up" : "neutral"}
            change={metrics.congestionIndex > 50 ? "+5.1%" : "stable"}
            icon={<BarChart3 className="w-5 h-5" />}
            variant={getCongestionVariant(metrics.congestionIndex)}
          />
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Intersection View */}
          <div className="lg:col-span-2">
            <IntersectionView
              northSouth={northSouthState}
              eastWest={eastWestState}
              vehicleCount={vehicleCount}
            />
            
            {/* Additional Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <MetricCard
                title="Total Processed"
                value={metrics.totalVehiclesProcessed}
                icon={<TrendingUp className="w-5 h-5" />}
                variant="default"
              />
              <MetricCard
                title="System Status"
                value={isRunning ? "Active" : "Paused"}
                icon={<Activity className="w-5 h-5" />}
                variant={isRunning ? "success" : "warning"}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div>
            <ControlPanel
              isRunning={isRunning}
              onToggleSimulation={toggleSimulation}
              onReset={resetSimulation}
              adaptiveMode={adaptiveMode}
              onAdaptiveModeChange={setAdaptiveMode}
              cycleTime={cycleTime}
              onCycleTimeChange={setCycleTime}
              minGreenTime={minGreenTime}
              onMinGreenTimeChange={setMinGreenTime}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Advanced Traffic Signal Control • Real-time Adaptive Optimization
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;