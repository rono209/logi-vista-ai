import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, User } from "lucide-react";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [notifications] = useState(3);

  const pageTitle = (() => {
    const path = location.pathname;
    if (path === "/dashboard") return "Command Center";
    if (path === "/vehicles") return "Vehicle Registry";
    if (path === "/trips") return "Trip Dispatch & Management";
    if (path === "/maintenance") return "Maintenance & Service";
    if (path === "/fuel") return "Fuel & Expense";
    if (path === "/drivers") return "Driver Performance";
    if (path === "/analytics") return "Analytics & Reports";
    return "FleetFlow AI";
  })();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold">{pageTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="h-4.5 w-4.5 text-muted-foreground" />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Fleet Manager</p>
                <p className="text-xs text-muted-foreground">admin@fleetflow.ai</p>
              </div>
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
