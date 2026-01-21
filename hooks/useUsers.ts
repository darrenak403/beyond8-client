import { AddUserRequest, fetchUsers, UserParams, UserResponse } from "@/lib/api/services/fetchUsers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useGetAllUsers(filterParams?: UserParams) {
    const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
        queryKey: ['users', 'getAll'],
        queryFn: () => fetchUsers.getAll(filterParams),
        select: (data: UserResponse) => ({
            users: data.data,
            count: data.metadata.totalItems,
            page: data.metadata.pageNumber,
            pageSize: data.metadata.pageSize,
            totalPages: data.metadata.totalPages,
            hasNextPage: data.metadata.hasNextPage,
            hasPreviousPage: data.metadata.hasPreviousPage
        }),
    })
    return {
        isLoading,
        isError,
        data,
        error,
        refetch,
        isFetching
    }
}

export function useAddUser() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (user: AddUserRequest) => fetchUsers.addUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] })
        }
    })
    return { mutateAsync, isPending }
}

export function useUpdateUser() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, user }: { id: string; user: any }) => fetchUsers.updateUser(id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] })
        }
    })
    return { mutateAsync, isPending }
}

export function useDeleteUser() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchUsers.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] })
        }
    })
    return { mutateAsync, isPending }
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => fetchUsers.updateUserStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] })
        }
    })
    return { mutateAsync, isPending }
}