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

const textareaStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  padding: '12px',
  color: 'white',
  resize: 'vertical',
  fontFamily: 'inherit'
};

// Domain detection matching backend logic
const TECHNICAL_DOMAINS = ['engineering', 'manufacturing', 'automotive', 'construction', 'technical', 'quality', 'production', 'machine', 'equipment', 'process', 'safety', 'maintenance'];
const BEHAVIORAL_DOMAINS = ['business', 'sales', 'marketing', 'leadership', 'management', 'communication', 'finance', 'legal', 'education', 'training', 'strategy', 'hr', 'planning', 'team', 'coaching'];

function detectDomain(topic) {
  const lower = topic.toLowerCase();
  if (TECHNICAL_DOMAINS.some(d => lower.includes(d))) return 'technical';
  if (BEHAVIORAL_DOMAINS.some(d => lower.includes(d))) return 'behavioral';
  return 'general';
}

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

const SAMPLE_CONTENT = `# SAMPLE: Strategic Planning Training
**Format:** Training | **Audience:** Executive/C-Suite | **Duration:** 1 Day

---

## MODULE 1: Blue Ocean Strategy — Creating Uncontested Market Space

### The Framework: Blue Ocean Strategy (Kim & Mauborgne, INSEAD)

**Core Insight:** Most organizations compete in "red oceans" — known markets with defined rules where competition is fierce. Blue Ocean Strategy shows you how to create "blue oceans" — uncontested market space where competition is irrelevant.

**The 4 Actions Framework (ERRC Grid):**
- **Eliminate:** Which factors the industry takes for granted should be eliminated?
- **Reduce:** Which factors should be reduced well below the industry standard?
- **Raise:** Which factors should be raised well above the industry standard?
- **Create:** Which factors should be created that the industry has never offered?

### Practice Exercise (35 min)

**What You Will Create:** Your organization's Strategic Canvas showing current position vs. 2 competitors.

**Instructions:**
1. List 8-10 competition factors in your industry
2. Rate yourself and 2 competitors on each factor (1-10 scale)
3. Apply ERRC Grid — be bold!
4. Write your positioning statement: "We are the only _____ that _____"

### Resources to Go Deeper
- YouTube search: "blue ocean strategy explained 3 minutes"
- YouTube search: "cirque du soleil blue ocean strategy case study"

---

## 30-Day Implementation Plan

**Week 1:** Complete Strategic Canvas with leadership team
**Week 2:** Develop strategic vision and communication cascade
**Week 3:** Create strategic initiatives with clear owners and metrics
**Week 4:** Launch communication plan, establish monitoring cadence

## Success Metrics
- Leadership alignment score: 85%
- 75% of employees can articulate strategy in one sentence
- Strategic decision-making speed improves by 40%

---
*This is an abbreviated sample. Your generated training will include ALL modules with elaborate frameworks, templates, and curated video resources.*`;

function getPPTPrompt(topic) {
  return `Create a professional presentation on: ${topic || 'Training Topic'}

Please create comprehensive slides that:
- Start with a compelling title slide
- Include an overview of why this topic matters now
- Cover each module/section with clear explanations
- Use bullet points and visuals for frameworks
- Add real-world examples and case studies
- End with implementation steps and key takeaways

Make it executive-ready, visually engaging, and actionable.`;
}

