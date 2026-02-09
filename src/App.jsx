import React, { useState } from 'react';
import NeuralBackground from './components/NeuralBackground';
import InputForm from './components/InputForm';

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);

  return (
    <div className="min-h-screen relative">
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
            🧠 NEXUS Learning Generator
          </h1>
          <p className="text-xl mt-4 text-gray-300">Think Clear. Act Better.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputForm onGenerate={setGeneratedContent} />
          
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/20">
            {generatedContent ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
                <pre className="whitespace-pre-wrap text-sm">
                  {generatedContent.content.substring(0, 500)}...
                </pre>
                {/* Add tabs for full content, facilitator, handout */}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-20">
                <p>Fill in the form and click Generate to create your training</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
