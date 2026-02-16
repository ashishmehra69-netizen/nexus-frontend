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
    
    // ✅ DEBUG: Log what we're passing to parent
    console.log('🔍 InputForm sending to App:', result);
    console.log('🔍 isLocked value:', result.isLocked);
    
    onGenerate(result);
  } catch (error) {
    console.error('Generation failed:', error);
    alert('Generation failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/20 backdrop-blur-2xl p-8 rounded-2xl border border-purple-500/40 shadow-2xl">
      <div>
        <label className="block text-sm font-medium mb-2">Purpose of Training</label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., Strategic Planning, Python Programming"
          className="w-full px-4 py-3 bg-black/20 backdrop-blur-lg border border-purple-500/40 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Company Name (Optional)</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          placeholder="e.g., Airtel, Infosys"
          className="w-full px-4 py-3 bg-black/20 backdrop-blur-lg border border-purple-500/40 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Company Context</label>
        <textarea
          value={formData.companyContext}
          onChange={(e) => setFormData({ ...formData, companyContext: e.target.value })}
          placeholder="Specific details about their situation..."
          rows="4"
          className="w-full px-4 py-3 bg-black/20 backdrop-blur-lg border border-purple-500/40 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Audience Level</label>
          <select
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            className="w-full px-4 py-3 bg-black/20 backdrop-blur-lg border border-purple-500/40 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
          >
            <option>Executive/C-Suite/Senior Leadership</option>
            <option>Manager/Supervisor/Team Lead</option>
            <option>Emerging/New/First-Time Leader</option>
            <option>Individual Contributor/Specialist</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <select
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
           className="w-full px-4 py-3 bg-black/20 backdrop-blur-lg border border-purple-500/40 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
          >
            <option>Training</option>
            <option>Workshop</option>
            <option>Action Learning</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-green-500 hover:from-purple-700 hover:to-green-600 rounded-lg font-bold text-white transition-all transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Training'}
      </button>
    </form>
  );
}
