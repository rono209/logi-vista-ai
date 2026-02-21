export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";
export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";
export type DriverStatus = "On Duty" | "Off Duty" | "Suspended";
export type UserRole = "Fleet Manager" | "Dispatcher" | "Safety Officer" | "Financial Analyst";

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  type: string;
  maxLoad: number;
  odometer: number;
  fuelEfficiency: number;
  acquisitionCost: number;
  emissionFactor: number;
  lastServiceOdometer: number;
  status: VehicleStatus;
}

export interface Driver {
  id: string;
  name: string;
  licenseCategory: string;
  licenseExpiry: string;
  completionRate: number;
  safetyScore: number;
  status: DriverStatus;
  totalTrips: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  distance: number;
  cargoWeight: number;
  vehicleType: string;
  estimatedFuelCost: number;
  status: TripStatus;
  createdAt: string;
  carbonEmission?: number;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  serviceType: string;
  cost: number;
  date: string;
  notes?: string;
}

export interface FuelLog {
  id: string;
  tripId: string;
  vehicleId: string;
  driverId: string;
  fuelUsed: number;
  fuelCost: number;
  maintenanceCost: number;
}

export const vehicles: Vehicle[] = [
  { id: "VH-001", model: "Volvo FH16", plate: "ABC-1234", type: "Heavy Truck", maxLoad: 25000, odometer: 145200, fuelEfficiency: 3.2, acquisitionCost: 85000, emissionFactor: 2.68, lastServiceOdometer: 141000, status: "Available" },
  { id: "VH-002", model: "Scania R500", plate: "DEF-5678", type: "Heavy Truck", maxLoad: 22000, odometer: 98500, fuelEfficiency: 3.5, acquisitionCost: 78000, emissionFactor: 2.65, lastServiceOdometer: 95000, status: "On Trip" },
  { id: "VH-003", model: "Mercedes Actros", plate: "GHI-9012", type: "Medium Truck", maxLoad: 15000, odometer: 67300, fuelEfficiency: 4.1, acquisitionCost: 62000, emissionFactor: 2.52, lastServiceOdometer: 61000, status: "Available" },
  { id: "VH-004", model: "DAF XF", plate: "JKL-3456", type: "Heavy Truck", maxLoad: 24000, odometer: 210800, fuelEfficiency: 2.9, acquisitionCost: 72000, emissionFactor: 2.71, lastServiceOdometer: 203000, status: "In Shop" },
  { id: "VH-005", model: "Isuzu NPR", plate: "MNO-7890", type: "Light Truck", maxLoad: 5000, odometer: 34200, fuelEfficiency: 7.5, acquisitionCost: 35000, emissionFactor: 2.31, lastServiceOdometer: 30000, status: "Available" },
  { id: "VH-006", model: "Ford Transit", plate: "PQR-1122", type: "Van", maxLoad: 2000, odometer: 52100, fuelEfficiency: 9.2, acquisitionCost: 28000, emissionFactor: 2.12, lastServiceOdometer: 50000, status: "On Trip" },
  { id: "VH-007", model: "MAN TGX", plate: "STU-3344", type: "Heavy Truck", maxLoad: 26000, odometer: 178900, fuelEfficiency: 3.0, acquisitionCost: 90000, emissionFactor: 2.70, lastServiceOdometer: 170000, status: "Available" },
  { id: "VH-008", model: "Hino 500", plate: "VWX-5566", type: "Medium Truck", maxLoad: 12000, odometer: 89400, fuelEfficiency: 4.8, acquisitionCost: 48000, emissionFactor: 2.45, lastServiceOdometer: 88000, status: "Retired" },
];

