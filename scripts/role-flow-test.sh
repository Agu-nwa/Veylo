#!/usr/bin/env bash

BASE_URL="${BASE_URL:-http://localhost:3000}"

CUSTOMER_IDENTIFIER="${CUSTOMER_IDENTIFIER:-}"
CUSTOMER_PASSWORD="${CUSTOMER_PASSWORD:-Password123}"

BUSINESS_IDENTIFIER="${BUSINESS_IDENTIFIER:-business@veylo.local}"
BUSINESS_PASSWORD="${BUSINESS_PASSWORD:-Password123}"

RIDER_IDENTIFIER="${RIDER_IDENTIFIER:-rider@veylo.local}"
RIDER_PASSWORD="${RIDER_PASSWORD:-Password123}"

ADMIN_IDENTIFIER="${ADMIN_IDENTIFIER:-admin@veylo.local}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Password123}"

FAILED=0
SKIPPED=0

pass() {
  echo "✅ $1"
}

fail() {
  echo "❌ $1"
  FAILED=1
}

skip() {
  echo "⚠️  $1"
  SKIPPED=1
}

section() {
  echo ""
  echo "----------------------------------------"
  echo "$1"
  echo "----------------------------------------"
}

json_escape() {
  python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1"
}

login_and_test() {
  ROLE="$1"
  IDENTIFIER="$2"
  PASSWORD="$3"
  EXPECTED_ROLE="$4"
  EXPECTED_PATH="$5"

  if [ -z "$IDENTIFIER" ]; then
    skip "$ROLE skipped because identifier is empty"
    return
  fi

  COOKIE_FILE="$(mktemp "/tmp/veylo-${ROLE}-cookies.XXXXXX")"

  IDENTIFIER_JSON=$(json_escape "$IDENTIFIER")
  PASSWORD_JSON=$(json_escape "$PASSWORD")

  LOGIN_BODY="{\"identifier\":$IDENTIFIER_JSON,\"password\":$PASSWORD_JSON}"

  LOGIN_STATUS=$(curl -s -c "$COOKIE_FILE" -o "/tmp/veylo-${ROLE}-login.json" -w "%{http_code}" \
    -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "$LOGIN_BODY")

  if [ "$LOGIN_STATUS" != "200" ]; then
    fail "$ROLE login failed with HTTP $LOGIN_STATUS"
    cat "/tmp/veylo-${ROLE}-login.json"
    rm -f "$COOKIE_FILE" "/tmp/veylo-${ROLE}-login.json" "/tmp/veylo-${ROLE}-me.json"
    return
  fi

  pass "$ROLE login returned 200"

  ME_STATUS=$(curl -s -b "$COOKIE_FILE" -o "/tmp/veylo-${ROLE}-me.json" -w "%{http_code}" \
    "$BASE_URL/api/auth/me")

  if [ "$ME_STATUS" != "200" ]; then
    fail "$ROLE /api/auth/me failed with HTTP $ME_STATUS"
    cat "/tmp/veylo-${ROLE}-me.json"
    rm -f "$COOKIE_FILE" "/tmp/veylo-${ROLE}-login.json" "/tmp/veylo-${ROLE}-me.json"
    return
  fi

  ACTUAL_ROLE=$(python3 - <<PY
import json
from pathlib import Path

payload = json.loads(Path("/tmp/veylo-${ROLE}-me.json").read_text())
print(payload.get("data", {}).get("user", {}).get("role", ""))
PY
)

  if [ "$ACTUAL_ROLE" = "$EXPECTED_ROLE" ]; then
    pass "$ROLE /api/auth/me role is $ACTUAL_ROLE"
  else
    fail "$ROLE expected role $EXPECTED_ROLE but got $ACTUAL_ROLE"
  fi

  PAGE_STATUS=$(curl -s -b "$COOKIE_FILE" -o /dev/null -w "%{http_code}" \
    "$BASE_URL$EXPECTED_PATH")

  if [ "$PAGE_STATUS" = "200" ]; then
    pass "$ROLE can access $EXPECTED_PATH"
  else
    fail "$ROLE expected 200 for $EXPECTED_PATH but got $PAGE_STATUS"
  fi

  LOGOUT_STATUS=$(curl -s -b "$COOKIE_FILE" -o /dev/null -w "%{http_code}" \
    -X POST "$BASE_URL/api/auth/logout")

  if [ "$LOGOUT_STATUS" = "200" ]; then
    pass "$ROLE logout returned 200"
  else
    fail "$ROLE logout returned $LOGOUT_STATUS"
  fi

  rm -f "$COOKIE_FILE" "/tmp/veylo-${ROLE}-login.json" "/tmp/veylo-${ROLE}-me.json"
}

section "Veylo logged-in role flow test"

HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/health")

if [ "$HEALTH_STATUS" != "200" ]; then
  fail "Server is not reachable at $BASE_URL. Start npm run dev first."
  exit 1
fi

pass "Server is reachable"

section "Role login and access checks"

login_and_test "CUSTOMER" "$CUSTOMER_IDENTIFIER" "$CUSTOMER_PASSWORD" "CUSTOMER" "/profile"
login_and_test "BUSINESS" "$BUSINESS_IDENTIFIER" "$BUSINESS_PASSWORD" "BUSINESS" "/business/dashboard"
login_and_test "RIDER" "$RIDER_IDENTIFIER" "$RIDER_PASSWORD" "RIDER" "/rider"
login_and_test "ADMIN" "$ADMIN_IDENTIFIER" "$ADMIN_PASSWORD" "ADMIN" "/admin"

section "Final result"

if [ "$FAILED" = "0" ]; then
  if [ "$SKIPPED" = "1" ]; then
    echo "✅ Role flow test passed with skipped roles."
  else
    echo "✅ Role flow test passed."
  fi
  exit 0
else
  echo "❌ Role flow test failed."
  exit 1
fi
