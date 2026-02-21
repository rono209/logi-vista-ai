import {
  LayoutDashboard,
  Truck,
  Route,
  Wrench,
  Fuel,
  Users,
  BarChart3,
  Leaf,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Vehicle Registry", url: "/vehicles", icon: Truck },
  { title: "Trip Dispatch", url: "/trips", icon: Route },
  { title: "Maintenance", url: "/maintenance", icon: Wrench },
  { title: "Fuel & Expense", url: "/fuel", icon: Fuel },
  { title: "Driver Performance", url: "/drivers", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen sticky top-0 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Truck className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-foreground tracking-tight">FleetFlow AI</h1>
            <p className="text-[10px] text-muted-foreground">Intelligent Logistics</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/dashboard"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
              collapsed && "justify-center px-0"
            )}
            activeClassName="bg-sidebar-accent text-primary font-medium"
          >
            <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Carbon tracker mini */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-medium text-success">Green Score</span>
          </div>
          <p className="text-lg font-bold text-foreground">78<span className="text-xs text-muted-foreground">/100</span></p>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
