import api from './api';

export const quizService = {
  async getQuiz(topicId) {
    return await api.get(`/student/topics/${topicId}/quiz`);
  },

  async submitQuizAttempt(topicId, data) {
    return await api.post(`/student/topics/${topicId}/quiz/attempt`, data);
  },

  async getQuizResults(topicId) {
    return await api.get(`/student/topics/${topicId}/quiz/results`);
  },
};
