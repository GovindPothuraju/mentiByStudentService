import api from './api';

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
