import { useState, useEffect, useCallback } from "react";
import { TrafficLightState } from "@/components/TrafficLight";
import { EmergencyVehicleType, EmergencyDirection } from "@/components/EmergencyControl";
import { WeatherCondition } from "@/components/WeatherControl";

interface VehicleCount {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface TrafficMetrics {
  avgWaitTime: number;
  vehiclesPerMinute: number;
  congestionIndex: number;
  totalVehiclesProcessed: number;
}

interface PedestrianRequests {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

interface TrafficDataPoint {
  time: string;
  vehicles: number;
  waitTime: number;
  congestion: number;
}

interface IntersectionData {
  id: string;
  name: string;
  northSouth: TrafficLightState;
  eastWest: TrafficLightState;
  vehicleCount: number;
  coordination: "synchronized" | "independent" | "delayed";
}

export const useAdvancedTrafficSimulation = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [northSouthState, setNorthSouthState] = useState<TrafficLightState>("red");
  const [eastWestState, setEastWestState] = useState<TrafficLightState>("green");
  
  // Configuration
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [cycleTime, setCycleTime] = useState(60);
  const [minGreenTime, setMinGreenTime] = useState(10);
  
  // Emergency System
  const [activeEmergency, setActiveEmergency] = useState<EmergencyVehicleType>(null);
  const [emergencyDirection, setEmergencyDirection] = useState<EmergencyDirection>(null);
  const [emergencyTimeRemaining, setEmergencyTimeRemaining] = useState(0);
  
  // Pedestrian System
  const [pedestrianRequests, setPedestrianRequests] = useState<PedestrianRequests>({
    north: false,
    south: false,
    east: false,
    west: false
  });
  const [pedestrianPhaseActive, setPedestrianPhaseActive] = useState(false);
  const [pedestrianTimeRemaining, setPedestrianTimeRemaining] = useState(0);
  
  // Weather System
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition>("clear");
  const [weatherImpact, setWeatherImpact] = useState(1.0);
  
  // Multi-Intersection System
  const [intersections, setIntersections] = useState<IntersectionData[]>([
    { id: "A", name: "Main & 1st", northSouth: "red", eastWest: "green", vehicleCount: 12, coordination: "synchronized" },
    { id: "B", name: "Main & 2nd", northSouth: "green", eastWest: "red", vehicleCount: 8, coordination: "synchronized" },
    { id: "C", name: "Main & 3rd", northSouth: "red", eastWest: "green", vehicleCount: 15, coordination: "delayed" }
  ]);
  const [greenWaveActive, setGreenWaveActive] = useState(true);
  
  // Vehicle counts (simulated) - Start with initial traffic
  const [vehicleCount, setVehicleCount] = useState<VehicleCount>({
    north: 8,
    south: 6,
    east: 10,
    west: 7
  });
  
  // Historical data
  const [trafficHistory, setTrafficHistory] = useState<VehicleCount[]>([]);
  const [trafficDataPoints, setTrafficDataPoints] = useState<TrafficDataPoint[]>([]);
  const [metrics, setMetrics] = useState<TrafficMetrics>({
    avgWaitTime: 0,
    vehiclesPerMinute: 0,
    congestionIndex: 0,
    totalVehiclesProcessed: 0
  });

  // Weather impact mapping
  const weatherImpactMap = {
    clear: 1.0,
    cloudy: 0.95,
    rain: 0.8,
    snow: 0.6,
    fog: 0.7
  };

  // Emergency vehicle handler
  const handleEmergencyTrigger = useCallback((type: EmergencyVehicleType, direction?: EmergencyDirection) => {
    if (type === null) {
      // Cancel emergency
      setActiveEmergency(null);
      setEmergencyDirection(null);
      setEmergencyTimeRemaining(0);
    } else if (direction) {
      // Set emergency with direction
      setActiveEmergency(type);
      setEmergencyDirection(direction);
      setEmergencyTimeRemaining(30); // 30 second emergency override
      // Cancel pedestrian phase if active
      setPedestrianPhaseActive(false);
      setPedestrianTimeRemaining(0);
    } else {
      // Just set the emergency type, waiting for direction
      setActiveEmergency(type);
      setEmergencyDirection(null);
    }
  }, []);

