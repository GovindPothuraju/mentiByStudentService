import api from './api';

export const notificationService = {
  async getNotifications() {
    return await api.get('/student/notifications');
  },

  async markRead(id) {
    return await api.patch(`/student/notifications/${id}/read`);
  },

  async markAllRead() {
    return await api.patch('/student/notifications/read-all');
  },
};
