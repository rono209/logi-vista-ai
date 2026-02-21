import { cn } from "@/lib/utils";
import { type VehicleStatus, type TripStatus, type DriverStatus } from "@/data/mockData";

type StatusType = VehicleStatus | TripStatus | DriverStatus;

const statusStyles: Record<string, string> = {
  "Available": "bg-success/15 text-success border-success/30",
  "On Trip": "bg-info/15 text-info border-info/30",
  "In Shop": "bg-warning/15 text-warning border-warning/30",
  "Retired": "bg-muted text-muted-foreground border-border",
  "Draft": "bg-muted text-muted-foreground border-border",
  "Dispatched": "bg-info/15 text-info border-info/30",
  "Completed": "bg-success/15 text-success border-success/30",
  "Cancelled": "bg-destructive/15 text-destructive border-destructive/30",
  "On Duty": "bg-success/15 text-success border-success/30",
  "Off Duty": "bg-muted text-muted-foreground border-border",
  "Suspended": "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status, className }: { status: StatusType; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      statusStyles[status] || "bg-muted text-muted-foreground border-border",
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === "Available" || status === "On Duty" || status === "Completed" ? "bg-success" :
        status === "On Trip" || status === "Dispatched" ? "bg-info" :
        status === "In Shop" || status === "Draft" ? "bg-warning" :
        status === "Suspended" || status === "Cancelled" ? "bg-destructive" :
        "bg-muted-foreground"
      )} />
      {status}
    </span>
  );
}
