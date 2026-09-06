// Web Audio API & Speech Synthesis Sound Alert Utility
// Completely client-side, zero-external-dependencies, safe for all browsers

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn('Web Audio not available', e);
    return null;
  }
}

/**
 * Plays a pleasant, friendly 3-note harmonic chime (C5 -> E5 -> G5)
 * Suitable for gentle medicine and precaution reminders.
 */
export function playChimeSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, idx) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.001, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.15 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.45);
    } catch (e) {
      console.warn('Chime playback error', e);
    }
  });
}

/**
 * Plays an alert chime for urgent critical precautions
 */
export function playAlertSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [880, 880, 880]; // A5 pulses

  frequencies.forEach((freq, idx) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.2);

      gain.gain.setValueAtTime(0.001, now + idx * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.3, now + idx * 0.2 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.2);
      osc.stop(now + idx * 0.2 + 0.18);
    } catch (e) {
      console.warn('Alert sound error', e);
    }
  });
}

/**
 * Voice announcement for uneducated/laypeople using browser SpeechSynthesis
 */
export function speakAlarmText(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
}
