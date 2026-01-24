import { AddUserRequest, fetchUsers, UpdateUserRequest, UserParams, UserResponse } from "@/lib/api/services/fetchUsers";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useGetAllUsers(filterParams?: UserParams) {
    const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
        queryKey: ['users', 'getAll', filterParams],
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
        placeholderData: keepPreviousData,
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
        mutationFn: ({ id, roles }: { id: string; roles: string[] }) => fetchUsers.updateUser(id, roles),
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
        mutationFn: (id: string) => fetchUsers.updateUserStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'getAll'] })
        }
    })
    return { mutateAsync, isPending }
}