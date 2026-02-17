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
  justifyContent: 'space-between',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '10px',
  cursor: 'pointer',
  color: 'white',
  fontWeight: selected ? '600' : '400',
  background: selected ? 'rgba(102,126,234,0.3)' : 'rgba(255,255,255,0.05)',
  border: selected ? '1px solid rgba(102,126,234,0.5)' : '1px solid rgba(255,255,255,0.1)',
  transition: 'all 0.2s',
  minHeight: '48px'
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
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🎓 What's Your Training Topic?</label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="Strategic Planning, Medical Diagnosis, Python Programming..."
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Company Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🏢 Company Name (Optional)</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g., Tata Steel, Apollo Hospitals, Infosys"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Company Context */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', fontWeight: '600', display: 'block', marginBottom: '8px' }}>📋 Company Context (Optional)</label>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', marginTop: '0', marginBottom: '8px' }}>
            ⚠️ QUALITY TIP: More detail = Better training. Aim for 100+ words with numbers, names, real scenarios
          </p>
          <textarea
            value={formData.companyContext}
            onChange={(e) => setFormData({ ...formData, companyContext: e.target.value })}
            placeholder={`❌ BAD: "Telecom company facing competition"

✅ GOOD: "Airtel: 500M subscribers, lost 15M to Jio in 2023 due to pricing. CEO Gopal Vittal pushing ₹50K crore 5G investment. CFO wants 15% cost cuts. Network ops resists change. Comms are siloed - Finance/Marketing/Network don't talk. Recent fail: Launched pricing without telling customer service = 10M complaints."

INCLUDE (the more specific, the better):
📊 Numbers: Employees, revenue, market share, specific metrics
👥 Stakeholders: Who disagrees with whom? Named roles/people
💰 Constraints: Budget limits, political dynamics, what you CAN'T do
⚡ Recent events: What happened that prompted this training?
🎯 Specific problem: Not just "need better communication" but "Finance launched new pricing without telling customer service, caused 10M complaints"

Without this detail, you get GENERIC training.
With this detail, you get HYPER-SPECIFIC training worth 10x more.`}
    rows="6"
    style={{
      width: '100%',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: 'white',
      fontFamily: 'inherit',
      fontSize: '0.9em',
      resize: 'vertical',
      boxSizing: 'border-box'
    }}
  />
</div>

        {/* Audience Level */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            'Executive/C-Suite/Senior Leadership',
            'Manager/Supervisor/Team Lead',
            'Emerging/New/First-Time Leader',
            'Individual Contributor/Specialist'
          ].map((aud) => (
            <label key={aud} style={radioOptionStyle(formData.audience === aud)}>
              <span style={{ flex: 1, fontSize: '0.9em', lineHeight: '1.3' }}>{aud}</span>
              <input type="radio" name="audience" value={aud}
                checked={formData.audience === aud}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                style={{ accentColor: '#667eea', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
              />
            </label>
          ))}
        </div>

        {/* Format */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {['Training', 'Workshop', 'Action Learning'].map((fmt) => (
            <label key={fmt} style={radioOptionStyle(formData.format === fmt)}>
              <span>{fmt}</span>
              <input type="radio" name="format" value={fmt}
                checked={formData.format === fmt}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                style={{ accentColor: '#667eea', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
              />
            </label>
          ))}
        </div>
        {/* Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            'Half Day (3-4 hours)',
            '1 Day (6-7 hours)',
            '2 Days (12-14 hours)'
          ].map((dur) => (
            <label key={dur} style={{...radioOptionStyle(formData.duration === dur), whiteSpace: 'nowrap', fontSize: '0.85em', padding: '10px 10px' }}>
              <span>{dur}</span>
              <input type="radio" name="duration" value={dur}
                checked={formData.duration === dur}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                style={{ accentColor: '#667eea', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
              />
            </label>
          ))}
        </div>

        {/* Delivery Mode */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', fontWeight: '600', display: 'block', marginBottom: '8px' }}>🖥️ Delivery Mode</label>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85em', marginTop: '0', marginBottom: '10px' }}>
            Adjusts exercises and activities for the delivery format
          </p>
          <select
            value={formData.deliveryMode}
            onChange={(e) => setFormData({ ...formData, deliveryMode: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '1em',
              boxSizing: 'border-box'
            }}
          >
            <option style={{ background: '#1a1f3a' }}>In-Person</option>
            <option style={{ background: '#1a1f3a' }}>Virtual</option>
            <option style={{ background: '#1a1f3a' }}>Hybrid</option>
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
