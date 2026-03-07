import { ApiResponse } from "@/types/api";
import apiService from "../core";

// --- AI Usage Types ---

export interface AIUsageStatistics {
  totalUsage: number;
  totalCost: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalInputCost: number;
  totalOutputCost: number;
}

export interface AIUsageRecord {
  id: string;
  userId: string;
  provider: string;
  model: string;
  operation: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  promptId: string | null;
  requestSummary: string | null;
  responseTimeMs: number;
  status: string;
  errorMessage: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any | null;
  createdAt: string;
}

export interface GetUsageHistoryParams {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

// --- AI Prompts Types ---

export interface AIPrompt {
  id: string;
  name: string;
  description: string | null;
  category: string;
  template: string;
  version: string;
  isActive: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParameters: any | null;
  systemPrompt: string | null;
  maxTokens: number;
  temperature: number;
  topP: number;
  tags: string[];
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetAIPromptsParams {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
}

export interface CreateAIPromptRequest {
  name: string;
  description?: string | null;
  category: string;
  template: string;
  version: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParameters?: any | null;
  systemPrompt?: string | null;
  maxTokens: number;
  temperature: number;
  topP: number;
  tags: string[];
}

export interface UpdateAIPromptRequest {
  description?: string | null;
  category: string;
  template?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParameters?: any | null;
  systemPrompt?: string | null;
  maxTokens?: number | null;
  temperature?: number | null;
  topP?: number | null;
  isActive?: boolean | null;
  tags: string[];
}

export interface EmbedFileRequest {
  cloudFrontUrl: string;
  courseId: string;
  lessonId: string;
  documentId: string;
}

// --- AI Quiz Question Explain Types ---

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ExplainQuizQuestionRequest {
  content: string;
  options: QuizOption[];
}

export interface QuizAnswerExplanation {
  answer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ExplainQuizQuestionResponse {
  answers: QuizAnswerExplanation[];
}

export const fetchAI = {
  // Usage
  getStatistics: async (): Promise<ApiResponse<AIUsageStatistics>> => {
    const response = await apiService.get<ApiResponse<AIUsageStatistics>>("api/v1/ai-usage/statistics");
    return response.data;
  },

  getHistory: async (params: GetUsageHistoryParams): Promise<ApiResponse<AIUsageRecord[]>> => {
    const response = await apiService.get<ApiResponse<AIUsageRecord[]>>("api/v1/ai-usage/me", params);
    return response.data;
  },

  getAllHistory: async (params?: GetUsageHistoryParams): Promise<ApiResponse<AIUsageRecord[]>> => {
    const response = await apiService.get<ApiResponse<AIUsageRecord[]>>("api/v1/ai-usage/all", params);
    return response.data;
  },

  // Prompts
  getPrompts: async (params: GetAIPromptsParams): Promise<ApiResponse<AIPrompt[]>> => {
    const response = await apiService.get<ApiResponse<AIPrompt[]>>("api/v1/ai-prompts", params);
    return response.data;
  },

  getPromptById: async (id: string): Promise<ApiResponse<AIPrompt>> => {
    const response = await apiService.get<ApiResponse<AIPrompt>>(`api/v1/ai-prompts/${id}`);
    return response.data;
  },

  createPrompt: async (data: CreateAIPromptRequest): Promise<ApiResponse<AIPrompt>> => {
    const response = await apiService.post<ApiResponse<AIPrompt>>("api/v1/ai-prompts", data);
    return response.data;
  },

  updatePrompt: async (id: string, data: UpdateAIPromptRequest): Promise<ApiResponse<AIPrompt>> => {
    const response = await apiService.put<ApiResponse<AIPrompt>>(`api/v1/ai-prompts/${id}`, data);
    return response.data;
  },

  deletePrompt: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await apiService.delete<ApiResponse<boolean>>(`api/v1/ai-prompts/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string): Promise<ApiResponse<boolean>> => {
    const response = await apiService.patch<ApiResponse<boolean>>(`api/v1/ai-prompts/${id}/toggle-status`, {});
    return response.data;
  },

  //Check the health of the embedding service (Qdrant, Hugging Face)
  checkHealthEmbed: async (): Promise<ApiResponse<boolean>> => {
    const response = await apiService.get<ApiResponse<boolean>>("api/v1/ai/embed/health");
    return response.data;
  },

  //Gửi CloudFront URL của PDF, backend giải mã key, tải từ S3 và embed vào Qdrant (Instructor only)
  embedFile: async (data: EmbedFileRequest): Promise<ApiResponse<boolean>> => {
    const response = await apiService.post<ApiResponse<boolean>>("api/v1/ai/embed", data);
    return response.data;
  },

  // Explain quiz question
  explainQuizQuestion: async (data: ExplainQuizQuestionRequest): Promise<ApiResponse<ExplainQuizQuestionResponse>> => {
    const response = await apiService.post<ApiResponse<ExplainQuizQuestionResponse>>("api/v1/ai/quiz/question/explain", data);
    return response.data;
  },
};
