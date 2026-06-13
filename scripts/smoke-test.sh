#!/usr/bin/env bash

BASE_URL="${BASE_URL:-http://localhost:3000}"

PUBLIC_ROUTES=(
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
  "/login"
  "/register"
  "/robots.txt"
  "/sitemap.xml"
  "/manifest.webmanifest"
  "/api/health"
  "/api/health/models"
)

PROTECTED_ROUTES=(
  "/orders"
  "/orders/VYL-2401"
  "/dashboard"
  "/profile"
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
)

echo "Testing Veylo routes against $BASE_URL"
echo "----------------------------------------"

FAILED=0

echo "Public routes must return 200"
for route in "${PUBLIC_ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

  if [ "$STATUS" = "200" ]; then
    echo "✅ $STATUS $route"
  else
    echo "❌ $STATUS $route"
    FAILED=1
  fi
done

echo "----------------------------------------"
echo "Protected routes may return 200 or redirect codes"

for route in "${PROTECTED_ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

  if [ "$STATUS" = "200" ] || [ "$STATUS" = "302" ] || [ "$STATUS" = "303" ] || [ "$STATUS" = "307" ] || [ "$STATUS" = "308" ]; then
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
