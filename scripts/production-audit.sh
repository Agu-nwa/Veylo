#!/usr/bin/env bash

BASE_URL="${BASE_URL:-http://localhost:3000}"

FAILED=0

pass() {
  echo "✅ $1"
}

fail() {
  echo "❌ $1"
  FAILED=1
}

section() {
  echo ""
  echo "----------------------------------------"
  echo "$1"
  echo "----------------------------------------"
}

section "Veylo production readiness audit"

if [ ! -f "package.json" ]; then
  fail "package.json not found. Run this from the Veylo project root."
  exit 1
fi

pass "Project root confirmed"

section "Git secret safety"

TRACKED_SECRET_FILES=$(git ls-files | grep -E '(^|/)(\.env\.local|\.env\.production|\.env\.development\.local|\.env\.test\.local|cookies.*\.txt|.*cookies.*\.txt)$' || true)

if [ -z "$TRACKED_SECRET_FILES" ]; then
  pass "No tracked local env or cookie files"
else
  fail "Tracked secret/session files found:"
  echo "$TRACKED_SECRET_FILES"
fi

TRACKED_ENV_FILES=$(git ls-files | grep -E '\.env' || true)

if [ "$TRACKED_ENV_FILES" = ".env.example" ]; then
  pass "Only .env.example is tracked"
else
  fail "Unexpected tracked env files:"
  echo "$TRACKED_ENV_FILES"
fi

section "Upload folder safety"

UPLOAD_FILES=$(find public/uploads -type f 2>/dev/null || true)

EXPECTED_UPLOADS=$(cat <<'EXPECTED'
public/uploads/proofs/.gitkeep
public/uploads/rider-documents/.gitkeep
EXPECTED
)

if [ "$UPLOAD_FILES" = "$EXPECTED_UPLOADS" ]; then
  pass "Only upload .gitkeep files exist"
else
  echo "$UPLOAD_FILES"
  fail "Unexpected local upload files found. Delete real uploaded files before commit."
fi

section "Server availability"

HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health")

if [ "$HEALTH_STATUS" = "200" ]; then
  pass "Server health endpoint is reachable"
else
  fail "Server health endpoint failed with $HEALTH_STATUS. Start npm run dev first."
fi

section "Public route smoke test"

if npm run smoke; then
  pass "Smoke test passed"
else
  fail "Smoke test failed"
fi

section "Protected page redirect checks"

PROTECTED_PAGES=(
  "/admin"
  "/admin/orders"
  "/business/dashboard"
  "/rider"
  "/profile"
  "/orders"
)

for route in "${PROTECTED_PAGES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

  if [ "$STATUS" = "302" ] || [ "$STATUS" = "303" ] || [ "$STATUS" = "307" ] || [ "$STATUS" = "308" ]; then
    pass "$route redirects when logged out ($STATUS)"
  else
    fail "$route should redirect when logged out, got $STATUS"
  fi
done

section "Protected API unauthenticated checks"

PROTECTED_APIS=(
  "/api/admin/analytics"
  "/api/admin/riders"
  "/api/business/dashboard"
  "/api/rider/profile"
  "/api/orders"
)

for route in "${PROTECTED_APIS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")

  if [ "$STATUS" = "401" ] || [ "$STATUS" = "403" ]; then
    pass "$route rejects unauthenticated access ($STATUS)"
  else
    fail "$route should reject unauthenticated access, got $STATUS"
  fi
done

section "Final result"

if [ "$FAILED" = "0" ]; then
  echo "✅ Veylo production readiness audit passed."
  exit 0
else
  echo "❌ Veylo production readiness audit failed."
  exit 1
fi
