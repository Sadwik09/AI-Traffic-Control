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
      <Card className="dashboard-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Traffic Flow Analysis</h3>
            <p className="text-xs text-muted-foreground">Real-time vehicle flow and wait times</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
            <Line 
              type="monotone" 
              dataKey="vehicles" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Vehicles/Min"
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="waitTime" 
              stroke="hsl(var(--warning))" 
              strokeWidth={3}
              name="Wait Time (s)"
              dot={{ fill: "hsl(var(--warning))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Congestion Levels */}
      <Card className="dashboard-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-warning/10">
            <BarChart3 className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Congestion Levels</h3>
            <p className="text-xs text-muted-foreground">Last 10 data points analysis</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trafficData.slice(-10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              label={{ value: '%', angle: 0, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
            <Bar 
              dataKey="congestion" 
              fill="hsl(var(--primary))"
              name="Congestion %"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Direction Distribution */}
      <Card className="dashboard-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-success/10">
            <PieChartIcon className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Traffic Distribution</h3>
            <p className="text-xs text-muted-foreground">Vehicle distribution by direction</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={directionData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={3}
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
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {directionData.map((entry) => (
            <div key={entry.direction} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{entry.direction}</span>
                <span className="text-xs text-muted-foreground">{entry.vehicles} vehicles</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};