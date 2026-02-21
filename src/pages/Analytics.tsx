import { vehicles, fuelLogs, maintenanceLogs, trips, fuelTrendData, emissionTrendData, calculateROI, getVehicleById } from "@/data/mockData";
import { KPICard } from "@/components/KPICard";
import { BarChart3, Download, TrendingUp, DollarSign, Fuel, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const vehicleROI = vehicles.filter(v => v.status !== "Retired").map(v => ({
    name: v.model,
    id: v.id,
    roi: calculateROI(v),
    fuelCost: fuelLogs.filter(f => f.vehicleId === v.id).reduce((s, f) => s + f.fuelCost, 0),
    maintCost: maintenanceLogs.filter(m => m.vehicleId === v.id).reduce((s, m) => s + m.cost, 0),
  })).sort((a, b) => b.roi - a.roi);

  const totalRevenue = trips.filter(t => t.status === "Completed").length * 1500;
  const totalFuelCost = fuelLogs.reduce((s, f) => s + f.fuelCost, 0);
  const totalMaintCost = maintenanceLogs.reduce((s, m) => s + m.cost, 0);
  const fleetROI = ((totalRevenue - totalFuelCost - totalMaintCost) / vehicles.reduce((s, v) => s + v.acquisitionCost, 0) * 100).toFixed(1);

  const activeVehicles = vehicles.filter(v => v.status !== "Retired").length;
  const onTrip = vehicles.filter(v => v.status === "On Trip").length;
  const utilization = Math.round((onTrip / activeVehicles) * 100);

  const costBreakdown = [
    { name: "Fuel", value: totalFuelCost, color: "hsl(185 70% 42%)" },
    { name: "Maintenance", value: totalMaintCost, color: "hsl(38 92% 50%)" },
  ];

  const handleExport = (type: "csv" | "pdf") => {
    if (type === "csv") {
      const headers = "Vehicle,ROI,Fuel Cost,Maint Cost\n";
      const rows = vehicleROI.map(v => `${v.name},${v.roi},${v.fuelCost},${v.maintCost}`).join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fleet-analytics.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Financial reports and fleet performance analytics</p>
        <div className="flex gap-2">
          <button onClick={() => handleExport("csv")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-sm hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> CSV
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-sm hover:bg-muted transition-colors">
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Fleet ROI" value={`${fleetROI}%`} icon={TrendingUp} variant="primary" trend={{ value: 3.2, label: "vs last quarter" }} />
        <KPICard title="Utilization" value={`${utilization}%`} icon={BarChart3} variant="success" />
        <KPICard title="Total Fuel Cost" value={`$${totalFuelCost.toLocaleString()}`} icon={Fuel} />
        <KPICard title="Total Maint. Cost" value={`$${totalMaintCost.toLocaleString()}`} icon={DollarSign} variant="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Fuel Efficiency Trend (km/L)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={fuelTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222 20% 12%)", border: "1px solid hsl(222 15% 18%)", borderRadius: 8, color: "hsl(210 20% 92%)" }} />
              <Line type="monotone" dataKey="efficiency" stroke="hsl(185 70% 42%)" strokeWidth={2} dot={{ fill: "hsl(185 70% 42%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Cost Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                  {costBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(222 20% 12%)", border: "1px solid hsl(222 15% 18%)", borderRadius: 8, color: "hsl(210 20% 92%)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {costBreakdown.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
                <span className="text-muted-foreground">{item.name}: ${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle ROI Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Vehicle ROI Ranking</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rank</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">ROI</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Fuel Cost</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Maint. Cost</th>
              <th className="text-center py-3 px-4 font-medium text-muted-foreground">Profitability</th>
            </tr>
          </thead>
          <tbody>
            {vehicleROI.map((v, i) => (
              <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">#{i + 1}</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-primary">{v.id}</span> {v.name}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-medium ${v.roi > 0 ? "text-success" : "text-destructive"}`}>
                    {v.roi > 0 ? "+" : ""}{(v.roi * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">${v.fuelCost.toLocaleString()}</td>
                <td className="py-3 px-4 text-right">${v.maintCost.toLocaleString()}</td>
                <td className="py-3 px-4 text-center">
                  <div className="w-full max-w-[100px] mx-auto h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${v.roi > 0 ? "bg-success" : "bg-destructive"}`} style={{ width: `${Math.min(Math.abs(v.roi) * 100, 100)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
