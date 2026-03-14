import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

function useScrollReveal() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  const setRef = useCallback((index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return setRef;
}

export default function ThesisPage() {
  const setRef = useScrollReveal();

  const sectionClass =
    'opacity-0 translate-y-4 transition-all duration-700 ease-out data-[visible]:opacity-100 data-[visible]:translate-y-0';

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-[720px] mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-xl font-bold text-navy hover:opacity-80 transition-opacity">
            Looper.AI
          </Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-navy transition-colors">
            &larr; Back to Prototype
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-[720px] mx-auto px-6 py-16">
        {/* ── Hero ── */}
        <section ref={setRef(0)} className={`${sectionClass} relative text-center mb-20`}>
          {/* Watermark */}
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-serif text-[120px] font-bold text-navy/[0.03] leading-none"
          >
            Looper.AI
          </span>

          <h1 className="font-serif text-5xl font-bold text-navy tracking-tight relative">
            Looper.AI
          </h1>
          <p className="text-xl text-gray-500 font-serif italic mt-4 relative">
            The Platform to Power Golf in the Age of AI
          </p>

          <div className="w-[80px] h-px bg-accent mx-auto my-8" />

          <p className="text-sm text-gray-400 relative">
            Preliminary Business Plan — March 2026
          </p>
          <p className="text-xs text-gray-400 mt-1 relative">
            Confidential — For Discussion Purposes Only
          </p>
        </section>

        {/* ── Section 1: The Opportunity ── */}
        <section ref={setRef(1)} className={`${sectionClass} mb-20`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-4">
            The Opportunity
          </h2>

          {/* Pull quote */}
          <blockquote className="text-2xl font-serif italic text-navy border-l-[3px] border-accent pl-6 py-2 mb-10">
            AI will transform how golf is taught, how players learn, and how equipment is fitted. The question is who builds the infrastructure first.
          </blockquote>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            Golf instruction is a $2 billion industry in the U.S. alone, growing at 3.4% annually. The adjacent markets — simulators ($1.74B, 9.4% CAGR), training aids ($1.5B), and instruction services globally ($4.18B) — bring the total addressable ecosystem to over $9 billion. Ten million new golfers have entered the game since 2016, with under-35 players driving participation growth.
          </p>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            But the infrastructure hasn&rsquo;t kept up. Coaching remains analog. Lesson notes live in a coach&rsquo;s head. Swing data sits in disconnected silos. No system connects what a coach says to what the data shows to whether the golfer actually improves. Looper builds that system.
          </p>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            Building real AI coaching requires three things that don&rsquo;t exist today: <strong>a persistent coaching record</strong> that captures the coach&rsquo;s verbal reasoning alongside launch monitor data, <strong>a structured coaching ontology</strong> that maps swing faults to prescriptions to outcomes, and <strong>a closed-loop outcome dataset</strong> that tracks whether those prescriptions actually work.
          </p>
        </section>

        {/* ── Section 2: The Problem ── */}
        <section ref={setRef(2)} className={`${sectionClass} mb-20`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-4">
            Golf&rsquo;s Medical Records Problem
          </h2>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            Imagine visiting a doctor who has no access to your medical history. Every visit starts from scratch. That&rsquo;s golf coaching today. A golfer can take 50 lessons across three coaches over five years, and not a single one of those coaches has a structured record of what the others taught, what was tried, or what worked.
          </p>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            Trackman, Foresight, and Arccos generate extraordinary data — club speed, ball speed, attack angle, spin rate, strokes gained. But none of it connects to coaching. A launch monitor knows what happened. It doesn&rsquo;t know why, and it can&rsquo;t tell you what to do about it.
          </p>
        </section>

        {/* ── Section 3: The Solution ── */}
        <section ref={setRef(3)} className={`${sectionClass} mb-20`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-4">
            Looper
          </h2>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            <strong>System 1: The Coaching Record.</strong> Every session captured — audio transcription of the coach&rsquo;s verbal reasoning, video of the swing, launch monitor data from Trackman or Foresight, prescribed drills, and outcome tracking. All structured, all searchable, all connected to a persistent golfer profile that follows the player across coaches, facilities, and years.
          </p>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-6">
            <strong>System 2: The Coaching Intelligence Engine.</strong> AI trained on real coaching outcomes. Not swing tips from YouTube — prescriptive intelligence built on thousands of structured coaching interactions, matched to measured improvement. The system learns what works, for which types of golfers, and why.
          </p>
        </section>

        {/* ── Section 4: Business Model ── */}
        <section ref={setRef(4)} className={`${sectionClass} mb-20`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-8">
            Four-Stage Revenue Model
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stage 1 */}
            <div className="bg-bg-light rounded-xl p-6">
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 rounded-full px-2.5 py-0.5 mb-3">
                Stage 1
              </span>
              <h3 className="font-semibold text-navy mb-1">Coaching Record</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Year 1-2. Facility fee $500–1,500/mo, Coach fee $50–150/mo.
              </p>
              <p className="font-mono text-accent text-sm">Target: $8–15M ARR</p>
            </div>

            {/* Stage 2 */}
            <div className="bg-bg-light rounded-xl p-6">
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 rounded-full px-2.5 py-0.5 mb-3">
                Stage 2
              </span>
              <h3 className="font-semibold text-navy mb-1">Intelligence Layer</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Year 2-3. AI premium tier.
              </p>
              <p className="font-mono text-accent text-sm">$5–12M incremental ARR</p>
            </div>

            {/* Stage 3 */}
            <div className="bg-bg-light rounded-xl p-6">
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 rounded-full px-2.5 py-0.5 mb-3">
                Stage 3
              </span>
              <h3 className="font-semibold text-navy mb-1">Consumer App</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Year 3-5. $20–30/mo self-serve.
              </p>
              <p className="font-mono text-accent text-sm">$20–50M+ ARR</p>
            </div>

            {/* Stage 4 */}
            <div className="bg-bg-light rounded-xl p-6">
              <span className="inline-block text-xs font-semibold text-accent bg-accent/10 rounded-full px-2.5 py-0.5 mb-3">
                Stage 4
              </span>
              <h3 className="font-semibold text-navy mb-1">Platform Expansion</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Sport-agnostic architecture.
              </p>
              <p className="font-mono text-accent text-sm">TAM expansion beyond golf</p>
            </div>
          </div>
        </section>

        {/* ── Section 5: Financial Projections ── */}
        <section ref={setRef(5)} className={`${sectionClass} mb-20`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-8">
            Five-Year Financial Projections
          </h2>

          {/* P&L Table */}
          <h3 className="font-serif text-xl text-navy font-semibold mb-4">
            P&amp;L Summary
          </h3>
          <div className="rounded-xl overflow-hidden border border-gray-100 mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium"></th>
                  <th className="px-4 py-3 text-right font-medium">Year 1</th>
                  <th className="px-4 py-3 text-right font-medium">Year 2</th>
                  <th className="px-4 py-3 text-right font-medium">Year 3</th>
                  <th className="px-4 py-3 text-right font-medium">Year 4</th>
                  <th className="px-4 py-3 text-right font-medium">Year 5</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy text-left">Revenue</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$20K</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$729K</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$4.3M</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$14.9M</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$40.3M</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy text-left">Total Costs</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$841K</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$2.7M</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$5.1M</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$7.4M</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$9.1M</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy text-left">Net Income</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums text-coral">($820K)</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums text-coral">($1.9M)</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums text-coral">($774K)</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums text-accent">$7.5M</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums text-accent">$31.2M</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Data Monetization Table */}
          <h3 className="font-serif text-xl text-navy font-semibold mb-4">
            Data Monetization Revenue
          </h3>
          <div className="rounded-xl overflow-hidden border border-gray-100 mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium"></th>
                  <th className="px-4 py-3 text-right font-medium">Year 2</th>
                  <th className="px-4 py-3 text-right font-medium">Year 3</th>
                  <th className="px-4 py-3 text-right font-medium">Year 4</th>
                  <th className="px-4 py-3 text-right font-medium">Year 5</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy text-left">Platform Users</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">1,800</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">10,000</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">40,000</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">120,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy text-left">Blended CPM</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$25</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$30</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$35</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$40</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-medium text-navy text-left">Total Data Revenue</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$7K</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$213K</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$978K</td>
                  <td className="px-4 py-3 font-mono text-right tabular-nums">$3.4M</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700">
            Seed round target: $3–5M. Built on Anthropic Claude API — no custom model training, no GPU infrastructure. Breakeven in Year 3.
          </p>
        </section>

        {/* ── Section 6: The Moat ── */}
        <section ref={setRef(6)} className={`${sectionClass} mb-20`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-4">
            Why This Gets Harder to Compete With Over Time
          </h2>

          <p className="font-sans text-[16px] leading-[1.75] text-gray-700">
            The coaching record creates lock-in — years of history that a golfer won&rsquo;t abandon and coaches can&rsquo;t replicate. The intelligence engine creates a compounding data asset — a closed-loop outcome dataset that no competitor collects. Every session captured makes the prescriptive model more accurate. Every new coach and facility strengthens the network. The moat widens with every lesson.
          </p>
        </section>

        {/* ── Section 7: Team & Contact ── */}
        <section ref={setRef(7)} className={`${sectionClass} mb-12`}>
          <h2 className="font-serif text-[28px] text-navy font-bold mb-6">
            Team
          </h2>

          <div className="text-center">
            <p className="font-sans text-[16px] leading-[1.75] text-gray-700 mb-2">
              <strong>Tripp</strong> — Founder
            </p>
            <p className="font-sans text-[16px] leading-[1.75] text-gray-700">
              Enterprise strategy, data monetization, and platform economics. Career building commercial strategy for Fortune 500 retail and consumer brands. MBA, University of Michigan Ross School of Business.
            </p>
          </div>
        </section>

        {/* Footer rule + footer */}
        <div className="w-[80px] h-px bg-accent mx-auto my-8" />

        <footer className="text-sm text-gray-400 text-center py-8">
          Looper — Confidential — March 2026
        </footer>
      </div>
    </div>
  );
}
