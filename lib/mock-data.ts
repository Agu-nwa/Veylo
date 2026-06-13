import type { DeliveryOrder, RiderProfile, ServiceCard } from "@/lib/types";

export const serviceCards: ServiceCard[] = [
  {
    type: "PICKUP_DELIVERY",
    title: "Pickup & Delivery",
    description:
      "Move small parcels, documents, food packages, and personal items within active Owerri zones.",
    pricingNote:
      "Base fare, route distance, time, package handling, and applicable rules.",
  },
  {
    type: "ERRAND_RUN",
    title: "Errand Run",
    description:
      "Request a rider for simple pickup, drop-off, purchase, document, or light task movement.",
    pricingNote:
      "Errand fee, route time, waiting rules, and task clarity affect the estimate.",
  },
  {
    type: "BUSINESS_DELIVERY",
    title: "Business / Vendor Delivery",
    description:
      "Give vendors, boutiques, offices, and restaurants clearer delivery history and proof.",
    pricingNote:
      "Business plan discounts can apply to the automated fare when approved.",
  },
  {
    type: "EXPRESS_DELIVERY",
    title: "Express Delivery",
    description:
      "Priority handling for urgent deliveries where rider availability and route conditions allow.",
    pricingNote:
      "Express uses an urgency multiplier with surcharge protection.",
  },
];

export const sampleRider: RiderProfile = {
  id: "rider-ow-014",
  name: "Verified Rider 014",
  verificationStatus: "VERIFIED",
  rating: 4.8,
  completedJobs: 326,
  phonePolicy: "Contact is controlled through order support until pickup is confirmed.",
};

export const sampleOrder: DeliveryOrder = {
  id: "VYL-2401",
  status: "IN_TRANSIT",
  serviceType: "PICKUP_DELIVERY",
  pickup: "Ikenegbu, Owerri",
  dropoff: "World Bank, Owerri",
  customerName: "Demo Customer",
  fare: 2400,
  rider: sampleRider,
  timeline: [
    {
      status: "CREATED",
      label: "Order created",
      time: "10:20 AM",
      detail: "Customer entered delivery details and requested a quote.",
    },
    {
      status: "QUOTED",
      label: "Fare estimated",
      time: "10:21 AM",
      detail: "Automated fare estimate generated from route and package factors.",
    },
    {
      status: "RIDER_ASSIGNED",
      label: "Rider assigned",
      time: "10:26 AM",
      detail: "A verified rider was assigned after dispatch review.",
    },
    {
      status: "PICKED_UP",
      label: "Item picked up",
      time: "10:43 AM",
      detail: "Pickup OTP confirmed and proof saved.",
    },
    {
      status: "IN_TRANSIT",
      label: "Delivery in progress",
      time: "Now",
      detail: "Rider is moving toward the drop-off point.",
    },
  ],
};

export const adminStats = [
  { label: "Live jobs", value: "18", note: "5 require dispatch review" },
  { label: "Quotes today", value: "142", note: "64 accepted, 19 expired" },
  { label: "Verified riders", value: "31", note: "24 active this week" },
  { label: "Business accounts", value: "12", note: "4 under review" },
];
