import { Link } from 'react-router-dom';
import { Building2, User } from 'lucide-react';

/** Entry gate — two-choice selector before the demo begins. */
export default function EntrySelector() {
  return (
    <div className="min-h-screen bg-[#0C1117] flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-4xl font-extrabold text-white tracking-[0.05em] mb-2">
        LOOPER<span className="text-[#0D7C66]">.AI</span>
      </h1>
      <p className="text-sm text-[#5E6E7E] font-sans mb-14">
        Choose your experience
      </p>

      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg">
        <Link
          to="/home"
          className="flex-1 bg-[#151D28] border border-[#2A3544] rounded-lg p-8 flex flex-col items-center text-center transition-all duration-150 hover:border-[#0D7C66] hover:-translate-y-[2px] hover:shadow-[0_4px_24px_rgba(13,124,102,0.15)]"
        >
          <div className="w-14 h-14 rounded-lg bg-[#0D7C66]/10 flex items-center justify-center mb-5">
            <Building2 className="w-7 h-7 text-[#0D7C66]" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-lg font-semibold text-white mb-1">
            View as Academy
          </h2>
          <p className="text-sm text-[#8B99A8] font-sans leading-relaxed">
            Coach portal, operations, and analytics
          </p>
        </Link>

        <Link
          to="/player"
          className="flex-1 bg-[#151D28] border border-[#2A3544] rounded-lg p-8 flex flex-col items-center text-center transition-all duration-150 hover:border-[#10B981] hover:-translate-y-[2px] hover:shadow-[0_4px_24px_rgba(16,185,129,0.15)]"
        >
          <div className="w-14 h-14 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-5">
            <User className="w-7 h-7 text-[#10B981]" strokeWidth={1.5} />
          </div>
          <h2 className="font-display text-lg font-semibold text-white mb-1">
            View as Player
          </h2>
          <p className="text-sm text-[#8B99A8] font-sans leading-relaxed">
            Your progress, practice plans, and rounds
          </p>
        </Link>
      </div>
    </div>
  );
}
