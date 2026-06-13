# Veylo Backend Handoff

## Purpose

This document is for backend developers only.

It should not be exposed as a public website page.

## Backend Mission

Build the backend for Veylo, an Owerri-first logistics platform where users book verified dispatch riders for pickups, deliveries, errands, express delivery, scheduled delivery, and business/vendor delivery.

The backend must power real authentication, role permissions, automated pricing, order creation, rider assignment, OTP, proof upload, support tickets, business accounts, admin operations, and audit logs.

## Required Roles

- CUSTOMER
- RIDER
- BUSINESS
- ADMIN

## Core Backend Modules

1. Authentication and role-based access
2. Customer accounts
3. Rider onboarding and verification
4. Business account requests and plans
5. Automated pricing engine
6. Quote generation and quote expiry
7. Order creation
8. Order status state machine
9. Rider assignment
10. OTP pickup and delivery confirmation
11. Proof upload
12. Support tickets
13. Disputes and claims
14. Admin dispatch dashboard
15. Pricing rules dashboard
16. Quote logs
17. Fare audit logs
18. Business delivery reports
19. Notifications
20. Payment reconciliation later

## Pricing Engine Requirement

The backend must generate final production fares.

The frontend should never be trusted as the final pricing authority.

### Required Quote Inputs

- serviceType
- pickupAddress
- pickupLandmark
- dropoffAddress
- dropoffLandmark
- packageCategory
- urgency
- valueBand
- isBusinessAccount
- businessId if available

### Required Quote Response

- quoteId
- quoteStatus
- currency
- finalFare
- fareBreakdown
- protections
- summaryFactors
- validUntil
- ruleVersion
- waitingRule
- restrictedItemNotice

## Required Pricing Components

- Base fare
- Distance fee
- Estimated time adjustment
- Zone difficulty fee
- Package handling fee
- Booking fee
- Urgency multiplier
- Peak surcharge
- Rain surcharge
- Night surcharge
- Rider availability surcharge
- Waiting fee
- Business discount
- Fare floor
- Fare cap
- Surcharge cap
- Discount cap
- Quote expiry

## Required Order Statuses

- CREATED
- QUOTED
- ASSIGNING_RIDER
- RIDER_ASSIGNED
- RIDER_EN_ROUTE
- ARRIVED_PICKUP
- PICKED_UP
- IN_TRANSIT
- ARRIVED_DROPOFF
- DELIVERED
- FAILED_PICKUP
- FAILED_DELIVERY
- DISPUTED
- CLOSED
- CANCELLED

## Required Quote Statuses

- QUOTE_CREATED
- QUOTE_VIEWED
- QUOTE_ACCEPTED
- QUOTE_ABANDONED
- QUOTE_EXPIRED
- QUOTE_REFRESHED

## Required Proof Types

- PICKUP_OTP
- DELIVERY_OTP
- PHOTO_PROOF
- RECIPIENT_CONFIRMATION
- RIDER_NOTE
- ADMIN_OVERRIDE

## Required Support Categories

- TRACK_ORDER
- PRICING_QUESTION
- FAILED_PICKUP
- FAILED_DELIVERY
- DAMAGE_CLAIM
- LOST_ITEM
- PAYMENT
- CANCELLATION
- BUSINESS_SUPPORT
- RIDER_SUPPORT
- SAFETY_REPORT

## API Expectations

### Customer

POST /api/quotes  
Generate instant fare estimate.

POST /api/orders  
Create delivery order from accepted quote.

GET /api/orders  
List customer orders.

GET /api/orders/:id  
Read order detail, timeline, rider, proof, and support state.

POST /api/support/tickets  
Create support ticket.

### Rider

GET /api/rider/jobs  
List rider job offers and active jobs.

PATCH /api/rider/jobs/:id/status  
Update rider job status.

POST /api/proofs  
Upload OTP, photo proof, recipient confirmation, or rider note.

GET /api/rider/earnings  
Read rider earnings summary.

### Business

POST /api/business/request  
Create business account request.

GET /api/business/dashboard  
Read business metrics, plan, discount, and delivery summary.

GET /api/business/reports  
Read monthly report and invoice-ready history.

### Admin

GET /api/admin/dispatch  
Read dispatch queue and live jobs.

PATCH /api/admin/orders/:id/status  
Admin status override with reason.

PATCH /api/admin/orders/:id/assign-rider  
Assign rider to order.

GET /api/admin/pricing-rules  
Read pricing rules.

PATCH /api/admin/pricing-rules  
Update pricing rules with audit log.

GET /api/admin/quotes  
Read quote logs.

GET /api/admin/fare-audit  
Read fare audit events.

GET /api/admin/riders  
Read rider verification queue.

PATCH /api/admin/riders/:id/verification  
Approve, reject, suspend, or review rider.

GET /api/admin/disputes  
Read dispute queue.

PATCH /api/admin/disputes/:id  
Resolve dispute.

## Backend Security Requirements

- Validate all inputs.
- Use server-side pricing only.
- Hash passwords.
- Use secure sessions or HTTP-only cookies.
- Enforce role-based access control.
- Protect admin routes.
- Rate-limit sensitive routes.
- Store proof uploads securely.
- Keep audit logs for pricing, admin overrides, order status changes, and disputes.
- Never trust client-side fare values.
- Never expose internal pricing controls to customers.

## Database Models Needed

- User
- RiderProfile
- BusinessProfile
- BusinessRequest
- DeliveryOrder
- OrderTimelineEvent
- PricingQuote
- PricingRule
- ZoneRule
- Proof
- SupportTicket
- Dispute
- Payment
- Payout
- Notification
- AuditLog

## Frontend Integration Rule

The current frontend uses mock data and mock quote adapters.

During backend integration, replace mock functions with real API calls while preserving response shapes.

## Final Backend Goal

Turn Veylo from a frontend MVP shell into a real logistics operating system with automated pricing, verified rider dispatch, proof-backed delivery, support workflows, business accounts, and admin control.
