export const PERMISSIONS = {
    // Admin Management Permissions
    ADMIN_CREATE: "admin:create",
    ADMIN_READ: "admin:read",
    ADMIN_LIST: "admin:list",
    ADMIN_EDIT: "admin:edit",
    ADMIN_STATUS: "admin:status",
    ADMIN_DELETE: "admin:delete",

    // Role Management Permissions
    ROLE_CREATE: "role:create",
    ROLE_READ: "role:read",
    ROLE_LIST: "role:list",
    ROLE_EDIT: "role:edit",
    ROLE_DELETE: "role:delete",

    // Customer Management Permissions
    CUSTOMER_CREATE: "customer:create",
    CUSTOMER_READ: "customer:read",
    CUSTOMER_LIST: "customer:list",
    CUSTOMER_EDIT: "customer:edit",
    CUSTOMER_STATUS: "customer:status",
    CUSTOMER_DELETE: "customer:delete",

    // Super Admin Full Access Root Permission
    ALL: "*",
} as const;

export const ALL_PERMISSIONS_LIST = [
    PERMISSIONS.ADMIN_CREATE,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.ADMIN_LIST,
    PERMISSIONS.ADMIN_EDIT,
    PERMISSIONS.ADMIN_STATUS,
    PERMISSIONS.ADMIN_DELETE,

    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_LIST,
    PERMISSIONS.ROLE_EDIT,
    PERMISSIONS.ROLE_DELETE,

    PERMISSIONS.CUSTOMER_CREATE,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_LIST,
    PERMISSIONS.CUSTOMER_EDIT,
    PERMISSIONS.CUSTOMER_STATUS,
    PERMISSIONS.CUSTOMER_DELETE,
] as const;

export type PermissionType = typeof ALL_PERMISSIONS_LIST[number] | typeof PERMISSIONS.ALL;
