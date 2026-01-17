/**
 * Product Service - FILE MẪU để tham khảo cho các API service khác
 *
 * Hướng dẫn sử dụng:
 * 1. Import apiService từ '../core'
 * 2. Định nghĩa types cho request/response
 * 3. Tạo object service với các method tương ứng API endpoints
 * 4. Sử dụng với React Query hook hoặc Redux thunk
 */

import type {ApiResponse} from '@/types/api'
import type {Product} from '@/types/models'
import apiService from '../core'

// ====================================
// Types - Định nghĩa các kiểu dữ liệu
// ====================================
export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

// ====================================
// Product Service - MẪU CRUD operations
// ====================================
export const productService = {
  /**
   * GET /products - Lấy danh sách products
   * Ví dụ: productService.getProducts({ search: 'laptop' })
   */
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    const response = await apiService.get<ApiResponse<Product[]>>('/products', filters)
    return response.data
  },

  /**
   * GET /products/:id - Lấy chi tiết 1 product
   * Ví dụ: productService.getProduct('123')
   */
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiService.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data
  },

  /**
   * POST /products - Tạo product mới
   * Ví dụ: productService.createProduct({ name: 'Product 1', price: 100 })
   */
  createProduct: async (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiService.post<ApiResponse<Product>>('/products', data)
    return response.data
  },

  /**
   * PUT /products/:id - Cập nhật product
   * Ví dụ: productService.updateProduct('123', { price: 200 })
   */
  updateProduct: async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiService.put<ApiResponse<Product>>(`/products/${id}`, data)
    return response.data
  },

  /**
   * DELETE /products/:id - Xóa product
   * Ví dụ: productService.deleteProduct('123')
   */
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiService.delete<ApiResponse<void>>(`/products/${id}`)
    return response.data
  },
}

/**
 * ==========================================================================
 * CÁCH SỬ DỤNG VỚI REACT QUERY HOOK
 * ==========================================================================
 *
 * import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
 * import { productService } from '@/lib/api/services/productService';
 *
 * function ProductList() {
 *   // GET - Lấy danh sách
 *   const { data, isLoading, error } = useQuery({
 *     queryKey: ['products'],
 *     queryFn: () => productService.getProducts()
 *   });
 *
 *   const queryClient = useQueryClient();
 *
 *   // POST - Tạo mới
 *   const createMutation = useMutation({
 *     mutationFn: productService.createProduct,
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products'] });
 *       toast.success('Tạo sản phẩm thành công!');
 *     },
 *     onError: (error) => {
 *       toast.error('Lỗi tạo sản phẩm!');
 *     }
 *   });
 *
 *   // PUT - Cập nhật
 *   const updateMutation = useMutation({
 *     mutationFn: ({ id, data }) => productService.updateProduct(id, data),
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products'] });
 *     }
 *   });
 *
 *   // DELETE - Xóa
 *   const deleteMutation = useMutation({
 *     mutationFn: productService.deleteProduct,
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['products'] });
 *     }
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={() => createMutation.mutate({ name: 'New Product' })}>
 *         Tạo sản phẩm
 *       </button>
 *     </div>
 *   );
 * }
 *
 * ==========================================================================
 * CÁCH TẠO SERVICE MỚI
 * ==========================================================================
 *
 * 1. Copy file này và đổi tên (vd: userService.ts, orderService.ts)
 * 2. Thay đổi interface types phù hợp với model
 * 3. Thay đổi endpoint URL
 * 4. Thêm/bớt methods tùy theo API backend
 */

