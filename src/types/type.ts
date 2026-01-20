import {
  ApplicationStatus,
  BlogPostStatus,
  CourseLevel,
  CourseStatus,
  NewsStatus,
  UserRole,
  UserStatus,
} from "./enum";

export interface Categories {
  id: string;
  name: string;
  url: string;
  isActive: string;
  coursesCount: number;
}

export enum NotificationType {
  COURSE_ENROLLMENT = "course_enrollment",
  COURSE_COMPLETION = "course_completion",
  NEW_COURSE = "new_course",
  NEW_LESSON = "new_lesson",
  NEW_TECHER = "new_teacher",
  APPLICATION_STATUS = "application_status",
  SYSTEM_ANNOUNCEMENT = "system_announcement",
  FORUM_REPLY = "forum_reply",
  QUIZ_RESULT = "quiz_result",
}

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  averageCompletionRate: number;
  monthlyCompletionAndEnrollment: MonthlyCompletionAndEnrollment[];
  courseEnrollmentStats: CourseEnrollmentStats[];
}

export interface MonthlyCompletionAndEnrollment {
  name: string;
  enrollments: number;
  completions: number;
}

export interface CourseEnrollmentStats {
  color: string;
  name: string;
  value: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status?: UserStatus;
  birthDate?: string;
  occupation?: string;
  education?: string;
  website?: string;
  biography?: string;
  location?: string;
  registrationDate: string;
}

export type UserWithLoading = User & { isLoading?: boolean };

export interface Category {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  coursesCount?: number;
  studentCount?: number;
  description?: string;
  shortDescription?: string;
  image?: string;
  color?: string;
}

export type Course = {
  id: string;
  name: string;
  description: string;
  url: string;
  detailedDescription: string;
  price: number;
  duration: string;
  status: CourseStatus;
  categoryId: number;
  heading: string;
  instructorId: number;
  createdAt: string;
  updatedAt: string;
  metaDescription?: string | null;
  metaTitle?: string | null;
  keywords?: string | null;
  level?: CourseLevel | null;
  images: Images[];
  color?: string | null;
  category?: Category | string;
  studentCount?: number;
  groups?: Group[];
  instructor?: User;
  isLoading?: boolean;
  isShow?: boolean;
};

export type Images = {
  id?: number;
  url: string;
  videoUrl?: string;
};

export interface PaginatedCourses {
  items: Course[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseQueryParams {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  level?: string;
  search?: string | null;
  limit?: number;
  page?: number;
}

export type Group = {
  id: number;
  groupNumber: string;
  ageRange: string;
  maxStudents: number;
  currentStudents: number;
  courseId: number;
  createdAt: string;
  updatedAt: string;
  schedule: Schedule[];
};

export type CreateGroup = {
  groupNumber: string;
  ageRange: string;
  maxStudents: number;
  courseId: number;
  schedule: Schedule[];
};

type Schedule = {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  groupId: number;
};

export type UpdateCourse = {
  name: string;
  description: string;
  price: number;
  duration: string;
  status: CourseStatus;
  url: string;
  categoryId: number;
  instructorId: number;
  heading: string;
  detailedDescription?: string | null;
  level?: string | null;
  images?: Images[];
  color?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  isShow?: boolean;
};

export type FileRes = {
  originalName: string;
  path: string;
  mimeType: string;
  size: number;
  fileType: string;
  entityType: string;
  uploadedById: number;
};

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  author?: {
    id: number;
    name: string;
    avatar?: string;
  };
  date: Date;
  url: string;
  image?: string;
  category?: string;
  status: NewsStatus;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
}

export interface NewsListResponse {
  data: NewsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  image?: string;
  category?: string;
  status: NewsStatus;
  authorId?: number;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  author: User;
  authorId: number;
  date: Date;
  images: string[];
  category: string;
  status: BlogPostStatus;
  tags: string[];
  url: string;
  createdAt: Date;
  updatedAt: Date;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
}

export interface UpdateBlog {
  title: string;
  content: string;
  images: string[];
  category: string;
  url: string;
  status: BlogPostStatus;
  tags: string[];
  authorId: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
}

export interface CreateApplication {
  childName: string;
  parentPhone: string;
  status: ApplicationStatus;
  groupId?: number;
  photo?: string;
  age?: number;
  courseId?: number;
  parentEmail?: string;
  message?: string;
}

export interface CreateUserAndBindGroup {
  childName: string;
  parentPhone: string;
  groupId: number;
  parentEmail: string;
}

export type UpdateApplication = CreateApplication & {
  id: number;
  responseMessage?: string;
};

export type Application = CreateApplication & {
  id: number;
  responseMessage?: string;
};

export type ApplicationWithLoading = Application & { isLoading?: boolean };

export interface SeoSetting {
  id: number;
  pageName: string; // 'home', 'courses', 'blog', 'news', 'about', 'contact'
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  ogImage?: string | null; // URL изображения
  createdAt: string; // ISO строка даты
  updatedAt: string; // ISO строка даты
}
