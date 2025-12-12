const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Blog API
export const blogAPI = {
  getAll: () => apiCall('/blogs'),
  getFeatured: () => apiCall('/blogs/featured'),
  getLatest: (count = 4) => apiCall(`/blogs/latest/${count}`),
  getBySlug: (slug) => apiCall(`/blogs/${slug}`),
  create: (blogData) => apiCall('/blogs', {
    method: 'POST',
    body: JSON.stringify(blogData),
  }),
  update: (slug, blogData) => apiCall(`/blogs/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(blogData),
  }),
  delete: (id) => apiCall(`/blogs/${id}`, {
    method: 'DELETE',
  }),
};

// Auth API
export const authAPI = {
  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  getMe: () => apiCall('/auth/me'),
  setup: () => apiCall('/auth/setup', { method: 'POST' }),
};

export default apiCall;
