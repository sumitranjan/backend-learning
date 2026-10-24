const ROLE_PERMISSIONS = {
  admin: [
    "user:read",
    "user:create",
    "user:update",
    "user:delete",
    "report:read",
    "report:create",
  ],

  manager: ["user:read", "user:update", "report:read"],

  user: ["profile:read", "profile:update"],
};

const hasPermission = (role, requiredPermission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];

  return permissions.includes(requiredPermission);
};

module.exports = {
  ROLE_PERMISSIONS,
  hasPermission,
};
