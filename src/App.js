import React, { useState, useEffect } from 'react';
import NeuralBackground from './components/NeuralBackground';
import InputForm from './components/InputForm';
import ReactMarkdown from 'react-markdown';
import LoginModal from './components/LoginModal';

const cardStyle = {
  background: 'rgba(0,0,0,0.1)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.15)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  borderRadius: '24px',
  padding: '16px'
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

const TECHNICAL_DOMAINS = ['engineering', 'manufacturing', 'automotive', 'construction', 'technical', 'quality', 'production', 'machine', 'equipment', 'process', 'safety', 'maintenance'];
const BEHAVIORAL_DOMAINS = ['business', 'sales', 'marketing', 'leadership', 'management', 'communication', 'finance', 'legal', 'education', 'training', 'strategy', 'hr', 'planning', 'team', 'coaching'];

function detectDomain(topic) {
  const lower = topic.toLowerCase();
  if (TECHNICAL_DOMAINS.some(d => lower.includes(d))) return 'technical';
  if (BEHAVIORAL_DOMAINS.some(d => lower.includes(d))) return 'behavioral';
  return 'behavioral';
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
- [Blue Ocean Strategy - Harvard Business Review](https://hbr.org/search?term=blue+ocean+strategy)
- [McKinsey - Strategic Planning Insights](https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights)
- [BCG - Strategy Resources](https://www.bcg.com/capabilities/strategy)

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

const HOW_TO_CONTENT = `# How to Use NEXUS

---

**💬 I learn with your feedback which is important to serve you better. Please spare a few moments to fill a small questionnaire in the Feedback tab.**

---

## 🚀 Quick Start Guide

### Step 1: Enter Your Topic
Enter any professional topic in the "What's Your Training Topic?" field.

**Examples:**
- Strategic Planning
- Leadership Coaching
- Python Programming
- Ophthalmology for Residents
- Car Engine Diagnostics
- Tensile Testing Procedures

### Step 2: Add Company Details (Optional)
- **Company Name**: Enter the company receiving this training
- **Company Context**: Add specific details about their situation
- More detail = more customized training!

### Step 3: Select Settings
- **Audience Level**: Executive, Manager, Emerging Leader, or Individual
- **Format**: Training, Workshop, or Action Learning
- **Duration**: Half Day, 1 Day, or 2 Days
- **Delivery Mode**: In-Person, Virtual, or Hybrid

### Step 4: Click Generate
- Answer the context questions for better results
- Wait 45-60 seconds while NEXUS creates your content
- Click **Unlock Full Access** to view all materials

---

## 📦 What You'll Get

✅ Complete training content with frameworks and examples

✅ Facilitator guide with talking points

✅ Participant handout with note-taking space

✅ PowerPoint export ready for AI generation

---

## 💡 Pro Tips

1. Be specific with your topic
2. Add company context for hyper-customized content
3. Choose audience level carefully
4. Check the **Sample** tab to see example output

---

**Ready? Fill in your topic above and click Generate!**`;

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
  { key: 'feedback', label: '💬 Feedback' },
  { key: 'about', label: '👤 About Creator' },
];

function App() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [detectedDomain, setDetectedDomain] = useState('behavioral');
  const [pptCopied, setPptCopied] = useState(false);

  // ── Auth state ──────────────────────────────────────────────
  const [userEmail, setUserEmail] useState('');
  const [showLogin, setShowLogin] = useState(false); // CHANGED: Start as false
  const [generationAttempted, setGenerationAttempted] = useState(false);
  const [answers, setAnswers] = useState({
    challenges: '',
    technical: '',
    behavioral: '',
    outcomes: ''
  });
  const [feedback, setFeedback] = useState({
    rating: 5,
    whatWorked: '',
    whatNeedsImprovement: '',
    suggestions: '',
    wouldUseAgain: true
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

  // ── Auth handlers ───────────────────────────────────────────
  const handleLoginSuccess = () => {
    const email = localStorage.getItem('userEmail');
    localStorage.setItem('userEmail', email); // Save after successful login
    setUserEmail(email);
    setShowLogin(false);
    setGenerationAttempted(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
    setShowLogin(true);
    setGeneratedContent(null);
  };

  const handleUnlock = async () => {
    const sessionId = generatedContent?.sessionId || generatedContent?.session_id;
    if (!sessionId) { alert("No session ID found!"); return; }
    try {
      const response = await fetch(
        `https://ashishmehra-nexus-backend.hf.space/api/unlock/${sessionId}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const data = JSON.parse(text);
      setGeneratedContent({
        ...generatedContent,
        content: data.content,
        facilitator: data.facilitator,
        handout: data.handout,
        isLocked: false
      });
    } catch (error) {
      alert(`Failed to unlock: ${error.message}`);
    }
  };

  const openContentPopup = (content, title) => {
    const newWin = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');
    if (!newWin) { alert('Please allow popups for this site'); return; }
    newWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        <style>
          body { font-family: Georgia, serif; max-width: 900px; margin: 40px auto; padding: 20px 40px; color: #111; line-height: 1.8; font-size: 16px; background: #fff; }
          h1 { color: #1a1a2e; border-bottom: 3px solid #667eea; padding-bottom: 10px; font-size: 2em; }
          h2 { color: #2d1b4e; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin-top: 30px; font-size: 1.5em; }
          h3 { color: #333; margin-top: 20px; font-size: 1.2em; }
          strong { color: #1a1a2e; }
          ul, ol { margin: 10px 0; padding-left: 25px; }
          li { margin: 6px 0; }
          blockquote { border-left: 4px solid #667eea; padding-left: 15px; color: #555; font-style: italic; margin: 20px 0; }
          hr { border: none; border-top: 2px solid #eee; margin: 30px 0; }
          p { margin: 12px 0; }
          a { color: #667eea; text-decoration: underline; }
          .print-btn { position: fixed; top: 20px; right: 20px; padding: 12px 24px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; box-shadow: 0 4px 15px rgba(102,126,234,0.4); z-index: 1000; }
          .print-btn:hover { opacity: 0.9; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
        <div id="content"></div>
        <script>
          const rawContent = ${JSON.stringify(content)};
          document.getElementById('content').innerHTML = marked.parse(rawContent);
        </script>
      </body>
      </html>
    `);
    newWin.document.close();
  };

  const closeQuestionsModal = () => {
    setShowQuestions(false);
    setPendingFormData(null);
  };

  const handleFormSubmit = (formData) => {
    const domain = detectDomain(formData.topic);
    setDetectedDomain(domain);
    setPendingFormData(formData);
    setAnswers({ challenges: '', technical: '', behavioral: '', outcomes: '' });
    setShowQuestions(true);
  };

  const generateContent = async (formData, extraAnswers) => {
    // Check if user is logged in
    if (!userEmail) {
      setGenerationAttempted(true);
      setShowLogin(true);
      return;
    }
    const startTime = Date.now();
    console.log('🚀 generateContent called!', formData);
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

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('https://ashishmehra-nexus-backend.hf.space/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          topic: formData.topic,
          companyName: formData.companyName,
          companyContext: enhancedContext.trim(),
          audienceLevel: formData.audience,
          format: formData.format,
          duration: formData.duration,
          deliveryMode: formData.deliveryMode,
          email: userEmail,
        }),
      });

      clearTimeout(timeoutId);
      console.log('✅ Fetch completed!', response.status);

      if (response.status === 403) {
        const errData = await response.json();
        setIsGenerating(false);
        alert(`⚠️ ${errData.message || 'Generation limit reached. Please purchase a package to continue.'}`);
        return;
      }

      if (!response.ok) throw new Error('Generation failed');

      const text = await response.text();
      console.log('📊 Response size:', text.length, 'characters');
      const data = JSON.parse(text);
      const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log('✅ JSON parsed!', data);

      setGeneratedContent({ ...data, isLocked: true, timeTaken });
      setActiveTab('synopsis');
      setIsGenerating(false);
    } catch (error) {
      console.error('❌ Full error:', error);
      setIsGenerating(false);
      if (error.name === 'AbortError') {
        alert(`Timed out after ${Math.round((Date.now() - startTime) / 1000)}s`);
      } else {
        alert(`Error: ${error.message} | Type: ${error.name}`);
      }
    }
  };

  const handleSubmitFeedback = async () => {
    if (!generatedContent) {
      alert('Please generate a training program first!');
      return;
    }
    try {
      const response = await fetch('https://ashishmehra-nexus-backend.hf.space/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId: generatedContent.generationId || generatedContent.session_id,
          topic: pendingFormData?.topic || 'Unknown',
          companyName: pendingFormData?.companyName || '',
          rating: feedback.rating,
          whatWorked: feedback.whatWorked,
          whatNeedsImprovement: feedback.whatNeedsImprovement,
          suggestions: feedback.suggestions,
          wouldUseAgain: feedback.wouldUseAgain
        }),
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setFeedback({ rating: 5, whatWorked: '', whatNeedsImprovement: '', suggestions: '', wouldUseAgain: true });
        setFeedbackSubmitted(false);
      }, 3000);
    } catch (error) {
      alert(`Failed to submit feedback: ${error.message}`);
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

  const OpenFullPageButton = ({ content, title }) => (
    <button
      onClick={() => openContentPopup(content, title)}
      style={{
        marginBottom: '16px', padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em', display: 'block'
      }}
    >
      📄 Open Full Page (White Background)
    </button>
  );

  // ── Show login ONLY after generation attempt ─────────────────────────────
  if (showLogin && generationAttempted) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <NeuralBackground />

      <div className="relative z-10 container mx-auto px-4" style={{ maxWidth: '1400px' }}>

        {/* Hero Section */}
        <div className="container mx-auto mb-3 relative overflow-hidden" style={{
          maxWidth: '1400px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 50%, rgba(240, 147, 251, 0.3) 100%)',
          backdropFilter: 'blur(10px)',
          padding: '20px 30px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div className="text-center relative z-10">
            <h1 className="text-4xl font-black text-white mb-1" style={{ letterSpacing: '-2px' }}>🧠 NEXUS</h1>
            <p className="text-lg text-white mb-1" style={{ opacity: 0.95 }}>AI-Powered Training Development Platform</p>
            <p className="text-sm text-white max-w-3xl mx-auto mb-3" style={{ opacity: 0.9, lineHeight: '1.6' }}>
              Transform training development from weeks to minutes. Generate research-backed, pedagogically sound training programs — instantly.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['✨ Domain Agnostic', '⚡ 45-Second Generation', '🎓 Research-Backed', '🔄 Auto-Customized', '📊 Export Ready'].map(pill => (
                <span key={pill} className="px-3 py-1 rounded-full text-white font-semibold text-xs" style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}>{pill}</span>
              ))}
            </div>
          </div>

          {/* User bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '12px', paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85em' }}>
              👤 <strong>{userEmail}</strong>
            </span>
            <button onClick={handleLogout} style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
              color: 'white', padding: '6px 16px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '0.85em', fontWeight: '600'
            }}>Logout</button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="container mx-auto flex justify-around flex-wrap gap-3 p-4 rounded-2xl mb-4" style={{
          maxWidth: '1400px',
          background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          {[['∞','Domain Agnostic'],['3-5','Modules'],['45s','Avg Time'],['100%','Custom']].map(([num, label]) => (
            <div key={label} className="text-center text-white">
              <div className="text-3xl font-black mb-0" style={{
                background: 'linear-gradient(135deg, #667eea, #f093fb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>{num}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Enhancement Questions Modal */}
        {showQuestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
            <div style={{ ...cardStyle, maxWidth: '650px', width: '92%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
              <button onClick={closeQuestionsModal} style={{
                position: 'absolute', top: '15px', right: '20px',
                background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'white'
              }}>✕</button>

              <div className="text-center mb-4 p-3 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3))' }}>
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

              <div className="space-y-3">
                <div>
                  <label className="text-white font-semibold block mb-1">🎯 What specific challenges should this training address?</label>
                  <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Be specific about the ACTUAL problem</p>
                  <textarea value={answers.challenges} onChange={(e) => setAnswers({ ...answers, challenges: e.target.value })}
                    placeholder="e.g. 'Team leads don't give feedback', 'Scrap rate too high'" rows="2" style={textareaStyle} />
                </div>

                {detectedDomain === 'technical' && (
                  <div>
                    <div className="p-3 rounded-lg mb-2" style={{ background: 'rgba(102,126,234,0.15)', borderLeft: '4px solid #667eea' }}>
                      <span className="text-white font-semibold">⚙️ Add equipment/process details</span>
                    </div>
                    <label className="text-white font-semibold block mb-1">⚙️ Equipment, Standards & Metrics</label>
                    <textarea value={answers.technical} onChange={(e) => setAnswers({ ...answers, technical: e.target.value })}
                      placeholder="Equipment, SOP numbers, metrics" rows="3" style={textareaStyle} />
                  </div>
                )}

                {detectedDomain === 'behavioral' && (
                  <div>
                    <div className="p-3 rounded-lg mb-2" style={{ background: 'rgba(255,107,53,0.15)', borderLeft: '4px solid #ff6b35' }}>
                      <span className="text-white font-semibold">🧠 Add culture details</span>
                    </div>
                    <label className="text-white font-semibold block mb-1">🧠 Culture, Dynamics & Real Scenarios</label>
                    <textarea value={answers.behavioral} onChange={(e) => setAnswers({ ...answers, behavioral: e.target.value })}
                      placeholder="Culture dynamics, team issues" rows="3" style={textareaStyle} />
                  </div>
                )}

                <div>
                  <label className="text-white font-semibold block mb-1">🎯 What should participants DO differently?</label>
                  <textarea value={answers.outcomes} onChange={(e) => setAnswers({ ...answers, outcomes: e.target.value })}
                    placeholder="e.g. 'Run standups in <15 min', 'Reduce scrap to <5%'" rows="2" style={textareaStyle} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowQuestions(false); generateContent(pendingFormData, answers); }}
                  style={{ flex: 1, padding: '14px', fontWeight: 'bold', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  🚀 Generate with Context
                </button>
                <button onClick={() => { setShowQuestions(false); generateContent(pendingFormData, { challenges: '', technical: '', behavioral: '', outcomes: '' }); }}
                  style={{ flex: 1, padding: '14px', fontWeight: 'bold', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  ⏭️ Skip — Generate Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4" style={{ maxWidth: '1400px' }}>
          <div className="lg:col-span-2">
            <InputForm onGenerate={handleFormSubmit} isGenerating={isGenerating} />
          </div>

          {/* Right Panel */}
          <div style={cardStyle}>
            {isGenerating ? (
              <div>
                <div className="text-white font-bold text-lg mb-4">⚡ Generating Your Training...</div>
                <div className="mb-2" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Monaco, monospace', fontSize: '0.9em' }}>{progressMsg}</div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <span>Progress</span><span>{elapsedTime}s elapsed</span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-2 rounded-full transition-all duration-1000" style={{
                      width: `${Math.min((elapsedTime / 150) * 100, 95)}%`,
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
                  <div className="mb-4 text-center">
                    <button onClick={handleUnlock} style={{
                      width: '100%', padding: '14px', fontWeight: 'bold', color: 'white', borderRadius: '12px',
                      border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '1.1em'
                    }}>🔓 Unlock Full Access</button>
                  </div>
                )}
                <div className="text-white font-semibold text-lg mb-3">📊 Generation Complete!</div>
                <div style={{ fontFamily: 'Monaco, monospace', fontSize: '0.85em', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
                  ✅ Training Generated!<br /><br />
                  📌 Topic: {pendingFormData?.topic}<br />
                  🎯 Format: {pendingFormData?.format}<br />
                  👥 Audience: {pendingFormData?.audience}<br />
                  ⏱️ Duration: {pendingFormData?.duration}<br />
                  🌍 Domain: {generatedContent.domain || 'Business'}<br />
                  ⚡ Time Taken: {generatedContent.timeTaken}s<br /><br />
                  {generatedContent.isLocked
                    ? '🔒 Click Unlock above to view full content'
                    : '🔓 Content unlocked and ready!'}
                  <br /><br />
                  📋 Available Tabs:<br />
                  ✓ Synopsis — Overview & objectives<br />
                  ✓ Content — Full training modules<br />
                  ✓ Facilitator — Delivery guide<br />
                  ✓ Handout — Participant materials<br />
                  ✓ PPT — Export to presentation<br />
                  ✓ Feedback — Share your experience<br /><br />
                  💬 <strong style={{ color: 'white' }}>Please share your feedback to help us improve!</strong>
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
        <div className="container mx-auto mb-4" style={{ maxWidth: '1400px' }}>
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl mb-3" style={{
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            {TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs transition-all"
                style={activeTab === tab.key ? {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
                } : { color: 'rgba(255,255,255,0.7)' }}
              >{tab.label}</button>
            ))}
          </div>

          <div style={{ ...cardStyle, padding: '20px', minHeight: '300px' }}>

            {/* SYNOPSIS TAB */}
            {activeTab === 'synopsis' && (
              <div className="prose prose-invert max-w-none overflow-auto"
                style={{ maxHeight: '250px', fontFamily: "'Inter', -apple-system, sans-serif", fontSize: '0.95rem', lineHeight: '1.6' }}>
                <style>{`
                  .synopsis-content h1 { font-size: 1.8em; font-weight: 800; margin: 0 0 0.5em 0; color: white; }
                  .synopsis-content h2 { font-size: 1.3em; font-weight: 700; margin: 1em 0 0.5em 0; color: #a78bfa; }
                  .synopsis-content h3 { font-size: 1.1em; font-weight: 600; margin: 0.8em 0 0.3em 0; color: rgba(255,255,255,0.9); }
                  .synopsis-content p { margin: 0.5em 0; color: rgba(255,255,255,0.85); }
                  .synopsis-content strong { color: white; font-weight: 600; }
                  .synopsis-content ul { margin: 0.5em 0; padding-left: 1.2em; }
                  .synopsis-content li { margin: 0.3em 0; color: rgba(255,255,255,0.85); }
                  .synopsis-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.2); margin: 1em 0; }
                `}</style>
                <div className="synopsis-content">
                  <ReactMarkdown>
                    {generatedContent ? generatedContent.synopsis : HOW_TO_CONTENT}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[400px]">
                {!generatedContent
                  ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program to see content here.</p>
                  : generatedContent.isLocked
                  ? <UnlockButton />
                  : (
                    <div>
                      <OpenFullPageButton content={generatedContent.content} title="Training Content" />
                      <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
                    </div>
                  )}
              </div>
            )}

            {/* FACILITATOR TAB */}
            {activeTab === 'facilitator' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {!generatedContent
                  ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program first.</p>
                  : generatedContent.isLocked
                  ? <UnlockButton />
                  : (
                    <div>
                      <OpenFullPageButton content={generatedContent.facilitator} title="Facilitator Guide" />
                      <ReactMarkdown>{generatedContent.facilitator}</ReactMarkdown>
                    </div>
                  )}
              </div>
            )}

            {/* HANDOUT TAB */}
            {activeTab === 'handout' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                {!generatedContent
                  ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Generate a training program first.</p>
                  : generatedContent.isLocked
                  ? <UnlockButton />
                  : (
                    <div>
                      <OpenFullPageButton content={generatedContent.handout} title="Participant Handout" />
                      <ReactMarkdown>{generatedContent.handout}</ReactMarkdown>
                    </div>
                  )}
              </div>
            )}

            {/* PPT TAB */}
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
                    <div className="prose prose-invert max-w-none mb-4">
                      <h2 className="text-white">🎨 Ready to Create Your Presentation!</h2>
                      <h3 className="text-white/80">Option 1: Manual Export</h3>
                      <p className="text-white/70">Copy content from the Content tab and paste into PowerPoint.</p>
                      <h3 className="text-white/80">Option 2: AI-Generated PPT (Recommended!)</h3>
                      <p className="text-white/70">Use Gamma AI or GenSpark AI to automatically create your presentation.</p>
                    </div>
                    <div className="text-white font-semibold mb-2">📋 AI Prompt for Gamma/GenSpark:</div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Monaco, monospace', fontSize: '0.85em', whiteSpace: 'pre-wrap', margin: 0 }}>
                        {getPPTPrompt(pendingFormData?.topic)}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
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

            {/* SAMPLE TAB */}
            {activeTab === 'sample' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                <ReactMarkdown>{SAMPLE_CONTENT}</ReactMarkdown>
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'feedback' && (
              <div>
                <div className="mb-4 p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))' }}>
                  <h2 className="text-2xl font-bold text-white mb-2">💬 Your Feedback Matters!</h2>
                  <p className="text-white/80" style={{ fontSize: '1.1em', fontWeight: '600' }}>
                    Help us serve you better by sharing your experience with NEXUS
                  </p>
                </div>
                {feedbackSubmitted ? (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl text-white font-bold mb-2">Thank you for your feedback!</h3>
                    <p className="text-white/70">Your input helps make NEXUS smarter and more useful.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-white font-semibold block mb-2">⭐ Overall Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setFeedback({...feedback, rating: star})}
                            style={{ fontSize: '2em', background: 'none', border: 'none', cursor: 'pointer',
                            color: star <= feedback.rating ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>★</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-white font-semibold block mb-2">✅ What worked well?</label>
                      <textarea value={feedback.whatWorked} onChange={(e) => setFeedback({...feedback, whatWorked: e.target.value})}
                        placeholder="e.g., Frameworks were relevant, examples were specific..." rows="3" style={textareaStyle} />
                    </div>
                    <div>
                      <label className="text-white font-semibold block mb-2">🔧 What needs improvement?</label>
                      <textarea value={feedback.whatNeedsImprovement} onChange={(e) => setFeedback({...feedback, whatNeedsImprovement: e.target.value})}
                        placeholder="e.g., Exercises could be more detailed, needed more examples..." rows="3" style={textareaStyle} />
                    </div>
                    <div>
                      <label className="text-white font-semibold block mb-2">💡 Any suggestions?</label>
                      <textarea value={feedback.suggestions} onChange={(e) => setFeedback({...feedback, suggestions: e.target.value})}
                        placeholder="e.g., Add video recommendations, include templates..." rows="3" style={textareaStyle} />
                    </div>
                    <div>
                      <label className="text-white font-semibold block mb-2">🔄 Would you use NEXUS again?</label>
                      <div className="flex gap-4">
                        <button onClick={() => setFeedback({...feedback, wouldUseAgain: true})}
                          style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid', cursor: 'pointer',
                          borderColor: feedback.wouldUseAgain ? '#10b981' : 'rgba(255,255,255,0.2)',
                          background: feedback.wouldUseAgain ? 'rgba(16,185,129,0.2)' : 'transparent',
                          color: 'white', fontWeight: 'bold' }}>✅ Yes</button>
                        <button onClick={() => setFeedback({...feedback, wouldUseAgain: false})}
                          style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid', cursor: 'pointer',
                          borderColor: !feedback.wouldUseAgain ? '#ef4444' : 'rgba(255,255,255,0.2)',
                          background: !feedback.wouldUseAgain ? 'rgba(239,68,68,0.2)' : 'transparent',
                          color: 'white', fontWeight: 'bold' }}>❌ No</button>
                      </div>
                    </div>
                    <button onClick={handleSubmitFeedback}
                      style={{ width: '100%', padding: '16px', fontWeight: 'bold', color: 'white', borderRadius: '12px',
                      border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '1.1em' }}>
                      🚀 Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ABOUT CREATOR TAB */}
            {activeTab === 'about' && (
              <div className="prose prose-invert max-w-none overflow-auto max-h-[600px]">
                <h1 style={{ color: 'white' }}>About the Creator</h1>
                <h2 style={{ color: 'rgba(255,255,255,0.9)' }}>Your Professional Thought Partner</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <strong style={{ color: 'white' }}>Ashish Mehra</strong> is an ICF Level 2 certified transformational coach
                  and leadership trainer with 1,000+ hours of coaching experience, working with CEOs and senior leaders
                  across India, Canada, Singapore, and Africa.
                </p>
                <h2 style={{ color: 'rgba(255,255,255,0.9)' }}>Credentials & Experience</h2>
                <ul style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <li>INSEAD Alumnus</li>
                  <li>ICF Level 2 Certified Coach</li>
                  <li>3 decades of experience: Xerox, Airtel, Singtel, Hitachi</li>
                  <li>Trained by Centre for Creative Leadership</li>
                </ul>
                <h2 style={{ color: 'rgba(255,255,255,0.9)' }}>Why NEXUS?</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  After 5 years of manually creating training programs taking 40-80 hours each, I created NEXUS
                  to combine my expertise with AI to generate complete, research-backed training programs instantly.
                </p>
                <h2 style={{ color: 'rgba(255,255,255,0.9)' }}>Connect With Me</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  📧 ashish.mehra@interfaceinc.co.in<br />
                  💼 <a href="https://www.linkedin.com/in/asmehra" target="_blank" rel="noreferrer" style={{ color: '#667eea' }}>
                    linkedin.com/in/asmehra
                  </a><br />
                  🌐 <a href="https://interfaceinc.co.in" target="_blank" rel="noreferrer" style={{ color: '#667eea' }}>
                    interfaceinc.co.in
                  </a>
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
