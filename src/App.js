import React, { useState, useEffect } from 'react';
import NeuralBackground from './components/NeuralBackground';
import InputForm from './components/InputForm';
import ReactMarkdown from 'react-markdown';

const cardStyle = {
  background: 'rgba(0,0,0,0.3)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  borderRadius: '24px',
  padding: '35px'
};

const PROGRESS_STEPS = [
  { time: 0,  msg: '🔍 Detecting domain...' },
  { time: 4,  msg: '🏢 Researching company & industry...' },
  { time: 10, msg: '📚 Gathering authoritative sources...' },
  { time: 18, msg: '⚙️ Building training framework...' },
  { time: 26, msg: '✍️ Writing Module 1 content...' },
  { time: 34, msg: '✍️ Writing Module 2 content...' },
  { time: 42, msg: '✍️ Writing Module 3 content...' },
  { time: 50, msg: '🎤 Creating facilitator guide...' },
  { time: 58, msg: '📝 Building participant handout...' },
  { time: 65, msg: '✅ Finalizing your training program...' },
];

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [answers, setAnswers] = useState({ challenges: '', outcomes: '', context: '' });

  useEffect(() => {
    if (!isGenerating) return;
    setElapsedTime(0);
    setProgressMsg(PROGRESS_STEPS[0].msg);
    const timer = setInterval(() => {
      setElapsedTime(prev => {
        const next = prev + 1;
        const step = [...PROGRESS_STEPS].reverse().find(s => next >= s.time);
        if (step) setProgressMsg(step.msg);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleUnlock = async () => {
    const sessionId = generatedContent?.sessionId || generatedContent?.session_id;
    if (!sessionId) { alert("No session ID found!"); return; }
    try {
      const response = await fetch(
        `https://ashishmehra-nexus-backend.hf.space/api/unlock/${sessionId}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setGeneratedContent({ ...generatedContent, content: data.content, facilitator: data.facilitator, handout: data.handout, isLocked: false });
    } catch (error) {
      alert(`Failed to unlock: ${error.message}`);
    }
  };

  const handleFormSubmit = (formData) => {
    setPendingFormData(formData);
    setAnswers({ challenges: '', outcomes: '', context: '' });
    setShowQuestions(true);
  };

  const generateContent = async (formData, extraAnswers) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      let enhancedContext = formData.companyContext || '';
      if (extraAnswers.challenges) enhancedContext += `\n\nKey Challenges: ${extraAnswers.challenges}`;
      if (extraAnswers.outcomes) enhancedContext += `\n\nDesired Outcomes: ${extraAnswers.outcomes}`;
      if (extraAnswers.context) enhancedContext += `\n\nAdditional Context: ${extraAnswers.context}`;

      const response = await fetch('https://ashishmehra-nexus-backend.hf.space/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          companyName: formData.companyName,
          companyContext: enhancedContext,
          audienceLevel: formData.audience,
          format: formData.format,
          duration: formData.duration,
          deliveryMode: formData.deliveryMode,
        }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setGeneratedContent({ ...data, isLocked: true });
      setActiveTab('synopsis');
    } catch (error) {
      alert('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'transparent', padding: '40px 20px' }}>
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto" style={{ maxWidth: '1400px' }}>
        
        {/* Hero Section */}
        <div className="mb-10 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.3) 50%, rgba(240,147,251,0.3) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '60px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(102,126,234,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div className="text-center relative z-10">
            <h1 className="text-6xl font-black text-white mb-5" style={{ letterSpacing: '-2px' }}>🎯 NEXUS</h1>
            <p className="text-2xl text-white mb-5" style={{ opacity: 0.95 }}>AI-Powered Training Development Platform</p>
            <p className="text-lg text-white max-w-3xl mx-auto mb-8" style={{ opacity: 0.9, lineHeight: '1.6' }}>
              Transform training development from weeks to minutes. Generate research-backed, pedagogically sound training programs — instantly.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['✨ Domain Agnostic', '⚡ 45-Second Generation', '🎓 Research-Backed', '🔄 Auto-Customized', '📊 Export Ready'].map(pill => (
                <span key={pill} className="px-5 py-2 rounded-full text-white font-semibold text-sm" style={{
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)'
                }}>{pill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="flex justify-around flex-wrap gap-5 p-8 rounded-3xl mb-10" style={{
          background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          {[['∞','Domain Agnostic'],['3-5','Modules Generated'],['45s','Average Time'],['100%','Customizable']].map(([num, label]) => (
            <div key={label} className="text-center text-white">
              <div className="text-5xl font-black mb-2" style={{
                background: 'linear-gradient(135deg, #667eea, #f093fb)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>{num}</div>
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Enhancement Questions Modal */}
        {showQuestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
            <div style={{ ...cardStyle, maxWidth: '600px', width: '90%' }}>
              <h2 className="text-2xl font-bold text-white mb-2">🎯 Make It Hyper-Specific</h2>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>Answer 2-3 quick questions to make your training hyper-specific, or skip to generate now.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold block mb-2">🚨 What's the main challenge to solve?</label>
                  <textarea
                    value={answers.challenges}
                    onChange={(e) => setAnswers({...answers, challenges: e.target.value})}
                    placeholder="e.g., Teams not collaborating, managers avoiding difficult conversations..."
                    rows="2"
                    className="w-full rounded-xl p-3 text-white"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="text-white font-semibold block mb-2">🎯 What outcomes must participants achieve?</label>
                  <textarea
                    value={answers.outcomes}
                    onChange={(e) => setAnswers({...answers, outcomes: e.target.value})}
                    placeholder="e.g., Reduce conflicts by 50%, improve team velocity..."
                    rows="2"
                    className="w-full rounded-xl p-3 text-white"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="text-white font-semibold block mb-2">🏢 Any specific context? (tools, culture, industry)</label>
                  <textarea
                    value={answers.context}
                    onChange={(e) => setAnswers({...answers, context: e.target.value})}
                    placeholder="e.g., Uses Salesforce, remote team, high-pressure culture..."
                    rows="2"
                    className="w-full rounded-xl p-3 text-white"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => { setShowQuestions(false); generateContent(pendingFormData, answers); }}
                  className="flex-1 py-3 font-bold text-white rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '1.1em' }}
                >
                  🚀 Generate with Answers
                </button>
                <button
                  onClick={() => { setShowQuestions(false); generateContent(pendingFormData, { challenges: '', outcomes: '', context: '' }); }}
                  className="flex-1 py-3 font-bold rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
                >
                  ⏭️ Skip & Generate Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <InputForm onGenerate={handleFormSubmit} isGenerating={isGenerating} />
          </div>
          
          {/* Right Panel */}
          <div style={cardStyle}>
            {isGenerating ? (
              <div>
                <div className="text-white font-bold text-lg mb-4">⚡ Generating Your Training...</div>
                <div className="mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Monaco, monospace', fontSize: '0.9em' }}>
                  {progressMsg}
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span>Progress</span>
                    <span>{elapsedTime}s elapsed</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-2 rounded-full transition-all duration-1000" style={{
                      width: `${Math.min((elapsedTime / 70) * 100, 95)}%`,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)'
                    }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {PROGRESS_STEPS.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm transition-all" style={{
                      color: elapsedTime >= step.time ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)'
                    }}>
                      <span>{elapsedTime >= step.time ? '✅' : '⏳'}</span>
                      <span>{step.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : generatedContent ? (
              <div>
                {generatedContent?.isLocked && (
                  <div className="mb-6 text-center">
                    <button
                      onClick={handleUnlock}
                      className="w-full py-3 font-bold text-white rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '1.1em' }}
                    >
                      🔓 Unlock Full Access
                    </button>
                  </div>
                )}
                <div className="prose prose-invert max-w-none overflow-auto max-h-[500px]">
                  <ReactMarkdown>{generatedContent.synopsis}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-white font-semibold text-lg mb-3">📊 Generation Status</div>
                <div style={{ fontFamily: 'Monaco, monospace', fontSize: '0.9em', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
                  ✨ Ready to Generate!<br /><br />
                  🌍 Supported Domains:<br />
                  • Business & Leadership<br />
                  • Medical & Healthcare<br />
                  • Engineering & Technical<br />
                  • IT & Software Development<br />
                  • Finance & Accounting<br />
                  • Legal & Compliance<br />
                  • Education & Training<br />
                  • Manufacturing<br />
                  • Sales & Marketing<br /><br />
                  📋 What You'll Get:<br />
                  ✓ Complete training content<br />
                  ✓ Facilitator guide<br />
                  ✓ Participant handouts<br />
                  ✓ Video resources<br />
                  ✓ PPT export ready<br /><br />
                  👉 Fill in your topic!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {generatedContent && (
          <div>
            <div className="flex gap-2 p-2 rounded-2xl mb-6" style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {[
                { key: 'synopsis', label: '📖 Synopsis' },
                { key: 'content', label: '📄 Content' },
                { key: 'facilitator', label: '🎤 Facilitator' },
                { key: 'handout', label: '📝 Handout' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all"
                  style={activeTab === tab.key ? {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                  } : { color: 'rgba(255,255,255,0.7)' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={cardStyle}>
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {activeTab === 'synopsis' && <ReactMarkdown>{generatedContent.synopsis}</ReactMarkdown>}
                {activeTab === 'content' && <ReactMarkdown>{generatedContent.content}</ReactMarkdown>}
                {activeTab === 'facilitator' && <ReactMarkdown>{generatedContent.facilitator}</ReactMarkdown>}
                {activeTab === 'handout' && <ReactMarkdown>{generatedContent.handout}</ReactMarkdown>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
