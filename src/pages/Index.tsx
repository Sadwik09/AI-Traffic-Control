import { MetricCard } from "@/components/MetricCard";
import { IntersectionView } from "@/components/IntersectionView";
import { ControlPanel } from "@/components/ControlPanel";
import { EmergencyControl } from "@/components/EmergencyControl";
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
    emergencyDirection,
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
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Gradient */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-card/95 border-b border-border shadow-lg">
        <div className="max-w-[1600px] mx-auto p-6 md:p-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Advanced Traffic Management System
            </h1>
            <p className="text-muted-foreground text-lg">
              AI-Powered Smart City Traffic Control • Emergency Priority • Weather Adaptation • Multi-Intersection Coordination
            </p>
            
            {/* Status Indicators */}
            <div className="flex items-center justify-center flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-success pulse-glow' : 'bg-muted'}`} />
                <span className="text-sm font-semibold">
                  {isRunning ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{systemStatus.status}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono font-semibold">{formatTime(currentTime)}</span>
              </div>
              
              {greenWaveActive && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
                  <Zap className="w-4 h-4 text-success" />
                  <span className="text-sm font-semibold text-success">Green Wave Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto p-6 space-y-8">

        {/* Key Performance Indicators */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
              title="Runtime"
              value={formatTime(currentTime)}
              icon={<Clock className="w-6 h-6" />}
              variant="default"
            />
            
            <MetricCard
              title="Traffic Flow Rate"
              value={metrics.vehiclesPerMinute.toFixed(1)}
              trend="up"
              change="vehicles/min"
              icon={<Car className="w-6 h-6" />}
              variant="success"
            />
            
            <MetricCard
              title="Average Wait Time"
              value={`${metrics.avgWaitTime.toFixed(1)}s`}
              trend="down"
              change={metrics.avgWaitTime > 15 ? "↑ High" : "↓ Optimal"}
              icon={<Timer className="w-6 h-6" />}
              variant={metrics.avgWaitTime > 15 ? "warning" : "success"}
            />
            
            <MetricCard
              title="Congestion Level"
              value={`${metrics.congestionIndex.toFixed(0)}%`}
              trend={metrics.congestionIndex > 50 ? "up" : "neutral"}
              change={metrics.congestionIndex > 70 ? "↑ Critical" : metrics.congestionIndex > 50 ? "→ Moderate" : "↓ Clear"}
              icon={<BarChart3 className="w-6 h-6" />}
              variant={getCongestionVariant(metrics.congestionIndex)}
            />

            <MetricCard
              title="Weather Impact"
              value={`${(weatherImpact * 100).toFixed(0)}%`}
              change={weatherImpact >= 0.9 ? "Optimal" : weatherImpact >= 0.7 ? "Moderate" : "Severe"}
              icon={<Activity className="w-6 h-6" />}
              variant={weatherImpact >= 0.9 ? "success" : weatherImpact >= 0.7 ? "warning" : "danger"}
            />
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Main Intersection */}
          <div className="xl:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xl font-bold">Live Intersection Monitor</h2>
              </div>
              <IntersectionView
                northSouth={northSouthState}
                eastWest={eastWestState}
                vehicleCount={vehicleCount}
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <h2 className="text-xl font-bold">Network Coordination</h2>
              </div>
              <MultiIntersectionView
                intersections={intersections}
                greenWaveActive={greenWaveActive}
              />
            </div>
          </div>

          {/* Middle Column - Analytics */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-xl font-bold">Traffic Analytics</h2>
              </div>
              <AnalyticsCharts
                trafficData={trafficDataPoints}
                directionData={directionData}
              />
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <h2 className="text-xl font-bold">Control Center</h2>
              </div>
              
              <div className="space-y-4">
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
                  emergencyDirection={emergencyDirection}
                  onEmergencyTrigger={handleEmergencyTrigger}
                  emergencyTimeRemaining={emergencyTimeRemaining}
                />

                <WeatherControl
                  currentWeather={currentWeather}
                  onWeatherChange={handleWeatherChange}
                  weatherImpact={weatherImpact}
                />
              </div>
            </div>
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
            title="System Efficiency" 
            value={`${(100 - metrics.congestionIndex).toFixed(0)}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant={metrics.congestionIndex < 30 ? "success" : "warning"}
          />
          <MetricCard
            title="Network Sync"
            value={`${intersections.filter(i => i.coordination === "synchronized").length}/${intersections.length}`}
            icon={<Zap className="w-5 h-5" />}
            variant="success"
          />
        </div>

        {/* Enhanced Footer */}
        <div className="dashboard-card text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="text-lg font-bold">Advanced Traffic Management System</p>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-Powered Smart City Solution • Capstone Project 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;