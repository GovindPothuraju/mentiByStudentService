import api from './api';

export const dashboardService = {
  async getDashboard() {
    return await api.get('/student/dashboard');
  },
};

export const topicService = {
  async getTopic(courseSlug, topicSlug, tab = 'content') {
    return await api.get(`/student/courses/${courseSlug}/topics/${topicSlug}`, {
      params: { tab },
    });
  },

  async startTopic(topicId) {
    return await api.post(`/student/topics/${topicId}/start`);
  },

  async completeTopic(topicId) {
    return await api.post(`/student/topics/${topicId}/complete`);
  },
};

export const roadmapService = {
  async generateRoadmap(data) {
    return await api.post('/student/roadmaps', data);
  },

  async getRoadmaps() {
    return await api.get('/student/roadmaps');
  },

  async getRoadmapByCourse(courseSlug) {
    return await api.get(`/student/roadmaps/${courseSlug}`);
  },

  async getTodayPlan(courseSlug) {
    return await api.get(`/student/roadmaps/${courseSlug}/today`);
  },

  async rescheduleRoadmap(roadmapId) {
    return await api.post(`/student/roadmaps/${roadmapId}/reschedule`);
  },

  async patchRoadmap(roadmapId, data) {
    return await api.patch(`/student/roadmaps/${roadmapId}`, data);
  },

  async regenerateRoadmap(roadmapId, data) {
    return await api.post(`/student/roadmaps/${roadmapId}/regenerate`, data);
  },
};
