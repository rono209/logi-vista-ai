import { useState, useMemo } from "react";
import { vehicles, drivers, trips as initialTrips, type Trip, type TripStatus, calculateVehicleScore, getVehicleById, getDriverById } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Zap, AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function TripDispatch() {
  const [tripList] = useState<Trip[]>(initialTrips);
  const [showForm, setShowForm] = useState(false);
  const [cargoWeight, setCargoWeight] = useState<number>(0);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [distance, setDistance] = useState<number>(0);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [showRecommendation, setShowRecommendation] = useState(false);

  const availableVehicles = vehicles.filter(v => v.status === "Available");
  const validDrivers = drivers.filter(d => d.status !== "Suspended" && new Date(d.licenseExpiry) > new Date());

  const recommendations = useMemo(() => {
    if (!cargoWeight || cargoWeight <= 0) return [];
    return availableVehicles
      .filter(v => v.maxLoad >= cargoWeight && (!selectedVehicleType || v.type === selectedVehicleType))
      .map(v => ({ vehicle: v, ...calculateVehicleScore(v, cargoWeight) }))
      .sort((a, b) => b.score - a.score);
  }, [cargoWeight, selectedVehicleType]);

  const selectedDriverData = getDriverById(selectedDriver);
  const driverWarnings: string[] = [];
  if (selectedDriverData) {
    if (new Date(selectedDriverData.licenseExpiry) < new Date()) driverWarnings.push("License expired");
    if (selectedDriverData.status === "Suspended") driverWarnings.push("Driver is suspended");
  }

  const vehicleTypes = [...new Set(vehicles.map(v => v.type))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Manage and dispatch fleet trips with AI-powered recommendations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> New Trip
        </button>
      </div>

      {/* Trip Creation Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-sm font-semibold mb-4">Create New Trip</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Vehicle Type</label>
              <select value={selectedVehicleType} onChange={(e) => setSelectedVehicleType(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Any type</option>
                {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Cargo Weight (kg)</label>
              <input type="number" value={cargoWeight || ""} onChange={(e) => setCargoWeight(Number(e.target.value))} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. 15000" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Distance (km)</label>
              <input type="number" value={distance || ""} onChange={(e) => setDistance(Number(e.target.value))} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. 450" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Driver</label>
              <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="">Select driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id} disabled={d.status === "Suspended" || new Date(d.licenseExpiry) < new Date()}>
                    {d.name} ({d.status}){new Date(d.licenseExpiry) < new Date() ? " – EXPIRED" : ""}
                  </option>
                ))}
              </select>
              {driverWarnings.length > 0 && (
                <div className="mt-1 flex items-center gap-1 text-destructive text-xs">
                  <AlertCircle className="h-3 w-3" /> {driverWarnings.join(", ")}
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Origin</label>
              <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="City, State" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Destination</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="City, State" />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setShowRecommendation(true)} disabled={!cargoWeight} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-40">
              <Zap className="h-4 w-4" /> Smart Recommend
            </button>
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Create Trip
            </button>
          </div>
        </div>
      )}

      {/* AI Recommendation Panel */}
      {showForm && showRecommendation && recommendations.length > 0 && (
        <div className="glass-card p-5 border-primary/30 glow-primary animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">AI Vehicle Recommendation</h3>
            <span className="text-xs text-muted-foreground">for {cargoWeight.toLocaleString()} kg cargo</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={rec.vehicle.id} className={`p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${i === 0 ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/50"}`}>
                {i === 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">Best Match</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{rec.vehicle.model}</span>
                  <span className="text-lg font-bold text-primary">{(rec.score * 100).toFixed(0)}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{rec.vehicle.id} · {rec.vehicle.type}</p>
                <div className="space-y-1.5">
                  {[
                    { label: "Capacity", value: rec.breakdown.capacity, weight: "40%" },
                    { label: "Fuel Eff.", value: rec.breakdown.fuel, weight: "30%" },
                    { label: "Maint. Risk", value: rec.breakdown.maintenance, weight: "20%" },
                    { label: "ROI", value: rec.breakdown.roi, weight: "10%" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-16">{item.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.value * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-6">{item.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {recommendations.length === 0 && (
            <div className="flex items-center gap-2 text-warning text-sm">
              <Info className="h-4 w-4" /> No vehicles match the cargo weight requirement
            </div>
          )}
        </div>
      )}

      {/* Trip List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trip ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Route</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Driver</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cargo</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Distance</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Fuel Est.</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">CO₂</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {tripList.map(trip => {
                const vehicle = getVehicleById(trip.vehicleId);
                const driver = getDriverById(trip.driverId);
                return (
                  <tr key={trip.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-primary">{trip.id}</td>
                    <td className="py-3 px-4">{trip.origin} → {trip.destination}</td>
                    <td className="py-3 px-4 text-xs">{vehicle?.model || trip.vehicleId}</td>
                    <td className="py-3 px-4">{driver?.name || "—"}</td>
                    <td className="py-3 px-4 text-right">{trip.cargoWeight.toLocaleString()} kg</td>
                    <td className="py-3 px-4 text-right">{trip.distance} km</td>
                    <td className="py-3 px-4 text-right">${trip.estimatedFuelCost}</td>
                    <td className="py-3 px-4 text-right text-xs">{trip.carbonEmission ? `${trip.carbonEmission} kg` : "—"}</td>
                    <td className="py-3 px-4 text-center"><StatusBadge status={trip.status} /></td>
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
