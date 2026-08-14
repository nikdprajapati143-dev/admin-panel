export const PERMISSIONS = {
    // Admin Management
    ADMIN_VIEW: "admin:read",
    ADMIN_LIST: "admin:list",
    ADMIN_CREATE: "admin:create",
    ADMIN_EDIT: "admin:edit",
    ADMIN_DELETE: "admin:delete",

    // Role Management
    ROLE_VIEW: "role:read",
    ROLE_LIST: "role:list",
    ROLE_CREATE: "role:create",
    ROLE_EDIT: "role:edit",
    ROLE_DELETE: "role:delete",

    // Customer Management
    CUSTOMER_VIEW: "customer:read",
    CUSTOMER_LIST: "customer:list",
    CUSTOMER_CREATE: "customer:create",
    CUSTOMER_EDIT: "customer:edit",
    CUSTOMER_DELETE: "customer:delete",

    // FAQ Management
    FAQ_VIEW: "faq:read",
    FAQ_LIST: "faq:list",
    FAQ_CREATE: "faq:create",
    FAQ_EDIT: "faq:edit",
    FAQ_DELETE: "faq:delete",

    // Wildcard
    ALL: "*",
} as const;

// Mapping aliases for flexibility without conflating distinct action permissions
export const PERMISSION_ALIASES: Record<string, string[]> = {
    [PERMISSIONS.ADMIN_VIEW]: ["admin:read", "ADMIN_VIEW"],
    [PERMISSIONS.ADMIN_LIST]: ["admin:list", "ADMIN_LIST"],
    [PERMISSIONS.ADMIN_CREATE]: ["admin:create", "ADMIN_CREATE"],
    [PERMISSIONS.ADMIN_EDIT]: ["admin:edit", "ADMIN_EDIT"],
    [PERMISSIONS.ADMIN_DELETE]: ["admin:delete", "ADMIN_DELETE"],

    [PERMISSIONS.ROLE_VIEW]: ["role:read", "ROLE_VIEW"],
    [PERMISSIONS.ROLE_LIST]: ["role:list", "ROLE_LIST"],
    [PERMISSIONS.ROLE_CREATE]: ["role:create", "ROLE_CREATE"],
    [PERMISSIONS.ROLE_EDIT]: ["role:edit", "ROLE_EDIT"],
    [PERMISSIONS.ROLE_DELETE]: ["role:delete", "ROLE_DELETE"],

    [PERMISSIONS.CUSTOMER_VIEW]: ["customer:read", "CUSTOMER_VIEW"],
    [PERMISSIONS.CUSTOMER_LIST]: ["customer:list", "CUSTOMER_LIST"],
    [PERMISSIONS.CUSTOMER_CREATE]: ["customer:create", "CUSTOMER_CREATE"],
    [PERMISSIONS.CUSTOMER_EDIT]: ["customer:edit", "CUSTOMER_EDIT"],
    [PERMISSIONS.CUSTOMER_DELETE]: ["customer:delete", "CUSTOMER_DELETE"],

    [PERMISSIONS.FAQ_VIEW]: ["faq:read", "FAQ_VIEW"],
    [PERMISSIONS.FAQ_LIST]: ["faq:list", "FAQ_LIST"],
    [PERMISSIONS.FAQ_CREATE]: ["faq:create", "FAQ_CREATE"],
    [PERMISSIONS.FAQ_EDIT]: ["faq:edit", "FAQ_EDIT"],
    [PERMISSIONS.FAQ_DELETE]: ["faq:delete", "FAQ_DELETE"],
};
