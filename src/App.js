import React, { useState } from 'react';
import NeuralBackground from './components/NeuralBackground';
import InputForm from './components/InputForm';
import ReactMarkdown from 'react-markdown';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');

  const handleUnlock = async () => {
    const sessionId = generatedContent?.sessionId || generatedContent?.session_id;

    if (!sessionId) {
      alert("No session ID found!");
      return;
    }

    try {
      const response = await fetch(
        `https://ashishmehra-nexus-backend.hf.space/api/unlock/${sessionId}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setGeneratedContent({
        ...generatedContent,
        content: data.content,
        facilitator: data.facilitator,
        handout: data.handout,
        isLocked: false,
        locked: false
      });

    } catch (error) {
      console.error("❌ Unlock failed:", error);
      alert(`Failed to unlock: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0e27', padding: '40px 20px' }}>
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto" style={{ maxWidth: '1400px' }}>
        
        {/* Hero Section */}
        <div className="mb-10 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 50%, rgba(240, 147, 251, 0.3) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '60px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 10s ease infinite'
        }}>
          <div className="text-center relative z-10">
            <h1 className="text-6xl font-black text-white mb-5" style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              letterSpacing: '-2px'
            }}>
              🎯 NEXUS
            </h1>
            <p className="text-2xl text-white mb-5" style={{ opacity: 0.95 }}>
              AI-Powered Training Development Platform
            </p>
            <p className="text-lg text-white max-w-3xl mx-auto mb-8" style={{ 
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              Transform training development from weeks to minutes. Generate research-backed, 
              pedagogically sound training programs complete with facilitator notes, participant handouts, 
              interactive exercises, and curated video content — instantly.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-5 py-2 rounded-full text-white font-semibold text-sm" style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>✨ Domain Agnostic</span>
              <span className="px-5 py-2 rounded-full text-white font-semibold text-sm" style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>⚡ 45-Second Generation</span>
              <span className="px-5 py-2 rounded-full text-white font-semibold text-sm" style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>🎓 Research-Backed</span>
              <span className="px-5 py-2 rounded-full text-white font-semibold text-sm" style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>🔄 Auto-Customized</span>
              <span className="px-5 py-2 rounded-full text-white font-semibold text-sm" style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>📊 Export Ready</span>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="flex justify-around flex-wrap gap-5 p-8 rounded-3xl mb-10" style={{
          background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <div className="text-center text-white">
            <div className="text-5xl font-black mb-2" style={{
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>∞</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Domain Agnostic</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl font-black mb-2" style={{
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>3-5</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Modules Generated</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl font-black mb-2" style={{
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>45s</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Average Time</div>
          </div>
          <div className="text-center text-white">
            <div className="text-5xl font-black mb-2" style={{
              background: 'linear-gradient(135deg, #667eea, #f093fb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>100%</div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Customizable</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <InputForm onGenerate={(data) => {
              setGeneratedContent(data);
              setActiveTab('synopsis');
            }} />
          </div>
          
          <div className="p-9 rounded-3xl" style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            {generatedContent ? (
              <div>
                {generatedContent?.isLocked && (
                  <div className="mb-6 text-center">
                    <button
                      onClick={handleUnlock}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-green-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-green-600 transition-all shadow-lg"
                    >
                      🔓 Unlock Full Access
                    </button>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>{generatedContent.synopsis}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-white font-semibold text-lg block mb-3">📊 Generation Status</label>
                <div className="p-8 rounded-2xl text-white" style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'Monaco, monospace',
                  fontSize: '0.95em',
                  lineHeight: '1.8',
                  minHeight: '400px'
                }}>
                  ✨ Ready to Generate!
                  <br /><br />
                  🌍 Supported Domains:<br />
                  • Business & Leadership<br />
                  • Medical & Healthcare<br />
                  • Engineering & Technical<br />
                  • IT & Software Development<br />
                  • Finance & Accounting<br />
                  • Legal & Compliance<br />
                  • Education & Training<br />
                  • Manufacturing<br />
                  • Sales & Marketing
                  <br /><br />
                  📋 What You'll Get:<br />
                  ✓ Complete training content<br />
                  ✓ Facilitator guide<br />
                  ✓ Participant handouts<br />
                  ✓ Video resources<br />
                  ✓ PPT export ready
                  <br /><br />
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
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {['synopsis', 'content', 'facilitator', 'handout'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-base transition-all ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  style={activeTab === tab ? {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  } : {}}
                >
                  {tab === 'synopsis' && '📖 Synopsis'}
                  {tab === 'content' && '📄 Content'}
                  {tab === 'facilitator' && '🎤 Facilitator'}
                  {tab === 'handout' && '📝 Handout'}
                </button>
              ))}
            </div>

            <div className="p-9 rounded-3xl" style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
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

      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

export default App;
