import { AddCategoryRequest, fetchCategory, UpdateCategoryRequest } from "@/lib/api/services/fetchCategory";
import { ApiError } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCategory() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategory.getAll(),
    });

    return {
        categories: data,
        isLoading,
        error,
    };
}

export function useAddCategory() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (category: AddCategoryRequest) => fetchCategory.addCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Tạo danh mục mới thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Tạo danh mục mới thất bại!")
        }
    })
    return { mutateAsync, isPending }
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, category }: { id: string; category: UpdateCategoryRequest }) => fetchCategory.updateCategory(id, category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Cập nhật danh mục thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Cập nhật danh mục thất bại!")
        }
    })
    return { mutateAsync, isPending }
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchCategory.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Xóa danh mục thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Xóa danh mục thất bại!")
        }
    })
    return { mutateAsync, isPending }
}

export function useUpdateCategoryStatus() {
    const queryClient = useQueryClient()
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (id: string) => fetchCategory.changeStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Cập nhật trạng thái danh mục thành công!")
        },
        onError: (error: ApiError) => {
            toast.error(error?.message || "Cập nhật trạng thái danh mục thất bại!")
        }
    })
    return { mutateAsync, isPending }
}
