import type { UserRegisterRequest } from '../utils/interfaces/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = await res.text();
    try {
      const json = JSON.parse(message);
      message = json.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (data: UserRegisterRequest) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { username: string; password: string }) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(data) }),
  loginWithShaadiCode: (code: string) =>
    request('/users/login-shaadi', { method: 'POST', body: JSON.stringify({ code }) }),
  getProfile: (id: string) => request(`/users/${id}`),
  getProfileMe: () => request('/users/me'),
  checkUsername: (username: string) =>
    request(`/users/check-username?username=${encodeURIComponent(username)}`),
  checkEmail: (email: string) =>
    request(`/users/check-email?email=${encodeURIComponent(email)}`),

  // Posts (now require shaadiId)
  getPosts: (shaadiId: string, page = 1, limit = 10) => 
    request(`/posts?shaadiId=${encodeURIComponent(shaadiId)}&page=${page}&limit=${limit}`),
  getPost: (id: string, shaadiId: string) => 
    request(`/posts/${id}?shaadiId=${encodeURIComponent(shaadiId)}`),
  createPost: (data: { shaadiId: string; mediaUrls: string[]; mediaTypes: string[]; caption?: string; tags?: string[] }) =>
    request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: string, shaadiId: string, data: { caption?: string }) =>
    request(`/posts/${id}`, { method: 'PATCH', body: JSON.stringify({ ...data, shaadiId }) }),
  deletePost: (id: string, shaadiId: string) => 
    request(`/posts/${id}`, { method: 'DELETE', body: JSON.stringify({ shaadiId }) }),
  likePost: (id: string, shaadiId: string) => 
    request(`/posts/${id}/like`, { method: 'POST', body: JSON.stringify({ shaadiId }) }),

  // Comments (now require shaadiId)
  getComments: (postId: string, shaadiId: string) => 
    request(`/comments/post/${postId}?shaadiId=${encodeURIComponent(shaadiId)}`),
  addComment: (postId: string, shaadiId: string, text: string) =>
    request(`/comments/post/${postId}`, { method: 'POST', body: JSON.stringify({ shaadiId, text }) }),
  deleteComment: (id: string) => request(`/comments/${id}`, { method: 'DELETE' }),

  // Profile Image Upload
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/users/upload-profile-image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      let message = await res.text();
      try {
        const json = JSON.parse(message);
        message = json.message || message;
      } catch {}
      throw new Error(message);
    }
    return res.json();
  },

  // Shaadi
  createShaadi: async (data: any) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Add all non-file fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append('image', value); // Use 'image' as the field name for the file
        } else if (key === 'date') {
          // Ensure date is in ISO format
          formData.append(key, new Date(String(value)).toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const res = await fetch(`${API_URL}/shaadi`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!res.ok) {
      let message = await res.text();
      try {
        const json = JSON.parse(message);
        message = json.message || message;
      } catch {}
      throw new Error(message);
    }
    return res.json();
  },

  sendShaadiInvite: async (data: any) => {
    const res = await fetch(`${API_URL}/shaadi/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      let message = await res.text();
      try {
        const json = JSON.parse(message);
        message = json.message || message;
      } catch {}
      throw new Error(message);
    }
    return res.json();
  },

  joinShaadi: async (data: { code: string; name: string; side: string; relationship: string; contactNumber?: string; showContact: boolean }) => {
    return request('/users/join-shaadi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  checkShaadiMembership: async (code: string) => {
    return request('/shaadi/check-membership', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // Guest Management APIs
  getInvites: async (shaadiId: string) => {
    return request(`/shaadi/${shaadiId}/invites`);
  },

  getGuestStats: async (shaadiId: string) => {
    return request(`/shaadi/${shaadiId}/guest-stats`);
  },

  getShaadiMembers: async (shaadiId: string) => {
    return request(`/shaadi/${shaadiId}/members`);
  },

  createInvite: async (shaadiId: string, inviteData: any) => {
    return request(`/shaadi/${shaadiId}/invites`, {
      method: 'POST',
      body: JSON.stringify(inviteData),
    });
  },

  deleteInvite: async (inviteId: string) => {
    return request(`/shaadi/invites/${inviteId}`, {
      method: 'DELETE',
    });
  },

  resendInvite: async (inviteId: string) => {
    return request(`/shaadi/invites/${inviteId}/resend`, {
      method: 'POST',
    });
  },

  updateInviteNotes: async (inviteId: string, notes: string) => {
    return request(`/shaadi/invites/${inviteId}`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  },

  trackInviteOpen: async (code: string) => {
    return request('/shaadi/track/open', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  trackInviteClick: async (code: string) => {
    return request('/shaadi/track/click', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  // Shaadi Management
  getUserShaadis: () => request('/shaadi/user'),
  switchShaadi: (code: string) => 
    request('/shaadi/switch', { method: 'POST', body: JSON.stringify({ code }) }),
  blockMember: (shaadiId: string, memberUserId: string) =>
    request('/shaadi/block-member', { method: 'PATCH', body: JSON.stringify({ shaadiId, memberUserId }) }),
  unblockMember: (shaadiId: string, memberUserId: string) =>
    request('/shaadi/unblock-member', { method: 'PATCH', body: JSON.stringify({ shaadiId, memberUserId }) }),
  deleteShaadi: (shaadiId: string, reason?: string) =>
    request(`/shaadi/${shaadiId}`, { method: 'DELETE', body: JSON.stringify({ reason }) }),
}; 