import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import './App.css';

// IMPORTANT: Replace with your actual Hugging Face Space URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://YOUR_USERNAME-nexus-backend.hf.space';

function App() {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Training');
  const [duration, setDuration] = useState('1 Day (6-7 hours)');
  const [audienceLevel, setAudienceLevel] = useState('Executive/C-Suite/Senior Leadership');
  const [companyName, setCompanyName] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [deliveryMode, setDeliveryMode] = useState('In-Person');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const isLocked = result?.isLocked === true;
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('synopsis');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate`, {
        topic,
        format,
        duration,
        audienceLevel,
        companyName,
        companyContext,
        deliveryMode
      });

      setResult(response.data);
      setActiveTab('synopsis');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate content');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
  if (!result?.sessionId) return;

  setLoading(true);
  setError('');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/unlock/${result.sessionId}`
    );

    setResult(prev => ({
      ...prev,
      ...response.data,
      isLocked: false
    }));
  } catch (err) {
    setError('Failed to unlock content');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="App">
      <header className="app-header">
        <h1>🧠 NEXUS Training Generator</h1>
        <p>AI-Powered Professional Training Content</p>
      </header>

      <div className="container">
        {/* Input Form */}
        <div className="form-card">
          <h2>Generate Training Content</h2>
          
          <div className="form-group">
            <label>Topic *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Strategic Planning, Leadership Development"
              className="input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="input">
                <option>Training</option>
                <option>Workshop</option>
                <option>Action Learning</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="input">
                <option>Half Day (3-4 hours)</option>
                <option>1 Day (6-7 hours)</option>
                <option>2 Days (12-14 hours)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Audience Level</label>
            <select value={audienceLevel} onChange={(e) => setAudienceLevel(e.target.value)} className="input">
              <option>Executive/C-Suite/Senior Leadership</option>
              <option>Manager/Supervisor/Team Lead</option>
              <option>Emerging/New/First-Time Leader</option>
              <option>Individual Contributor/Specialist</option>
            </select>
          </div>

          <div className="form-group">
            <label>Delivery Mode</label>
            <select value={deliveryMode} onChange={(e) => setDeliveryMode(e.target.value)} className="input">
              <option>In-Person</option>
              <option>Virtual (Online)</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Company Name (Optional)</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Acme Corp"
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Company Context (Optional)</label>
            <textarea
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder="Provide specific context about the company's situation, challenges, or goals..."
              className="textarea"
              rows={4}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="spinner" />
                Generating...
              </>
            ) : (
              'Generate Training Content'
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="results-card">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'synopsis' ? 'active' : ''}`}
                onClick={() => setActiveTab('synopsis')}
              >
                Synopsis
              </button>
              <button 
                className={`tab ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                {result.isLocked ? '🔒 Content' : 'Content'}
              </button>
              <button 
                className={`tab ${activeTab === 'facilitator' ? 'active' : ''}`}
                onClick={() => setActiveTab('facilitator')}
              >
                {result.isLocked ? '🔒 Facilitator' : 'Facilitator Guide'}
              </button>
              <button 
                className={`tab ${activeTab === 'handout' ? 'active' : ''}`}
                onClick={() => setActiveTab('handout')}
              >
                {result.isLocked ? '🔒 Handout' : 'Handout'}
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'synopsis' && (
                <div className="markdown-content">
                  <ReactMarkdown>{result.synopsis}</ReactMarkdown>
                </div>
              )}

              case 'content':
                return (
                  <div className="tab-panel">
                  {result?.isLocked ? (
                    <div className="locked">
                      <h3>LOCKED</h3>
                      <p>Full training after unlock.</p>
                      <button onClick={handleUnlock}>Unlock</button>
                  </div>
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>
                      {result?.content}
                    </ReactMarkdown>
                </div>
              )}
            </div>
  );
                </div>
              )}

              {activeTab === 'facilitator' && (
                <div className="markdown-content">
                  {result.isLocked ? (
                    <div className="locked-content">
                      <h2>🔒 Facilitator Guide Locked</h2>
                      <button onClick={handleUnlock} className="btn-primary">
                        Unlock Full Access
                      </button>
                    </div>
                  ) : (
                      <ReactMarkdown>{result.facilitator}</ReactMarkdown>
                  )}
                </div>
              )}

              {activeTab === 'handout' && (
                <div className="markdown-content">
                  {result.isLocked ? (
                    <div className="locked-content">
                      <h2>🔒 Handout Locked</h2>
                      <button onClick={handleUnlock} className="btn-primary">
                        Unlock Full Access
                      </button>
                    </div>
                  ) : (
                      <ReactMarkdown>{result.handout}</ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
