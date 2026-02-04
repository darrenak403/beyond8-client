import { MetaData } from "@react-three/drei";
import apiService from "../core";
import { Metadata } from "./fetchUsers";
import { ApiResponse } from "@/types/api";
import { Question } from "./fetchQuestion";

export interface Quiz {
    id: string;
    instructorId: string
    courseId: string
    lessonId: string
    title: string
    description: string
    timeLimitMinutes: number
    passScorePercent: number
    questionCount: number
    questions?: Question[]
}


export interface CreateQuizRequest {
    title: string
    description: string
    courseId: string
    lessonId: string
    questionIds: string[]
    timeLimitMinutes: number
    passScorePercent: number
    totalPoints: number
    maxAttempts: number
    shuffleQuestions: boolean
    allowReview: boolean
    showExplanation: boolean
    difficultyDistribution: {
        easyPercent: number
        mediumPercent: number
        hardPercent: number
    }
}

export interface UpdateQuizRequest {
    title: string
    description: string
    questionIds: string[]
    timeLimitMinutes: number
    passScorePercent: number
    totalPoints: number
    maxAttempts: number
    shuffleQuestions: boolean
    allowReview: boolean
    showExplanation: boolean
    difficultyDistribution: {
        easyPercent: number
        mediumPercent: number
        hardPercent: number
    }
}

export interface QuizResponse {
    isSuccess: boolean
    message: string
    data: Quiz[]
    metadata: Metadata | null
}

export const fetchQuiz = {
    createQuiz: async (request: CreateQuizRequest): Promise<QuizResponse> => {
        const response = await apiService.post<QuizResponse>('api/v1/quizzes', request)
        return response.data
    },

    updateQuiz: async (id: string, request: UpdateQuizRequest): Promise<QuizResponse> => {
        const response = await apiService.put<QuizResponse>(`api/v1/quizzes/${id}`, request)
        return response.data
    },

    deleteQuiz: async (id: string): Promise<QuizResponse> => {
        const response = await apiService.delete<QuizResponse>(`api/v1/quizzes/${id}`)
        return response.data
    },

    getAllQuiz: async (): Promise<QuizResponse> => {
        const response = await apiService.get<QuizResponse>('api/v1/quizzes')
        return response.data
    },

    getQuizById: async (id: string): Promise<ApiResponse<Quiz>> => {
        const response = await apiService.get<ApiResponse<Quiz>>(`api/v1/quizzes/${id}`)
        return response.data
    }
}

