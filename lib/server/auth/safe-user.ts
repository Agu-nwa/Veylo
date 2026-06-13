export function toSafeUser(user: any) {
  if (!user) return null;

  const source =
    typeof user.toJSON === "function" ? user.toJSON() : { ...user };

  delete source.passwordHash;
  delete source.__v;

  return {
    id: String(source.id || source._id),
    fullName: source.fullName,
    email: source.email,
    phone: source.phone,
    role: source.role,
    accountStatus: source.accountStatus,
    verificationStatus: source.verificationStatus,
    lastLoginAt: source.lastLoginAt,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}
