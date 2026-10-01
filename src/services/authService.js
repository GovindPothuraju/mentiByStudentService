import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.token) {
      localStorage.setItem('mentiby_student_token', res.data.token);
      localStorage.setItem('mentiby_student_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('mentiby_student_token', res.data.token);
      localStorage.setItem('mentiby_student_user', JSON.stringify(res.data.user));
    }
    return res;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('mentiby_student_token');
      localStorage.removeItem('mentiby_student_user');
    }
  },

  async getMe() {
    return await api.get('/auth/me');
  },
};