  // Pedestrian request handler
  const handlePedestrianRequest = useCallback((direction: keyof PedestrianRequests) => {
    if (activeEmergency) return; // No pedestrian requests during emergency
    
    setPedestrianRequests(prev => ({
      ...prev,
      [direction]: !prev[direction]
    }));
  }, [activeEmergency]);

  // Weather change handler
  const handleWeatherChange = useCallback((weather: WeatherCondition) => {
    setCurrentWeather(weather);
    setWeatherImpact(weatherImpactMap[weather]);
  }, []);

  // Simulate vehicle arrivals with weather impact
  const generateVehicles = useCallback(() => {
    const timeOfDay = (Date.now() % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000);
    const rushHourMultiplier = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19) ? 2 : 1;
    const baseRate = Math.floor(Math.random() * 3 * rushHourMultiplier * weatherImpact);
    
    setVehicleCount(prev => ({
      north: Math.max(0, prev.north + baseRate - 1),
      south: Math.max(0, prev.south + baseRate - 1),
      east: Math.max(0, prev.east + baseRate - 1),
      west: Math.max(0, prev.west + baseRate - 1),
    }));

    // Update multi-intersection data
    setIntersections(prev => prev.map(intersection => ({
      ...intersection,
      vehicleCount: Math.max(0, intersection.vehicleCount + Math.floor(Math.random() * 2 * weatherImpact) - 1)
    })));
  }, [weatherImpact]);

  // Process vehicles through intersection
  const processVehicles = useCallback(() => {
    setVehicleCount(prev => {
      let throughput = { north: 0, south: 0, east: 0, west: 0 };

      if (activeEmergency && emergencyDirection) {
        // Emergency vehicles get priority - only emergency direction moves
        const baseRate = 5;
        throughput = {
          north: emergencyDirection === "north" ? Math.min(prev.north, baseRate) : 0,
          south: emergencyDirection === "south" ? Math.min(prev.south, baseRate) : 0,
          east: emergencyDirection === "east" ? Math.min(prev.east, baseRate) : 0,
          west: emergencyDirection === "west" ? Math.min(prev.west, baseRate) : 0,
        };
      } else if (pedestrianPhaseActive) {
        // No vehicle movement during pedestrian phase
        throughput = { north: 0, south: 0, east: 0, west: 0 };
      } else {
        // Normal traffic flow based on lights
        const baseRate = Math.floor(3 * weatherImpact);
        throughput = {
          north: northSouthState === "green" ? Math.min(prev.north, baseRate) : 0,
          south: northSouthState === "green" ? Math.min(prev.south, baseRate) : 0,
          east: eastWestState === "green" ? Math.min(prev.east, baseRate) : 0,
          west: eastWestState === "green" ? Math.min(prev.west, baseRate) : 0,
        };
      }

      const processed = Object.values(throughput).reduce((a, b) => a + b, 0);
      
      setMetrics(m => ({
        ...m,
        totalVehiclesProcessed: m.totalVehiclesProcessed + processed,
        vehiclesPerMinute: processed * 6 // per second * 60 / 10 (update frequency)
      }));

      return {
        north: prev.north - throughput.north,
        south: prev.south - throughput.south,
        east: prev.east - throughput.east,
        west: prev.west - throughput.west,
      };
    });
  }, [northSouthState, eastWestState, activeEmergency, emergencyDirection, pedestrianPhaseActive, weatherImpact]);

