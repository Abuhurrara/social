import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  Post, 
  PostWithMetadata, 
  User, 
  UserWithToken,
  CreatePostPayload, 
  UpdatePostPayload,
  FeedParams 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/authentication/token', credentials);
    // The API returns just a token string wrapped in data
    const token = response.data.data;
    
    // For now, return a mock user - in a real app you'd decode the JWT
    // or make another API call to get user info
    const mockUser: User = {
      id: 1,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      created_at: new Date().toISOString(),
      is_active: true,
      role_id: 1,
      role: {
        id: 1,
        name: 'user',
        level: 1,
        description: 'Regular user'
      }
    };
    
    return {
      token,
      user: mockUser
    };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/authentication/user', credentials);
    // The API returns UserWithToken format wrapped in data
    const userWithToken: UserWithToken = response.data.data;
    
    return {
      token: userWithToken.token,
      user: {
        id: userWithToken.id,
        name: userWithToken.name,
        email: userWithToken.email,
        created_at: userWithToken.created_at,
        is_active: userWithToken.is_active,
        role_id: userWithToken.role_id,
        role: userWithToken.role
      }
    };
  },
};

export const postsAPI = {
  create: async (postData: CreatePostPayload): Promise<Post> => {
    const response = await api.post('/posts', postData);
    const post = response.data.data || response.data;
    
    // If user data is missing or empty, populate with current user
    if (!post.user || !post.user.name) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id) {
        post.user = currentUser;
      }
    }
    
    return post;
  },

  getById: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    const post = response.data.data || response.data;
    
    // If user data is missing or empty, populate with fallback
    if (!post.user || !post.user.name) {
      // Try to get current user, or use a fallback
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id && currentUser.id === post.user_id) {
        post.user = currentUser;
      } else {
        // Fallback for posts by other users
        post.user = {
          id: post.user_id,
          name: `User ${post.user_id}`,
          email: '',
          created_at: '',
          is_active: true,
          role_id: 0,
          role: { id: 0, name: 'user', level: 1, description: 'User' }
        };
      }
    }
    
    return post;
  },

  update: async (id: number, postData: UpdatePostPayload): Promise<Post> => {
    const response = await api.patch(`/posts/${id}`, postData);
    const post = response.data.data || response.data;
    
    // If user data is missing or empty, populate with current user
    if (!post.user || !post.user.name) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id) {
        post.user = currentUser;
      }
    }
    
    return post;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  addComment: async (postId: number, content: string): Promise<void> => {
    await api.post(`/posts/${postId}/comments`, { content });
  },
};

export const usersAPI = {
  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data || response.data;
  },

  follow: async (userId: number): Promise<void> => {
    await api.put(`/users/${userId}/follow`);
  },

  unfollow: async (userId: number): Promise<void> => {
    await api.put(`/users/${userId}/unfollow`);
  },

  getFeed: async (params?: FeedParams): Promise<PostWithMetadata[]> => {
    const response = await api.get('/users/feed', { params });
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : []; // Ensure we always return an array
  },
};

export const healthAPI = {
  check: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data.data || response.data;
  },
};

export default api;