export const drivers: Driver[] = [
  { id: "DR-001", name: "John Martinez", licenseCategory: "CDL-A", licenseExpiry: "2026-08-15", completionRate: 94, safetyScore: 88, status: "On Duty", totalTrips: 234 },
  { id: "DR-002", name: "Sarah Chen", licenseCategory: "CDL-A", licenseExpiry: "2025-03-20", completionRate: 97, safetyScore: 95, status: "On Duty", totalTrips: 312 },
  { id: "DR-003", name: "Mike Johnson", licenseCategory: "CDL-B", licenseExpiry: "2026-11-30", completionRate: 89, safetyScore: 72, status: "Off Duty", totalTrips: 178 },
  { id: "DR-004", name: "Lisa Okafor", licenseCategory: "CDL-A", licenseExpiry: "2024-12-01", completionRate: 91, safetyScore: 82, status: "Suspended", totalTrips: 203 },
  { id: "DR-005", name: "Carlos Rivera", licenseCategory: "CDL-B", licenseExpiry: "2027-05-10", completionRate: 96, safetyScore: 91, status: "On Duty", totalTrips: 287 },
  { id: "DR-006", name: "Amy Nguyen", licenseCategory: "CDL-A", licenseExpiry: "2026-09-22", completionRate: 93, safetyScore: 86, status: "Off Duty", totalTrips: 156 },
];

export const trips: Trip[] = [
  { id: "TR-001", vehicleId: "VH-002", driverId: "DR-001", origin: "Chicago, IL", destination: "Detroit, MI", distance: 450, cargoWeight: 18000, vehicleType: "Heavy Truck", estimatedFuelCost: 320, status: "Dispatched", createdAt: "2026-02-20", carbonEmission: 376.5 },
  { id: "TR-002", vehicleId: "VH-006", driverId: "DR-002", origin: "Dallas, TX", destination: "Houston, TX", distance: 385, cargoWeight: 1500, vehicleType: "Van", estimatedFuelCost: 95, status: "Dispatched", createdAt: "2026-02-20", carbonEmission: 88.7 },
  { id: "TR-003", vehicleId: "VH-001", driverId: "DR-005", origin: "Atlanta, GA", destination: "Nashville, TN", distance: 400, cargoWeight: 20000, vehicleType: "Heavy Truck", estimatedFuelCost: 280, status: "Completed", createdAt: "2026-02-18", carbonEmission: 335.0 },
  { id: "TR-004", vehicleId: "VH-003", driverId: "DR-003", origin: "Phoenix, AZ", destination: "Las Vegas, NV", distance: 480, cargoWeight: 12000, vehicleType: "Medium Truck", estimatedFuelCost: 260, status: "Completed", createdAt: "2026-02-17", carbonEmission: 295.1 },
  { id: "TR-005", vehicleId: "VH-005", driverId: "DR-006", origin: "Seattle, WA", destination: "Portland, OR", distance: 280, cargoWeight: 3500, vehicleType: "Light Truck", estimatedFuelCost: 85, status: "Draft", createdAt: "2026-02-21", carbonEmission: 86.2 },
  { id: "TR-006", vehicleId: "VH-007", driverId: "DR-001", origin: "Miami, FL", destination: "Orlando, FL", distance: 380, cargoWeight: 22000, vehicleType: "Heavy Truck", estimatedFuelCost: 290, status: "Completed", createdAt: "2026-02-15", carbonEmission: 342.0 },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: "MT-001", vehicleId: "VH-004", serviceType: "Engine Overhaul", cost: 4500, date: "2026-02-19", notes: "Major engine repair" },
  { id: "MT-002", vehicleId: "VH-001", serviceType: "Oil Change", cost: 250, date: "2026-02-10" },
  { id: "MT-003", vehicleId: "VH-002", serviceType: "Brake Replacement", cost: 1200, date: "2026-01-28" },
  { id: "MT-004", vehicleId: "VH-003", serviceType: "Tire Rotation", cost: 400, date: "2026-02-05" },
  { id: "MT-005", vehicleId: "VH-007", serviceType: "Transmission Service", cost: 2800, date: "2026-01-15" },
  { id: "MT-006", vehicleId: "VH-005", serviceType: "Oil Change", cost: 180, date: "2026-02-12" },
];

