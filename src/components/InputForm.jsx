import React, { useState } from 'react';

export default function InputForm({ onGenerate, isGenerating }) {
  const [formData, setFormData] = useState({
    topic: '',
    companyName: '',
    companyContext: '',
    audience: 'Executive/C-Suite/Senior Leadership',
    format: 'Training',
    duration: '1 Day (6-7 hours)',
    deliveryMode: 'In-Person',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div style={{
      background: 'rgba(0,0,0,0.3)',
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

        <div>
          <label>👥 Audience Level</label>
          <select
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
          >
            <option>Executive/C-Suite/Senior Leadership</option>
            <option>Manager/Supervisor/Team Lead</option>
            <option>Emerging/New/First-Time Leader</option>
            <option>Individual Contributor/Specialist</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>📚 Format</label>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              {['Training', 'Workshop', 'Action Learning'].map((fmt) => (
                <label key={fmt} style={{
                  display: 'block',
                  padding: '10px',
                  margin: '6px 0',
                  background: formData.format === fmt ? 'rgba(102,126,234,0.3)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: formData.format === fmt ? '600' : '400'
                }}>
                  <input
                    type="radio"
                    name="format"
                    value={fmt}
                    checked={formData.format === fmt}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    style={{ marginRight: '8px' }}
                  />
                  {fmt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>⏱️ Duration</label>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              {['1 Day (6-7 hours)', '2 Days (12-14 hours)'].map((dur) => (
                <label key={dur} style={{
                  display: 'block',
                  padding: '10px',
                  margin: '6px 0',
                  background: formData.duration === dur ? 'rgba(102,126,234,0.3)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: formData.duration === dur ? '600' : '400'
                }}>
                  <input
                    type="radio"
                    name="duration"
                    value={dur}
                    checked={formData.duration === dur}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{ marginRight: '8px' }}
                  />
                  {dur}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          style={{
            background: isGenerating
              ? 'rgba(255,255,255,0.2)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 50px',
            fontSize: '1.25em',
            fontWeight: '700',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            width: '100%',
            marginTop: '10px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: isGenerating ? 'none' : '0 10px 30px rgba(102,126,234,0.5)',
          }}
        >
          {isGenerating ? '⏳ GENERATING...' : '🚀 GENERATE TRAINING PROGRAM'}
        </button>
      </form>
    </div>
  );
}
