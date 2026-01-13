const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
};

export const auth = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    const data = await response.json();
    setToken(data.token);
    return data;
  },
  logout: () => {
    removeToken();
  },
  verify: async () => {
    const token = getToken();
    if (!token) throw new Error('No token');
    const response = await fetch(`${API_URL}/admin/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      removeToken();
      throw new Error('Token invalid');
    }
    return response.json();
  },
};

export const api = {
  async get(endpoint: string) {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error(`Failed to post ${endpoint}`);
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error(`Failed to put ${endpoint}`);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const token = getToken();
    const response = await fetch(`${API_URL}/admin${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      throw new Error(`Failed to delete ${endpoint}`);
    }
    return response.json();
  },
};

