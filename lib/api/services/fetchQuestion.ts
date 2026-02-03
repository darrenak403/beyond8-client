import apiService, { RequestParams } from "../core"
import type { ApiResponse } from "@/types/api"

export interface TagCount {
  tag: string
  count: number
}

export interface QuestionTagsCountResponse extends ApiResponse<TagCount[]> {
  isSuccess: boolean
  message: string
  data: TagCount[]
  metadata: null | unknown
}

export enum QuestionType {
  MultipleChoice = "MultipleChoice",
  TrueFalse = "TrueFalse",
  Essay = "Essay",
}

export enum QuestionDifficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  content: string
  type: QuestionType
  options: QuestionOption[]
  explanation: string | null
  tags: string[]
  difficulty: QuestionDifficulty
  points: number
  createdAt: string
  updatedAt: string
}

export interface QuestionParams {
  tag?: string
  pageNumber?: number
  pageSize?: number
  isDescending?: boolean
}

export interface QuestionListResponse extends ApiResponse<Question[]> {
  isSuccess: boolean
  message: string
  data: Question[]
  metadata: null | unknown
}

export interface CreateQuestionRequest {
  content: string
  type: QuestionType
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
  explanation: string | null
  tags: string[]
  difficulty: QuestionDifficulty
  points: number
}

export interface CreateQuestionResponse extends ApiResponse<Question> {
  isSuccess: boolean
  message: string
  data: Question
  metadata: null | unknown
}

export interface GeneratedQuestion {
  content: string
  type: QuestionType
  options: QuestionOption[]
  explanation: string | null
  tags: string[]
  difficulty: QuestionDifficulty
  points: number
}

export interface GeneratedQuestionsByDifficulty {
  totalQuestions: number
  easy: GeneratedQuestion[]
  medium: GeneratedQuestion[]
  hard: GeneratedQuestion[]
}

export interface GenerateQuestionsFromPDFResponse extends ApiResponse<GeneratedQuestionsByDifficulty[]> {
  isSuccess: boolean
  message: string
  data: GeneratedQuestionsByDifficulty[]
  metadata: null | unknown
}

export interface ImportQuestionsFromAIRequest {
  easy: GeneratedQuestion[]
  medium: GeneratedQuestion[]
  hard: GeneratedQuestion[]
}

export interface ImportQuestionsFromAIResponse extends ApiResponse<string[]> {
  isSuccess: boolean
  message: string
  data: string[]
  metadata: null | unknown
}

export interface DeleteQuestionResponse extends ApiResponse<boolean> {
  isSuccess: boolean
  message: string
  data: boolean
  metadata: null | unknown
}

export type BulkCreateQuestionRequest = CreateQuestionRequest[]

export interface BulkCreateQuestionResponse extends ApiResponse<Question> {
  isSuccess: boolean
  message: string
  data: Question
  metadata: null | unknown
}

const convertQuestionParamsToQuery = (params?: QuestionParams): RequestParams => {
  if (!params) return {}
  const query: RequestParams = {}
  if (params.tag) query.tag = params.tag
  // API requires PageNumber and PageSize (PascalCase) - they are required parameters
  query.PageNumber = params.pageNumber ?? 1
  query.PageSize = params.pageSize ?? 10
  if (params.isDescending !== undefined) query.IsDescending = params.isDescending
  return query
}

export const questionService = {
  getTagsCount: async (): Promise<QuestionTagsCountResponse> => {
    const response = await apiService.get<QuestionTagsCountResponse>("api/v1/questions/tags/count")
    return response.data
  },

  getQuestions: async (params?: QuestionParams): Promise<QuestionListResponse> => {
    const query = convertQuestionParamsToQuery(params)
    const response = await apiService.get<QuestionListResponse>("api/v1/questions", query)
    return response.data
  },

  createQuestion: async (data: CreateQuestionRequest): Promise<CreateQuestionResponse> => {
    const response = await apiService.post<CreateQuestionResponse, CreateQuestionRequest>("api/v1/questions", data)
    return response.data
  },

  generateQuestionsFromPDF: async (file: File): Promise<GenerateQuestionsFromPDFResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await apiService.post<GenerateQuestionsFromPDFResponse, FormData>("api/v1/ai/quiz/format/questions", formData)
    return response.data
  },

  importQuestionsFromAI: async (data: ImportQuestionsFromAIRequest): Promise<ImportQuestionsFromAIResponse> => {
    const response = await apiService.post<ImportQuestionsFromAIResponse, ImportQuestionsFromAIRequest>("api/v1/questions/import-from-ai", data)
    return response.data
  },

  deleteQuestion: async (id: string): Promise<DeleteQuestionResponse> => {
    const response = await apiService.delete<DeleteQuestionResponse>(`api/v1/questions/${id}`)
    return response.data
  },

  bulkCreateQuestions: async (data: BulkCreateQuestionRequest): Promise<BulkCreateQuestionResponse> => {
    const response = await apiService.post<BulkCreateQuestionResponse, BulkCreateQuestionRequest>("api/v1/questions/bulk", data)
    return response.data
  },
}
