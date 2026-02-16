import React, { useState } from 'react';
import { generateTraining } from '../services/api';

export default function InputForm({ onGenerate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    companyName: '',
    companyContext: '',
    audience: 'Executive/C-Suite/Senior Leadership',
    format: 'Training',
    duration: '1 Day (6-7 hours)',
    deliveryMode: 'In-Person',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await generateTraining(formData);
      onGenerate(result);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      padding: '35px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>🎓 What's Your Training Topic?</label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Strategic Planning, Medical Diagnosis, Python Programming..."
            required
          />
        </div>

        <div>
          <label>🏢 Company Name (Optional)</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g., Tata Steel, Apollo Hospitals, Infosys"
          />
        </div>

        <div>
          <label>📋 Company Context (Optional)</label>
          <textarea
            value={formData.companyContext}
            onChange={(e) => setFormData({ ...formData, companyContext: e.target.value })}
            placeholder="e.g., Manufacturing, 500 employees, digital transformation..."
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 50px',
            fontSize: '1.25em',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            marginTop: '20px',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ GENERATING...' : '🚀 GENERATE TRAINING PROGRAM'}
        </button>
      </form>
    </div>
  );
}
