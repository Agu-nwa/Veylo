#!/bin/bash

BASE_URL="http://localhost:3000"

ROUTES=(
  "/"
  "/how-it-works"
  "/services"
  "/business-delivery"
  "/pricing"
  "/safety"
  "/riders"
  "/riders/apply"
  "/riders/status"
  "/support"
  "/support/new"
  "/faqs"
  "/contact"
  "/express"
  "/markets"
  "/book"
  "/book/confirmed"
  "/orders"
  "/orders/VYL-2401"
  "/dashboard"
  "/profile"
  "/login"
  "/register"
  "/business/dashboard"
  "/business/new-delivery"
  "/business/history"
  "/business/reports"
  "/business/plan"
  "/business/support"
  "/business/request"
  "/rider"
  "/rider/jobs"
  "/rider/jobs/JOB-2401"
  "/rider/earnings"
  "/rider/profile"
  "/rider/support"
  "/admin"
  "/admin/dispatch"
  "/admin/orders"
  "/admin/riders"
  "/admin/businesses"
  "/admin/pricing"
  "/admin/quotes"
  "/admin/disputes"
  "/admin/analytics"
  "/admin/audit-logs"
  "/robots.txt"
  "/sitemap.xml"
  "/manifest.webmanifest"
  "/api/health"
  "/api/health/models"
)

echo "Testing Veylo routes against $BASE_URL"
echo "----------------------------------------"

FAILED=0

for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

  if [ "$STATUS" = "200" ]; then
    echo "✅ $STATUS $route"
  else
    echo "❌ $STATUS $route"
    FAILED=1
  fi
done

echo "----------------------------------------"

if [ "$FAILED" = "0" ]; then
  echo "All Veylo routes passed."
  exit 0
else
  echo "Some Veylo routes failed."
  exit 1
fi
