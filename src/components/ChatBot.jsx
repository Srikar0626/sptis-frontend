import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MessageCircle, X, Send, Mic, Sparkles, ArrowRight, ArrowLeft,
  Route as RouteIcon, Bus, Train, Coins, HelpCircle, Zap, Users, MapPin
} from 'lucide-react';
import { LegStrip, CrowdBadge } from './MetroLeg';
import {
  loadMetro, getMetro, findStation, nextTrains, metroFare, secToHHMM, secondsSinceMidnight
} from '../lib/metro';
import {
  buildPlaces, placeOptions, resolvePlace, planJourneys, sortJourneys, BUS_STOP_SECONDS
} from '../lib/routing';

/**
 * ChatBot.jsx — a guided assistant with no AI call and no free-text
 * parsing. Every answer comes straight from the same client-side engine
 * the planner itself uses (lib/routing.js + lib/metro.js), so it can never
 * fail because a server or API key is down, and it can never say
 * something the planner wouldn't also show.
 *
 * The only typing involved is picking a stop or station name from an
 * autocomplete list — everything else is a button.
 */

const GREETING = {
  en: "Hi! I'm the SPTIS assistant. Pick what you need below.",
  te: 'హాయ్! నేను SPTIS సహాయకుడిని. కింద మీకు కావలసినది ఎంచుకోండి.',
  hi: 'नमस्ते! मैं SPTIS सहायक हूँ। नीचे से चुनिए कि आपको क्या चाहिए।'
};

const SORT_LABEL = { fastest: 'Fastest', cheapest: 'Cheapest', fewest: 'Fewest changes', least_crowded: 'Least crowded' };
const SORT_ICON = { fastest: Zap, cheapest: Coins, fewest: RouteIcon, least_crowded: Users };

const MENU = [
  { id: 'plan', label: 'Plan a journey', Icon: RouteIcon },
  { id: 'next_bus', label: 'Next buses at a stop', Icon: Bus },
  { id: 'track_bus', label: 'Track a bus', Icon: MapPin },
  { id: 'next_train', label: 'Next trains', Icon: Train },
  { id: 'fare', label: 'Metro fare', Icon: Coins },
  { id: 'guide', label: 'How to use this', Icon: HelpCircle }
];

const GUIDE_STEPS = [
  'Tap a button below to say what you want — plan a journey, check next buses, track a bus, and so on.',
  'When asked for a stop or station, start typing and tap the matching name from the list that appears. The mic button lets you say it instead.',
  'For a journey, after picking From and To you can choose Fastest, Cheapest, Fewest changes or Least crowded.',
  'Tap "Open in planner" under any journey card to see it full-size with the map.',
  'Tap "Menu" any time to start over.'
];

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
          onClick={onOpen}
          className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#0f4c81] bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition"
        >
          Open in planner <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/** One autocomplete text field for a stop/station name, with a mic button. */
