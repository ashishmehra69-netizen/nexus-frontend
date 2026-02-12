import axios from 'axios';

const API_BASE_URL = 'https://ashishmehra-nexus-backend.hf.space';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function generateTraining(formData) {
  const response = await fetch('https://ashishmehra-nexus-backend.hf.space/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: formData.topic,
      companyName: formData.companyName,
      companyContext: formData.companyContext,
      audienceLevel: formData.audience,
      format: formData.format,
      duration: formData.duration,
      deliveryMode: formData.deliveryMode,
    }),
  });

  if (!response.ok) {
    throw new Error('Generation failed');
  }

  const data = await response.json();
  
  // ✅ CRITICAL FIX: Force isLocked to true
  console.log('🔍 Backend Response:', data);
  console.log('🔍 Backend isLocked:', data.isLocked);
  
  return {
    ...data,
    isLocked: true,  // ← FORCE TO TRUE - new generations are always locked
  };
}

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
