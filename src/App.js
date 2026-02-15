import React, { useState } from 'react';
import NeuralBackground from './components/NeuralBackground';
import InputForm from './components/InputForm';
import ReactMarkdown from 'react-markdown';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');

  const handleUnlock = async () => {
    const sessionId = generatedContent?.sessionId || generatedContent?.session_id;

    console.log("🔓 Unlock clicked, sessionId:", sessionId);
    console.log("📦 Current content:", generatedContent);

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
      console.log("✅ Unlock response:", data);

      // CRITICAL: Force complete state replacement
      setGeneratedContent({
        ...generatedContent,
        content: data.content,
        facilitator: data.facilitator,
        handout: data.handout,
        isLocked: false,
        locked: false
      });

      console.log("✅ State updated, content should be unlocked now");

    } catch (error) {
      console.error("❌ Unlock failed:", error);
      alert(`Failed to unlock: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-900">
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold flex items-center justify-center gap-4">
            <div className="text-6xl">🧠</div>
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              NEXUS Learning Generator
            </span>
          </h1>
          <p className="text-xl mt-4 text-gray-300">Think Clear. Act Better.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputForm onGenerate={(data) => {
            console.log("📥 Received from backend:", data);
            setGeneratedContent(data);
            setActiveTab('synopsis');
          }} />
          
          <div className="bg-black/10 backdrop-blur-3xl p-8 rounded-2xl border border-purple-500/40 shadow-2xl">
            {generatedContent ? (
              <div>
                {/* Show unlock button only if content is locked */}
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

                {/* Tabs */}
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

                {/* Content Display */}
                <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                  {activeTab === 'synopsis' && (
                    <div className="text-gray-300">
                      <ReactMarkdown>{generatedContent.synopsis}</ReactMarkdown>
                    </div>
                  )}
                  
                  {activeTab === 'content' && (
                    <div className="text-gray-300">
                      <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
                    </div>
                  )}
                  
                  {activeTab === 'facilitator' && (
                    <div className="text-gray-300">
                      <ReactMarkdown>{generatedContent.facilitator}</ReactMarkdown>
                    </div>
                  )}
                  
                  {activeTab === 'handout' && (
                    <div className="text-gray-300">
                      <ReactMarkdown>{generatedContent.handout}</ReactMarkdown>
                    </div>
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
