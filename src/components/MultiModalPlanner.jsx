import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapPin, MapPinOff, ArrowDownUp, Search, Zap, Coins, Route as RouteIcon,
  Users, Leaf, Train, Clock, ShieldAlert, Loader2, Info
} from 'lucide-react';
import {
  loadMetro, getMetro, secToHHMM, METRO_LINE_STYLE
} from '../lib/metro';
import { buildPlaces, placeOptions, resolvePlace, planJourneys, sortJourneys, SORT_MODES } from '../lib/routing';
import { LegStrip, LegDetails, CrowdBadge } from './MetroLeg';

const SORT_ICON = { fastest: Zap, cheapest: Coins, fewest: RouteIcon, least_crowded: Users };
const SORT_LABEL = {
  fastest: 'Fastest', cheapest: 'Cheapest', fewest: 'Fewest changes', least_crowded: 'Least crowded'
};

function PlaceInput({ label, value, onChange, places, icon, placeholder }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value || '');
  const box = useRef(null);

  useEffect(() => { setText(value || ''); }, [value]);
  useEffect(() => {
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  const matches = useMemo(() => {
    const q = text.trim().toLowerCase();
    return q ? places.filter((p) => p.name.toLowerCase().includes(q)) : places;
  }, [text, places]);

  return (
    <div className="relative flex-1" ref={box}>
      <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">
        {icon} {label}
      </label>
      <input
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true); onChange(e.target.value); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-[#0f4c81] outline-none bg-white text-slate-800 font-bold transition-all"
      />
      {open && matches.length > 0 && (
        <ul className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
          {matches.map((p) => (
            <li
              key={p.id}
              onClick={() => { onChange(p.name); setText(p.name); setOpen(false); }}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between gap-2"
            >
              <span className="text-sm font-bold text-slate-700 truncate">
                {p.name}
                {p.kind === 'metro' && <span className="text-slate-400 font-semibold"> (Metro Station)</span>}
              </span>
              {p.kind === 'metro' && (
                <span className="flex items-center gap-1 flex-shrink-0">
                  {p.lines.map((l) => (
                    <span key={l} className="w-2.5 h-2.5 rounded-full" style={{ background: METRO_LINE_STYLE[l]?.color }} />
                  ))}
                  <Train className="w-3 h-3 text-slate-400" />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** "Leave now" or pick a clock time — defaults to now, stays live if left alone. */
function DepartureControl({ date, onChange }) {
  const [mode, setMode] = useState('now');
  const [clock, setClock] = useState(() => hhmm(date));

  useEffect(() => {
    if (mode !== 'now') return;
    const t = setInterval(() => onChange(new Date()), 30000);
    return () => clearInterval(t);
  }, [mode, onChange]);

  function hhmm(d) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex rounded-xl border-2 border-slate-100 p-1 bg-slate-50">
        <button
          onClick={() => { setMode('now'); onChange(new Date()); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition ${mode === 'now' ? 'bg-white text-[#0f4c81] shadow-sm' : 'text-slate-400'}`}
        >
          Leaving now
        </button>
        <button
          onClick={() => setMode('pick')}
          className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide transition ${mode === 'pick' ? 'bg-white text-[#0f4c81] shadow-sm' : 'text-slate-400'}`}
        >
          Depart at
        </button>
      </div>
      {mode === 'pick' && (
        <input
          type="time"
          value={clock}
          onChange={(e) => {
            setClock(e.target.value);
            const [h, m] = e.target.value.split(':').map(Number);
            const d = new Date();
            d.setHours(h, m, 0, 0);
            onChange(d);
          }}
          className="px-3 py-1.5 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-700 focus:border-[#0f4c81] outline-none"
        />
      )}
    </div>
  );
}

function JourneyMap({ journey }) {
  const el = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!window.L || !el.current || !journey) return;
    if (!map.current) {
      map.current = window.L.map(el.current, { zoomControl: false, attributionControl: false });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map.current);
    }
    map.current.eachLayer((l) => { if (l instanceof window.L.Polyline || l instanceof window.L.CircleMarker) map.current.removeLayer(l); });

    const all = [];
    journey.legs.forEach((leg) => {
      const pts = (leg.path || []).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
      if (pts.length < 2) return;
      all.push(...pts);
      const color = leg.kind === 'metro' ? (METRO_LINE_STYLE[leg.line]?.color || '#475569')
        : leg.kind === 'bus' ? '#0f4c81' : '#94a3b8';
      window.L.polyline(pts, {
        color, weight: leg.kind === 'walk' ? 3 : 5,
        dashArray: leg.kind === 'walk' ? '6 8' : null, opacity: 0.9
      }).addTo(map.current);
      [pts[0], pts[pts.length - 1]].forEach((p) =>
        window.L.circleMarker(p, { radius: 5, color: '#fff', weight: 2, fillColor: color, fillOpacity: 1 }).addTo(map.current));
    });
    if (all.length) map.current.fitBounds(window.L.latLngBounds(all), { padding: [30, 30] });
    setTimeout(() => map.current?.invalidateSize(), 60);
  }, [journey]);

  if (!window.L) return null;
  return <div ref={el} className="h-56 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-200" />;
}

/**
 * The combined bus + metro + walk planner. Also doubles as the fallback for
 * Bus Finder: pass `initialFrom`/`initialTo` (and bump `searchToken` to
 * re-trigger) to land here pre-filled and already searching.
 */
export default function MultiModalPlanner({
  buses = [], busFare = null, onOpenBus = null,
  initialFrom = '', initialTo = '', searchToken = 0
}) {
  const [ready, setReady] = useState(!!getMetro());
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(() => new Date());
  const [sort, setSort] = useState('fastest');
  const [results, setResults] = useState(null);
  const [openIdx, setOpenIdx] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null); // { missing, suggestions } | { crashed: true } | null

  useEffect(() => { loadMetro().then(() => setReady(true)).catch(() => setReady(false)); }, []);

  const places = useMemo(() => (ready ? buildPlaces(buses) : []), [ready, buses.length]);
  const options = useMemo(() => placeOptions(places), [places]);

  const run = (f = from, t = to, when = date) => {
    if (!f || !t || f === t) return;
    setSearchError(null);

    // Resolve names to real stops/stations up front. planJourneys() does
    // this silently and just returns [] on a miss, which used to look
    // exactly like "nothing happened" when a typed name didn't match
    // anything (e.g. a spelling the dataset doesn't use).
    const origin = resolvePlace(places, f);
    const dest = resolvePlace(places, t);
    if (!origin || !dest) {
      const missing = !origin ? f : t;
      const q = missing.trim().toLowerCase();
      const suggestions = q
        ? places.filter((p) => p.name.toLowerCase().includes(q.slice(0, Math.min(4, q.length)))).slice(0, 6)
        : [];
      setResults(null);
      setSearchError({ missing, suggestions });
      return;
    }

    setSearching(true);
    setTimeout(() => {
      // A thrown error in here used to leave `searching` stuck true
      // forever, which permanently disabled the Find routes button for
      // every search after that — not just this one.
      try {
        setResults(planJourneys({ buses, from: origin, to: dest, busFare, places, date: when }));
        setOpenIdx(0);
      } catch (err) {
        console.error('Journey search failed:', err);
        setResults([]);
        setSearchError({ crashed: true });
      } finally {
        setSearching(false);
      }
    }, 10);
  };

  // Arriving here from "Bus Finder → try Bus + Metro" pre-fills and runs.
  useEffect(() => {
    if (!ready || !searchToken || !initialFrom || !initialTo) return;
    setFrom(initialFrom);
    setTo(initialTo);
    run(initialFrom, initialTo, new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, searchToken]);

  const sorted = useMemo(() => (results ? sortJourneys(results, sort) : null), [results, sort]);
  const metro = getMetro();

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 relative">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Multi-Leg Planner</h2>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg">
            Walk + Bus + Metro
          </span>
        </div>

        <DepartureControl date={date} onChange={setDate} />

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-5">
          <PlaceInput
            label="From" value={from} onChange={(v) => { setFrom(v); setSearchError(null); }} places={options}
            placeholder="Stop or metro station"
            icon={<MapPin className="w-3 h-3 text-slate-400" />}
          />
          <button
            onClick={() => { const a = from; setFrom(to); setTo(a); }}
            className="self-center sm:mb-1 p-2.5 rounded-xl border-2 border-slate-100 hover:border-[#0f4c81] hover:text-[#0f4c81] text-slate-400 transition"
            aria-label="Swap"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
          <PlaceInput
            label="To" value={to} onChange={(v) => { setTo(v); setSearchError(null); }} places={options}
            placeholder="Stop or metro station"
            icon={<MapPinOff className="w-3 h-3 text-slate-400" />}
          />
        </div>

        <button
          onClick={() => run()}
          disabled={!from || !to || from === to || searching}
          // relative + a z-index above the PlaceInput dropdowns (z-30): without
          // this, an autocomplete list left open over "From" or "To" sits on
          // top of this button and swallows the click before it ever reaches
          // Find routes, so nothing appears to happen.
          className="relative z-40 w-full bg-[#0f4c81] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-[0_4px_14px_0_rgba(15,76,129,0.39)] flex items-center justify-center gap-2 tracking-wide"
        >
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Find routes
        </button>

        {!ready && (
          <p className="text-[11px] font-bold text-slate-400 mt-3 text-center">Loading metro network…</p>
        )}
        {ready && metro && (
          <p className="text-[11px] font-medium text-slate-400 mt-3 text-center">
            Metro runs every ~5 min · network &amp; fares from {metro.source.publisher} · bus positions simulated live
          </p>
        )}
      </div>

      {sorted && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {SORT_MODES.map((m) => {
            const Icon = SORT_ICON[m.id];
            const active = sort === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSort(m.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition border-2 ${
                  active ? 'bg-[#0f4c81] text-white border-[#0f4c81] shadow' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {SORT_LABEL[m.id]}
              </button>
            );
          })}
        </div>
      )}

      {sorted && sorted.length === 0 && (
        <div className="p-10 text-center bg-white rounded-3xl border border-slate-200">
          <ShieldAlert className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-800">No route found</h3>
          <p className="text-sm font-medium text-slate-500 mt-2 max-w-md mx-auto">
            Nothing connects these two points right now. Try a nearby hub such as Ameerpet, MG Bus Station or Secunderabad.
          </p>
        </div>
      )}

      {searchError && !searchError.crashed && (
        <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-black text-amber-800">
                We don't recognise &ldquo;{searchError.missing}&rdquo; as a stop or metro station
              </h3>
              <p className="text-xs font-medium text-amber-700 mt-1">Did you mean one of these?</p>
            </div>
          </div>
          {searchError.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchError.suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (searchError.missing === from) setFrom(p.name);
                    else setTo(p.name);
                    setSearchError(null);
                  }}
                  className="text-xs font-black px-3 py-2 rounded-xl bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-400 transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {searchError?.crashed && (
        <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-3xl text-sm font-bold text-rose-700 flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 flex-shrink-0" />
          Something went wrong planning that route. Please try again, or try a different stop.
        </div>
      )}

      {sorted && sorted.map((j, idx) => {
        const open = openIdx === idx;
        return (
          <div
            key={j.id}
            onClick={() => setOpenIdx(open ? -1 : idx)}
            className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden ${
              open ? 'border-[#0f4c81]/40 shadow-xl' : 'border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            {j.longWait && (
              <div className="px-5 pt-4 -mb-1 flex items-start gap-2 text-[11px] font-bold text-amber-700 bg-amber-50 border-b border-amber-100">
                <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span className="pb-3">
                  {j.longWaitKind === 'metro'
                    ? 'Includes a long wait — the metro isn\'t running yet on this leg. First available departure shown.'
                    : 'Includes a long wait for one of the buses on this route.'}
                </span>
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {Math.round(j.durationSec / 60)}<span className="text-sm font-bold text-slate-400 ml-1">min</span>
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {secToHHMM(j.depSec)} – {secToHHMM(j.arrSec)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#0f4c81] leading-none">₹{j.fare}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    {j.transfers} change{j.transfers === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <LegStrip journey={j} />

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <CrowdBadge level={j.crowdLevel} />
                {j.walkM > 0 && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200">
                    {j.walkM} m walk
                  </span>
                )}
                {j.co2SavedKg > 0.1 && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> {j.co2SavedKg.toFixed(1)} kg CO₂ saved
                  </span>
                )}
              </div>
            </div>

            {open && (
              <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                <LegDetails journey={j} onOpenBus={onOpenBus} />
                <JourneyMap journey={j} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}