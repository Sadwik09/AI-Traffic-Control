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
    <div className="min-h-screen">
      {/* Vibrant Header with Rainbow Gradient */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b-2 border-primary/20 shadow-xl">
        <div className="max-w-[1600px] mx-auto p-6 md:p-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
              Advanced Traffic Management System
            </h1>
            <p className="text-foreground text-lg font-medium">
              🚦 AI-Powered Smart City Traffic Control • 🚨 Emergency Priority • 🌦️ Weather Adaptation • 🔄 Multi-Intersection Coordination
            </p>
            
            {/* Colorful Status Indicators */}
            <div className="flex items-center justify-center flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/30 shadow-lg">
                <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-success pulse-glow' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-bold text-primary">
                  {isRunning ? '● ACTIVE' : '○ PAUSED'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 border-2 border-secondary/30 shadow-lg">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-sm font-bold text-secondary">{systemStatus.status}</span>
              </div>
              
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border-2 border-accent/30 shadow-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm font-mono font-bold text-accent">{formatTime(currentTime)}</span>
              </div>
              
              {greenWaveActive && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/30 shadow-lg">
                  <Zap className="w-5 h-5 text-success pulse-glow" />
                  <span className="text-sm font-bold text-success">🌊 Green Wave Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto p-6 space-y-8">

        {/* Colorful Key Performance Indicators */}
        <div className="dashboard-card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Key Performance Indicators
              </h2>
              <p className="text-xs text-muted-foreground">Real-time system metrics and analytics</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard
              title="⏱️ Runtime"
              value={formatTime(currentTime)}
              icon={<Clock className="w-6 h-6 text-primary" />}
              variant="default"
            />
            
            <MetricCard
              title="🚗 Traffic Flow"
              value={metrics.vehiclesPerMinute.toFixed(1)}
              trend="up"
              change="vehicles/min"
              icon={<Car className="w-6 h-6 text-success" />}
              variant="success"
            />
            
            <MetricCard
              title="⏳ Wait Time"
              value={`${metrics.avgWaitTime.toFixed(1)}s`}
              trend="down"
              change={metrics.avgWaitTime > 15 ? "↑ High" : "✓ Optimal"}
              icon={<Timer className="w-6 h-6 text-warning" />}
              variant={metrics.avgWaitTime > 15 ? "warning" : "success"}
            />
            
            <MetricCard
              title="📊 Congestion"
              value={`${metrics.congestionIndex.toFixed(0)}%`}
              trend={metrics.congestionIndex > 50 ? "up" : "neutral"}
              change={metrics.congestionIndex > 70 ? "⚠ Critical" : metrics.congestionIndex > 50 ? "→ Moderate" : "✓ Clear"}
              icon={<BarChart3 className="w-6 h-6 text-accent" />}
              variant={getCongestionVariant(metrics.congestionIndex)}
            />

            <MetricCard
              title="🌦️ Weather Impact"
              value={`${(weatherImpact * 100).toFixed(0)}%`}
              change={weatherImpact >= 0.9 ? "Perfect" : weatherImpact >= 0.7 ? "Moderate" : "Severe"}
              icon={<Activity className="w-6 h-6 text-secondary" />}
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
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-lg" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  🚦 Live Intersection Monitor
                </h2>
              </div>
              <IntersectionView
                northSouth={northSouthState}
                eastWest={eastWestState}
                vehicleCount={vehicleCount}
              />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse shadow-lg" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                  🌐 Network Coordination
                </h2>
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
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-lg" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
                  📈 Traffic Analytics
                </h2>
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
                <div className="w-3 h-3 rounded-full bg-warning animate-pulse shadow-lg" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-warning to-danger bg-clip-text text-transparent">
                  🎮 Control Center
                </h2>
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

        {/* Vibrant Footer */}
        <div className="dashboard-card text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary via-secondary to-accent animate-pulse shadow-lg" />
            <p className="text-xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Advanced Traffic Management System
            </p>
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent via-secondary to-primary animate-pulse shadow-lg" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            🎓 AI-Powered Smart City Solution • 🏆 Capstone Project 2025 • 🚀 Built with React & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;