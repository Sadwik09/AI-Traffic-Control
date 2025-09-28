import { useState, useEffect, useCallback } from "react";
import { TrafficLightState } from "@/components/TrafficLight";

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

export const useTrafficSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [northSouthState, setNorthSouthState] = useState<TrafficLightState>("red");
  const [eastWestState, setEastWestState] = useState<TrafficLightState>("green");
  
  // Configuration
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [cycleTime, setCycleTime] = useState(60);
  const [minGreenTime, setMinGreenTime] = useState(10);
  
  // Vehicle counts (simulated)
  const [vehicleCount, setVehicleCount] = useState<VehicleCount>({
    north: 0,
    south: 0,
    east: 0,
    west: 0
  });
  
  // Historical data for adaptive timing
  const [trafficHistory, setTrafficHistory] = useState<VehicleCount[]>([]);
  const [metrics, setMetrics] = useState<TrafficMetrics>({
    avgWaitTime: 0,
    vehiclesPerMinute: 0,
    congestionIndex: 0,
    totalVehiclesProcessed: 0
  });

  // Simulate vehicle arrivals
  const generateVehicles = useCallback(() => {
    const timeOfDay = (Date.now() % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000);
    const rushHourMultiplier = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19) ? 2 : 1;
    
    setVehicleCount(prev => ({
      north: Math.max(0, prev.north + Math.floor(Math.random() * 3 * rushHourMultiplier) - 1),
      south: Math.max(0, prev.south + Math.floor(Math.random() * 3 * rushHourMultiplier) - 1),
      east: Math.max(0, prev.east + Math.floor(Math.random() * 3 * rushHourMultiplier) - 1),
      west: Math.max(0, prev.west + Math.floor(Math.random() * 3 * rushHourMultiplier) - 1),
    }));
  }, []);

  // Process vehicles through intersection
  const processVehicles = useCallback(() => {
    setVehicleCount(prev => {
      const throughput = {
        north: northSouthState === "green" ? Math.min(prev.north, 3) : 0,
        south: northSouthState === "green" ? Math.min(prev.south, 3) : 0,
        east: eastWestState === "green" ? Math.min(prev.east, 3) : 0,
        west: eastWestState === "green" ? Math.min(prev.west, 3) : 0,
      };

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
  }, [northSouthState, eastWestState]);

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
    
    // Allocate more time to directions with more traffic, but respect minimum
    const nsTime = Math.max(minGreenTime, Math.floor(cycleTime * nsRatio));
    const ewTime = Math.max(minGreenTime, cycleTime - nsTime);
    
    return { nsTime, ewTime };
  }, [adaptiveMode, trafficHistory, cycleTime, minGreenTime]);

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
      
      // Generate new vehicles every second
      generateVehicles();
      
      // Process vehicles through intersection
      processVehicles();
      
      // Store traffic history every 10 seconds
      if (currentTime % 10 === 0) {
        setTrafficHistory(prev => [...prev.slice(-50), vehicleCount]);
      }
      
      // Update traffic light states
      const timing = adaptiveMode ? calculateAdaptiveTiming() : { nsTime: cycleTime / 2, ewTime: cycleTime / 2 };
      const cyclePosition = currentTime % (typeof timing === 'number' ? cycleTime : timing.nsTime + timing.ewTime + 6); // +6 for yellow transitions
      
      if (typeof timing === 'number') {
        // Fixed timing
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
        // Adaptive timing
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

      // Update metrics
      const totalWaiting = Object.values(vehicleCount).reduce((a, b) => a + b, 0);
      setMetrics(prev => ({
        ...prev,
        avgWaitTime: totalWaiting > 0 ? totalWaiting * 2.5 : 0, // Estimated wait time
        congestionIndex: Math.min(100, totalWaiting * 5) // Scale 0-100
      }));
      
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentTime, generateVehicles, processVehicles, calculateAdaptiveTiming, vehicleCount, adaptiveMode, cycleTime]);

  const toggleSimulation = () => setIsRunning(!isRunning);
  
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setVehicleCount({ north: 0, south: 0, east: 0, west: 0 });
    setTrafficHistory([]);
    setMetrics({
      avgWaitTime: 0,
      vehiclesPerMinute: 0,
      congestionIndex: 0,
      totalVehiclesProcessed: 0
    });
    setNorthSouthState("red");
    setEastWestState("green");
  };

  return {
    // State
    isRunning,
    currentTime,
    northSouthState,
    eastWestState,
    vehicleCount,
    metrics,
    
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