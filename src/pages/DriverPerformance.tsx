import { drivers, type Driver } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
import { Shield, AlertTriangle, Search } from "lucide-react";

export default function DriverPerformance() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const isExpired = (date: string) => new Date(date) < new Date();
  const isExpiringSoon = (date: string) => {
    const exp = new Date(date);
    const now = new Date();
    const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff < 90;
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Monitor driver safety, license compliance, and performance metrics</p>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search drivers..." className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="all">All Status</option>
          <option value="On Duty">On Duty</option>
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(driver => (
          <div key={driver.id} className="glass-card p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{driver.name}</p>
                <p className="text-xs text-muted-foreground">{driver.id} · {driver.licenseCategory}</p>
              </div>
              <StatusBadge status={driver.status} />
            </div>

            <div className="space-y-3">
              {/* License */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">License Expiry</span>
                <span className={`text-xs font-medium flex items-center gap-1 ${isExpired(driver.licenseExpiry) ? "text-destructive" : isExpiringSoon(driver.licenseExpiry) ? "text-warning" : "text-foreground"}`}>
                  {isExpired(driver.licenseExpiry) && <AlertTriangle className="h-3 w-3" />}
                  {driver.licenseExpiry}
                </span>
              </div>

              {/* Safety Score */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Safety Score</span>
                  <span className={`font-medium ${driver.safetyScore >= 85 ? "text-success" : driver.safetyScore >= 70 ? "text-warning" : "text-destructive"}`}>{driver.safetyScore}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${driver.safetyScore >= 85 ? "bg-success" : driver.safetyScore >= 70 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${driver.safetyScore}%` }} />
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">{driver.completionRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${driver.completionRate}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-1 border-t border-border">
                <span className="text-muted-foreground">Total Trips</span>
                <span className="font-medium">{driver.totalTrips}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
