import { api } from "@/lib/auth";
import { Blog, Categories, Category, Course, CourseQueryParams, CreateApplication, CreateGroup, CreateUserAndBindGroup, FileRes, Group, NewsItem, PaginatedCourses, UpdateApplication, UpdateBlog, UpdateCourse, User } from "@/types/type";
import { SeoData, GetSeoResponse } from "@/types/seo"; 

export const backendUrl = process.env.NEXT_PUBLIC_API_URL

export async function login(values: any) {
  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify(values),
  } as any);
  return res.json();
}

export async function getStats(userId?: string) {
  const params: any = {};
  if (userId != null) {
    params.userId = userId;
  }

  const { data } = await api.get(`/api/statistics/dashboard`, { params })
  return data
}

export async function getAdminNotification() {
  const { data } = await api.get('/api/notif/admin')
  return data
}

export async function getNotification(id: string) {
  const { data } = await api.get('/api/notif/' + id)
  return data
}

export async function readAllNotification(ids: string[], id: string) {
  const { data } = await api.patch(`/api/notif/read-all?id=${id}`, { ids })
  return data as any
}

export async function readAllAdminNotification(ids: string[]) {
  const { data } = await api.patch('/api/notif/admin/read-all', { ids })
  return data as any
}

export async function getCategories() {
  const { data } = await api.get('/api/categories')
  return data as Categories[]
}

export async function getCategoriesAdmin() {
  const { data } = await api.get('/api/categories/admin')
  return data as Categories[]
}

export async function getUsers(role?: string) {
  const query = role ? `?role=${role}` : '';
  const { data } = await api.get(`/api/users${query}`);
  return data as User[];
}

export async function updateUser(user: any) {
  const filteredUserData = Object.fromEntries(
    Object.entries({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      biography: user.biography,
      birthDate: user.birthDate,
      location: user.location,
      occupation: user.occupation,
      education: user.education,
      website: user.website,
    }).filter(([_, value]) => value !== null && value !== undefined && value !== "")
  );

  const { data } = await api.patch(`/api/users/${user.id}`, filteredUserData);
  return data as User;
}

export async function createUser(user: any) {
  const filteredUserData = Object.fromEntries(
    Object.entries({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      biography: user.biography,
      birthDate: user.birthDate,
      location: user.location,
      occupation: user.occupation,
      education: user.education,
      website: user.website,
    }).filter(([_, value]) => value !== null && value !== undefined && value !== "")
  );
  const { data } = await api.post('/api/users', filteredUserData);
  return data as User;
}

export async function deleteUser(userId: string) {
  const { data } = await api.delete(`/api/users/${userId}`);
  return data as User;
}

export async function createCategory(name: string, status?: boolean, url?: string) {
  const { data } = await api.post('/api/categories', { name, status, url });
  return data as Category;
}

export async function updateCategory(category: Category) {
  const { data } = await api.patch(`/api/categories/${category.id}`,
    { name: category.name, status: category.status, url: category.url }
  );
  return data as Category;
}

export async function deleteCategory(categoryId: string) {
  const res = api.delete(`/api/categories/${categoryId}`);
  return (await res).status;
}

export async function getAllCourses(all: string): Promise<Course[]> {
  const { data } = await api.get('/api/courses/all')
  return data;
}

