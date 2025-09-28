import { MetricCard } from "@/components/MetricCard";
import { IntersectionView } from "@/components/IntersectionView";
import { ControlPanel } from "@/components/ControlPanel";
import { EmergencyControl } from "@/components/EmergencyControl";
import { PedestrianControl } from "@/components/PedestrianControl";
import { WeatherControl } from "@/components/WeatherControl";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { MultiIntersectionView } from "@/components/MultiIntersectionView";
import { useAdvancedTrafficSimulation } from "@/hooks/useAdvancedTrafficSimulation";
import { 
  Clock, 
  Car, 
  Timer, 
  TrendingUp,
  Activity,
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

const Index = () => {
  const {
    isRunning,
    currentTime,
    northSouthState,
    eastWestState,
    vehicleCount,
    metrics,
    trafficDataPoints,
    directionData,
    activeEmergency,
    emergencyTimeRemaining,
    handleEmergencyTrigger,
    pedestrianRequests,
    pedestrianPhaseActive,
    pedestrianTimeRemaining,
    handlePedestrianRequest,
    currentWeather,
    weatherImpact,
    handleWeatherChange,
    intersections,
    greenWaveActive,
    setGreenWaveActive,
    adaptiveMode,
    cycleTime,
    minGreenTime,
    toggleSimulation,
    resetSimulation,
    setAdaptiveMode,
    setCycleTime,
    setMinGreenTime,
  } = useAdvancedTrafficSimulation();

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

  const getSystemStatus = () => {
    if (activeEmergency) return { status: "Emergency Override", variant: "danger" as const };
    if (pedestrianPhaseActive) return { status: "Pedestrian Phase", variant: "warning" as const };
    if (adaptiveMode) return { status: "Adaptive Control", variant: "success" as const };
    return { status: "Fixed Timing", variant: "default" as const };
  };

  const systemStatus = getSystemStatus();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Advanced Traffic Management System
          </h1>
          <p className="text-muted-foreground">
            Smart city traffic control with emergency priority, pedestrian safety, and weather adaptation
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-center gap-4 p-3 bg-muted/20 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-success pulse-glow' : 'bg-muted'}`} />
            <span className="text-sm font-medium">
              System {isRunning ? 'Active' : 'Paused'}
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm">{systemStatus.status}</span>
          </div>
          {greenWaveActive && (
            <>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-success" />
                <span className="text-sm text-success">Green Wave Coordination</span>
              </div>
            </>
          )}
        </div>

        {/* Main Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

          <MetricCard
            title="Weather Impact"
            value={`${(weatherImpact * 100).toFixed(0)}%`}
            icon={<Activity className="w-5 h-5" />}
            variant={weatherImpact >= 0.9 ? "success" : weatherImpact >= 0.7 ? "warning" : "danger"}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Main Intersection */}
          <div className="xl:col-span-2 space-y-6">
            <IntersectionView
              northSouth={northSouthState}
              eastWest={eastWestState}
              vehicleCount={vehicleCount}
            />
            
            <MultiIntersectionView
              intersections={intersections}
              greenWaveActive={greenWaveActive}
            />
          </div>

          {/* Middle Column - Analytics */}
          <div className="space-y-6">
            <AnalyticsCharts
              trafficData={trafficDataPoints}
              directionData={directionData}
            />
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
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

            <EmergencyControl
              activeEmergency={activeEmergency}
              onEmergencyTrigger={handleEmergencyTrigger}
              emergencyTimeRemaining={emergencyTimeRemaining}
            />

            <PedestrianControl
              pedestrianRequests={pedestrianRequests}
              onPedestrianRequest={handlePedestrianRequest}
              pedestrianPhaseActive={pedestrianPhaseActive}
              pedestrianTimeRemaining={pedestrianTimeRemaining}
            />

            <WeatherControl
              currentWeather={currentWeather}
              onWeatherChange={handleWeatherChange}
              weatherImpact={weatherImpact}
            />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Processed"
            value={metrics.totalVehiclesProcessed}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="default"
          />
          <MetricCard
            title="Emergency Events"
            value={activeEmergency ? "1 Active" : "0"}
            icon={<Shield className="w-5 h-5" />}
            variant={activeEmergency ? "danger" : "success"}
          />
          <MetricCard
            title="Pedestrian Requests" 
            value={Object.values(pedestrianRequests).filter(Boolean).length}
            icon={<Clock className="w-5 h-5" />}
            variant="default"
          />
          <MetricCard
            title="Network Sync"
            value={`${intersections.filter(i => i.coordination === "synchronized").length}/${intersections.length}`}
            icon={<Zap className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground border-t border-border pt-4">
          <p>
            Advanced Traffic Control System • Emergency Priority • Weather Adaptation • Multi-Intersection Coordination
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;