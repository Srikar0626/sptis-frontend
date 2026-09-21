import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Mic, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { sendChat } from '../lib/chatApi';
import { LegStrip, CrowdBadge } from './MetroLeg';
import { secToHHMM } from '../lib/metro';

const GREETING = {
  en: "Hi! I'm the SPTIS assistant. Ask me how to get somewhere, when the next bus or metro is, or how much a trip costs.",
  te: 'హాయ్! నేను SPTIS సహాయకుడిని. ఎక్కడికి ఎలా వెళ్లాలి, తదుపరి బస్సు లేదా మెట్రో ఎప్పుడు వస్తుంది, ఛార్జీ ఎంత — అడగండి.',
  hi: 'नमस्ते! मैं SPTIS सहायक हूँ। कहीं कैसे पहुँचें, अगली बस या मेट्रो कब है, किराया कितना है — पूछिए।'
};

const QUICK = {
  en: ['Miyapur to HITEC City', 'Next trains at Ameerpet', 'Cheapest way to LB Nagar', 'Least crowded bus now'],
  te: ['మియాపూర్ నుండి హైటెక్ సిటీ', 'అమీర్‌పేటలో తదుపరి రైళ్లు', 'ఎల్‌బీ నగర్‌కు చౌక మార్గం', 'తక్కువ రద్దీ బస్సు'],
  hi: ['मियापुर से हाईटेक सिटी', 'अमीरपेट पर अगली ट्रेनें', 'एलबी नगर का सस्ता रास्ता', 'कम भीड़ वाली बस']
};

function JourneyCard({ journey, onOpen }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-base font-black text-slate-900">
          {Math.round(journey.durationSec / 60)}<span className="text-[11px] font-bold text-slate-400 ml-0.5">min</span>
        </span>
        <span className="text-sm font-black text-[#0f4c81]">₹{journey.fare}</span>
      </div>
      <LegStrip journey={journey} compact />
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400">
          {secToHHMM(journey.depSec)}–{secToHHMM(journey.arrSec)}
        </span>
        <CrowdBadge level={journey.crowdLevel} />
      </div>
      {onOpen && (
        <button
          onClick={() => onOpen(journey)}
          className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0f4c81] bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition"
        >
          Open in planner <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

export default function ChatBot({ lang = 'en', onOpenJourney = null }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING[lang] || GREETING.en }]);
  const scroller = useRef(null);
  const recognition = useRef(null);
  const abort = useRef(null);

  useEffect(() => {
    setMessages((m) => (m.length === 1 ? [{ role: 'assistant', content: GREETING[lang] || GREETING.en }] : m));
  }, [lang]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  // keep the panel out of the way of the on-screen keyboard on phones
  useEffect(() => {
    if (!open || !window.visualViewport) return;
    const fit = () => document.documentElement.style.setProperty('--chat-vh', `${window.visualViewport.height}px`);
    fit();
    window.visualViewport.addEventListener('resize', fit);
    return () => window.visualViewport.removeEventListener('resize', fit);
  }, [open]);

  const ask = useCallback(async (text) => {
    const question = (text ?? input).trim();
    if (!question || busy) return;
    setInput('');
    const next = [...messages, { role: 'user', content: question }];
    setMessages([...next, { role: 'assistant', content: '', streaming: true }]);
    setBusy(true);

    abort.current = new AbortController();
    const patch = (fn) => setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = fn(copy[copy.length - 1]);
      return copy;
    });

    await sendChat({
      messages: next.map(({ role, content }) => ({ role, content })),
      lang,
      signal: abort.current.signal,
      onEvent: (event, data) => {
        if (event === 'token') patch((m) => ({ ...m, content: m.content + data.text }));
        if (event === 'thinking') patch((m) => ({ ...m, working: data.tools }));
        if (event === 'journeys') patch((m) => ({ ...m, journeys: data.journeys }));
        if (event === 'error') patch((m) => ({ ...m, content: data.message, error: true }));
        if (event === 'done' || event === 'error') patch((m) => ({ ...m, streaming: false, working: null }));
      }
    }).catch(() => patch((m) => ({ ...m, content: m.content || 'Connection lost. Try again.', streaming: false })));

    setBusy(false);
  }, [input, busy, messages, lang]);

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { recognition.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = { en: 'en-IN', te: 'te-IN', hi: 'hi-IN' }[lang] || 'en-IN';
    r.interimResults = false;
    r.onresult = (e) => { const said = e.results[0][0].transcript; setInput(said); ask(said); };
    r.onend = () => setListening(false);
    r.start();
    recognition.current = r;
    setListening(true);
  };

  const micAvailable = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant"
          className="fixed z-[900] right-4 bottom-20 sm:bottom-6 w-14 h-14 rounded-full bg-[#0f4c81] text-white shadow-[0_8px_24px_rgba(15,76,129,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
        </button>
      )}

      {open && (
        <div
          className="fixed z-[950] inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[380px] sm:h-[600px] sm:max-h-[calc(100vh-3rem)] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ height: 'var(--chat-vh, 100dvh)' }}
        >
          <header
            className="flex items-center justify-between px-4 py-3 bg-[#0f4c81] text-white flex-shrink-0"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-black leading-none">SPTIS Assistant</p>
                <p className="text-[10px] font-bold text-blue-200 mt-0.5">Live buses + metro timetable</p>
              </div>
            </div>
            <button onClick={() => { abort.current?.abort(); setOpen(false); }} aria-label="Close" className="p-2 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </header>

          <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] space-y-2 ${m.role === 'user' ? '' : 'w-full'}`}>
                  {(m.content || m.streaming) && (
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                        m.role === 'user'
                          ? 'bg-[#0f4c81] text-white rounded-br-md'
                          : m.error
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 rounded-bl-md'
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                      }`}
                    >
                      {m.content || (
                        <span className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {m.working ? 'Checking live data…' : 'Thinking…'}
                        </span>
                      )}
                    </div>
                  )}
                  {m.journeys?.map((j, k) => (
                    <JourneyCard key={k} journey={j} onOpen={onOpenJourney} />
                  ))}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(QUICK[lang] || QUICK.en).map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="text-[11px] font-bold px-3 py-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-[#0f4c81] hover:text-[#0f4c81] transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="flex-shrink-0 border-t border-slate-200 bg-white p-3 flex items-end gap-2"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
              placeholder="Where do you want to go?"
              className="flex-1 resize-none max-h-28 px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#0f4c81] focus:bg-white outline-none text-sm font-medium text-slate-800"
            />
            {micAvailable && (
              <button
                onClick={toggleMic}
                aria-label="Speak"
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                  listening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => ask()}
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-full bg-[#0f4c81] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-blue-700 transition"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
