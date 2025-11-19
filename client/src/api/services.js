import api from './axios';

// --- COMPONENT SERVICES ---
export const componentService = {
  getAll: async () => {
    const response = await api.get('/components');
    return response.data;
  },
  create: async (componentData) => {
    const response = await api.post('/components', componentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/components/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/components/${id}`, data);
    return response.data;
  }
};

// --- USER SERVICES ---
export const userService = {
  getAllStudents: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  addStudent: async (studentData) => {
    const response = await api.post('/users', studentData);
    return response.data;
  },
  deleteStudent: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// --- TRANSACTION SERVICES ---
export const issueService = {
  issueComponent: async (data) => {
    const response = await api.post('/issue', data);
    return response.data;
  },
  getAllIssues: async () => {
    const response = await api.get('/issue');
    return response.data;
  },
  returnComponent: async (issueId) => {
    const response = await api.put(`/issue/${issueId}/return`);
    return response.data;
  },
  getMyIssues: async () => {
    const response = await api.get('/issue/student/me');
    return response.data;
  }
};