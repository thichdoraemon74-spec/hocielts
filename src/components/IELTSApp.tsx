'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, Square, Send, PenTool, MessageCircle, CheckCircle,
  AlertCircle, BookOpen, Loader2, Award, Zap, Trash2,
  Volume2, Play, Pause, RefreshCw, Sparkles, HelpCircle,
  PlusCircle, Edit3, Compass, Settings, List, Type, User, Wand2
} from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const CEFR_LEVELS = [
  { id: 'A1', name: 'A1 - Beginner', ielts: '1.0 - 2.5', desc: 'Sơ cấp' },
  { id: 'A2', name: 'A2 - Elementary', ielts: '3.0 - 3.5', desc: 'Căn bản' },
  { id: 'B1', name: 'B1 - Intermediate', ielts: '4.0 - 5.0', desc: 'Trung cấp' },
  { id: 'B2', name: 'B2 - Upper Intermediate', ielts: '5.5 - 6.5', desc: 'Trung cấp trên' },
  { id: 'C1', name: 'C1 - Advanced', ielts: '7.0 - 8.0', desc: 'Cao cấp' },
  { id: 'C2', name: 'C2 - Proficient', ielts: '8.5 - 9.0', desc: 'Thành thạo' }
];

const DEFAULT_TOPICS = {
  writing: "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.",
  speaking: "Describe a book that you enjoyed reading because you had to think a lot. You should say:\n- What this book was\n- Why you decided to read it\n- What reading this book made you think about\n- And explain why you enjoyed reading it."
};

const roundIELTS = (num: number) => {
  const floorVal = Math.floor(num);
  const decimal = num - floorVal;
  if (decimal < 0.25) return floorVal;
  if (decimal < 0.75) return floorVal + 0.5;
  return floorVal + 1.0;
};

const translateWithAI = async (text: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const prompt = `Bạn là một từ điển Anh-Việt thông minh. Dịch cụm từ tiếng Anh sau sang tiếng Việt ngắn gọn, dễ hiểu. 
Định dạng bắt buộc (chỉ cần trả về text, không dùng markdown): 
- Nghĩa: [nghĩa tiếng Việt]
- Ví dụ: [1 câu ví dụ tiếng Anh đơn giản] ([Dịch ví dụ sang tiếng Việt])

Từ/cụm từ cần dịch: "${text}"`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.1 }
  };

  for (let i = 0; i < 2; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (err) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error("Lỗi kết nối từ điển.");
};

const generateTopicWithAI = async (theme: string, type: string, targetLevel: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const prompt = type === 'writing'
    ? `Create an IELTS-style Writing task prompt based on the theme: "${theme}".
       IMPORTANT: Adjust the topic complexity, vocabulary, and expectations to be suitable for an English learner at the CEFR ${targetLevel} level.
       If ${targetLevel} is A1/A2, make it a very simple descriptive or opinion task. If B1/B2, make it standard Task 2. If C1/C2, make it highly abstract and complex.
       Provide ONLY the text of the prompt itself, nothing else. Do not use markdown formatting.`
    : `Create an IELTS-style Speaking Part 2 cue card prompt based on the theme: "${theme}".
       IMPORTANT: Adjust the topic complexity to be suitable for an English learner at the CEFR ${targetLevel} level.
       Format: "Describe..." followed by 3-4 bullet points starting with "You should say:".
       Provide ONLY the text of the prompt itself, nothing else. Do not use markdown formatting.`;

  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (data.candidates && data.candidates[0].content.parts[0].text) {
    return data.candidates[0].content.parts[0].text.trim();
  }
  throw new Error("Không thể tạo đề bài.");
};

const pcmToWav = (base64PCM: string, sampleRate = 24000) => {
  const binaryString = atob(base64PCM);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  const buffer = bytes.buffer;

  const numChannels = 1;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const wavBuffer = new ArrayBuffer(44 + buffer.byteLength);
  const view = new DataView(wavBuffer);
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + buffer.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, buffer.byteLength, true);

  const pcmView = new Uint8Array(buffer);
  const wavView = new Uint8Array(wavBuffer, 44);
  wavView.set(pcmView);
  const blob = new Blob([view], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

const generateTTS = async (text: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: text }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } } }
  };
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
    return pcmToWav(data.candidates[0].content.parts[0].inlineData.data, 24000);
  }
  throw new Error("Không thể tạo giọng đọc mẫu lúc này.");
};

