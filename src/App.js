import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import NeuralBackground from './components/NeuralBackground';
import InputForm from './components/InputForm';
import ReactMarkdown from 'react-markdown';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');

  const handleUnlock = async () => {
    const sessionId = generatedContent?.sessionId || generatedContent?.session_id;

  console.log("Unlock clicked, sessionId:", sessionId);
  console.log("Full content:", generatedContent);

  if (!sessionId) {
    alert("No session ID found!");
    return;
  }

  try {
    const response = await fetch(
      `https://ashishmehra-nexus-backend.hf.space/api/unlock/${sessionId}`,
      { method: 'POST' }
    );

    const data = await response.json();
    console.log("Unlock response:", data);

    setGeneratedContent(prev => ({
      ...prev,
      ...data,
      isLocked: false
    }));

  } catch (error) {
    console.error("Unlock failed", error);
    alert("Failed to unlock content");
  }
};

  return (
    <div className="min-h-screen relative bg-gray-900">
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            🧠 NEXUS Learning Generator
          </h1>
          <p className="text-xl mt-4 text-gray-300">Think Clear. Act Better.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputForm onGenerate={(data) => {
            setGeneratedContent(data);
            setActiveTab('synopsis');
          }} />
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/20">
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

                <div className="flex space-x-2 mb-6 border-b border-gray-700">
                  <button
                    onClick={() => setActiveTab('synopsis')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'synopsis'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Synopsis
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'content'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Content
                  </button>
                  <button
                    onClick={() => setActiveTab('facilitator')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'facilitator'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Facilitator Guide
                  </button>
                  <button
                    onClick={() => setActiveTab('handout')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'handout'
                        ? 'text-purple-400 border-b-2 border-purple-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Handout
                  </button>
                </div>

                <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                  {activeTab === 'synopsis' && (
                    <div className="text-gray-300">
                      <ReactMarkdown>{generatedContent.synopsis}</ReactMarkdown>
                    </div>
                  )}
                  
                  {activeTab === 'content' && (
                    <div className="text-gray-300">
                      {console.log('🐛 Content Tab Debug:', { 
                        isLocked: generatedContent?.isLocked, 
                        contentPreview: generatedContent?.content?.substring(0, 50) 
                      })}
                      
                      {generatedContent?.isLocked ? (
                        <div style={{
                          padding: '60px 40px',
                          textAlign: 'center',
                          backgroundColor: '#1f2937',
                          borderRadius: '12px',
                          border: '2px dashed #6366f1',
                          margin: '20px 0'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                          <h2 style={{ color: '#a78bfa', marginBottom: '20px', fontSize: '2rem' }}>
                            Content Locked
                          </h2>
                          <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '30px' }}>
                            Full training content available after unlock.
                          </p>
                          
                          <button
                            onClick={handleUnlock}
                            style={{
                              padding: '20px 40px',
                              fontSize: '20px',
                              fontWeight: 'bold',
                              background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(59, 130, 246))',
                              color: 'white',
                              border: 'none',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                              marginTop: '20px'
                            }}
                          >
                            🔓 Unlock Full Access
                          </button>
                          
                          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '30px' }}>
                            Session: {generatedContent?.sessionId || generatedContent?.session_id || 'N/A'}
                          </p>
                        </div>
                      ) : (
                        <ReactMarkdown>{generatedContent?.content}</ReactMarkdown>
                      )}
                    </div>
                  )}

src/components/InputForm.jsx
                  {activeTab === 'facilitator' && (
                    generatedContent?.isLocked ? (
                      <div className="text-center py-20">
                        <p className="text-xl text-gray-400 mb-4">🔒 Content Locked</p>
                        <p className="text-gray-500">Click Unlock Full Access to view</p>
                      </div>
                    ) : (
                      <div className="text-gray-300">
                        <ReactMarkdown>{generatedContent.facilitator}</ReactMarkdown>
                      </div>
                    )
                  )}
                  
                  {activeTab === 'handout' && (
                    generatedContent?.isLocked ? (
                      <div className="text-center py-20">
                        <p className="text-xl text-gray-400 mb-4">🔒 Content Locked</p>
                        <p className="text-gray-500">Click Unlock Full Access to view</p>
                      </div>
                    ) : (
                      <div className="text-gray-300">
                        <ReactMarkdown>{generatedContent.handout}</ReactMarkdown>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-20">
                <p className="text-lg">Fill in the form and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
