const V1 = '';

export const ENDPOINTS = {
    auth: {
        register: `${V1}/auth/register`,
        login: `${V1}/auth/login`,
        refresh: `${V1}/auth/refresh`,
        logout: `${V1}/auth/logout`,
        logoutAll: `${V1}/auth/logout-all`,
        changePassword: `${V1}/auth/change-password`,
        googleToken: `${V1}/auth/google/token`,
        providers: `${V1}/auth/providers`,
    },

    users: {
        me: `${V1}/users/me`,
        settings: `${V1}/users/me/settings`,
        avatar: `${V1}/users/me/avatar`,
        search: `${V1}/users/search`,
        byTag: (tag: string) => `${V1}/users/${tag}`,
    },

    accounts: {
        me: `${V1}/accounts/me`,
        summary: `${V1}/accounts/me/summary`,
    },

    transactions: {
        list: `${V1}/transactions`,
        details: (id: string) => `${V1}/transactions/${id}`,
    },

    transfers: {
        send: `${V1}/transfers`,
        list: `${V1}/transfers`,
        details: (id: string) => `${V1}/transfers/${id}`,
    },

    beneficiaries: {
        list: `${V1}/beneficiaries`,
        create: `${V1}/beneficiaries`,
        followers: `${V1}/beneficiaries/followers`,
        update: (id: string) => `${V1}/beneficiaries/${id}`,
        remove: (id: string) => `${V1}/beneficiaries/${id}`,
    },

    cards: {
        list: `${V1}/cards`,
        create: `${V1}/cards`,
        status: (id: string) => `${V1}/cards/${id}/status`,
        setDefault: (id: string) => `${V1}/cards/${id}/default`,
        remove: (id: string) => `${V1}/cards/${id}`,
    },

    sessions: {
        list: `${V1}/sessions`,
        revoke: (id: string) => `${V1}/sessions/${id}`,
    },

    admin: {
        overview: `${V1}/admin/overview`,
        users: `${V1}/admin/users`,
        user: (id: string) => `${V1}/admin/users/${id}`,
        userStatus: (id: string) => `${V1}/admin/users/${id}/status`,
        userRole: (id: string) => `${V1}/admin/users/${id}/role`,
        transfers: `${V1}/admin/transfers`,
    },

    notifications: {
        list: `${V1}/notifications`,
        readAll: `${V1}/notifications/read-all`,
        read: (id: string) => `${V1}/notifications/${id}/read`,
    },

    health: `${V1}/health`,
} as const;
