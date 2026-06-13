export const PERMISSIONS = {
  // User permissions
  USER_READ: 'user.read',
  USER_WRITE: 'user.write',
  USER_DELETE: 'user.delete',

  // Admin permissions
  ADMIN_READ_USERS: 'admin.users.read',
  ADMIN_WRITE_USERS: 'admin.users.write',
  ADMIN_DELETE_USERS: 'admin.users.delete',
  ADMIN_MANAGE_ROLES: 'admin.roles.manage',
  ADMIN_MANAGE_PERMISSIONS: 'admin.permissions.manage',

  // Team permissions
  TEAM_CREATE: 'team.create',
  TEAM_READ: 'team.read',
  TEAM_WRITE: 'team.write',
  TEAM_DELETE: 'team.delete',

  // Workspace permissions
  WORKSPACE_CREATE: 'workspace.create',
  WORKSPACE_READ: 'workspace.read',
  WORKSPACE_WRITE: 'workspace.write',
  WORKSPACE_DELETE: 'workspace.delete',
};

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: Object.values(PERMISSIONS), // All permissions
  ADMIN: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.ADMIN_READ_USERS,
    PERMISSIONS.ADMIN_WRITE_USERS,
    PERMISSIONS.ADMIN_MANAGE_ROLES,
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.WORKSPACE_READ,
  ],
  TEAM_OWNER: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_WRITE,
    PERMISSIONS.TEAM_CREATE,
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.TEAM_WRITE,
    PERMISSIONS.WORKSPACE_CREATE,
    PERMISSIONS.WORKSPACE_READ,
    PERMISSIONS.WORKSPACE_WRITE,
  ],
  MEMBER: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_WRITE,
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.WORKSPACE_READ,
    PERMISSIONS.WORKSPACE_WRITE,
  ],
  VIEWER: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.TEAM_READ,
    PERMISSIONS.WORKSPACE_READ,
  ],
};
