// Generative ambient soundscape for "Sensory Soundscape: The Atelier" using Web Audio API

class AtelierSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private isPlayingState = false;

  public start(): void {
    if (this.isPlayingState) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.14, now + 1.2);
    master.connect(this.ctx.destination);
    this.masterGain = master;

    // Warm Parisian atelier ambient chord (Dmaj9 pad: D3, A3, E4, F#4)
    const freqs = [146.83, 220.0, 329.63, 369.99];
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, now);
    filter.Q.setValueAtTime(0.7, now);
    filter.connect(master);

    // Subtle slow filter breathing
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.14, now);
    lfoGain.gain.setValueAtTime(180, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
    this.lfo = lfo;

    this.oscillators = freqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(idx === 1 ? -4 : idx === 2 ? 5 : 0, now);
      oscGain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.16, now);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      return osc;
    });

    // Soft silk-air texture (filtered pink-ish noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.45;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(420, now);
    noiseFilter.Q.setValueAtTime(0.8, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now);
    this.noiseSource = noise;

    this.isPlayingState = true;
  }

  public stop(): void {
    if (!this.isPlayingState || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const gain = this.masterGain;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    const oscs = [...this.oscillators];
    const lfo = this.lfo;
    const noise = this.noiseSource;

    setTimeout(() => {
      oscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      try {
        lfo?.stop();
        lfo?.disconnect();
      } catch {
        // ignore
      }
      try {
        noise?.stop();
        noise?.disconnect();
      } catch {
        // ignore
      }
      try {
        gain.disconnect();
      } catch {
        // ignore
      }
    }, 480);

    this.oscillators = [];
    this.lfo = null;
    this.noiseSource = null;
    this.masterGain = null;
    this.isPlayingState = false;
  }
}

export const atelierAudio = new AtelierSoundscapeEngine();