  // Adaptive timing calculation
  const calculateAdaptiveTiming = useCallback(() => {
    if (!adaptiveMode || trafficHistory.length < 5) return cycleTime / 2;
    
    const recentHistory = trafficHistory.slice(-10);
    const avgNorthSouth = recentHistory.reduce((acc, curr) => acc + curr.north + curr.south, 0) / recentHistory.length;
    const avgEastWest = recentHistory.reduce((acc, curr) => acc + curr.east + curr.west, 0) / recentHistory.length;
    
    const totalTraffic = avgNorthSouth + avgEastWest;
    if (totalTraffic === 0) return cycleTime / 2;
    
    const nsRatio = avgNorthSouth / totalTraffic;
    const ewRatio = avgEastWest / totalTraffic;
    
    const nsTime = Math.max(minGreenTime, Math.floor(cycleTime * nsRatio));
    const ewTime = Math.max(minGreenTime, cycleTime - nsTime);
    
    return { nsTime, ewTime };
  }, [adaptiveMode, trafficHistory, cycleTime, minGreenTime]);

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
      
      // Handle emergency countdown
      if (emergencyTimeRemaining > 0) {
        setEmergencyTimeRemaining(prev => prev - 1);
        if (emergencyTimeRemaining === 1) {
          setActiveEmergency(null);
          setEmergencyDirection(null);
        }
      }
      
      // Handle pedestrian countdown
      if (pedestrianTimeRemaining > 0) {
        setPedestrianTimeRemaining(prev => prev - 1);
        if (pedestrianTimeRemaining === 1) {
          setPedestrianPhaseActive(false);
          setPedestrianRequests({ north: false, south: false, east: false, west: false });
        }
      }
      
      // Check for pedestrian phase activation
      const hasRequests = Object.values(pedestrianRequests).some(Boolean);
      if (hasRequests && !pedestrianPhaseActive && !activeEmergency && currentTime % 30 === 0) {
        setPedestrianPhaseActive(true);
        setPedestrianTimeRemaining(15);
      }
      
      generateVehicles();
      processVehicles();
      
      // Store traffic history every 10 seconds
      if (currentTime % 10 === 0) {
        setTrafficHistory(prev => [...prev.slice(-50), vehicleCount]);
        
        // Add data point for charts
        const timeStr = new Date(Date.now() - ((50 - Math.floor(currentTime / 10)) * 10000)).toLocaleTimeString();
        setTrafficDataPoints(prev => [...prev.slice(-20), {
          time: timeStr,
          vehicles: Object.values(vehicleCount).reduce((a, b) => a + b, 0),
          waitTime: metrics.avgWaitTime,
          congestion: metrics.congestionIndex
        }]);
      }
      
      // Traffic light control logic
      if (activeEmergency && emergencyDirection) {
        // Emergency override - selected direction green, all others red
        if (emergencyDirection === "north" || emergencyDirection === "south") {
          setNorthSouthState("green");
          setEastWestState("red");
        } else {
          setNorthSouthState("red");
          setEastWestState("green");
        }
      } else if (pedestrianPhaseActive) {
        // Pedestrian phase - all lights red
        setNorthSouthState("red");
        setEastWestState("red");
      } else {
        // Normal operation
        const timing = adaptiveMode ? calculateAdaptiveTiming() : { nsTime: cycleTime / 2, ewTime: cycleTime / 2 };
        const totalCycle = typeof timing === 'number' ? cycleTime : timing.nsTime + timing.ewTime + 6;
        const cyclePosition = currentTime % totalCycle;
        
        if (typeof timing === 'number') {
          if (cyclePosition < timing) {
            setNorthSouthState("green");
            setEastWestState("red");
          } else if (cyclePosition < timing + 3) {
            setNorthSouthState("yellow");
            setEastWestState("red");
          } else if (cyclePosition < timing + 3 + timing) {
            setNorthSouthState("red");
            setEastWestState("green");
          } else {
            setNorthSouthState("red");
            setEastWestState("yellow");
          }
        } else {
          if (cyclePosition < timing.nsTime) {
            setNorthSouthState("green");
            setEastWestState("red");
          } else if (cyclePosition < timing.nsTime + 3) {
            setNorthSouthState("yellow");
            setEastWestState("red");
          } else if (cyclePosition < timing.nsTime + 3 + timing.ewTime) {
            setNorthSouthState("red");
            setEastWestState("green");
          } else {
            setNorthSouthState("red");
            setEastWestState("yellow");
          }
        }
      }

