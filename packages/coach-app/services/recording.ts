/**
 * Audio recording service using expo-av.
 *
 * Records lesson audio in high-quality M4A format suitable for Deepgram transcription.
 * Supports background audio mode so recording continues if coach switches apps.
 */

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export type RecordingStatus =
  | 'idle'
  | 'requesting-permission'
  | 'ready'
  | 'recording'
  | 'paused'
  | 'stopped'
  | 'error';

export interface RecordingState {
  status: RecordingStatus;
  durationMs: number;
  fileUri: string | null;
  error: string | null;
  metering: number | null; // dB level, -160 to 0
}

// High-quality recording preset optimized for speech transcription
const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
  isMeteringEnabled: true,
};

export class LessonRecorder {
  private recording: Audio.Recording | null = null;
  private onStatusChange: (state: RecordingState) => void;

  constructor(onStatusChange: (state: RecordingState) => void) {
    this.onStatusChange = onStatusChange;
  }

  private emit(state: Partial<RecordingState>): void {
    this.onStatusChange({
      status: 'idle',
      durationMs: 0,
      fileUri: null,
      error: null,
      metering: null,
      ...state,
    });
  }

  async requestPermission(): Promise<boolean> {
    this.emit({ status: 'requesting-permission' });
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      this.emit({ status: 'error', error: 'Microphone permission denied' });
      return false;
    }
    this.emit({ status: 'ready' });
    return true;
  }

  async start(): Promise<void> {
    try {
      // Enable audio session for recording (handles phone calls, other apps)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,  // Continue recording if coach opens another app
        shouldDuckAndroid: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS,
        (status) => this.handleRecordingUpdate(status),
        100  // Update every 100ms for live metering
      );

      this.recording = recording;
      this.emit({ status: 'recording', durationMs: 0 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Recording failed to start';
      this.emit({ status: 'error', error: message });
      throw err;
    }
  }

  async pause(): Promise<void> {
    if (!this.recording) return;
    await this.recording.pauseAsync();
    this.emit({ status: 'paused' });
  }

  async resume(): Promise<void> {
    if (!this.recording) return;
    await this.recording.startAsync();
    this.emit({ status: 'recording' });
  }

  async stop(): Promise<string | null> {
    if (!this.recording) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      // Restore audio session to normal playback mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
      });

      this.emit({ status: 'stopped', fileUri: uri });
      return uri ?? null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop recording';
      this.emit({ status: 'error', error: message });
      return null;
    }
  }

  async discard(): Promise<void> {
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        if (uri) await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch {
        // ignore cleanup errors
      }
      this.recording = null;
    }
    this.emit({ status: 'idle' });
  }

  private handleRecordingUpdate(status: Audio.RecordingStatus): void {
    if (!status.isRecording && !status.isDoneRecording) return;

    this.emit({
      status: status.isRecording ? 'recording' : 'stopped',
      durationMs: status.durationMillis,
      metering: status.metering ?? null,
    });
  }
}

/**
 * Format milliseconds to a human-readable duration: "1:23:45" or "12:34"
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
