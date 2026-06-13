export type RiderJobStatus =
  | "OFFERED"
  | "ACCEPTED"
  | "RIDER_EN_ROUTE"
  | "ARRIVED_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED_PICKUP"
  | "FAILED_DELIVERY";

export interface RiderJob {
  id: string;
  service: string;
  pickup: string;
  dropoff: string;
  packageCategory: string;
  urgency: string;
  estimatedPayout: number;
  distance: string;
  status: RiderJobStatus;
  expiresIn: string;
  note: string;
}

export const riderJobs: RiderJob[] = [
  {
    id: "JOB-2401",
    service: "Pickup & Delivery",
    pickup: "Ikenegbu, Owerri",
    dropoff: "World Bank, Owerri",
    packageCategory: "Small parcel",
    urgency: "Standard",
    estimatedPayout: 1650,
    distance: "7.2 km",
    status: "OFFERED",
    expiresIn: "04:20",
    note: "Call support if the pickup landmark is unclear.",
  },
  {
    id: "JOB-2402",
    service: "Business Delivery",
    pickup: "New Owerri, Owerri",
    dropoff: "Aladinma, Owerri",
    packageCategory: "Food package",
    urgency: "Express",
    estimatedPayout: 2150,
    distance: "5.8 km",
    status: "ACCEPTED",
    expiresIn: "Accepted",
    note: "Business delivery. Recipient confirmation required.",
  },
  {
    id: "JOB-2403",
    service: "Errand Run",
    pickup: "Douglas Road, Owerri",
    dropoff: "IMSU area, Owerri",
    packageCategory: "Document",
    urgency: "Standard",
    estimatedPayout: 1900,
    distance: "8.5 km",
    status: "IN_TRANSIT",
    expiresIn: "Active",
    note: "Document handling. Delivery OTP required.",
  },
];

export function getRiderJobById(id: string): RiderJob {
  return riderJobs.find((job) => job.id === id) ?? riderJobs[0];
}
