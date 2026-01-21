import { metadata } from "@/app/layout";
import { fetchUsers, UserParams, UserResponse } from "@/lib/api/services/fetchUsers";
import { useQuery, useQueryClient } from "@tanstack/react-query";


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