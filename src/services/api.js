import axios from 'axios';

const API_BASE_URL = 'https://ashishmehra-nexus-backend.hf.space';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateTraining = async (data) => {
  const response = await api.post('/generate', data);
  return response.data;
};

export const researchCompany = async (companyName) => {
  const response = await api.post('/research/company', { companyName });
  return response.data;
};

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getFeedbackStats = async () => {
  const response = await api.get('/feedback/stats');
  return response.data;
};

export default api;
