import { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Columns2,
  Minus,
  Circle,
  Triangle,
  Maximize2,
} from 'lucide-react';
import type { CoachSessionSwing } from '../../data/coachSessionData';

interface VideoPlayerProps {
  selectedSwing: CoachSessionSwing;
}

const SPEED_OPTIONS = ['0.25x', '0.5x', '1x'] as const;

export default function VideoPlayer({ selectedSwing }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<(typeof SPEED_OPTIONS)[number]>('1x');
  const [isComparing, setIsComparing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(35); // percentage

  const swingLabel = `#${String(selectedSwing.swingNumber).padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-[#E2E5E8] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E2E5E8] bg-[#F9FAFB]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#1A1F2B]">
            Swing {swingLabel}
          </span>
          <span className="text-[10px] text-[#9CA3AF] font-medium">
            {selectedSwing.club} • {selectedSwing.timestamp}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Draw tools (placeholders) */}
          <div className="flex items-center gap-1 border-r border-[#E2E5E8] pr-2 mr-1">
            <button className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] transition-colors" title="Draw line">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] transition-colors" title="Draw circle">
              <Circle className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] transition-colors" title="Draw angle">
              <Triangle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compare toggle */}
          <button
            onClick={() => setIsComparing(!isComparing)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{
              backgroundColor: isComparing ? '#F0FDFA' : 'transparent',
              color: isComparing ? '#0D7C66' : '#6B7280',
              border: `1px solid ${isComparing ? '#0D7C66' : '#E2E5E8'}`,
            }}
          >
            <Columns2 className="w-3.5 h-3.5" />
            Compare
          </button>

          {/* Fullscreen */}
          <button className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#9CA3AF] transition-colors" title="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex min-h-0">
        {isComparing ? (
          // Side-by-side comparison
          <div className="flex w-full">
            {/* Player swing */}
            <div className="flex-1 border-r border-[#E2E5E8] flex flex-col items-center justify-center bg-[#F6F7F9] relative">
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold px-2 py-1 rounded bg-white/90 text-[#1A1F2B] shadow-sm">
                  Player: {selectedSwing.club} {swingLabel}
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#E2E5E8] flex items-center justify-center">
                  <Play className="w-6 h-6 text-[#9CA3AF] ml-0.5" />
                </div>
                <p className="text-sm text-[#9CA3AF]">Video: Swing {swingLabel}</p>
                <span className="text-[10px] text-[#9CA3AF]/60 italic">Sample Video</span>
              </div>
            </div>
            {/* Reference swing */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F6F7F9] relative">
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-semibold px-2 py-1 rounded bg-white/90 text-[#1A1F2B] shadow-sm">
                  Reference: Rory McIlroy
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#E2E5E8] flex items-center justify-center">
                  <Play className="w-6 h-6 text-[#9CA3AF] ml-0.5" />
                </div>
                <p className="text-sm text-[#9CA3AF]">Reference Swing</p>
                <span className="text-[10px] text-[#9CA3AF]/60 italic">Sample Video</span>
              </div>
            </div>
          </div>
        ) : (
          // Single video view
          <div className="flex-1 flex flex-col items-center justify-center bg-[#F6F7F9] relative">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                style={{ backgroundColor: isPlaying ? '#0D7C66' : '#E2E5E8' }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-[#9CA3AF] ml-1" />
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-[#1A1F2B]">
                  Video: Swing {swingLabel}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  {selectedSwing.club} • {selectedSwing.carry} yds carry
                </p>
              </div>
              <span className="text-[10px] text-[#9CA3AF]/60 italic px-3 py-1 rounded-full border border-[#E2E5E8]">
                Sample Video — Drop .mp4 files into /assets/videos/
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="border-t border-[#E2E5E8] bg-white px-4 py-2.5">
        {/* Scrub bar */}
        <div className="mb-2 relative">
          <div className="h-1 bg-[#E2E5E8] rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setScrubPosition(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{ width: `${scrubPosition}%`, backgroundColor: '#0D7C66' }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0D7C66] shadow-sm border-2 border-white"
            style={{ left: `${scrubPosition}%`, marginLeft: -6 }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Frame back */}
            <button
              className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
              title="Previous frame"
              onClick={() => setScrubPosition(Math.max(0, scrubPosition - 1))}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: isPlaying ? '#0D7C66' : '#F3F4F6',
                color: isPlaying ? 'white' : '#1A1F2B',
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Frame forward */}
            <button
              className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
              title="Next frame"
              onClick={() => setScrubPosition(Math.min(100, scrubPosition + 1))}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Timestamp */}
          <span
            className="text-[11px] text-[#9CA3AF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            00:{String(Math.round(scrubPosition * 0.03 * 100) / 100).padStart(2, '0')} / 00:03.00
          </span>

          {/* Speed toggle */}
          <div className="flex items-center gap-0.5 bg-[#F3F4F6] rounded-md p-0.5">
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className="px-2 py-1 rounded text-[10px] font-semibold transition-colors"
                style={{
                  backgroundColor: playbackSpeed === speed ? '#0D7C66' : 'transparent',
                  color: playbackSpeed === speed ? 'white' : '#6B7280',
                }}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