export const fuelLogs: FuelLog[] = [
  { id: "FL-001", tripId: "TR-003", vehicleId: "VH-001", driverId: "DR-005", fuelUsed: 125, fuelCost: 275, maintenanceCost: 0 },
  { id: "FL-002", tripId: "TR-004", vehicleId: "VH-003", driverId: "DR-003", fuelUsed: 117, fuelCost: 257, maintenanceCost: 0 },
  { id: "FL-003", tripId: "TR-006", vehicleId: "VH-007", driverId: "DR-001", fuelUsed: 127, fuelCost: 279, maintenanceCost: 50 },
  { id: "FL-004", tripId: "TR-001", vehicleId: "VH-002", driverId: "DR-001", fuelUsed: 129, fuelCost: 310, maintenanceCost: 0 },
  { id: "FL-005", tripId: "TR-002", vehicleId: "VH-006", driverId: "DR-002", fuelUsed: 42, fuelCost: 92, maintenanceCost: 0 },
];

// Utility functions
export function getVehicleById(id: string) {
  return vehicles.find(v => v.id === id);
}

export function getDriverById(id: string) {
  return drivers.find(d => d.id === id);
}

export function getKmSinceService(vehicle: Vehicle): number {
  return vehicle.odometer - vehicle.lastServiceOdometer;
}

export function isServiceDueSoon(vehicle: Vehicle): boolean {
  return getKmSinceService(vehicle) > 5000;
}

export function getMaintenanceRiskScore(vehicle: Vehicle): number {
  const kmSince = getKmSinceService(vehicle);
  const highMileage = Math.min(kmSince / 10000, 1);
  const tripCount = trips.filter(t => t.vehicleId === vehicle.id).length;
  const frequentTrips = Math.min(tripCount / 10, 1);
  const fuelInefficiency = 1 - Math.min(vehicle.fuelEfficiency / 10, 1);
  return Number(((0.4 * highMileage) + (0.3 * frequentTrips) + (0.3 * fuelInefficiency)).toFixed(2));
}

export function calculateVehicleScore(vehicle: Vehicle, cargoWeight: number): { score: number; breakdown: { capacity: number; fuel: number; maintenance: number; roi: number } } {
  const capacityMatch = cargoWeight <= vehicle.maxLoad ? 1 - (vehicle.maxLoad - cargoWeight) / vehicle.maxLoad * 0.5 : 0;
  const fuelScore = Math.min(vehicle.fuelEfficiency / 10, 1);
  const maintenanceRisk = 1 - getMaintenanceRiskScore(vehicle);
  const roi = vehicle.fuelEfficiency / (vehicle.acquisitionCost / 100000);
  const roiScore = Math.min(roi, 1);
  const score = (0.4 * capacityMatch) + (0.3 * fuelScore) + (0.2 * maintenanceRisk) + (0.1 * roiScore);
  return { score: Number(score.toFixed(2)), breakdown: { capacity: Number(capacityMatch.toFixed(2)), fuel: Number(fuelScore.toFixed(2)), maintenance: Number(maintenanceRisk.toFixed(2)), roi: Number(roiScore.toFixed(2)) } };
}

export function calculateCarbonEmission(fuelUsed: number, emissionFactor: number): number {
  return Number((fuelUsed * emissionFactor).toFixed(1));
}

export function calculateROI(vehicle: Vehicle): number {
  const tripRevenue = trips.filter(t => t.vehicleId === vehicle.id && t.status === "Completed").length * 1500;
  const fuelCosts = fuelLogs.filter(f => f.vehicleId === vehicle.id).reduce((s, f) => s + f.fuelCost, 0);
  const maintCosts = maintenanceLogs.filter(m => m.vehicleId === vehicle.id).reduce((s, m) => s + m.cost, 0);
  return Number(((tripRevenue - fuelCosts - maintCosts) / vehicle.acquisitionCost).toFixed(2));
}

// Chart data
export const fuelTrendData = [
  { month: "Sep", efficiency: 4.2, cost: 12400 },
  { month: "Oct", efficiency: 4.0, cost: 13100 },
  { month: "Nov", efficiency: 4.3, cost: 11800 },
  { month: "Dec", efficiency: 3.9, cost: 14200 },
  { month: "Jan", efficiency: 4.1, cost: 13500 },
  { month: "Feb", efficiency: 4.4, cost: 11200 },
];

export const emissionTrendData = [
  { month: "Sep", co2: 4200 },
  { month: "Oct", co2: 4500 },
  { month: "Nov", co2: 3900 },
  { month: "Dec", co2: 4800 },
  { month: "Jan", co2: 4100 },
  { month: "Feb", co2: 3600 },
];
