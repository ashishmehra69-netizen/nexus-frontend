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

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '2px solid rgba(255,255,255,0.15)',
    borderRadius: '16px',
    padding: '16px 20px',
    color: 'white',
    fontSize: '1em',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    color: 'white',
    fontWeight: '600',
    fontSize: '1.05em',
    marginBottom: '12px',
    display: 'block'
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
          <label style={labelStyle}>🎓 What's Your Training Topic?</label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Strategic Planning, Medical Diagnosis, Python Programming..."
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>🏢 Company Name (Optional)</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g., Tata Steel, Apollo Hospitals, Infosys"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>📋 Company Context (Optional)</label>
          <textarea
            value={formData.companyContext}
            onChange={(e) => setFormData({ ...formData, companyContext: e.target.value })}
            placeholder="e.g., Manufacturing, 500 employees, digital transformation..."
            rows="3"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div>
          <label style={labelStyle}>👥 Audience Level</label>
          <select
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            style={{...inputStyle, cursor: 'pointer'}}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.12)';
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option style={{background: '#1a1f3a'}}>Executive/C-Suite/Senior Leadership</option>
            <option style={{background: '#1a1f3a'}}>Manager/Supervisor/Team Lead</option>
            <option style={{background: '#1a1f3a'}}>Emerging/New/First-Time Leader</option>
            <option style={{background: '#1a1f3a'}}>Individual Contributor/Specialist</option>
          </select>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
          <div>
            <label style={labelStyle}>📚 Format</label>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              {['Training', 'Workshop', 'Action Learning'].map((fmt) => (
                <label key={fmt} style={{
                  display: 'block',
                  padding: '12px',
                  margin: '8px 0',
                  background: formData.format === fmt ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white'
                }}>
                  <input
                    type="radio"
                    name="format"
                    value={fmt}
                    checked={formData.format === fmt}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    style={{marginRight: '10px'}}
                  />
                  {fmt}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>⏱️ Duration</label>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              {['1 Day (6-7 hours)', '2 Days (12-14 hours)'].map((dur) => (
                <label key={dur} style={{
                  display: 'block',
                  padding: '12px',
                  margin: '8px 0',
                  background: formData.duration === dur ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white'
                }}>
                  <input
                    type="radio"
                    name="duration"
                    value={dur}
                    checked={formData.duration === dur}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    style={{marginRight: '10px'}}
                  />
                  {dur}
                </label>
              ))}
            </div>
          </div>
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
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            width: '100%',
            marginTop: '20px',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.5)';
          }}
        >
          {loading ? '⏳ GENERATING...' : '🚀 GENERATE TRAINING PROGRAM'}
        </button>
      </form>
    </div>
  );
}