const TABS = [
  { key: 'synopsis', label: '📖 Synopsis' },
  { key: 'content', label: '📄 Content' },
  { key: 'facilitator', label: '🎤 Facilitator' },
  { key: 'handout', label: '📝 Handout' },
  { key: 'ppt', label: '🎨 PPT Export' },
  { key: 'sample', label: '🎯 Sample' },
];

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [detectedDomain, setDetectedDomain] = useState('general');
  const [pptCopied, setPptCopied] = useState(false);
  const [answers, setAnswers] = useState({
    challenges: '',
    technical: '',
    behavioral: '',
    outcomes: ''
  });

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
    const domain = detectDomain(formData.topic);
    setDetectedDomain(domain);
    setPendingFormData(formData);
    setAnswers({ challenges: '', technical: '', behavioral: '', outcomes: '' });
    setShowQuestions(true);
  };

  const generateContent = async (formData, extraAnswers) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      let enhancedContext = formData.companyContext || '';

      if (extraAnswers.challenges?.trim()) {
        enhancedContext += `\n\n${'='.repeat(70)}\nMANDATORY: USER-SPECIFIED REQUIREMENTS\n${'='.repeat(70)}\n`;
        enhancedContext += `\n**CHALLENGE TO SOLVE:**\n${extraAnswers.challenges}\n`;
        enhancedContext += `→ MODULE 1 MUST start by addressing this exact challenge\n`;
        enhancedContext += `→ Framework in Module 1 MUST solve this (not generic)\n`;
        enhancedContext += `→ Exercise in Module 1 MUST use this as the scenario\n`;
      }

      if (extraAnswers.technical?.trim()) {
        enhancedContext += `\n**TECHNICAL CONTEXT (MUST USE IN EXAMPLES):**\n${extraAnswers.technical}\n`;
        enhancedContext += `→ Reference SPECIFIC equipment models mentioned above\n`;
        enhancedContext += `→ Use ACTUAL SOP numbers in procedures\n`;
        enhancedContext += `→ Apply REAL metrics/targets in examples\n`;
      }

      if (extraAnswers.behavioral?.trim()) {
        enhancedContext += `\n**CULTURAL CONTEXT (MUST USE IN SCENARIOS):**\n${extraAnswers.behavioral}\n`;
        enhancedContext += `→ Start Module 1 with the ACTUAL dysfunction described\n`;
        enhancedContext += `→ Role-play exercises MUST use this culture dynamic\n`;
        enhancedContext += `→ Avoid generic advice - address THIS specific culture\n`;
      }

      if (extraAnswers.outcomes?.trim()) {
        enhancedContext += `\n**SUCCESS CRITERIA (MUST BE MODULE OUTCOMES):**\n${extraAnswers.outcomes}\n`;
        enhancedContext += `→ Each module outcome MUST connect to these results\n`;
        enhancedContext += `→ Exercises MUST produce deliverables that achieve these\n`;
      }

      const response = await fetch('https://ashishmehra-nexus-backend.hf.space/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.topic,
          companyName: formData.companyName,
          companyContext: enhancedContext.trim(),
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

  const UnlockButton = () => (
    <div className="text-center py-10">
      <p className="text-white text-xl mb-4">🔒 Content is locked</p>
      <button onClick={handleUnlock} style={{
        padding: '14px 40px', fontWeight: 'bold', color: 'white', borderRadius: '12px',
        border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>🔓 Unlock Full Access</button>
    </div>
  );

  return (
    <div className="min-h-screen relative" style={{ background: 'transparent', padding: '40px 20px' }}>
      <NeuralBackground />
      
      <div className="relative z-10 container mx-auto" style={{ maxWidth: '1400px' }}>
        
        {/* Hero Section */}
        <div className="mb-10 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(102,126,234,0.3) 0%, rgba(118,75,162,0.3) 50%, rgba(240,147,251,0.3) 100%)',
          backdropFilter: 'blur(10px)', padding: '60px 40px', borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(102,126,234,0.4)', border: '1px solid rgba(255,255,255,0.1)',
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
          background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
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

        {/* ===== ENHANCEMENT QUESTIONS MODAL ===== */}
        {showQuestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
            <div style={{ ...cardStyle, maxWidth: '650px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
              
              {/* Header */}
              <div className="text-center mb-6 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))' }}>
                <h2 className="text-2xl font-bold text-white mb-1">✨ Quick Context Check</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Answer 2-3 quick questions to make your training hyper-specific</p>
                {detectedDomain !== 'general' && (
                  <div className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold" style={{
                    background: detectedDomain === 'technical' ? 'rgba(102,126,234,0.4)' : 'rgba(255,107,53,0.4)',
                    color: 'white', border: `1px solid ${detectedDomain === 'technical' ? 'rgba(102,126,234,0.6)' : 'rgba(255,107,53,0.6)'}`
                  }}>
                    {detectedDomain === 'technical' ? '⚙️ Technical Training Detected' : '🧠 Leadership/Behavioral Training Detected'}
                  </div>
                )}
              </div>

              <div className="space-y-5">

                {/* Q1 - Always shown */}
                <div>
                  <label className="text-white font-semibold block mb-1">
                    🎯 What specific challenges should this training address?
                  </label>
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Be specific about the ACTUAL problem, not the symptom</p>
                  <textarea
                    value={answers.challenges}
                    onChange={(e) => setAnswers({ ...answers, challenges: e.target.value })}
                    placeholder="e.g. 'Team leads don't give feedback', 'Scrap rate too high', 'Departments don't collaborate'"
                    rows="2"
                    style={textareaStyle}
                  />
                </div>

                {/* Q2 - Technical only */}
                {detectedDomain === 'technical' && (
                  <div>
                    <div className="p-3 rounded-lg mb-2" style={{ background: 'rgba(102,126,234,0.15)', borderLeft: '4px solid #667eea' }}>
                      <span className="text-white font-semibold">⚙️ Technical Training Detected</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}> — Add equipment/process details for maximum relevance</span>
                    </div>
                    <label className="text-white font-semibold block mb-1">⚙️ Equipment, Standards & Metrics</label>
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Specific equipment models, SOP numbers, real metrics make training directly applicable</p>
                    <textarea
                      value={answers.technical}
                      onChange={(e) => setAnswers({ ...answers, technical: e.target.value })}
                      placeholder={`Equipment: "MTS Criterion Model 43 tensile tester"\nStandards: "ASTM E8, ISO 6892-1, SOP-QC-023"\nCurrent metrics: "15% scrap rate, Cpk = 0.98"\nTargets: "Target <5% scrap, Cpk ≥ 1.33"\nCommon issues: "Grip slippage at >50kN"`}
                      rows="4"
                      style={textareaStyle}
                    />
                  </div>
                )}

                {/* Q2 - Behavioral only */}
                {detectedDomain === 'behavioral' && (
                  <div>
                    <div className="p-3 rounded-lg mb-2" style={{ background: 'rgba(255,107,53,0.15)', borderLeft: '4px solid #ff6b35' }}>
                      <span className="text-white font-semibold">🧠 Leadership/Behavioral Training Detected</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}> — Add culture details for maximum relevance</span>
                    </div>
                    <label className="text-white font-semibold block mb-1">🧠 Culture, Dynamics & Real Scenarios</label>
                    <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Be honest about dysfunction. Real culture details = Real training relevance</p>
                    <textarea
                      value={answers.behavioral}
                      onChange={(e) => setAnswers({ ...answers, behavioral: e.target.value })}
                      placeholder={`Culture: "Command-and-control, heroic firefighting celebrated"\nDynamics: "CFO and CMO don't talk, decisions made in WhatsApp"\nPain points: "Managers promoted from technical roles, no people training"\nReal situation: "CEO wants better comms but real problem is strategy disagreement"`}
                      rows="4"
                      style={textareaStyle}
                    />
                  </div>
                )}

                {/* Q3 - Always shown */}
                <div>
                  <label className="text-white font-semibold block mb-1">
                    🎯 What should participants DO differently after training?
                  </label>
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Focus on concrete actions and measurable outcomes</p>
                  <textarea
                    value={answers.outcomes}
                    onChange={(e) => setAnswers({ ...answers, outcomes: e.target.value })}
                    placeholder="e.g. 'Run effective standups in <15 min', 'Reduce scrap rate to <5%', 'Make decisions without 50-person email chains'"
                    rows="2"
                    style={textareaStyle}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowQuestions(false); generateContent(pendingFormData, answers); }}
                  style={{ flex: 1, padding: '14px', fontWeight: 'bold', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '1em' }}
                >
                  🚀 Generate with Context
                </button>
                <button
                  onClick={() => { setShowQuestions(false); generateContent(pendingFormData, { challenges: '', technical: '', behavioral: '', outcomes: '' }); }}
                  style={{ flex: 1, padding: '14px', fontWeight: 'bold', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                >
                  ⏭️ Skip — Generate Now
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
                <div className="mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Monaco, monospace', fontSize: '0.9em' }}>{progressMsg}</div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span>Progress</span><span>{elapsedTime}s elapsed</span>
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
                    <div key={i} className="flex items-center gap-2 text-sm" style={{
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
                    <button onClick={handleUnlock} style={{
                      width: '100%', padding: '14px', fontWeight: 'bold', color: 'white', borderRadius: '12px',
                      border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '1.1em'
                    }}>🔓 Unlock Full Access</button>
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
        <div>
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl mb-6" style={{
            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
          }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                style={activeTab === tab.key ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                } : { color: 'rgba(255,255,255,0.7)' }}
              >{tab.label}</button>
            ))}
          </div>

          <div style={cardStyle}>
            {activeTab === 'synopsis' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {generatedContent
                  ? <ReactMarkdown>{generatedContent.synopsis}</ReactMarkdown>
                  : <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program to see the synopsis here.</p>}
              </div>
            )}

            {activeTab === 'content' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {!generatedContent ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program to see content here.</p>
                  : generatedContent.isLocked ? <UnlockButton />
                  : <ReactMarkdown>{generatedContent.content}</ReactMarkdown>}
              </div>
            )}

            {activeTab === 'facilitator' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {!generatedContent ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program to see the facilitator guide here.</p>
                  : generatedContent.isLocked ? <UnlockButton />
                  : <ReactMarkdown>{generatedContent.facilitator}</ReactMarkdown>}
              </div>
            )}

            {activeTab === 'handout' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {!generatedContent ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program to see the handout here.</p>
                  : generatedContent.isLocked ? <UnlockButton />
                  : <ReactMarkdown>{generatedContent.handout}</ReactMarkdown>}
              </div>
            )}

            {activeTab === 'ppt' && (
              <div>
                {!generatedContent || generatedContent.isLocked ? (
                  <div className="text-center py-10">
                    <p className="text-white text-xl mb-2">🎨 PPT Export</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Generate and unlock your training program first.</p>
                    {generatedContent?.isLocked && <div className="mt-4"><UnlockButton /></div>}
                  </div>
                ) : (
                  <div>
                    <div className="prose prose-invert max-w-none mb-6">
                      <h2 className="text-white">🎨 Ready to Create Your Presentation!</h2>
                      <h3 className="text-white/80">Option 1: Manual Export</h3>
                      <p className="text-white/70">Copy content from the Content tab and paste into PowerPoint, Google Slides, or Keynote.</p>
                      <h3 className="text-white/80">Option 2: AI-Generated PPT (Recommended!)</h3>
                      <p className="text-white/70">Use Gamma AI or GenSpark AI to automatically create your presentation in minutes.</p>
                      <ol className="text-white/70">
                        <li>Copy the AI prompt below</li>
                        <li>Open Gamma AI (gamma.app) or GenSpark AI (genspark.ai)</li>
                        <li>Paste the prompt and generate!</li>
                      </ol>
                    </div>
                    <div className="text-white font-semibold mb-2">📋 AI Prompt for Gamma/GenSpark:</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Monaco, monospace', fontSize: '0.85em', whiteSpace: 'pre-wrap', margin: 0 }}>
                        {getPPTPrompt(pendingFormData?.topic)}
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <button onClick={() => {
                        navigator.clipboard.writeText(getPPTPrompt(pendingFormData?.topic));
                        setPptCopied(true);
                        setTimeout(() => setPptCopied(false), 2000);
                      }} style={{
                        flex: 1, padding: '12px', fontWeight: 'bold', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer',
                        background: pptCopied ? 'rgba(34,197,94,0.8)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}>{pptCopied ? '✅ Copied!' : '📋 Copy AI Prompt'}</button>
                      <button onClick={() => window.open('https://gamma.app', '_blank')} style={{
                        flex: 1, padding: '12px', fontWeight: 'bold', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(255,255,255,0.1)'
                      }}>🎨 Open Gamma AI</button>
                      <button onClick={() => window.open('https://genspark.ai', '_blank')} style={{
                        flex: 1, padding: '12px', fontWeight: 'bold', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(255,255,255,0.1)'
                      }}>✨ Open GenSpark AI</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sample' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                <ReactMarkdown>{SAMPLE_CONTENT}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