function PlaceField({ places, placeholder, lang, onSubmit, onBack }) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const box = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  const matches = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return [];
    return places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [text, places]);

  const pick = (name) => { setText(''); setOpen(false); onSubmit(name); };

  const micAvailable = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { recognition.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = { en: 'en-IN', te: 'te-IN', hi: 'hi-IN' }[lang] || 'en-IN';
    r.interimResults = false;
    r.onresult = (e) => { setText(e.results[0][0].transcript); setOpen(true); };
    r.onend = () => setListening(false);
    r.start();
    recognition.current = r;
    setListening(true);
  };

  return (
    <div className="p-3 border-t border-slate-200 bg-white">
      <div className="relative" ref={box}>
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={text}
            onChange={(e) => { setText(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => { if (e.key === 'Enter' && matches[0]) pick(matches[0].name); }}
            placeholder={placeholder}
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#0f4c81] focus:bg-white outline-none text-sm font-bold text-slate-800"
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
        </div>
        {open && matches.length > 0 && (
          <ul className="absolute z-10 bottom-full mb-2 w-full max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
            {matches.map((p) => (
              <li
                key={p.id}
                onClick={() => pick(p.name)}
                className="px-3.5 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-bold text-slate-700 truncate flex items-center gap-2"
              >
                {p.kind === 'metro' ? <Train className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> : <Bus className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={onBack} className="mt-2 flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600">
        <ArrowLeft className="w-3 h-3" /> Back to menu
      </button>
    </div>
  );
}

function BusPicker({ buses, onSubmit, onBack }) {
  const [text, setText] = useState('');
  const live = useMemo(
    () => buses.filter((b) => !b.bufferActive).slice(0, 8).map((b) => b.id),
    [buses]
  );
  return (
    <div className="p-3 border-t border-slate-200 bg-white space-y-2">
      {live.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {live.map((id) => (
            <button
              key={id}
              onClick={() => onSubmit(id)}
              className="text-[11px] font-black px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:border-[#0f4c81] hover:text-[#0f4c81]"
            >
              {id}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { onSubmit(text.trim()); setText(''); } }}
          placeholder="Or type a bus number e.g. TS-10-1010"
          className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#0f4c81] focus:bg-white outline-none text-sm font-bold text-slate-800"
        />
        <button
          onClick={() => { if (text.trim()) { onSubmit(text.trim()); setText(''); } }}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-[#0f4c81] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <button onClick={onBack} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600">
        <ArrowLeft className="w-3 h-3" /> Back to menu
      </button>
    </div>
  );
}

export default function ChatBot({ lang = 'en', buses = [], onOpenJourney = null }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('menu');
  const [pending, setPending] = useState({});
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING.en }]);
  const [metroReady, setMetroReady] = useState(!!getMetro());
  const scroller = useRef(null);

  useEffect(() => { loadMetro().then(() => setMetroReady(true)).catch(() => setMetroReady(false)); }, []);

  useEffect(() => {
    setMessages((m) => (m.length === 1 ? [{ role: 'assistant', content: GREETING[lang] || GREETING.en }] : m));
  }, [lang]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, step]);

  // keep the panel out of the way of the on-screen keyboard on phones
  useEffect(() => {
    if (!open || !window.visualViewport) return;
    const fit = () => document.documentElement.style.setProperty('--chat-vh', `${window.visualViewport.height}px`);
    fit();
    window.visualViewport.addEventListener('resize', fit);
    return () => window.visualViewport.removeEventListener('resize', fit);
  }, [open]);

  const places = useMemo(() => buildPlaces(buses), [buses.length, metroReady]);
  const options = useMemo(() => placeOptions(places), [places]);

  const say = (content, extra = {}) => setMessages((m) => [...m, { role: 'assistant', content, ...extra }]);
  const sayUser = (content) => setMessages((m) => [...m, { role: 'user', content }]);
  const toMenu = () => { setStep('menu'); setPending({}); };

  const pickMenu = (id) => {
    sayUser(MENU.find((m) => m.id === id)?.label || id);
    setPending({});
    if (id === 'plan') { say('Where are you starting from?'); setStep('plan_from'); }
    else if (id === 'next_bus') { say('Which stop?'); setStep('bus_next_stop'); }
    else if (id === 'track_bus') { say("Which bus? Tap one that's live now, or type its number."); setStep('bus_track'); }
    else if (id === 'next_train') { say('Which metro station?'); setStep('metro_next'); }
    else if (id === 'fare') { say('Metro fare — which station are you starting from?'); setStep('metro_fare_from'); }
    else if (id === 'guide') { say('Here\'s how this works:', { guide: true }); setStep('guide'); }
  };

  const runFilter = (mode) => {
    sayUser(SORT_LABEL[mode]);
    const origin = resolvePlace(places, pending.from);
    const dest = resolvePlace(places, pending.to);
    if (!origin || !dest) {
      say(`I couldn't match "${!origin ? pending.from : pending.to}" to a stop or station. Let's try again — where are you starting from?`);
      setPending({});
      setStep('plan_from');
      return;
    }
    try {
      const list = sortJourneys(planJourneys({ buses, from: origin, to: dest, places }), mode).slice(0, 3);
      if (!list.length) {
        say(`No route found from ${origin.name} to ${dest.name} right now. Try a nearby hub such as Ameerpet or MG Bus Station.`);
      } else {
        say(`Here's the ${SORT_LABEL[mode].toLowerCase()} way from ${origin.name} to ${dest.name}:`, {
          journeys: list, journeyFrom: origin.name, journeyTo: dest.name
        });
      }
    } catch (err) {
      console.error('Chat journey search failed:', err);
      say('Something went wrong planning that route. Please try again.');
    }
    toMenu();
  };

  const answerNextBuses = (stopName) => {
    const place = resolvePlace(places, stopName);
    if (!place) { say(`I don't recognise "${stopName}" as a stop.`); toMenu(); return; }
    const rows = [];
    buses.forEach((bus) => {
      const idx = (bus.stops || []).findIndex((s) => s.name === place.name);
      if (idx < 0) return;
      const here = bus.currentStopIndex ?? 0;
      if (idx < here) return;
      const eta = (bus.etaSeconds || 0) + (idx - here) * BUS_STOP_SECONDS;
      rows.push({
        id: bus.id, route: bus.route, mins: Math.max(0, Math.round(eta / 60)),
        occ: bus.occupiedSeats || 0, seats: bus.totalSeats || 50
      });
    });
    rows.sort((a, b) => a.mins - b.mins);
    if (!rows.length) say(`No buses currently heading to ${place.name}.`);
    else say(`Buses heading to ${place.name}:`, { busRows: rows.slice(0, 6) });
    toMenu();
  };

  const answerBusStatus = (id) => {
    const bus = buses.find((b) => String(b.id).toLowerCase() === id.trim().toLowerCase());
    if (!bus) { say(`I can't find a bus numbered "${id}".`); toMenu(); return; }
    const stop = bus.stops[bus.currentStopIndex];
    const next = bus.stops[(bus.currentStopIndex + 1) % bus.stops.length];
    const where = bus.bufferActive ? `waiting at ${stop?.name}` : `on the way to ${next?.name}`;
    say(`Bus ${bus.id} (${bus.route}) is ${where}. ${bus.occupiedSeats}/${bus.totalSeats} seats taken.`);
    toMenu();
  };

  const answerNextTrains = (stationName) => {
    const st = findStation(stationName);
    if (!st) { say(`I don't recognise "${stationName}" as a metro station.`); toMenu(); return; }
    const departures = nextTrains(st.id, { after: secondsSinceMidnight(), limit: 5 });
    if (!departures.length) say(`No more trains today from ${st.name}.`);
    else say(`Next trains from ${st.name}:`, {
      trainRows: departures.map((d) => ({ line: d.line, towards: d.terminus, at: secToHHMM(d.depSec), inMin: Math.max(0, d.inMin) }))
    });
    toMenu();
  };

  const answerFare = (fromName, toName) => {
    const a = findStation(fromName);
    const b = findStation(toName);
    if (!a || !b) { say(`I couldn't match "${!a ? fromName : toName}" to a metro station.`); toMenu(); return; }
    const cash = metroFare(a.id, b.id);
    if (cash === null) say(`The fare between ${a.name} and ${b.name} isn't published.`);
    else say(`${a.name} → ${b.name}: ₹${cash} cash, ₹${metroFare(a.id, b.id, { smartCard: true })} with smart card.`);
    toMenu();
  };

  const submitPlace = (name) => {
    sayUser(name);
    if (step === 'plan_from') {
      setPending((p) => ({ ...p, from: name }));
      say(`Got it — from ${name}. And where to?`);
      setStep('plan_to');
    } else if (step === 'plan_to') {
      setPending((p) => ({ ...p, to: name }));
      say('How should I sort the options?', { filters: true });
      setStep('plan_filter');
    } else if (step === 'bus_next_stop') {
      answerNextBuses(name);
    } else if (step === 'metro_next') {
      answerNextTrains(name);
    } else if (step === 'metro_fare_from') {
      setPending((p) => ({ ...p, fareFrom: name }));
      say(`From ${name}. And the destination station?`);
      setStep('metro_fare_to');
    } else if (step === 'metro_fare_to') {
      answerFare(pending.fareFrom, name);
    }
  };

  const isPlaceStep = ['plan_from', 'plan_to', 'bus_next_stop', 'metro_next', 'metro_fare_from', 'metro_fare_to'].includes(step);
  const placePlaceholder = {
    plan_from: 'Type a stop or metro station',
    plan_to: 'Type a stop or metro station',
    bus_next_stop: 'Type a bus stop',
    metro_next: 'Type a metro station',
    metro_fare_from: 'Type a metro station',
    metro_fare_to: 'Type a metro station'
  }[step];

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
            <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </header>

          <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] space-y-2 ${m.role === 'user' ? '' : 'w-full'}`}>
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#0f4c81] text-white rounded-br-md'
                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md'
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.guide && (
                    <ol className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                      {GUIDE_STEPS.map((g, k) => (
                        <li key={k} className="flex gap-2.5 text-xs font-medium text-slate-600 leading-relaxed">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-[#0f4c81] text-[11px] font-black flex items-center justify-center">{k + 1}</span>
                          {g}
                        </li>
                      ))}
                    </ol>
                  )}

                  {m.journeys?.map((j, k) => (
                    <JourneyCard key={k} journey={j} onOpen={onOpenJourney ? () => onOpenJourney(m.journeyFrom, m.journeyTo) : null} />
                  ))}

                  {m.busRows && (
                    <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                      {m.busRows.map((r, k) => (
                        <div key={k} className="flex items-center justify-between px-3.5 py-2.5">
                          <div>
                            <p className="text-xs font-black text-slate-800">{r.id}</p>
                            <p className="text-[10px] font-bold text-slate-400">{r.route}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-[#0f4c81]">{r.mins} min</p>
                            <p className="text-[10px] font-bold text-slate-400">{r.occ}/{r.seats} seats</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.trainRows && (
                    <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                      {m.trainRows.map((r, k) => (
                        <div key={k} className="flex items-center justify-between px-3.5 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded" style={{ background: { RED: '#E31E24', GREEN: '#009846', BLUE: '#007ABB' }[r.line] || '#475569' }}>
                              {r.line}
                            </span>
                            <span className="text-xs font-bold text-slate-600">→ {r.towards}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-[#0f4c81]">{r.at}</p>
                            <p className="text-[10px] font-bold text-slate-400">{r.inMin} min</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {step === 'menu' && (
            <div className="grid grid-cols-2 gap-2 p-3 border-t border-slate-200 bg-white">
              {MENU.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => pickMenu(id)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-700 text-xs font-black hover:border-[#0f4c81] hover:text-[#0f4c81] transition text-left"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" /> {label}
                </button>
              ))}
            </div>
          )}

          {isPlaceStep && (
            <PlaceField places={options} placeholder={placePlaceholder} lang={lang} onSubmit={submitPlace} onBack={toMenu} />
          )}

          {step === 'bus_track' && (
            <BusPicker buses={buses} onSubmit={answerBusStatus} onBack={toMenu} />
          )}

          {step === 'plan_filter' && (
            <div className="p-3 border-t border-slate-200 bg-white space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(SORT_LABEL).map((mode) => {
                  const Icon = SORT_ICON[mode];
                  return (
                    <button
                      key={mode}
                      onClick={() => runFilter(mode)}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-100 text-slate-700 text-[11px] font-black hover:border-[#0f4c81] hover:text-[#0f4c81] transition"
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" /> {SORT_LABEL[mode]}
                    </button>
                  );
                })}
              </div>
              <button onClick={toMenu} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-3 h-3" /> Back to menu
              </button>
            </div>
          )}

          {step === 'guide' && (
            <div className="p-3 border-t border-slate-200 bg-white">
              <button onClick={toMenu} className="w-full py-3 rounded-2xl bg-[#0f4c81] text-white text-sm font-black">
                Got it — back to menu
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}