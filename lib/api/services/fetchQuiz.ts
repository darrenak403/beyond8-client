import apiService from "../core";
import { Metadata } from "./fetchUsers";
import { ApiResponse } from "@/types/api";

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

// Quiz Overview Response (before starting quiz)
export interface QuizOverview {
    id: string
    instructorId: string
    courseId: string | null
    lessonId: string | null
    title: string
    description: string | null
    timeLimitMinutes: number | null
    passScorePercent: number
    questionCount: number
}

// Quiz Attempt Response (after starting quiz)
export interface QuizQuestion {
    questionId: string
    orderIndex: number
    content: string
    type: "MultipleChoice" | "TrueFalse" | "ShortAnswer"
    points: number
    options: {
        id: string
        text: string
    }[]
}

export interface QuizAttempt {
    attemptId: string
    quizId: string
    quizTitle: string
    quizDescription: string | null
    attemptNumber: number
    startedAt: string
    timeLimitMinutes: number | null
    totalQuestions: number
    totalPoints: number
    passScorePercent: number
    questions: QuizQuestion[]
}

// Submit / Auto-save request bodies
export interface QuizAttemptAnswers {
    // questionId -> selected option ids (or values depending on question type)
    [questionId: string]: string[]
}

export interface SubmitQuizAttemptRequest {
    answers: QuizAttemptAnswers
    timeSpentSeconds: number
}

export interface AutoSaveQuizAttemptRequest {
    answers: QuizAttemptAnswers
    timeSpentSeconds: number
    flaggedQuestions: string[]
}

// Submit result types
export interface QuizAttemptOptionResult {
    id: string
    text: string
    isCorrect: boolean
    isSelected: boolean
}

export interface QuizAttemptQuestionResult {
    questionId: string
    orderIndex: number
    content: string
    type: "MultipleChoice" | "TrueFalse" | "ShortAnswer"
    points: number
    earnedPoints: number
    isCorrect: boolean
    selectedOptions: string[]
    correctOptions: string[]
    options: QuizAttemptOptionResult[]
    [key: string]: unknown
}

export interface SubmitQuizAttemptResult {
    attemptId: string
    quizId: string
    quizTitle: string
    attemptNumber: number
    startedAt: string
    submittedAt: string
    timeSpentSeconds: number
    score: number
    scorePercent: number
    totalPoints: number
    passScorePercent: number
    isPassed: boolean
    totalQuestions: number
    correctAnswers: number
    wrongAnswers: number
    status: string
    questionResults: QuizAttemptQuestionResult[]
}

// Quiz attempt result (GET /api/v1/quiz-attempts/{attemptId}/result)
export type QuizAttemptResult = SubmitQuizAttemptResult;

// My attempts summary (GET /api/v1/quiz-attempts/quiz/{quizId}/my-attempts)
export interface QuizAttemptSummaryItem {
    attemptId: string
    quizId: string
    quizTitle: string
    attemptNumber: number
    startedAt: string
    submittedAt: string | null
    score: number | null
    scorePercent: number | null
    isPassed: boolean | null
    timeSpentSeconds: number
    [key: string]: unknown
}

export interface QuizMyAttemptsSummary {
    quizId: string
    quizTitle: string
    maxAttempts: number
    usedAttempts: number
    remainingAttempts: number
    bestScore: number | null
    latestScore: number | null
    attempts: QuizAttemptSummaryItem[]
}

// Check in-progress attempt (GET /api/v1/quiz-attempts/quiz/{quizId}/check-in-progress)
export interface QuizInProgressStatus {
    hasInProgress: boolean
    attemptId: string | null
}

// Current attempt (GET /api/v1/quiz-attempts/quiz/{quizId}/current)
export interface QuizCurrentAttempt extends QuizAttempt {
    savedAnswers: QuizAttemptAnswers
    timeSpentSeconds: number
    flaggedQuestions: string[]
}

// Flag question in an attempt (POST /api/v1/quiz-attempts/{attemptId}/flag-question)
export interface FlagQuizQuestionRequest {
    questionId: string
    isFlagged: boolean
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
    },

    // Get quiz overview (before starting)
    getQuizOverview: async (quizId: string): Promise<ApiResponse<QuizOverview>> => {
        const response = await apiService.get<ApiResponse<QuizOverview>>(`api/v1/quizzes/${quizId}/student`)
        return response.data
    },

    // Start quiz attempt
    startQuizAttempt: async (quizId: string): Promise<ApiResponse<QuizAttempt>> => {
        const response = await apiService.post<ApiResponse<QuizAttempt>>(`api/v1/quiz-attempts/start/${quizId}`, {})
        return response.data
    },

    // Submit quiz attempt
    submitQuizAttempt: async (attemptId: string, body: SubmitQuizAttemptRequest): Promise<ApiResponse<SubmitQuizAttemptResult>> => {
        const response = await apiService.post<ApiResponse<SubmitQuizAttemptResult>>(`api/v1/quiz-attempts/${attemptId}/submit`, body)
        return response.data
    },

    // Auto-save quiz attempt
    autoSaveQuizAttempt: async (attemptId: string, body: AutoSaveQuizAttemptRequest): Promise<ApiResponse<boolean>> => {
        const response = await apiService.post<ApiResponse<boolean>>(`api/v1/quiz-attempts/${attemptId}/auto-save`, body)
        return response.data
    },

    // Get quiz attempt result
    getQuizAttemptResult: async (attemptId: string): Promise<ApiResponse<QuizAttemptResult>> => {
        const response = await apiService.get<ApiResponse<QuizAttemptResult>>(`api/v1/quiz-attempts/${attemptId}/result`)
        return response.data
    },

    // Get my attempts for a quiz
    getMyQuizAttempts: async (quizId: string): Promise<ApiResponse<QuizMyAttemptsSummary>> => {
        const response = await apiService.get<ApiResponse<QuizMyAttemptsSummary>>(`api/v1/quiz-attempts/quiz/${quizId}/my-attempts`)
        return response.data
    },

    // Check if there is an in-progress attempt for a quiz
    checkQuizInProgress: async (quizId: string): Promise<ApiResponse<QuizInProgressStatus>> => {
        const response = await apiService.get<ApiResponse<QuizInProgressStatus>>(`api/v1/quiz-attempts/quiz/${quizId}/check-in-progress`)
        return response.data
    },

    // Get current in-progress attempt data for a quiz
    getCurrentQuizAttempt: async (quizId: string): Promise<ApiResponse<QuizCurrentAttempt>> => {
        const response = await apiService.get<ApiResponse<QuizCurrentAttempt>>(`api/v1/quiz-attempts/quiz/${quizId}/current`)
        return response.data
    },

    // Flag/unflag a question in an attempt
    flagQuizQuestion: async (attemptId: string, body: FlagQuizQuestionRequest): Promise<ApiResponse<string[]>> => {
        const response = await apiService.post<ApiResponse<string[]>>(`api/v1/quiz-attempts/${attemptId}/flag-question`, body)
        return response.data
    },
}