      // Update multi-intersection coordination
      setIntersections(prev => prev.map((intersection, index) => {
        const offset = index * 20; // 20 second offset between intersections
        const adjustedTime = (currentTime + offset) % (cycleTime + 6);
        
        let newNS: TrafficLightState = "red";
        let newEW: TrafficLightState = "red";
        
        if (!activeEmergency && !pedestrianPhaseActive) {
          if (adjustedTime < cycleTime / 2) {
            newNS = "green";
            newEW = "red";
          } else if (adjustedTime < cycleTime / 2 + 3) {
            newNS = "yellow";
            newEW = "red";
          } else if (adjustedTime < cycleTime) {
            newNS = "red";
            newEW = "green";
          } else {
            newNS = "red";
            newEW = "yellow";
          }
        }

        return {
          ...intersection,
          northSouth: newNS,
          eastWest: newEW,
          coordination: greenWaveActive && index < 2 ? "synchronized" : index === 2 ? "delayed" : "independent"
        };
      }));

      // Update metrics
      const totalWaiting = Object.values(vehicleCount).reduce((a, b) => a + b, 0);
      setMetrics(prev => ({
        ...prev,
        avgWaitTime: totalWaiting > 0 ? totalWaiting * 2.5 * (2 - weatherImpact) : 0,
        congestionIndex: Math.min(100, totalWaiting * 5 / weatherImpact)
      }));
      
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentTime, vehicleCount, generateVehicles, processVehicles, calculateAdaptiveTiming, 
      activeEmergency, pedestrianPhaseActive, pedestrianRequests, emergencyTimeRemaining, 
      pedestrianTimeRemaining, adaptiveMode, cycleTime, greenWaveActive, weatherImpact, metrics.avgWaitTime, metrics.congestionIndex]);

  const toggleSimulation = () => setIsRunning(!isRunning);
  
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setVehicleCount({ north: 0, south: 0, east: 0, west: 0 });
    setTrafficHistory([]);
    setTrafficDataPoints([]);
    setMetrics({
      avgWaitTime: 0,
      vehiclesPerMinute: 0,
      congestionIndex: 0,
      totalVehiclesProcessed: 0
    });
    setNorthSouthState("red");
    setEastWestState("green");
    setActiveEmergency(null);
    setEmergencyDirection(null);
    setEmergencyTimeRemaining(0);
    setPedestrianPhaseActive(false);
    setPedestrianTimeRemaining(0);
    setPedestrianRequests({ north: false, south: false, east: false, west: false });
  };

  // Derived data for charts
  const directionData = [
    { direction: "North", vehicles: vehicleCount.north, color: "#ef4444" },
    { direction: "South", vehicles: vehicleCount.south, color: "#f97316" },
    { direction: "East", vehicles: vehicleCount.east, color: "#eab308" },
    { direction: "West", vehicles: vehicleCount.west, color: "#22c55e" }
  ];

  return {
    // State
    isRunning,
    currentTime,
    northSouthState,
    eastWestState,
    vehicleCount,
    metrics,
    trafficDataPoints,
    directionData,
    
    // Emergency System
    activeEmergency,
    emergencyDirection,
    emergencyTimeRemaining,
    handleEmergencyTrigger,
    
    // Pedestrian System
    pedestrianRequests,
    pedestrianPhaseActive,
    pedestrianTimeRemaining,
    handlePedestrianRequest,
    
    // Weather System
    currentWeather,
    weatherImpact,
    handleWeatherChange,
    
    // Multi-Intersection System
    intersections,
    greenWaveActive,
    setGreenWaveActive,
    
    // Configuration
    adaptiveMode,
    cycleTime,
    minGreenTime,
    
    // Actions
    toggleSimulation,
    resetSimulation,
    setAdaptiveMode,
    setCycleTime: (value: number[]) => setCycleTime(value[0]),
    setMinGreenTime: (value: number[]) => setMinGreenTime(value[0]),
  };
};