const generateBrainstorm = async (topicText: string, type: string, targetLevel: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const systemInstruction = `You are an expert IELTS tutor. Provide brainstorming ideas for the given ${type} prompt.
  Tailor the vocabulary complexity and ideas for a student aiming for CEFR level ${targetLevel}.
  Return ONLY a raw JSON object with this exact structure:
  {
    "outline": ["Point 1: ...", "Point 2: ...", "Point 3: ..."],
    "vocabulary": [
      { "word": "advanced word 1", "meaning": "meaning in vietnamese" },
      { "word": "advanced word 2", "meaning": "meaning in vietnamese" }
    ]
  }`;

  const payload = {
    contents: [{ parts: [{ text: `Topic: "${topicText}"` }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { responseMimeType: "application/json" }
  };
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (data.candidates && data.candidates[0].content.parts[0].text) {
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }
  throw new Error("Không thể tạo dàn ý.");
};

const gradeWithAI = async (text: string, type: string, topicText: string, targetLevel: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const systemInstruction = `You are an expert, strict IELTS examiner. Grade the following student's ${type} response based on the provided prompt.
  The student's target level is CEFR ${targetLevel}. Keep this in mind when providing the 'improved_version' rewrite.
  You MUST return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
  {
    "overall": 6.5,
    "criteria": {
      "task_response": { "score": 6.5, "feedback": "Detailed feedback..." },
      "coherence": { "score": 6.0, "feedback": "Detailed feedback..." },
      "lexical": { "score": 7.0, "feedback": "Detailed feedback..." },
      "grammar": { "score": 6.5, "feedback": "Detailed feedback..." }
    },
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "improved_version": "A complete high-level exemplary rewrite of a key part of their answer to show how to comfortably reach or slightly exceed CEFR ${targetLevel}."
  }`;

  const payload = {
    contents: [{ parts: [{ text: `Prompt Given: "${topicText}"\n\nStudent's Answer: "${text}"` }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { responseMimeType: "application/json" }
  };

  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (err) {
      await new Promise(res => setTimeout(res, 2000 * (i + 1)));
    }
  }
  throw new Error("Không thể kết nối với AI chấm điểm lúc này.");
};

export default function App() {
  const [activeTab, setActiveTab] = useState('writing');
  const [history, setHistory] = useState({ writing: [], speaking: [], chat: [] });
  const [targetLevel, setTargetLevel] = useState('B2');
  const [dictPopup, setDictPopup] = useState({ visible: false, x: 0, y: 0, transform: '', word: '', meaning: '', loading: false });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleSelection = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.split(/\s+/).length <= 5 && !text.includes('\n')) {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();

          if (rect) {
            let topPos = rect.top + window.scrollY - 15;
            let yTransform = '-translate-y-full';

            if (rect.top < 150) {
              topPos = rect.bottom + window.scrollY + 15;
              yTransform = 'translate-y-0';
            }

            setDictPopup(prev => {
              if (prev.word === text && prev.visible) return prev;
              return {
                visible: true,
                x: rect.left + window.scrollX + (rect.width / 2),
                y: topPos,
                transform: yTransform,
                word: text,
                meaning: '',
                loading: true
              }
            });

            try {
              const translation = await translateWithAI(text);
              setDictPopup(prev => prev.word === text ? { ...prev, meaning: translation, loading: false } : prev);
            } catch (e) {
              setDictPopup(prev => prev.word === text ? { ...prev, meaning: "Không thể dịch lúc này.", loading: false } : prev);
            }
          }
        } else {
          setDictPopup(prev => prev.visible ? { ...prev, visible: false } : prev);
        }
      }, 600);
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ielts_score_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) { }
    }
  }, []);

  const clearHistory = () => {
    const freshHistory = { writing: [], speaking: [], chat: [] };
    setHistory(freshHistory);
    localStorage.removeItem('ielts_score_history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 font-sans text-slate-800 pb-24 relative overflow-x-hidden">
      <style>{`
        @keyframes floatBlob1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(60px, -80px) scale(1.2); }
          66% { transform: translate(-40px, 40px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatBlob2 {
          0% { transform: translate(0px, 0px) scale(1.2); }
          50% { transform: translate(-80px, 60px) scale(0.85); }
          100% { transform: translate(0px, 0px) scale(1.2); }
        }
        @keyframes floatBlob3 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, -60px) scale(0.9); }
          66% { transform: translate(50px, 30px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .liquid-blob {
          filter: blur(100px);
          opacity: 0.22;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 liquid-blob" style={{ animation: 'floatBlob1 24s infinite ease-in-out' }} />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 liquid-blob" style={{ animation: 'floatBlob2 28s infinite ease-in-out' }} />
      <div className="absolute bottom-10 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 liquid-blob" style={{ animation: 'floatBlob3 20s infinite ease-in-out' }} />

      {dictPopup.visible && (
        <div
          className={`absolute z-50 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-4 max-w-[280px] w-max text-sm transform -translate-x-1/2 ${dictPopup.transform} transition-all duration-200`}
          style={{ left: dictPopup.x, top: dictPopup.y }}
        >
          <div className="font-black text-indigo-700 text-lg mb-2 flex items-center gap-2 border-b border-white/20 pb-2">
            <BookOpen className="w-4 h-4" /> {dictPopup.word}
          </div>
          {dictPopup.loading ? (
            <div className="flex items-center gap-2 text-indigo-500 font-bold py-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Đang dịch...
            </div>
          ) : (
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed font-semibold">
              {dictPopup.meaning}
            </div>
          )}
        </div>
      )}

      <header className="bg-white/40 backdrop-blur-md border-b border-white/30 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                IELTS Master<span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Glassmorphic AI Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-indigo-500/10 px-3 py-1.5 rounded-full text-indigo-700 font-black border border-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Integrated AI Dictionary
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
        <div className="sticky top-20 z-30 mb-8 mx-auto w-max">
          <div className="flex p-1.5 bg-white/40 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(99,102,241,0.2)] border border-white/60 transition-all duration-300">
            <button
              onClick={() => setActiveTab('writing')}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full font-black text-xs sm:text-sm transition-all duration-300 ${activeTab === 'writing'
                ? 'bg-gradient-to-tr from-indigo-500/90 to-purple-500/90 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
                }`}
            >
              <PenTool className="w-4 h-4" /> Writing
            </button>
            <button
              onClick={() => setActiveTab('speaking')}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full font-black text-xs sm:text-sm transition-all duration-300 ${activeTab === 'speaking'
                ? 'bg-gradient-to-tr from-indigo-500/90 to-purple-500/90 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
                }`}
            >
              <Mic className="w-4 h-4" /> Speaking
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full font-black text-xs sm:text-sm transition-all duration-300 ${activeTab === 'chat'
                ? 'bg-gradient-to-tr from-indigo-500/90 to-purple-500/90 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white/40'
                }`}
            >
              <MessageCircle className="w-4 h-4" /> Chat AI
            </button>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-lg p-6 rounded-3xl border border-white/50 shadow-md text-center animate-in fade-in duration-500">
          <h2 className="text-2xl font-black text-indigo-900 mb-4">Welcome to IELTS Master AI</h2>
          <p className="text-slate-700 font-semibold mb-6">Your Premium AI-Powered IELTS Learning Platform</p>
          <div className="flex items-center justify-center gap-3">
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              className="bg-white/60 border border-white/80 text-indigo-900 px-4 py-2 rounded-xl font-bold"
            >
              {CEFR_LEVELS.map(lvl => (
                <option key={lvl.id} value={lvl.id}>{lvl.id} - {lvl.desc}</option>
              ))}
            </select>
            <span className="text-sm text-slate-600">Target Level</span>
          </div>
          <button
            onClick={clearHistory}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-rose-500/10 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        </div>
      </main>
    </div>
  );
}
