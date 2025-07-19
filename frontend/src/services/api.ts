const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string }) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { username: string; password: string }) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: (id: string) => request(`/users/${id}`),
  getProfileMe: () => request('/users/me'),

  // Posts
  getPosts: (page = 1, limit = 10) => request(`/posts?page=${page}&limit=${limit}`),
  getPost: (id: string) => request(`/posts/${id}`),
  createPost: (data: { mediaUrl: string; mediaType: string; caption?: string }) =>
    request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: string, data: { caption?: string }) =>
    request(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePost: (id: string) => request(`/posts/${id}`, { method: 'DELETE' }),
  likePost: (id: string) => request(`/posts/${id}/like`, { method: 'POST' }),

  // Comments
  getComments: (postId: string) => request(`/comments/post/${postId}`),
  addComment: (postId: string, text: string) =>
    request(`/comments/post/${postId}`, { method: 'POST', body: JSON.stringify({ text }) }),
  deleteComment: (id: string) => request(`/comments/${id}`, { method: 'DELETE' }),
}; 