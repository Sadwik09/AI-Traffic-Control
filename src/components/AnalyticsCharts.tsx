import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface TrafficDataPoint {
  time: string;
  vehicles: number;
  waitTime: number;
  congestion: number;
}

interface DirectionData {
  direction: string;
  vehicles: number;
  color: string;
}

interface AnalyticsChartsProps {
  trafficData: TrafficDataPoint[];
  directionData: DirectionData[];
  className?: string;
}

export const AnalyticsCharts = ({
  trafficData,
  directionData,
  className
}: AnalyticsChartsProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Traffic Flow Over Time */}
      <Card className="dashboard-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Traffic Flow Analysis</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="vehicles" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Vehicles/Min"
            />
            <Line 
              type="monotone" 
              dataKey="waitTime" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              name="Wait Time (s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Congestion Levels */}
      <Card className="dashboard-card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Congestion Levels</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={trafficData.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
            <Bar 
              dataKey="congestion" 
              fill="hsl(var(--primary))"
              name="Congestion %"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Direction Distribution */}
      <Card className="dashboard-card">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Traffic Distribution</h3>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={directionData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="vehicles"
            >
              {directionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center gap-4 mt-2">
          {directionData.map((entry) => (
            <div key={entry.direction} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.direction}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};