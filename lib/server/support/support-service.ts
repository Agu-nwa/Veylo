import { createAuditLog } from "@/lib/server/audit/audit";
import type { SessionUser } from "@/lib/server/auth/types";
import { AppError } from "@/lib/server/errors";
import { DeliveryOrderModel } from "@/lib/server/models/DeliveryOrder";
import { SupportTicketModel } from "@/lib/server/models/SupportTicket";
import type {
  SupportTicketCreateInput,
  SupportTicketUpdateInput,
} from "@/lib/server/support/schemas";

export function createTicketId() {
  return `TCK-${Date.now().toString().slice(-7)}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

function priorityForCategory(category: string) {
  if (category === "SAFETY_REPORT") return "URGENT";
  if (["LOST_ITEM", "DAMAGE_CLAIM", "FAILED_DELIVERY"].includes(category)) {
    return "HIGH";
  }
  if (["FAILED_PICKUP", "PAYMENT", "CANCELLATION"].includes(category)) {
    return "MEDIUM";
  }
  return "LOW";
}

export async function createSupportTicket(
  input: SupportTicketCreateInput,
  user?: SessionUser | null
) {
  let order = null;

  if (input.orderId) {
    order = await DeliveryOrderModel.findOne({ orderId: input.orderId });

    if (order && user && user.role !== "ADMIN") {
      const ownsOrder = String(order.customerId) === user.userId;
      const assignedRider = String(order.riderId || "") === user.userId;
      const businessOrder = user.role === "BUSINESS" && Boolean(order.businessId);

      if (!ownsOrder && !assignedRider && !businessOrder) {
        throw new AppError("Permission denied", 403, "FORBIDDEN");
      }
    }
  }

  const ticket = await SupportTicketModel.create({
    ticketId: createTicketId(),
    orderId: input.orderId,
    customerId: user?.role === "CUSTOMER" ? user.userId : undefined,
    category: input.category,
    subject: input.subject,
    message: input.message,
    evidenceUrls: input.evidenceUrls,
    contactPhone: input.contactPhone,
    contactEmail: input.contactEmail,
    status: "OPEN",
    priority: priorityForCategory(input.category),
  });

  if (order) {
    order.supportStatus = "OPEN";
    await order.save();
  }

  await createAuditLog({
    actorId: user?.userId,
    actorRole: user?.role ?? "SYSTEM",
    action: "SUPPORT_TICKET_CREATED",
    entityType: "SupportTicket",
    entityId: ticket.ticketId,
    after: {
      ticketId: ticket.ticketId,
      category: ticket.category,
      priority: ticket.priority,
      orderId: ticket.orderId,
    },
  });

  return ticket;
}

export async function listSupportTickets(user: SessionUser) {
  if (user.role === "ADMIN") {
    return SupportTicketModel.find().sort({ createdAt: -1 }).limit(100);
  }

  if (user.role === "CUSTOMER") {
    return SupportTicketModel.find({ customerId: user.userId })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  if (user.role === "RIDER") {
    return SupportTicketModel.find({ category: "RIDER_SUPPORT" })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  if (user.role === "BUSINESS") {
    return SupportTicketModel.find({ category: "BUSINESS_SUPPORT" })
      .sort({ createdAt: -1 })
      .limit(100);
  }

  return [];
}

export async function getSupportTicket(ticketId: string, user: SessionUser) {
  const ticket = await SupportTicketModel.findOne({ ticketId });

  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "SUPPORT_TICKET_NOT_FOUND");
  }

  if (user.role === "ADMIN") {
    return ticket;
  }

  if (ticket.customerId && String(ticket.customerId) === user.userId) {
    return ticket;
  }

  if (
    user.role === "RIDER" &&
    ticket.category === "RIDER_SUPPORT"
  ) {
    return ticket;
  }

  if (
    user.role === "BUSINESS" &&
    ticket.category === "BUSINESS_SUPPORT"
  ) {
    return ticket;
  }

  throw new AppError("Permission denied", 403, "FORBIDDEN");
}

export async function updateSupportTicket(
  ticketId: string,
  input: SupportTicketUpdateInput,
  user: SessionUser
) {
  if (user.role !== "ADMIN") {
    throw new AppError("Admin access required", 403, "ADMIN_ACCESS_REQUIRED");
  }

  const ticket = await SupportTicketModel.findOne({ ticketId });

  if (!ticket) {
    throw new AppError("Support ticket not found", 404, "SUPPORT_TICKET_NOT_FOUND");
  }

  const before = {
    status: ticket.status,
    priority: ticket.priority,
    assignedAdminId: ticket.assignedAdminId,
    resolutionNote: ticket.resolutionNote,
  };

  Object.assign(ticket, input);
  await ticket.save();

  if (ticket.orderId && ["RESOLVED", "CLOSED"].includes(ticket.status)) {
    await DeliveryOrderModel.updateOne(
      { orderId: ticket.orderId },
      { supportStatus: "RESOLVED" }
    );
  }

  await createAuditLog({
    actorId: user.userId,
    actorRole: user.role,
    action: "ADMIN_OVERRIDE",
    entityType: "SupportTicket",
    entityId: ticket.ticketId,
    before,
    after: input,
  });

  return ticket;
}
