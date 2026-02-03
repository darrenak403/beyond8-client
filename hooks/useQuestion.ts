import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { 
  questionService, 
  QuestionTagsCountResponse, 
  QuestionListResponse,
  QuestionParams,
  CreateQuestionRequest,
  CreateQuestionResponse,
  GenerateQuestionsFromPDFResponse,
  ImportQuestionsFromAIRequest,
  ImportQuestionsFromAIResponse,
  DeleteQuestionResponse,
  BulkCreateQuestionRequest,
  BulkCreateQuestionResponse
} from "@/lib/api/services/fetchQuestion"

export function useGetQuestionTagsCount() {
  const { data, isLoading, error, refetch, isFetching } = useQuery<QuestionTagsCountResponse, Error>({
    queryKey: ["question-tags-count"],
    queryFn: () => questionService.getTagsCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  return {
    tags: data?.data || [],
    isLoading,
    error,
    refetch,
    isFetching,
  }
}

export function useGetQuestions(params?: QuestionParams) {
  const { data, isLoading, error, refetch, isFetching } = useQuery<QuestionListResponse, Error>({
    queryKey: ["questions", params],
    queryFn: () => questionService.getQuestions(params),
    enabled: !!params?.tag, // Only run query when tag is selected
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })

  return {
    questions: data?.data || [],
    isLoading,
    error,
    refetch,
    isFetching,
  }
}

export function useCreateQuestion() {
  const queryClient = useQueryClient()

  const mutation = useMutation<CreateQuestionResponse, Error, CreateQuestionRequest>({
    mutationFn: (data: CreateQuestionRequest) => questionService.createQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-tags-count"] })
      toast.success("Tạo câu hỏi thành công!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Tạo câu hỏi thất bại!")
    },
  })

  return {
    createQuestion: mutation.mutate,
    createQuestionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  }
}

export function useGenerateQuestionsFromPDF() {
  const mutation = useMutation<GenerateQuestionsFromPDFResponse, Error, File>({
    mutationFn: (file: File) => questionService.generateQuestionsFromPDF(file),
    onSuccess: () => {
      toast.success("Tạo câu hỏi từ PDF thành công!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Tạo câu hỏi từ PDF thất bại!")
    },
  })

  return {
    generateQuestions: mutation.mutate,
    generateQuestionsAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  }
}

export function useImportQuestionsFromAI() {
  const queryClient = useQueryClient()

  const mutation = useMutation<ImportQuestionsFromAIResponse, Error, ImportQuestionsFromAIRequest>({
    mutationFn: (data: ImportQuestionsFromAIRequest) => questionService.importQuestionsFromAI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-tags-count"] })
      toast.success("Import câu hỏi từ AI thành công!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Import câu hỏi từ AI thất bại!")
    },
  })

  return {
    importQuestions: mutation.mutate,
    importQuestionsAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  }
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  const mutation = useMutation<DeleteQuestionResponse, Error, string>({
    mutationFn: (id: string) => questionService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-tags-count"] })
      toast.success("Xóa câu hỏi thành công!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Xóa câu hỏi thất bại!")
    },
  })

  return {
    deleteQuestion: mutation.mutate,
    deleteQuestionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  }
}

export function useBulkCreateQuestions() {
  const queryClient = useQueryClient()

  const mutation = useMutation<BulkCreateQuestionResponse, Error, BulkCreateQuestionRequest>({
    mutationFn: (data: BulkCreateQuestionRequest) => questionService.bulkCreateQuestions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] })
      queryClient.invalidateQueries({ queryKey: ["question-tags-count"] })
      toast.success("Tạo câu hỏi hàng loạt thành công!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Tạo câu hỏi hàng loạt thất bại!")
    },
  })

  return {
    bulkCreateQuestions: mutation.mutate,
    bulkCreateQuestionsAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset,
  }
}
