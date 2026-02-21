import { fuelLogs, trips, getVehicleById, getDriverById, type FuelLog } from "@/data/mockData";
import { useState } from "react";
import { Plus, DollarSign, Fuel, TrendingDown } from "lucide-react";
import { KPICard } from "@/components/KPICard";

export default function FuelExpense() {
  const [logs] = useState<FuelLog[]>(fuelLogs);
  const [showForm, setShowForm] = useState(false);

  const totalFuelCost = logs.reduce((s, l) => s + l.fuelCost, 0);
  const totalMaintCost = logs.reduce((s, l) => s + l.maintenanceCost, 0);
  const totalOpCost = totalFuelCost + totalMaintCost;
  const totalFuelUsed = logs.reduce((s, l) => s + l.fuelUsed, 0);

  const enrichedLogs = logs.map(log => {
    const trip = trips.find(t => t.id === log.tripId);
    const vehicle = getVehicleById(log.vehicleId);
    const driver = getDriverById(log.driverId);
    const costPerKm = trip ? (log.fuelCost + log.maintenanceCost) / trip.distance : 0;
    return { ...log, trip, vehicle, driver, costPerKm, totalCost: log.fuelCost + log.maintenanceCost };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Track fuel consumption and operational expenses</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="h-4 w-4" /> Log Expense
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Fuel Cost" value={`$${totalFuelCost.toLocaleString()}`} icon={Fuel} variant="primary" />
        <KPICard title="Maintenance Cost" value={`$${totalMaintCost.toLocaleString()}`} icon={DollarSign} variant="warning" />
        <KPICard title="Total Operational" value={`$${totalOpCost.toLocaleString()}`} icon={TrendingDown} />
        <KPICard title="Fuel Used" value={`${totalFuelUsed.toLocaleString()} L`} icon={Fuel} variant="success" />
      </div>

      {showForm && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-sm font-semibold mb-4">Log Fuel & Expense</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Trip ID", type: "text", placeholder: "TR-XXX" },
              { label: "Vehicle", type: "select" },
              { label: "Driver", type: "select" },
              { label: "Fuel Used (L)", type: "number", placeholder: "0" },
              { label: "Fuel Cost ($)", type: "number", placeholder: "0.00" },
              { label: "Maintenance Cost ($)", type: "number", placeholder: "0.00" },
            ].map(field => (
              <div key={field.label}>
                <label className="text-xs text-muted-foreground mb-1 block">{field.label}</label>
                <input className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder={field.placeholder || ""} type={field.type === "number" ? "number" : "text"} />
              </div>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save Entry</button>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trip</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Driver</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Fuel (L)</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Fuel Cost</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Maint. Cost</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">$/km</th>
            </tr>
          </thead>
          <tbody>
            {enrichedLogs.map(log => (
              <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-primary">{log.id}</td>
                <td className="py-3 px-4 font-mono text-xs">{log.tripId}</td>
                <td className="py-3 px-4">{log.vehicle?.model || log.vehicleId}</td>
                <td className="py-3 px-4">{log.driver?.name || log.driverId}</td>
                <td className="py-3 px-4 text-right">{log.fuelUsed}</td>
                <td className="py-3 px-4 text-right">${log.fuelCost}</td>
                <td className="py-3 px-4 text-right">${log.maintenanceCost}</td>
                <td className="py-3 px-4 text-right font-medium">${log.totalCost}</td>
                <td className="py-3 px-4 text-right text-xs text-muted-foreground">${log.costPerKm.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
