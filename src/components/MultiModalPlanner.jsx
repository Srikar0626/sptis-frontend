import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapPin, MapPinOff, ArrowDownUp, Search, Zap, Coins, Route as RouteIcon,
  Users, Leaf, Train, Clock, ShieldAlert, Loader2
} from 'lucide-react';
import { loadMetro, getMetro, secToHHMM, METRO_LINE_STYLE } from '../lib/metro';
import { buildPlaces, placeOptions, planJourneys, sortJourneys, SORT_MODES } from '../lib/routing';
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
    const pool = q ? places.filter((p) => p.name.toLowerCase().includes(q)) : places;
    return pool.slice(0, 8);
  }, [text, places]);

  return (
    <div className="relative flex-1" ref={box}>
      <label className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">
        {icon} {label}
      </label>
      <input
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true); }}
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
              <span className="text-sm font-bold text-slate-700 truncate">{p.name}</span>
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

function JourneyMap({ journey }) {
  const el = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!window.L || !el.current || !journey) return;
    if (!map.current) {
      map.current = window.L.map(el.current, { zoomControl: false, attributionControl: false });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);
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

export default function MultiModalPlanner({ buses = [], busFare = null, onOpenBus = null }) {
  const [ready, setReady] = useState(!!getMetro());
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('fastest');
  const [results, setResults] = useState(null);
  const [openIdx, setOpenIdx] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => { loadMetro().then(() => setReady(true)).catch(() => setReady(false)); }, []);

  const places = useMemo(() => (ready ? buildPlaces(buses) : []), [ready, buses.length]);
  const options = useMemo(() => placeOptions(places), [places]);

  const run = () => {
    if (!from || !to || from === to) return;
    setSearching(true);
    // let the spinner paint before the synchronous search
    setTimeout(() => {
      setResults(planJourneys({ buses, from, to, busFare, places }));
      setOpenIdx(0);
      setSearching(false);
    }, 10);
  };

  const sorted = useMemo(() => (results ? sortJourneys(results, sort) : null), [results, sort]);
  const metro = getMetro();

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 relative">
        <div className="flex items-center gap-2 mb-5">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Plan a journey</h2>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg">
            Bus + Metro
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-5">
          <PlaceInput
            label="From" value={from} onChange={setFrom} places={options}
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
            label="To" value={to} onChange={setTo} places={options}
            placeholder="Stop or metro station"
            icon={<MapPinOff className="w-3 h-3 text-slate-400" />}
          />
        </div>

        <button
          onClick={run}
          disabled={!from || !to || from === to || searching}
          className="w-full bg-[#0f4c81] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-[0_4px_14px_0_rgba(15,76,129,0.39)] flex items-center justify-center gap-2 tracking-wide"
        >
          {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Find routes
        </button>

        {!ready && (
          <p className="text-[11px] font-bold text-slate-400 mt-3 text-center">Loading metro network…</p>
        )}
        {ready && metro && (
          <p className="text-[11px] font-medium text-slate-400 mt-3 text-center">
            Metro timetable from {metro.source.publisher} · feed {metro.generatedAt} · bus positions simulated live
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
                <LegDetails journey={j} />
                <JourneyMap journey={j} />
                {onOpenBus && j.legs.some((l) => l.kind === 'bus') && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenBus(j.legs.find((l) => l.kind === 'bus').busId); }}
                    className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-sm font-black text-slate-700 transition"
                  >
                    Track this bus live
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}