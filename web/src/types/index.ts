export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  role_id: number;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
  level: number;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  version: number;
  user_id: number;
  user?: User; // Make user optional
  comments: Comment[];
}

export interface PostWithMetadata extends Post {
  comments_count?: number; // Make optional
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  post_id: number;
  user_id: number;
  user?: User; // Make user optional
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UserWithToken {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  role_id: number;
  role: Role;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
}

export interface FeedParams {
  since?: string;
  until?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  tags?: string;
  search?: string;
}