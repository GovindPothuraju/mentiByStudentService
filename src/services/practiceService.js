import api from './api';

export const practiceService = {
  async getPracticeCatalog(params = {}) {
    return await api.get('/student/practice', { params });
  },

  async getTopicPractice(topicId) {
    return await api.get(`/student/topics/${topicId}/practice`);
  },

  async getQuestion(topicId, questionId) {
    return await api.get(`/student/topics/${topicId}/practice/${questionId}`);
  },

  async submitCode(problemId, data) {
    return await api.post(`/student/practice/${problemId}/submit`, data);
  },
};
