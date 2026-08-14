export interface SystemPermissionDefinition {
    name: string;
    code: string;
    module: string;
    description: string;
}

// Master System Permissions List - Single Source of Truth
export const SYSTEM_PERMISSIONS: SystemPermissionDefinition[] = [
    // Admin Management Permissions
    { name: "Create Admins", code: "admin:create", module: "ADMIN", description: "Create new administrator accounts" },
    { name: "View Admins", code: "admin:read", module: "ADMIN", description: "View details of administrators" },
    { name: "List Admins", code: "admin:list", module: "ADMIN", description: "List all administrator accounts" },
    { name: "Edit Admins", code: "admin:edit", module: "ADMIN", description: "Modify existing administrator details" },
    { name: "Delete Admins", code: "admin:delete", module: "ADMIN", description: "Soft-delete administrator accounts" },

    // Customer Management Permissions
    { name: "Create Customers", code: "customer:create", module: "CUSTOMER", description: "Register new customer accounts" },
    { name: "View Customers", code: "customer:read", module: "CUSTOMER", description: "View details of customer profiles" },
    { name: "List Customers", code: "customer:list", module: "CUSTOMER", description: "List all customer accounts" },
    { name: "Edit Customers", code: "customer:edit", module: "CUSTOMER", description: "Update customer details and status" },
    { name: "Delete Customers", code: "customer:delete", module: "CUSTOMER", description: "Soft-delete customer records" },

    // Role Management Permissions
    { name: "Create Roles", code: "role:create", module: "ROLE", description: "Create new custom roles" },
    { name: "List Roles", code: "role:list", module: "ROLE", description: "List all roles and permission matrix" },
    { name: "Edit Roles", code: "role:edit", module: "ROLE", description: "Modify role details and permission matrix" },
    { name: "Delete Roles", code: "role:delete", module: "ROLE", description: "Delete custom roles" },
];

export const PERMISSIONS = {
    // Admin Management Permissions
    ADMIN_CREATE: "admin:create",
    ADMIN_READ: "admin:read",
    ADMIN_LIST: "admin:list",
    ADMIN_EDIT: "admin:edit",
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
    CUSTOMER_DELETE: "customer:delete",

    // Super Admin Full Access Root Permission
    ALL: "*",
} as const;

export const PERMISSION_ALIASES: Record<string, string[]> = {
    "admin:read": ["admin:read", "ADMIN_VIEW"],
    "admin:list": ["admin:list", "ADMIN_LIST"],
    "admin:create": ["admin:create", "ADMIN_CREATE"],
    "admin:edit": ["admin:edit", "ADMIN_EDIT"],
    "admin:delete": ["admin:delete", "ADMIN_DELETE"],

    "role:read": ["role:read", "ROLE_VIEW"],
    "role:list": ["role:list", "ROLE_LIST"],
    "role:create": ["role:create", "ROLE_CREATE"],
    "role:edit": ["role:edit", "ROLE_EDIT"],
    "role:delete": ["role:delete", "ROLE_DELETE"],

    "customer:read": ["customer:read", "CUSTOMER_VIEW"],
    "customer:list": ["customer:list", "CUSTOMER_LIST"],
    "customer:create": ["customer:create", "CUSTOMER_CREATE"],
    "customer:edit": ["customer:edit", "CUSTOMER_EDIT"],
    "customer:delete": ["customer:delete", "CUSTOMER_DELETE"],

};

export const ALL_PERMISSIONS_LIST = SYSTEM_PERMISSIONS.map((p) => p.code);
export type PermissionType = typeof ALL_PERMISSIONS_LIST[number] | typeof PERMISSIONS.ALL;
