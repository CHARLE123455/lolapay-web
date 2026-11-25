import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QK } from '../lib/queryClient';
import type { AdminTransfersQuery, AdminUsersQuery, UserRole } from '../lib/types';
import { adminService } from '../services';

export const useAdminOverview = () => useQuery({ queryKey: QK.admin.overview, queryFn: adminService.overview, refetchInterval: 30_000 });

export const useAdminUsers = (params: AdminUsersQuery) =>
    useQuery({ queryKey: QK.admin.users(params as Record<string, unknown>), queryFn: () => adminService.users(params), placeholderData: (prev) => prev });

export const useAdminTransfers = (params: AdminTransfersQuery) =>
    useQuery({ queryKey: QK.admin.transfers(params as Record<string, unknown>), queryFn: () => adminService.transfers(params), placeholderData: (prev) => prev });

export function useSetUserStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => adminService.setUserStatus(id, isActive),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
            void qc.invalidateQueries({ queryKey: QK.admin.overview });
        },
    });
}

export function useSetUserRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: UserRole }) => adminService.setUserRole(id, role),
        onSuccess: () => void qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
    });
}
