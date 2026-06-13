import { sampleOrder } from "@/lib/mock-data";
import type { DeliveryOrder } from "@/lib/types";

export const demoOrders: DeliveryOrder[] = [
  sampleOrder,
  {
    ...sampleOrder,
    id: "VYL-2402",
    status: "DELIVERED",
    pickup: "New Owerri, Owerri",
    dropoff: "Aladinma, Owerri",
    fare: 1850,
    timeline: [
      ...sampleOrder.timeline,
      {
        status: "ARRIVED_DROPOFF",
        label: "Rider arrived",
        time: "11:08 AM",
        detail: "Rider reached the drop-off point and requested delivery confirmation.",
      },
      {
        status: "DELIVERED",
        label: "Delivered",
        time: "11:15 AM",
        detail: "Recipient confirmed delivery and proof was saved.",
      },
    ],
  },
  {
    ...sampleOrder,
    id: "VYL-2403",
    status: "ASSIGNING_RIDER",
    pickup: "Douglas Road, Owerri",
    dropoff: "Imo State University area",
    fare: 2200,
    timeline: [
      {
        status: "CREATED",
        label: "Order created",
        time: "12:04 PM",
        detail: "Customer entered delivery details and requested a quote.",
      },
      {
        status: "QUOTED",
        label: "Fare estimated",
        time: "12:05 PM",
        detail: "Automated fare estimate generated and accepted.",
      },
      {
        status: "ASSIGNING_RIDER",
        label: "Assigning rider",
        time: "Now",
        detail: "Veylo is assigning a verified rider for this route.",
      },
    ],
  },
];

export function getOrderById(id: string): DeliveryOrder {
  return demoOrders.find((order) => order.id === id) ?? demoOrders[0];
}
