// Mock data for course detail, sections, lessons, and instructor

export interface Instructor {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
  bio?: string
  title?: string
  rating?: number
  totalStudents?: number
  totalCourses?: number
  socialLinks?: {
    website?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
}

export interface Lesson {
  id: string
  title: string
  description?: string
  duration: string
  videoUrl?: string
  isPreview: boolean
  order: number
}

export interface Section {
  id: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export interface CourseDetail {
  id: string
  title: string
  description: string
  shortDescription?: string
  thumbnailUrl: string
  price: number
  rating: number
  students: number
  category: string
  level: string
  duration: string
  language?: string
  instructor: Instructor
  sections: Section[]
  outcomes?: string[]
  requirements?: string[]
  targetAudience?: string[]
  createdAt?: string
  updatedAt?: string
  isRegistered?: boolean
}

// Mock Instructor Data
export const mockInstructor: Instructor = {
  id: 'instructor-001',
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  bio: 'Giảng viên với hơn 10 năm kinh nghiệm trong lĩnh vực Machine Learning và Data Science. Đã từng làm việc tại các công ty công nghệ hàng đầu và có nhiều nghiên cứu được công bố trên các tạp chí quốc tế.',
  title: 'Senior Data Scientist & AI Researcher',
  rating: 4.9,
  totalStudents: 50000,
  totalCourses: 15,
  socialLinks: {
    website: 'https://nguyenvana.dev',
    linkedin: 'https://linkedin.com/in/nguyenvana',
    twitter: 'https://twitter.com/nguyenvana',
    youtube: 'https://youtube.com/@nguyenvana',
  },
}

// Mock Course Detail Data
export const mockCourseDetail: CourseDetail = {
  id: '1',
  isRegistered: true,
  title: 'Machine Learning A-Z: Hands-On Python & R',
  description: `Khóa học Machine Learning toàn diện này sẽ đưa bạn từ người mới bắt đầu đến chuyên gia trong lĩnh vực Machine Learning. Bạn sẽ học cách xây dựng các mô hình AI mạnh mẽ, phân tích dữ liệu phức tạp, và áp dụng Machine Learning vào các dự án thực tế.
  
Khóa học bao gồm:
- Hơn 40 giờ video bài giảng chất lượng cao
- Hơn 50 bài tập thực hành và dự án
- Tài liệu và code mẫu đầy đủ
- Hỗ trợ từ giảng viên và cộng đồng

Bạn sẽ học được:
- Các thuật toán Machine Learning cơ bản và nâng cao
- Xử lý và phân tích dữ liệu với Python và R
- Xây dựng và triển khai mô hình Machine Learning
- Đánh giá và tối ưu hóa hiệu suất mô hình
- Áp dụng vào các bài toán thực tế trong doanh nghiệp`,
  shortDescription: 'Khóa học Machine Learning toàn diện từ cơ bản đến nâng cao với Python và R',
  thumbnailUrl: '/course 5.png',
  price: 1299000,
  rating: 4.8,
  students: 15420,
  category: 'AI',
  level: 'Intermediate',
  duration: '44 giờ',
  language: 'vi-VN',
  instructor: mockInstructor,
  sections: [
    {
      id: 'section-1',
      title: 'Giới thiệu về Machine Learning',
      description: 'Tổng quan về Machine Learning và các ứng dụng thực tế',
      order: 1,
      lessons: [
        {
          id: 'lesson-1-1',
          title: 'Machine Learning là gì?',
          description: 'Tìm hiểu về Machine Learning và tại sao nó quan trọng',
          duration: '15:30',
          isPreview: true,
          order: 1,
        },
        {
          id: 'lesson-1-2',
          title: 'Các loại Machine Learning',
          description: 'Supervised, Unsupervised, và Reinforcement Learning',
          duration: '22:45',
          isPreview: true,
          order: 2,
        },
        {
          id: 'lesson-1-3',
          title: 'Môi trường phát triển',
          description: 'Cài đặt Python, R, và các thư viện cần thiết',
          duration: '18:20',
          isPreview: false,
          order: 3,
        },
      ],
    },
    {
      id: 'section-2',
      title: 'Data Preprocessing',
      description: 'Xử lý và chuẩn bị dữ liệu cho Machine Learning',
      order: 2,
      lessons: [
        {
          id: 'lesson-2-1',
          title: 'Import và khám phá dữ liệu',
          description: 'Cách import và khám phá dataset',
          duration: '25:10',
          isPreview: false,
          order: 1,
        },
        {
          id: 'lesson-2-2',
          title: 'Xử lý dữ liệu thiếu',
          description: 'Các kỹ thuật xử lý missing values',
          duration: '20:30',
          isPreview: false,
          order: 2,
        },
        {
          id: 'lesson-2-3',
          title: 'Encoding Categorical Data',
          description: 'Chuyển đổi dữ liệu phân loại thành số',
          duration: '18:45',
          isPreview: false,
          order: 3,
        },
        {
          id: 'lesson-2-4',
          title: 'Feature Scaling',
          description: 'Chuẩn hóa và normalize dữ liệu',
          duration: '16:20',
          isPreview: false,
          order: 4,
        },
      ],
    },
    {
      id: 'section-3',
      title: 'Regression',
      description: 'Các thuật toán Regression và ứng dụng',
      order: 3,
      lessons: [
        {
          id: 'lesson-3-1',
          title: 'Simple Linear Regression',
          description: 'Hồi quy tuyến tính đơn giản',
          duration: '28:15',
          isPreview: false,
          order: 1,
        },
        {
          id: 'lesson-3-2',
          title: 'Multiple Linear Regression',
          description: 'Hồi quy tuyến tính đa biến',
          duration: '32:40',
          isPreview: false,
          order: 2,
        },
        {
          id: 'lesson-3-3',
          title: 'Polynomial Regression',
          description: 'Hồi quy đa thức',
          duration: '24:50',
          isPreview: false,
          order: 3,
        },
        {
          id: 'lesson-3-4',
          title: 'Support Vector Regression (SVR)',
          description: 'SVR và ứng dụng',
          duration: '30:25',
          isPreview: false,
          order: 4,
        },
        {
          id: 'lesson-3-5',
          title: 'Decision Tree Regression',
          description: 'Cây quyết định cho Regression',
          duration: '26:10',
          isPreview: false,
          order: 5,
        },
        {
          id: 'lesson-3-6',
          title: 'Random Forest Regression',
          description: 'Random Forest cho Regression',
          duration: '29:35',
          isPreview: false,
          order: 6,
        },
      ],
    },
    {
      id: 'section-4',
      title: 'Classification',
      description: 'Các thuật toán Classification',
      order: 4,
      lessons: [
        {
          id: 'lesson-4-1',
          title: 'Logistic Regression',
          description: 'Hồi quy logistic cho classification',
          duration: '31:20',
          isPreview: false,
          order: 1,
        },
        {
          id: 'lesson-4-2',
          title: 'K-Nearest Neighbors (K-NN)',
          description: 'Thuật toán K-NN',
          duration: '27:45',
          isPreview: false,
          order: 2,
        },
        {
          id: 'lesson-4-3',
          title: 'Support Vector Machine (SVM)',
          description: 'SVM cho classification',
          duration: '35:10',
          isPreview: false,
          order: 3,
        },
        {
          id: 'lesson-4-4',
          title: 'Naive Bayes',
          description: 'Thuật toán Naive Bayes',
          duration: '23:30',
          isPreview: false,
          order: 4,
        },
        {
          id: 'lesson-4-5',
          title: 'Decision Tree Classification',
          description: 'Cây quyết định cho Classification',
          duration: '28:55',
          isPreview: false,
          order: 5,
        },
        {
          id: 'lesson-4-6',
          title: 'Random Forest Classification',
          description: 'Random Forest cho Classification',
          duration: '32:15',
          isPreview: false,
          order: 6,
        },
      ],
    },
    {
      id: 'section-5',
      title: 'Clustering',
      description: 'Unsupervised Learning với Clustering',
      order: 5,
      lessons: [
        {
          id: 'lesson-5-1',
          title: 'K-Means Clustering',
          description: 'Thuật toán K-Means',
          duration: '26:40',
          isPreview: false,
          order: 1,
        },
        {
          id: 'lesson-5-2',
          title: 'Hierarchical Clustering',
          description: 'Clustering phân cấp',
          duration: '29:20',
          isPreview: false,
          order: 2,
        },
      ],
    },
    {
      id: 'section-6',
      title: 'Dự án thực tế',
      description: 'Áp dụng kiến thức vào các dự án thực tế',
      order: 6,
      lessons: [
        {
          id: 'lesson-6-1',
          title: 'Dự án 1: Dự đoán giá nhà',
          description: 'Xây dựng mô hình dự đoán giá nhà',
          duration: '45:30',
          isPreview: false,
          order: 1,
        },
        {
          id: 'lesson-6-2',
          title: 'Dự án 2: Phân loại khách hàng',
          description: 'Phân loại khách hàng bằng Machine Learning',
          duration: '52:15',
          isPreview: false,
          order: 2,
        },
        {
          id: 'lesson-6-3',
          title: 'Dự án 3: Hệ thống gợi ý',
          description: 'Xây dựng hệ thống gợi ý sản phẩm',
          duration: '48:20',
          isPreview: false,
          order: 3,
        },
      ],
    },
  ],
  outcomes: [
    'Hiểu rõ các khái niệm cơ bản và nâng cao về Machine Learning',
    'Thành thạo Python và R cho Data Science và Machine Learning',
    'Xây dựng và triển khai các mô hình Machine Learning mạnh mẽ',
    'Xử lý và phân tích dữ liệu phức tạp',
    'Đánh giá và tối ưu hóa hiệu suất mô hình',
    'Áp dụng Machine Learning vào các bài toán thực tế',
  ],
  requirements: [
    'Kiến thức cơ bản về toán học (đại số, xác suất thống kê)',
    'Có máy tính với kết nối internet',
    'Động lực và quyết tâm học tập',
    'Không cần kinh nghiệm lập trình trước đó (sẽ được hướng dẫn từ đầu)',
  ],
  targetAudience: [
    'Người mới bắt đầu muốn học Machine Learning',
    'Data Scientists muốn nâng cao kỹ năng',
    'Developers muốn thêm Machine Learning vào kỹ năng',
    'Sinh viên và nghiên cứu sinh',
    'Doanh nhân muốn hiểu về AI và Machine Learning',
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-03-20T14:30:00Z',
}

// Helper function to create a course detail from base course data
function createCourseDetailFromBase(
  courseId: string,
  title: string,
  instructor: Instructor,
  baseDetail: CourseDetail
): CourseDetail {
  return {
    ...baseDetail,
    id: courseId,
    title: title,
    instructor: instructor,
  }
}

// Create instructors for different courses
const instructors: Record<string, Instructor> = {
  'Nguyễn Văn A': mockInstructor,
  'Trần Thị B': {
    ...mockInstructor,
    id: 'instructor-002',
    fullName: 'Trần Thị B',
    email: 'tranthib@example.com',
    title: 'Senior Full-Stack Developer',
    bio: 'Giảng viên với hơn 8 năm kinh nghiệm phát triển web. Chuyên gia về React, Node.js, và các công nghệ web hiện đại.',
    totalStudents: 35000,
    totalCourses: 12,
  },
  'Lê Văn C': {
    ...mockInstructor,
    id: 'instructor-003',
    fullName: 'Lê Văn C',
    email: 'levanc@example.com',
    title: 'Data Scientist & AI Engineer',
    bio: 'Chuyên gia về Data Science và AI với nhiều năm kinh nghiệm trong ngành. Đã tham gia nhiều dự án AI lớn.',
    totalStudents: 28000,
    totalCourses: 10,
  },
}

// Create a map of course details by courseId
export const courseDetailsMap: Record<string, CourseDetail> = {
  '1': mockCourseDetail,
  '2': createCourseDetailFromBase(
    '2',
    'Complete Web Development Bootcamp 2024',
    instructors['Trần Thị B'],
    {
      ...mockCourseDetail,
      description: `Khóa học Web Development toàn diện nhất năm 2024! Từ HTML, CSS, JavaScript cơ bản đến các framework hiện đại như React, Next.js, Node.js. Bạn sẽ học cách xây dựng các ứng dụng web full-stack từ đầu đến cuối.

Khóa học bao gồm:
- Hơn 65 giờ video bài giảng chất lượng cao
- Hơn 100 bài tập và dự án thực tế
- Xây dựng portfolio với 10+ dự án
- Hỗ trợ từ giảng viên và cộng đồng

Bạn sẽ học được:
- HTML5, CSS3, JavaScript ES6+
- React và Next.js cho frontend
- Node.js và Express cho backend
- MongoDB và SQL databases
- RESTful APIs và GraphQL
- Authentication và Security
- Deployment và DevOps cơ bản`,
      shortDescription: 'Khóa học Web Development toàn diện từ cơ bản đến nâng cao',
      price: 999000,
      rating: 4.9,
      students: 23150,
      category: 'Technology',
      level: 'Beginner',
      duration: '65 giờ',
      thumbnailUrl: '/course 2.png',
      sections: [
        {
          id: 'section-1',
          title: 'HTML & CSS Fundamentals',
          description: 'Học HTML và CSS từ cơ bản',
          order: 1,
          lessons: [
            {
              id: 'lesson-1-1',
              title: 'Giới thiệu HTML',
              duration: '20:00',
              isPreview: true,
              order: 1,
            },
            {
              id: 'lesson-1-2',
              title: 'CSS Basics',
              duration: '25:00',
              isPreview: true,
              order: 2,
            },
          ],
        },
      ],
      outcomes: [
        'Thành thạo HTML, CSS, JavaScript',
        'Xây dựng ứng dụng web với React và Next.js',
        'Phát triển backend với Node.js',
        'Làm việc với databases',
        'Deploy ứng dụng lên production',
      ],
      requirements: [
        'Không cần kinh nghiệm lập trình',
        'Có máy tính với kết nối internet',
        'Động lực và quyết tâm học tập',
      ],
      targetAudience: [
        'Người mới bắt đầu muốn học lập trình web',
        'Developers muốn nâng cao kỹ năng',
        'Sinh viên IT',
      ],
    }
  ),
  '3': createCourseDetailFromBase(
    '3',
    'Data Science và AI cho người mới bắt đầu',
    instructors['Lê Văn C'],
    {
      ...mockCourseDetail,
      description: `Khóa học Data Science và AI dành cho người mới bắt đầu. Bạn sẽ học từ những khái niệm cơ bản nhất đến các kỹ thuật nâng cao trong Data Science và Machine Learning.`,
      shortDescription: 'Khóa học Data Science và AI từ cơ bản cho người mới bắt đầu',
      price: 1499000,
      rating: 4.7,
      students: 12890,
      category: 'AI',
      level: 'Beginner',
      duration: '38 giờ',
      thumbnailUrl: '/course 5.png',
    }
  ),
  // Add more course details as needed
}

// Helper function to get course detail by courseId
export function getCourseDetailById(courseId: string): CourseDetail {
  return courseDetailsMap[courseId] || mockCourseDetail
}
