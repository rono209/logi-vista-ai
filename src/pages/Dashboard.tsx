import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { vehicles, trips, drivers, maintenanceLogs, fuelLogs, isServiceDueSoon, emissionTrendData, fuelTrendData, getDriverById, getVehicleById, calculateCarbonEmission } from "@/data/mockData";
import { Truck, AlertTriangle, TrendingUp, Package, Wrench, Leaf, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const activeFleet = vehicles.filter(v => v.status === "On Trip").length;
  const inShop = vehicles.filter(v => v.status === "In Shop").length;
  const totalOperational = vehicles.filter(v => v.status !== "Retired").length;
  const utilizationRate = Math.round((activeFleet / totalOperational) * 100);
  const pendingCargo = trips.filter(t => t.status === "Draft").length;
  const serviceSoon = vehicles.filter(v => isServiceDueSoon(v) && v.status !== "Retired").length;
  const monthlyEmission = fuelLogs.reduce((sum, f) => {
    const v = getVehicleById(f.vehicleId);
    return sum + (v ? calculateCarbonEmission(f.fuelUsed, v.emissionFactor) : 0);
  }, 0);

  const recentTrips = trips.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Active Fleet" value={activeFleet} subtitle={`${totalOperational} total operational`} icon={Truck} variant="primary" trend={{ value: 12, label: "vs last week" }} />
        <KPICard title="Maintenance Alerts" value={inShop} subtitle="Vehicles in shop" icon={AlertTriangle} variant="warning" />
        <KPICard title="Utilization Rate" value={`${utilizationRate}%`} icon={TrendingUp} variant="success" trend={{ value: 5, label: "vs last month" }} />
        <KPICard title="Pending Cargo" value={pendingCargo} subtitle="Awaiting dispatch" icon={Package} />
        <KPICard title="Service Due" value={serviceSoon} subtitle="Predictive alerts" icon={Wrench} variant="destructive" />
        <KPICard title="CO₂ This Month" value={`${(monthlyEmission / 1000).toFixed(1)}t`} icon={Leaf} variant="success" trend={{ value: -8, label: "vs last month" }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Fuel Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fuelTrendData}>
              <defs>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(185 70% 42%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(185 70% 42%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222 20% 12%)", border: "1px solid hsl(222 15% 18%)", borderRadius: 8, color: "hsl(210 20% 92%)" }} />
              <Area type="monotone" dataKey="efficiency" stroke="hsl(185 70% 42%)" fillOpacity={1} fill="url(#fuelGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Monthly CO₂ Emissions (kg)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={emissionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 15% 18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 15% 55%)", fontSize: 12 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222 20% 12%)", border: "1px solid hsl(222 15% 18%)", borderRadius: 8, color: "hsl(210 20% 92%)" }} />
              <Bar dataKey="co2" fill="hsl(152 60% 40%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Trips + Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Recent Trips</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 font-medium">Trip ID</th>
                  <th className="text-left py-2 font-medium">Route</th>
                  <th className="text-left py-2 font-medium">Driver</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Distance</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map(trip => {
                  const driver = getDriverById(trip.driverId);
                  return (
                    <tr key={trip.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-2.5 font-mono text-xs text-primary">{trip.id}</td>
                      <td className="py-2.5">{trip.origin} → {trip.destination}</td>
                      <td className="py-2.5">{driver?.name || "—"}</td>
                      <td className="py-2.5"><StatusBadge status={trip.status} /></td>
                      <td className="py-2.5 text-right">{trip.distance} km</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-4">Fleet Status</h3>
          <div className="space-y-3">
            {[
              { label: "Available", count: vehicles.filter(v => v.status === "Available").length, variant: "success" as const },
              { label: "On Trip", count: vehicles.filter(v => v.status === "On Trip").length, variant: "info" as const },
              { label: "In Shop", count: vehicles.filter(v => v.status === "In Shop").length, variant: "warning" as const },
              { label: "Retired", count: vehicles.filter(v => v.status === "Retired").length, variant: "muted" as const },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    item.variant === "success" ? "bg-success" :
                    item.variant === "info" ? "bg-info" :
                    item.variant === "warning" ? "bg-warning" :
                    "bg-muted-foreground"
                  }`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Maintenance Alerts
            </h4>
            {vehicles.filter(v => isServiceDueSoon(v) && v.status !== "Retired").slice(0, 3).map(v => (
              <div key={v.id} className="flex items-center justify-between py-1.5 text-xs">
                <span>{v.model}</span>
                <span className="text-warning font-medium">{v.odometer - v.lastServiceOdometer} km overdue</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
