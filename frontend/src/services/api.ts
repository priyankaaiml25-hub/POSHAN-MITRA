const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('poshan_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('poshan_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('poshan_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: { email: string; password: string }) =>
    request<{ success: boolean; data: { token: string; user: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDemoAccounts: () =>
    request<{ success: boolean; data: any[] }>('/auth/demo-accounts'),
  getCurrentUser: () =>
    request<{ success: boolean; data: any }>('/auth/me'),

  // Children
  listChildren: (params?: { search?: string; reviewOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.reviewOnly) query.append('reviewOnly', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: any[] }>(`/children${qs}`);
  },
  getChildById: (id: string) =>
    request<{ success: boolean; data: any }>(`/children/${id}`),
  createChild: (data: { referenceId: string; dateOfBirth: string; gender: string; guardianName?: string; guardianPhone?: string }) =>
    request<{ success: boolean; data: any }>('/children', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Growth Measurements
  addMeasurement: (data: { childId: string; measurementDate: string; weightKg: number; heightCm: number; reviewNotes?: string }) =>
    request<{ success: boolean; data: { measurement: any; interpretation: any } }>('/growth/measurements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMeasurementsForChild: (childId: string) =>
    request<{ success: boolean; data: { child: any; measurements: any[] } }>(`/growth/child/${childId}`),

  // Tasks
  listTasks: (params?: { status?: string; priority?: string; category?: string; childId?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.category) query.append('category', params.category);
    if (params?.childId) query.append('childId', params.childId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: any[] }>(`/tasks${qs}`);
  },
  createTask: (data: any) =>
    request<{ success: boolean; data: any }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id: string, data: { status?: string; priority?: string; completionNotes?: string }) =>
    request<{ success: boolean; data: any }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTask: (id: string) =>
    request<{ success: boolean; message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Lessons
  listLessons: (category?: string) => {
    const qs = category ? `?category=${category}` : '';
    return request<{ success: boolean; count: number; data: any[] }>(`/lessons${qs}`);
  },
  getLessonBySlug: (slug: string) =>
    request<{ success: boolean; data: any }>(`/lessons/${slug}`),

  // Foods
  listFoods: (params?: { category?: string; search?: string; localOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.localOnly) query.append('localOnly', 'true');
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: any[] }>(`/foods${qs}`);
  },
  getFoodById: (id: string) =>
    request<{ success: boolean; data: any }>(`/foods/${id}`),

  // Meal Planner
  generateMealPlan: (data: {
    budgetInr: number;
    dietaryType: string;
    familyMembers: number;
    mealType: string;
    preferredGrain?: string;
  }) =>
    request<{ success: boolean; data: any }>('/meal-planner/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Reports
  getCommunityImpactReport: () =>
    request<{ success: boolean; data: any }>('/reports/impact'),
  getExportCsvUrl: () => `${API_BASE}/reports/export-csv`,
};

