import api from './api';

export const interviewService = {
  async getInterviewQuestions(topicId) {
    return await api.get(`/student/topics/${topicId}/interview`);
  },

  async updateInterviewProgress(questionId, data) {
    return await api.post(`/student/interview/${questionId}/progress`, data);
  },
};
