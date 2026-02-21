import { useState } from "react";
import { vehicles as initialVehicles, type Vehicle, type VehicleStatus, getKmSinceService, isServiceDueSoon, getMaintenanceRiskScore, calculateROI } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, Filter, Edit2, Trash2, AlertTriangle } from "lucide-react";

export default function VehicleRegistry() {
  const [vehicleList] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = vehicleList.filter(v => {
    const matchSearch = v.model.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    const matchType = filterType === "all" || v.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const types = [...new Set(vehicleList.map(v => v.type))];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-sm font-semibold mb-4">Register New Vehicle</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Vehicle ID", "Model", "Plate Number", "Vehicle Type", "Max Load (kg)", "Odometer (km)", "Fuel Efficiency (km/L)", "Acquisition Cost ($)", "Emission Factor"].map(field => (
              <div key={field}>
                <label className="text-xs text-muted-foreground mb-1 block">{field}</label>
                <input className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder={field} />
              </div>
            ))}
            <div className="flex items-end">
              <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity w-full">
                Save Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plate</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Max Load</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Odometer</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Fuel Eff.</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Risk</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">ROI</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const risk = getMaintenanceRiskScore(v);
                const roi = calculateROI(v);
                const serviceDue = isServiceDueSoon(v);
                return (
                  <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-mono text-xs text-primary">{v.id}</span>
                        <p className="font-medium">{v.model}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{v.type}</td>
                    <td className="py-3 px-4 font-mono text-xs">{v.plate}</td>
                    <td className="py-3 px-4 text-right">{v.maxLoad.toLocaleString()} kg</td>
                    <td className="py-3 px-4 text-right">
                      <div>
                        {v.odometer.toLocaleString()} km
                        {serviceDue && (
                          <div className="flex items-center gap-1 justify-end text-warning text-xs">
                            <AlertTriangle className="h-3 w-3" /> Service due
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">{v.fuelEfficiency} km/L</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-medium ${risk > 0.6 ? "text-destructive" : risk > 0.3 ? "text-warning" : "text-success"}`}>
                        {(risk * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-medium ${roi > 0 ? "text-success" : "text-destructive"}`}>
                        {roi > 0 ? "+" : ""}{(roi * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center"><StatusBadge status={v.status} /></td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button className="p-1.5 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