export async function getAllCoursesPublic(
  filters: CourseQueryParams = {}
): Promise<PaginatedCourses> {
  const params: Record<string, any> = {};

  if (filters.categories && filters.categories.length > 0) {
    params.categories = filters.categories.join(',');
  }

  if (filters.minPrice !== undefined) {
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice !== undefined) {
    params.maxPrice = filters.maxPrice;
  }

  if (filters.level) {
    params.level = filters.level;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  params.limit = filters.limit ?? 10;
  params.page = filters.page ?? 1;

  const { data } = await api.get<PaginatedCourses>('/api/courses', {
    params,
  });

  return data;
}

export async function getCourseByName(name: string) {
  const { data } = await api.get(`/api/courses/name/${name}`);
  return data as Course;
}

export async function getBlogByUrl(url: string) {
  const { data } = await api.get(`/api/blog/url/${url}`);
  return data as Blog;
}

export async function getNewsByUrl(url: string) {
  const { data } = await api.get(`/api/news/url/${url}`);
  return data as NewsItem;
}

export async function getAllCoursesByInstructor(instructorId: string) {
  const { data } = await api.get(`/api/courses/instructor/${instructorId}`);
  return data as Course[];
}

export async function deleteCourse(courseId: string) {
  const res = api.delete(`/api/courses/${courseId}`);
  return (await res).status;
}

export async function createCourse(course: UpdateCourse) {
  const { data } = await api.post('/api/courses', course);
  return data as Course;
}

export async function updateCourse({ id, data: course }: { id: string, data: UpdateCourse }) {  
  const { data } = await api.patch(`/api/courses/${id}`, course);
  return data as Course;
}

export async function uploadFile(file: FormData) {
  const { data } = await api.post('/api/files/upload', file);
  return data as FileRes;
}

export async function getNews(
  currentPage: number,
  limit: number,
  status: string,
  categoryName?: string,
  excludeBlogId?: number
) {
  const params = new URLSearchParams({
    page: String(currentPage),
    limit: String(limit),
    status,
  });

  if (categoryName) {
    params.append("categoryName", categoryName);
  }

  if (excludeBlogId !== undefined) {
    params.append("excludeBlogId", String(excludeBlogId));
  }

  const { data } = await api.get(`/api/news?${params.toString()}`);
  return data as {
    items: NewsItem[],
    total: number
  };
}

export async function getNewsById(id: string) {
  const { data } = await api.get(`/api/news/${id}`);
  return data as Blog;
}

export async function updateNews(id: string, data: any) {
  const { data: res } = await api.patch(`/api/news/${id}`, data);
  return res as any;
}

export async function createNews(data: any) {
  const { data: res } = await api.post('/api/news', data);
  return res as any;
}

export async function deleteNews(id: string) {
  const { data } = await api.delete(`/api/news/${id}`);
  return data as any;
}

export async function getBlogs(
  currentPage: number,
  limit: number,
  status: string,
  categoryName?: string,
  excludeBlogId?: number
) {
  const params = new URLSearchParams({
    page: String(currentPage),
    limit: String(limit),
    status,
  });

  if (categoryName) {
    params.append("categoryName", categoryName);
  }

  if (excludeBlogId !== undefined) {
    params.append("excludeBlogId", String(excludeBlogId));
  }

  const { data } = await api.get(`/api/blog?${params.toString()}`);
  return data as {
    items: Blog[],
    total: number
  };
}

export async function getBlogById(id: string) {
  const { data } = await api.get(`/api/blog/${id}`);
  return data as Blog;
}

export async function getBlogsByTeacher(id: string, currentPage: number, limit: number, status: string) {
  const { data } = await api.get(`/api/blog/teacher/${id}?page=${currentPage}&limit=${limit}&status=${status}`);
  return data as Course[];
}

export async function updateBlog({ id, data: blog }: { id: string, data: UpdateBlog }) {
  const { data } = await api.patch(`/api/blog/${id}`, blog);
  return data as Blog;
}

export async function createBlog(blog: UpdateBlog) {
  const { data } = await api.post('/api/blog', blog);
  return data as Blog;
}

export async function deleteBlog(blogId: string) {
  const res = api.delete(`/api/blog/${blogId}`);
  return (await res).status;
}

export async function createGroup(group: CreateGroup) {
  const { data } = await api.post('/api/groups', {
    courseId: group.courseId,
    groupNumber: group.groupNumber,
    ageRange: group.ageRange,
    maxStudents: group.maxStudents,
    schedule: group.schedule
  });
  return data as Group;
}

export async function updateGroup(group:Group) {
  const { data } = await api.patch(`/api/groups/${group.id}`, {
    courseId: group.courseId,
    groupNumber: group.groupNumber,
    ageRange: group.ageRange,
    maxStudents: group.maxStudents,
    schedule: group.schedule
  });
  return data as Group;
}

export async function deleteGroup(groupId: string) {
  const res = api.delete(`/api/groups/${groupId}`);
  return (await res).status;
}

export async function createApplication(data: CreateApplication) {
  const { data: res } = await api.post('/api/applications', data);
  return res as any;
}

export async function createUserAndBindGroup(data: CreateUserAndBindGroup) {
  const { data: res } = await api.post('/api/applications/user-course-group', data);
  return res as any;
}

export async function getApplications(currentPage: number, limit: number) {
  const { data } = await api.get(`/api/applications?page=${currentPage}&limit=${limit}`);
  return data as any;
}

export async function updateApplication({ data }: { data: UpdateApplication }) {
  
  const { data: res } = await api.patch(`/api/applications/${data.id}`, {
    childName: data.childName,
    parentPhone: data.parentPhone,
    status: data.status,
    photo: data.photo,
    age: data.age,
    groupId: data.groupId,
    courseId: data.courseId,
    parentEmail: data.parentEmail,
    message: data.message,
    responseMessage: data.responseMessage
  });
  return res as any;
}

export async function getAllAges() {
  const { data } = await api.get('/api/groups/age-ranges');
  return data as string[];
}

export async function deleteApplication(appId: string) {
  const res = api.delete(`/api/applications/${appId}`);
  return (await res).status;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/api/users/${id}`);
  return data as User;
}

export async function updateUserProfile(user: User, id: string) {
  const { data } = await api.patch(`/api/users/${id}`, user);
  return data as User;
}

export async function updatePassword(id: string, password: string, oldPassword: string) {
  const { data } = await api.patch(`/api/users/${id}`, { password, oldPassword });
  return data as User;
}

export async function updateUserSatus(id: string, status: string) {
  const { data } = await api.patch(`/api/users/${id}`, { status });
  return data as User;
} 

export async function getAllNewsPublic(
  filters: { limit?: number; page?: number; status?: string } = {}
): Promise<{ items: NewsItem[]; total: number }> {
  const params = new URLSearchParams({
    limit: String(filters.limit ?? 1000),
    page: String(filters.page ?? 1),
    status: filters.status ?? 'PUBLISHED'
  });

  const { data } = await api.get(`/api/news?${params.toString()}`);
  return data as { items: NewsItem[]; total: number };
}

export async function getAllBlogsPublic(
  filters: { limit?: number; page?: number; status?: string } = {}
): Promise<{ items: Blog[]; total: number }> {
  const params = new URLSearchParams({
    limit: String(filters.limit ?? 1000),
    page: String(filters.page ?? 1),
    status: filters.status ?? 'PUBLISHED'
  });

  const { data } = await api.get(`/api/blog?${params.toString()}`);
  return data as { items: Blog[]; total: number };
}

// export async function getSeoByPageName(pageName: string): Promise<SeoData | null> {
//   try {
//     const response = await api.get<GetSeoResponse>(`/api/seo/${pageName}`);
//     return response.data.data;
//   } catch (error) {
//     console.error(`Error fetching SEO data for page: ${pageName}`, error);
//     return null;
//   }
// }

// export async function updateSeo(seoData: SeoData): Promise<SeoData> {
//   const response = await api.put<SeoData>(`/api/seo/${seoData.pageName}`, seoData);
//   return response.data;
// }

// GET /api/blog/seo/:pageName -> возвращает BlogPost или null
export async function getSeoByPageName(pageName: string): Promise<Blog | null> { // Измените тип возвращаемого значения на Blog | null
  try {
    const response = await api.get<Blog | null>(`/api/blog/seo/${pageName}`); // Изменили путь
    return response.data; // API возвращает null, если не найдено
  } catch (error: any) {
    // Обрабатываем 404 как отсутствие данных, а не как ошибку
    if (error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching SEO data for page: ${pageName}`, error);
    // В зависимости от логики, можно бросить ошибку или вернуть null
    // throw error; // Если хотите пробросить ошибку дальше
    return null; // Если хотите считать любую ошибку отсутствием данных
  }
}

// PUT /api/blog/seo/:pageName -> принимает частичные данные BlogPost
export async function updateSeo(pageName: string, seoData: Partial<Blog>): Promise<Blog> { // Измените тип возвращаемого значения на Blog
  const response = await api.put<Blog>(`/api/blog/seo/${pageName}`, seoData); // Изменили путь
  return response.data;
}