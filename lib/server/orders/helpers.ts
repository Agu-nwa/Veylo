import { hashPassword, verifyPassword } from "@/lib/server/auth/password";

export function createOrderId() {
  return `VYL-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

export function createOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function hashOtp(otp: string) {
  return hashPassword(otp);
}

export async function verifyOtp(otp: string, otpHash: string) {
  return verifyPassword(otp, otpHash);
}
