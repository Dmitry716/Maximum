export enum CourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  EDITOR = "editor",
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export enum NewsStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export enum BlogPostStatus {
  PUBLISHED = "published",
  DRAFT = "draft",
}

export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export enum ApplicationStatus {
  NEW = "new",
  PROCESSING = "processing",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  PENDING = "pending",
}

export enum FileType {
  COURSE_MATERIAL = "course_material",
  LESSON_ATTACHMENT = "lesson_attachment",
  USER_AVATAR = "user_avatar",
  COURSE_THUMBNAIL = "course_thumbnail",
  CERTIFICATE_TEMPLATE = "certificate_template",
}