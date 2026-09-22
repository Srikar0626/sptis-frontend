import React from 'react';
import { Train, Bus, Footprints, ArrowRight } from 'lucide-react';
import { METRO_LINE_STYLE, secToHHMM } from '../lib/metro';

/** Coloured Red / Green / Blue pill for a metro line. */
export function LineChip({ line, compact = false }) {
  const s = METRO_LINE_STYLE[line] || { name: line, color: '#475569', text: '#fff' };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-black tracking-wide ${compact ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'}`}
      style={{ background: s.color, color: s.text }}
    >
      <Train className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {compact ? s.name.replace(' Line', '') : s.name}
    </span>
  );
}

export function BusChip({ route, compact = false }) {
  const num = String(route || '').split(' - ')[0] || 'Bus';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-[#0f4c81] text-white font-black tracking-wide ${compact ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
      <Bus className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> {num}
    </span>
  );
}

export function WalkChip({ m, compact = false }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 font-bold ${compact ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1'}`}>
      <Footprints className={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> {m} m
    </span>
  );
}

/** The one-line "Bus 218 → Red Line → walk" strip at the top of a result. */
export function LegStrip({ journey, compact = false }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {journey.legs.map((leg, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
          {leg.kind === 'metro' && <LineChip line={leg.line} compact={compact} />}
          {leg.kind === 'bus' && <BusChip route={leg.route} compact={compact} />}
          {leg.kind === 'walk' && <WalkChip m={leg.m} compact={compact} />}
        </React.Fragment>
      ))}
    </div>
  );
}

const crowdStyle = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  'Medium-High': 'bg-orange-50 text-orange-700 border-orange-200',
  High: 'bg-rose-50 text-rose-700 border-rose-200'
};

export function CrowdBadge({ level, estimated = false }) {
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${crowdStyle[level] || crowdStyle.Medium}`}>
      {level}{estimated ? ' ~' : ''}
    </span>
  );
}

/** Vertical step-by-step view of one journey. Pass onOpenBus to get a small
 * "Track live" button on each individual bus leg, right where it's relevant. */
export function LegDetails({ journey, onOpenBus = null }) {
  return (
    <ol className="space-y-3">
      {journey.legs.map((leg, i) => (
        <li key={i} className="flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow"
              style={{
                background: leg.kind === 'metro'
                  ? (METRO_LINE_STYLE[leg.line]?.color || '#475569')
                  : leg.kind === 'bus' ? '#0f4c81' : '#cbd5e1'
              }}
            />
            {i < journey.legs.length - 1 && <div className="flex-1 w-0.5 bg-slate-200 my-1" />}
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {leg.kind === 'metro' && <LineChip line={leg.line} compact />}
              {leg.kind === 'bus' && <BusChip route={leg.route} compact />}
              {leg.kind === 'walk' && <WalkChip m={leg.m} compact />}
              <span className="text-[11px] font-bold text-slate-400">
                {secToHHMM(leg.depSec)} – {secToHHMM(leg.arrSec)}
              </span>
              {leg.crowd && <CrowdBadge level={leg.crowd.level} estimated={leg.kind === 'metro'} />}
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1.5 leading-snug">
              {leg.from} <ArrowRight className="w-3 h-3 inline text-slate-300" /> {leg.to}
            </p>
            {leg.kind === 'metro' && (
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                {leg.stops} stop{leg.stops === 1 ? '' : 's'} towards {leg.terminus}
                {leg.waitSec > 0 && ` · train in ${Math.max(0, Math.round(leg.waitSec / 60))} min`}
              </p>
            )}
            {leg.kind === 'bus' && (
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className="text-[11px] font-medium text-slate-500">
                  {leg.stops} stop{leg.stops === 1 ? '' : 's'} · bus {leg.busId}
                  {leg.waitSec > 0 && ` · arrives in ${Math.round(leg.waitSec / 60)} min`}
                  {leg.crowd && ` · ${leg.crowd.occupied}/${leg.crowd.seats} seats taken`}
                </p>
                {onOpenBus && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenBus(leg.busId); }}
                    className="flex-shrink-0 flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-[#0f4c81] bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition"
                  >
                    <Bus className="w-3 h-3" /> Track live
                  </button>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}