import api from './api';

export const courseService = {
  async getCourses(params = {}) {
    return await api.get('/student/courses', { params });
  },

  async getCourseBySlug(courseSlug) {
    return await api.get(`/student/courses/${courseSlug}`);
  },

  async enrollCourse(courseId) {
    return await api.post(`/student/courses/${courseId}/enroll`);
  },

  async getCourseCategories(courseSlug) {
    return await api.get(`/student/courses/${courseSlug}/categories`);
  },
};
