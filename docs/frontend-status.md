# Veylo Frontend Status

## Current Build Status

Veylo frontend MVP shell is built and production build is passing.

## Brand

Brand name: Veylo  
Product category: Owerri-first logistics platform  
Positioning: verified rider booking for deliveries, errands, and business logistics across Owerri.

## Public Routes

- /
- /how-it-works
- /services
- /business-delivery
- /pricing
- /safety
- /riders
- /support
- /support/new
- /faqs
- /contact
- /express
- /markets

## Customer Routes

- /book
- /book/confirmed
- /orders
- /orders/[id]
- /dashboard
- /profile
- /login
- /register

## Business Routes

- /business/dashboard
- /business/new-delivery
- /business/history
- /business/reports
- /business/plan
- /business/support
- /business/request

## Rider Routes

- /rider
- /rider/jobs
- /rider/jobs/[id]
- /rider/earnings
- /rider/profile
- /rider/support
- /riders/apply

## Internal Admin Routes

These are frontend-only internal operations screens. They are not linked from the public navigation and are marked noindex.

- /admin
- /admin/dispatch
- /admin/orders
- /admin/riders
- /admin/businesses
- /admin/pricing
- /admin/quotes
- /admin/disputes
- /admin/analytics

## Completed Frontend Capabilities

- Premium Veylo homepage
- Public content pages
- Multi-step booking flow
- Mock automated fare estimate
- Quote ready, accepted, expired, and refreshed states
- Mock order creation state
- Order list and dynamic order detail route
- Rider profile, OTP, proof, and support panels
- Customer dashboard
- Business dashboard and sub-pages
- Rider console and sub-pages
- Admin operations dashboard and sub-pages
- Support ticket form
- Login, register, profile, business request, rider application
- Mobile bottom navigation
- PWA manifest
- Developer docs in /docs

## Important Product Notes

The frontend is currently mock-data driven.

No real authentication exists yet.

No real backend pricing exists yet.

No real order database exists yet.

No real rider assignment exists yet.

No real proof upload exists yet.

No real payment system exists yet.

No real notifications exist yet.

## Frontend Principle

The frontend must never calculate final production fares after backend integration.

Production pricing must come from the backend pricing engine.

The frontend should request a quote, render the returned quote, and create an order only after quote acceptance.

## Developer Handoff Rule

Developer handoff and backend notes must stay in /docs only, not public app routes.

## Backend Readiness

Ready for backend planning and integration.
