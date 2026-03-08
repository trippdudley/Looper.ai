import { Link } from 'react-router-dom';
import {
  Crosshair,
  Disc3,
  Target,
  Circle,
  Grip,
  Layers,
  AlertTriangle,
  Sparkles,
  PenLine,
} from 'lucide-react';
import { golfers } from '../../../data/golfers';

const golfer = golfers.find((g) => g.id === 'golfer-mike')!;

// ── Parse equipment strings ──
function splitDriverParts(raw: string) {
  const parts = raw.split(' \u2014 ');
  return { model: parts[0] ?? raw, shaft: parts[1] ?? '' };
}
function splitIronParts(raw: string) {
  const parts = raw.split(' \u2014 ');
  return { model: parts[0] ?? raw, shaft: parts[1] ?? '' };
}

const driver = splitDriverParts(golfer.equipment.driver);
const irons = splitIronParts(golfer.equipment.irons);

function formatFittingDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function monthsSinceFitting(dateStr: string): number {
  const now = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return (
    (now.getFullYear() - d.getFullYear()) * 12 +
    now.getMonth() -
    d.getMonth()
  );
}

const fittingDate = formatFittingDate(golfer.equipment.lastFittingDate);
const fittingMonths = monthsSinceFitting(golfer.equipment.lastFittingDate);
const fittingLabel = `Fitted at Club Champion \u2014 ${fittingDate}`;
const ageLabel = `${fittingMonths} months since fitting`;

export default function EquipmentProfile() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-navy font-bold">
          Equipment Profile &mdash; {golfer.name}
        </h1>
        <Link
          to="/fitter/session"
          className="inline-flex items-center gap-2 border border-gray-300 text-navy rounded-lg px-5 py-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          <PenLine className="w-4 h-4" />
          Edit Equipment
        </Link>
      </div>

      {/* ── Equipment Cards Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Driver */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Crosshair className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-navy">Driver</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Make / Model</p>
              <p className="text-sm font-medium text-navy">{driver.model}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Shaft</p>
              <p className="text-sm font-medium text-navy">{driver.shaft}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-gray-500">Loft</p>
                <p className="text-sm font-mono text-navy">10.5&deg;</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Length</p>
                <p className="text-sm font-mono text-navy">45.5&quot;</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Flex</p>
                <p className="text-sm font-mono text-navy">Stiff</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Head Setting</p>
                <p className="text-sm font-mono text-navy">Standard</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">{fittingLabel}</p>
              <span className="text-xs font-medium text-warm-amber bg-warm-amber/10 px-2 py-0.5 rounded-full">
                {ageLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Irons */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-navy">Irons</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Make / Model</p>
              <p className="text-sm font-medium text-navy">{irons.model}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Shaft</p>
              <p className="text-sm font-medium text-navy">{irons.shaft}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-gray-500">Configuration</p>
                <p className="text-sm font-mono text-navy">5-PW</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Lie Angle</p>
                <p className="text-sm font-mono text-navy">Standard</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Grip</p>
                <p className="text-sm font-mono text-navy">Midsize</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">{fittingLabel}</p>
              <span className="text-xs font-medium text-warm-amber bg-warm-amber/10 px-2 py-0.5 rounded-full">
                {ageLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Wedges */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-navy">Wedges</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Make / Model</p>
              <p className="text-sm font-medium text-navy">{golfer.equipment.wedges}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-gray-500">Lofts</p>
                <p className="text-sm font-mono text-navy">50&deg;, 54&deg;, 58&deg;</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bounce / Grind</p>
                <p className="text-sm font-mono text-navy">Standard bounce, C-Grind</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">{fittingLabel}</p>
            </div>
          </div>
        </div>

        {/* Card 4: Putter */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Circle className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-navy">Putter</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Make / Model</p>
              <p className="text-sm font-medium text-navy">{golfer.equipment.putter}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-gray-500">Length</p>
                <p className="text-sm font-mono text-navy">34&quot;</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Grip</p>
                <p className="text-sm font-mono text-navy">SuperStroke Slim 3.0</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">{fittingLabel}</p>
            </div>
          </div>
        </div>

        {/* Card 5: Golf Ball */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Disc3 className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-navy">Golf Ball</h3>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Ball</p>
              <p className="text-sm font-medium text-navy">{golfer.equipment.ball}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Compression</p>
              <p className="text-sm font-mono text-navy">Medium (87)</p>
            </div>
            <p className="text-xs text-gray-500 italic">
              Matched to swing speed and spin profile
            </p>
          </div>
        </div>

        {/* Card 6: Fairway Woods & Hybrids */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Grip className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-navy">
              Fairway Woods &amp; Hybrids
            </h3>
          </div>

          <div className="space-y-4">
            {/* Fairway Woods */}
            <div className="bg-bg-light rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Fairway Woods
              </p>
              <p className="text-sm font-medium text-navy">
                {golfer.equipment.fairwayWoods}
              </p>
            </div>

            {/* Hybrids */}
            <div className="bg-bg-light rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Hybrids
              </p>
              <p className="text-sm font-medium text-navy">
                {golfer.equipment.hybrids}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">{fittingLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Re-Fit Alert Section ── */}
      <div className="border-2 border-warm-amber rounded-xl bg-warm-amber/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-warm-amber" />
          <h3 className="text-lg font-semibold text-warm-amber">
            Re-Fitting Recommendation
          </h3>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Based on 6 months of coaching data, the following swing changes may
          warrant equipment adjustment:
        </p>

        <ul className="space-y-3 mb-5">
          {[
            'Driver shaft flex: Club speed increased 2.3 mph \u2014 current Stiff shaft may be limiting. Consider X-Stiff or stiffer profile.',
            'Iron lie angle: Path corrected from out-to-in to slightly in-to-out \u2014 standard lie may cause pulls. Check dynamic lie.',
            'Driver loft: Spin reduced 430 rpm, attack angle improved \u2014 current 10.5\u00b0 may be too much loft. Consider 9.5\u00b0.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-warm-amber mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-sm font-semibold text-navy">
            Recommend Re-Fitting: Driver (shaft, loft), Irons (lie angle)
          </p>
          <span className="inline-flex items-center gap-1.5 bg-data-blue/10 text-data-blue text-xs font-medium px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
