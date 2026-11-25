import api from '../lib/api';
import { ENDPOINTS } from '../lib/endpoints';
import type { AdminOverview, AdminTransfer, AdminTransfersQuery, AdminUser, AdminUsersQuery, ApiEnvelope, Paginated, UserRole } from '../lib/types';

export const adminService = {
    async overview() {
        const { data } = await api.get<ApiEnvelope<AdminOverview>>(ENDPOINTS.admin.overview);
        return data.data as AdminOverview;
    },

    async users(params: AdminUsersQuery = {}): Promise<Paginated<AdminUser>> {
        const { data } = await api.get<ApiEnvelope<AdminUser[]>>(ENDPOINTS.admin.users, { params });
        return { data: data.data ?? [], meta: data.meta as Paginated<AdminUser>['meta'] };
    },

    async user(id: string) {
        const { data } = await api.get<ApiEnvelope<AdminUser>>(ENDPOINTS.admin.user(id));
        return data.data as AdminUser;
    },

    async setUserStatus(id: string, isActive: boolean) {
        const { data } = await api.patch<ApiEnvelope<AdminUser>>(ENDPOINTS.admin.userStatus(id), { isActive });
        return data.data as AdminUser;
    },

    async setUserRole(id: string, role: UserRole) {
        const { data } = await api.patch<ApiEnvelope<AdminUser>>(ENDPOINTS.admin.userRole(id), { role });
        return data.data as AdminUser;
    },

    async transfers(params: AdminTransfersQuery = {}): Promise<Paginated<AdminTransfer>> {
        const { data } = await api.get<ApiEnvelope<AdminTransfer[]>>(ENDPOINTS.admin.transfers, { params });
        return { data: data.data ?? [], meta: data.meta as Paginated<AdminTransfer>['meta'] };
    },
};
