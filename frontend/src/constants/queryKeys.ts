export const adminKeys = {
    all: ["admins"] as const,
    lists: () => [...adminKeys.all, "list"] as const,
    list: (params?: Record<string, any>) => [...adminKeys.lists(), params] as const,
    details: () => [...adminKeys.all, "detail"] as const,
    detail: (id: string) => [...adminKeys.details(), id] as const,
};

export const roleKeys = {
    all: ["roles"] as const,
    lists: () => [...roleKeys.all, "list"] as const,
    list: (params?: Record<string, any>) => [...roleKeys.lists(), params] as const,
    details: () => [...roleKeys.all, "detail"] as const,
    detail: (id: string) => [...roleKeys.details(), id] as const,
};

export const customerKeys = {
    all: ["customers"] as const,
    lists: () => [...customerKeys.all, "list"] as const,
    list: (params?: Record<string, any>) => [...customerKeys.lists(), params] as const,
    details: () => [...customerKeys.all, "detail"] as const,
    detail: (id: string) => [...customerKeys.details(), id] as const,
};

export const faqKeys = {
    all: ["faqs"] as const,
    lists: () => [...faqKeys.all, "list"] as const,
    list: (params?: Record<string, any>) => [...faqKeys.lists(), params] as const,
    details: () => [...faqKeys.all, "detail"] as const,
    detail: (id: string) => [...faqKeys.details(), id] as const,
    categories: () => [...faqKeys.all, "categories"] as const,
};

export const permissionKeys = {
    all: ["permissions"] as const,
    list: () => [...permissionKeys.all, "list"] as const,
};
