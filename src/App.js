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
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent flex items-center justify-center gap-4">
            <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 512 512">
              <path d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"/>
            </svg>
            NEXUS Learning Generator
          </h1>
          <p className="text-xl mt-4 text-gray-300">Think Clear. Act Better.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputForm onGenerate={(data) => {
            console.log("📥 Received from backend:", data);
            setGeneratedContent(data);
            setActiveTab('synopsis');
          }} />
          
          <div className="bg-gray-800/30 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 shadow-2xl">
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
