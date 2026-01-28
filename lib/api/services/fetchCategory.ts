import apiService from "../core";

export interface CategoryResponse {
    isSuccess: boolean;
    message: string;
    data: Category[];
    metadata: unknown;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    level: number;
    type: CategoryType;
    description: string;
    isRoot: boolean;
    subCategories: Category[];
}

export enum CategoryType {
    Technology = "Technology",
    Design = "Design",
    Business = "Business",
    Marketing = "Marketing",
    Language = "Language",
    Other = "Other"
}

export const categoryTypeLabels: Record<CategoryType, string> = {
    [CategoryType.Technology]: "Công nghệ",
    [CategoryType.Design]: "Thiết kế",
    [CategoryType.Business]: "Kinh doanh",
    [CategoryType.Marketing]: "Marketing",
    [CategoryType.Language]: "Ngôn ngữ",
    [CategoryType.Other]: "Khác"
};


export interface AddCategoryRequest {
    name: string;
    type: CategoryType;
    isRoot: boolean;
    parentId: string | null;
    description: string;
}

export interface UpdateCategoryRequest {
    name: string;
    description: string;
}


export const fetchCategory = {
    getAll: async (): Promise<CategoryResponse> => {
        const response = await apiService.get<CategoryResponse>("api/v1/categories/tree");
        return response.data;
    },

    addCategory: async (category: AddCategoryRequest): Promise<CategoryResponse> => {
        const response = await apiService.post<CategoryResponse>("api/v1/categories", category);
        return response.data;
    },

    updateCategory: async (id: string, category: UpdateCategoryRequest): Promise<CategoryResponse> => {
        const response = await apiService.put<CategoryResponse>(`api/v1/categories/${id}`, category);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<CategoryResponse> => {
        const response = await apiService.delete<CategoryResponse>(`api/v1/categories/${id}`);
        return response.data;
    },

    changeStatus: async (id: string): Promise<CategoryResponse> => {
        const response = await apiService.patch<CategoryResponse>(`api/v1/categories/${id}/toggle-status`);
        return response.data;
    }
}