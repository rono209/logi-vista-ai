import { useState } from "react";
import { maintenanceLogs, vehicles, getVehicleById, getKmSinceService, isServiceDueSoon, getMaintenanceRiskScore, type MaintenanceLog } from "@/data/mockData";
import { Plus, AlertTriangle, Wrench, TrendingUp } from "lucide-react";

export default function Maintenance() {
  const [logs] = useState<MaintenanceLog[]>(maintenanceLogs);
  const [showForm, setShowForm] = useState(false);

  const predictiveAlerts = vehicles
    .filter(v => v.status !== "Retired")
    .map(v => ({ vehicle: v, kmSince: getKmSinceService(v), risk: getMaintenanceRiskScore(v), isDue: isServiceDueSoon(v) }))
    .sort((a, b) => b.risk - a.risk);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Track service history and predictive maintenance alerts</p>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus className="h-4 w-4" /> Log Service
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-sm font-semibold mb-4">Log Maintenance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Vehicle</label>
              <select className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select vehicle</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.id} – {v.model}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Service Type</label>
              <input className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Oil Change" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Cost ($)</label>
              <input type="number" className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="0.00" />
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save</button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-warning" /> Logging maintenance will set the vehicle status to "In Shop"
          </p>
        </div>
      )}

      {/* Predictive Alerts */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Predictive Maintenance Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {predictiveAlerts.map(({ vehicle, kmSince, risk, isDue }) => (
            <div key={vehicle.id} className={`p-4 rounded-lg border transition-all ${isDue ? "border-warning/40 bg-warning/5" : "border-border bg-secondary/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{vehicle.model}</span>
                {isDue && <AlertTriangle className="h-4 w-4 text-warning" />}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{vehicle.id} · {vehicle.plate}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Km since service</span>
                  <span className={isDue ? "text-warning font-medium" : ""}>{kmSince.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className={`font-medium ${risk > 0.6 ? "text-destructive" : risk > 0.3 ? "text-warning" : "text-success"}`}>{(risk * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${risk > 0.6 ? "bg-destructive" : risk > 0.3 ? "bg-warning" : "bg-success"}`} style={{ width: `${risk * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service History */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Wrench className="h-4 w-4 text-muted-foreground" /> Service History</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Service Type</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cost</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => {
              const vehicle = getVehicleById(log.vehicleId);
              return (
                <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-primary">{log.id}</td>
                  <td className="py-3 px-4">{vehicle?.model || log.vehicleId}</td>
                  <td className="py-3 px-4">{log.serviceType}</td>
                  <td className="py-3 px-4 text-right">${log.cost.toLocaleString()}</td>
                  <td className="py-3 px-4">{log.date}</td>
                  <td className="py-3 px-4 text-muted-foreground">{log.notes || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
