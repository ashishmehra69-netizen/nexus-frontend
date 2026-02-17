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

  const radioGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px'
  };

  const radioOptionStyle = (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'white',
    fontWeight: selected ? '600' : '400',
    background: selected ? 'rgba(102,126,234,0.3)' : 'rgba(255,255,255,0.05)',
    border: selected ? '1px solid rgba(102,126,234,0.5)' : '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.2s'
  });

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

        {/* Topic */}
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

        {/* Company Name */}
        <div>
          <label>🏢 Company Name (Optional)</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g., Tata Steel, Apollo Hospitals, Infosys"
          />
        </div>

        {/* Company Context */}
        <div>
          <label>📋 Company Context (Optional)</label>
          <textarea
            value={formData.companyContext}
            onChange={(e) => setFormData({ ...formData, companyContext: e.target.value })}
            placeholder="e.g., Manufacturing, 500 employees, digital transformation..."
            rows="3"
          />
        </div>

        {/* Audience Level */}
        <div>
          <label>👥 Audience Level</label>
          <div style={radioGroupStyle}>
            {[
              'Executive/C-Suite/Senior Leadership',
              'Manager/Supervisor/Team Lead',
              'Emerging/New/First-Time Leader',
              'Individual Contributor/Specialist'
            ].map((aud) => (
              <label key={aud} style={radioOptionStyle(formData.audience === aud)}>
                <input type="radio" name="audience" value={aud}
                  checked={formData.audience === aud}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  style={{ accentColor: '#667eea' }}
                />
                {aud}
              </label>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <label>📚 Format</label>
          <div style={radioGroupStyle}>
            {['Training', 'Workshop', 'Action Learning'].map((fmt) => (
              <label key={fmt} style={radioOptionStyle(formData.format === fmt)}>
                <input type="radio" name="format" value={fmt}
                  checked={formData.format === fmt}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  style={{ accentColor: '#667eea' }}
                />
                {fmt}
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label>⏱️ Duration</label>
          <div style={radioGroupStyle}>
            {[
              'Half Day (3-4 hours)',
              '1 Day (6-7 hours)',
              '2 Days (12-14 hours)'
            ].map((dur) => (
              <label key={dur} style={radioOptionStyle(formData.duration === dur)}>
                <input type="radio" name="duration" value={dur}
                  checked={formData.duration === dur}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  style={{ accentColor: '#667eea' }}
                />
                {dur}
              </label>
            ))}
          </div>
        </div>

        {/* Delivery Mode */}
        <div>
          <label>🖥️ Delivery Mode</label>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', marginTop: '-8px', marginBottom: '10px' }}>
            Adjusts exercises and activities for the delivery format
          </p>
          <select
            value={formData.deliveryMode}
            onChange={(e) => setFormData({ ...formData, deliveryMode: e.target.value })}
          >
            <option>In-Person</option>
            <option>Virtual</option>
            <option>Hybrid</option>
          </select>
        </div>

        {/* Submit Button */}
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
