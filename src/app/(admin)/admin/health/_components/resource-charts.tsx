"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const resourceData = [
  { time: "00:00", cpu: 30, memory: 40 },
  { time: "04:00", cpu: 45, memory: 35 },
  { time: "08:00", cpu: 60, memory: 50 },
  { time: "12:00", cpu: 55, memory: 65 },
  { time: "16:00", cpu: 70, memory: 55 },
  { time: "20:00", cpu: 85, memory: 45 },
  { time: "Now", cpu: 65, memory: 60 },
];

export function ResourceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
           <div>
              <CardTitle>Resource Utilization</CardTitle>
              <p className="text-sm text-muted-foreground">CPU vs Memory Usage over time</p>
           </div>
           <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-blue-500" />
                 <span>CPU Load</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-purple-500" />
                 <span>Memory</span>
              </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis 
                    dataKey="time" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="cpu" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCpu)" 
                />
                <Area 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="#a855f7" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorMem)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Volume</CardTitle>
          <p className="text-sm text-muted-foreground">Requests per region (RPM)</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span>North America</span>
                <span>45%</span>
             </div>
             <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[45%] rounded-full bg-blue-500" />
             </div>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span>Europe (West)</span>
                <span>28%</span>
             </div>
             <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[28%] rounded-full bg-blue-500" />
             </div>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span>Asia Pacific</span>
                <span>15%</span>
             </div>
             <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[15%] rounded-full bg-purple-500" />
             </div>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span>South America</span>
                <span>8%</span>
             </div>
             <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[8%] rounded-full bg-orange-500" />
             </div>
          </div>
          
          <div className="pt-4 mt-4 border-t h-[120px] bg-muted/30 rounded-lg flex items-center justify-center">
             {/* Placeholder for map or other viz */}
             <div className="text-xs text-muted-foreground">Regional Heatmap Placeholder</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
