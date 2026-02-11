import apiService from "../core";

export interface CheckEnrollmentResponse {
  isSuccess: boolean;
  message: string;
  data: boolean;
  metadata: {
    enrollmentId: string;
  };
}

export interface EnrollmentData {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnailUrl: string | null;
  instructorId: string;
  instructorName: string;
  pricePaid: number;
  status: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  completedAt: string | null;
  lastAccessedAt: string | null;
  lastAccessedLessonId: string | null;
}

export interface EnrollmentResponse {
  isSuccess: boolean;
  message: string;
  data: EnrollmentData;
  metadata: unknown | null;
}

export interface MyEnrollmentData {
  id: string;
  courseId: string;
  courseTitle: string;
  slug: string;
  courseThumbnailUrl: string | null;
  instructorId: string;
  instructorName: string;
  progressPercent: number;
}

export interface MyEnrollmentsResponse {
  isSuccess: boolean;
  message: string;
  data: MyEnrollmentData[];
  metadata: null;
}

export interface LessonProgress {
  lessonId: string;
  title: string;
  order: number;
  isCompleted: boolean;
  isPassed: boolean;
}

export interface SectionProgress {
  sectionId: string;
  title: string;
  order: number;
  isCompleted: boolean;
  lessons: LessonProgress[];
}

export interface CurriculumProgressData {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  sections: SectionProgress[];
}

export interface UpdateLearningRequest {
  lastPositionSeconds: number;
  markComplete: boolean;
}

export interface Learning {
  id: string
  lessonId: string
  enrollmentId: string
  courseId: string
  status: string
  isPassed: boolean
  lastPositionSeconds: number
  totalDurationSeconds: number
  watchPercent: number
  quizAttempts: unknown
  quizBestScore: unknown
  startedAt: string
  completedAt: string | null
  lastAccessedAt: string | null
  isManuallyCompleted: boolean
}

export interface UpdateLearningResponse {
  isSuccess: boolean;
  message: string;
  data: Learning;
  metadata: unknown;
}

export interface CurriculumProgressResponse {
  isSuccess: boolean;
  message: string;
  data: CurriculumProgressData;
  metadata: null;
}

export const fetchEnroll = {
  // Kiểm tra người dùng hiện tại đã đăng ký khoá học hay chưa
  checkEnrollment: async (
    courseId: string
  ): Promise<CheckEnrollmentResponse> => {
    const response = await apiService.get<CheckEnrollmentResponse>(
      "api/v1/enrollments/check",
      {
        courseId,
      }
    );
    return response.data;
  },

  // Đăng ký khoá học (enroll) cho user hiện tại
  enrollCourse: async (courseId: string): Promise<EnrollmentResponse> => {
    const response = await apiService.post<EnrollmentResponse, { courseId: string }>(
      "api/v1/enrollments",
      { courseId }
    );
    return response.data;
  },

  // Lấy danh sách các khóa học mà user hiện tại đã đăng ký
  getMyEnrollments: async (): Promise<MyEnrollmentsResponse> => {
    const response = await apiService.get<MyEnrollmentsResponse>(
      "api/v1/enrollments/me"
    );
    return response.data;
  },

  // Lấy curriculum progress của enrollment
  getCurriculumProgress: async (
    enrollmentId: string
  ): Promise<CurriculumProgressResponse> => {
    const response = await apiService.get<CurriculumProgressResponse>(
      `api/v1/enrollments/${enrollmentId}/curriculum-progress`
    );
    return response.data;
  },

  //Cập nhật tiến độ bài học (heartbeat): vị trí xem / đánh dấu hoàn thành
  updateLearning: async (lessonId: string, data: UpdateLearningRequest): Promise<UpdateLearningResponse> => {
    const response = await apiService.put<UpdateLearningResponse>(
      `api/v1/enrollments/lesson/${lessonId}/heartbeat`,
      data
    );
    return response.data;
  },
};

