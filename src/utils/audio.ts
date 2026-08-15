/**
 * Web Audio API procedural sound engine for authentic 2004 computing & ambient acoustics.
 * No external large audio assets required; completely real-time procedural synthesis.
 */

let audioCtx: AudioContext | null = null;
let ambienceGainNode: GainNode | null = null;
let rainNoiseSource: AudioNode | null = null;
let humOscillator: OscillatorNode | null = null;
let isAmbienceActive = false;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. CRT Power On Sound: mechanical snap, high voltage coil charge, flyback 15.7kHz tone
export function playCrtPowerOn() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Relay switch click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(120, now);
    clickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.05);
    clickGain.gain.setValueAtTime(0.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + 0.05);

    // CRT phosphor high frequency sweep & tube pop
    const tubeOsc = ctx.createOscillator();
    const tubeGain = ctx.createGain();
    tubeOsc.type = 'sine';
    tubeOsc.frequency.setValueAtTime(60, now + 0.04);
    tubeOsc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
    tubeOsc.frequency.exponentialRampToValueAtTime(15625, now + 0.9); // 15.6 kHz NTSC CRT flyback
    tubeGain.gain.setValueAtTime(0.001, now);
    tubeGain.gain.linearRampToValueAtTime(0.15, now + 0.2);
    tubeGain.gain.exponentialRampToValueAtTime(0.005, now + 1.2);
    tubeOsc.connect(tubeGain);
    tubeGain.connect(ctx.destination);
    tubeOsc.start(now + 0.04);
    tubeOsc.stop(now + 1.2);
  } catch (e) {
    console.warn('Audio play error', e);
  }
}

// 2. CRT Degauss: Heavy deep transformer thud, oscillating metallic coil decay
export function playCrtDegauss() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Heavy thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 1.2);

    // Tremolo LFO for magnetic wobble
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(50, now);
    lfo.frequency.linearRampToValueAtTime(15, now + 1.2);
    lfoGain.gain.setValueAtTime(20, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + 1.4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.4);
  } catch (e) {
    console.warn(e);
  }
}

// 3. Windows XP Startup Chord (Synthesized iconic bright major chords: Eb - Bb - Ab - Eb - Bb)
export function playWindowsStartup() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime + 0.05;

    const chords = [
      { freq: 311.13, start: 0.0, dur: 1.8, gain: 0.15 }, // Eb4
      { freq: 466.16, start: 0.2, dur: 1.8, gain: 0.14 }, // Bb4
      { freq: 415.30, start: 0.45, dur: 2.0, gain: 0.16 }, // Ab4
      { freq: 622.25, start: 0.8, dur: 2.4, gain: 0.18 }, // Eb5
      { freq: 932.33, start: 1.15, dur: 2.6, gain: 0.15 }, // Bb5
      { freq: 1244.5, start: 1.5, dur: 3.0, gain: 0.12 }, // Eb6
    ];

    chords.forEach(({ freq, start, dur, gain: targetGain }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      // Subtle harmonic richness
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, now + start);

      g.gain.setValueAtTime(0.001, now + start);
      g.gain.linearRampToValueAtTime(targetGain, now + start + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0005, now + start + dur);

      osc.connect(g);
      osc2.connect(g);
      g.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + dur);
      osc2.start(now + start);
      osc2.stop(now + start + dur);
    });
  } catch (e) {
    console.warn(e);
  }
}

// 4. Windows XP Error Chord / Ding
export function playWindowsError() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn(e);
  }
}

// 5. Windows XP Balloon Hint Chime
export function playWindowsBalloon() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.1, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.25);
    });
  } catch (e) {
    console.warn(e);
  }
}

// 6. AIM Message Received Chime
export function playAimReceive() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1174.66, now + 0.08); // A5 -> D6
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn(e);
  }
}

// 7. AIM Send message click
export function playAimSend() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now);
    osc.frequency.setValueAtTime(783.99, now + 0.06);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn(e);
  }
}

// 8. AIM BUZZ / Nudge (intense vibration rattle)
export function playAimBuzz() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);

    const lfo = ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(25, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.3, now);
    lfo.connect(lfoGain);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
    lfo.start(now);
    lfo.stop(now + 0.65);
  } catch (e) {
    console.warn(e);
  }
}

// 9. AIM Buddy Door Open / Close
export function playAimDoor(isOpen: boolean) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    if (isOpen) {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    } else {
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);
    }
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {
    console.warn(e);
  }
}

// 10. Tactile Key Click / Mouse Click
export function playKeyClick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.025);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  } catch (e) {
    // Ignore key errors
  }
}

export function playMouseClick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.015);
  } catch (e) {
    // Ignore click errors
  }
}

// 11. Hard Drive Seeking (Subtle random ticking)
export function playHddSeek() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const ticks = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < ticks; i++) {
      const t = now + i * (0.02 + Math.random() * 0.03);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800 + Math.random() * 1200, t);
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.0005, t + 0.01);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.012);
    }
  } catch (e) {
    // Silent fail
  }
}

// 12. 56k Dial-Up Burst
export function playDialupHandshake() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Dual Tone dial pulse
    const freqs = [697, 1209, 770, 1336, 852, 1477];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = f;
      const st = now + (idx % 3) * 0.12;
      g.gain.setValueAtTime(0.04, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.1);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(st);
      osc.stop(st + 0.11);
    });

    // Static chirp burst
    setTimeout(() => {
      if (!ctx || ctx.state === 'closed') return;
      const noiseNow = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.08);
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2400;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, noiseNow);
      g.gain.exponentialRampToValueAtTime(0.001, noiseNow + 0.7);
      whiteNoise.connect(filter);
      filter.connect(g);
      g.connect(ctx.destination);
      whiteNoise.start(noiseNow);
      whiteNoise.stop(noiseNow + 0.75);
    }, 450);
  } catch (e) {
    console.warn(e);
  }
}

// 13. Room Tone & Rain Ambience (Procedural noise & low 60Hz hum)
export function startAmbience(volume = 0.25) {
  if (isAmbienceActive) return;
  try {
    const ctx = getAudioContext();
    isAmbienceActive = true;

    ambienceGainNode = ctx.createGain();
    ambienceGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    ambienceGainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);
    ambienceGainNode.connect(ctx.destination);

    // Pink/Brown noise for rain outside cyber cafe window
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    // Filter rain to sound like outside glass
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 1100;

    rainSource.connect(rainFilter);
    rainFilter.connect(ambienceGainNode);
    rainSource.start();
    rainNoiseSource = rainSource;

    // Low 60Hz fluorescent tube transformer room hum
    humOscillator = ctx.createOscillator();
    const humGain = ctx.createGain();
    humOscillator.type = 'sine';
    humOscillator.frequency.value = 60;
    humGain.gain.value = 0.018;

    const humHarmonic = ctx.createOscillator();
    const harmGain = ctx.createGain();
    humHarmonic.type = 'sine';
    humHarmonic.frequency.value = 120;
    harmGain.gain.value = 0.008;

    humOscillator.connect(humGain);
    humGain.connect(ambienceGainNode);
    humHarmonic.connect(harmGain);
    harmGain.connect(ambienceGainNode);

    humOscillator.start();
    humHarmonic.start();
  } catch (e) {
    console.warn('Ambience audio start error', e);
  }
}

export function stopAmbience() {
  if (!isAmbienceActive || !ambienceGainNode || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    ambienceGainNode.gain.linearRampToValueAtTime(0.001, now + 0.6);
    setTimeout(() => {
      try {
        if (rainNoiseSource && 'stop' in rainNoiseSource) {
          (rainNoiseSource as AudioBufferSourceNode).stop();
        }
        if (humOscillator) {
          humOscillator.stop();
        }
      } catch (e) {
        // Ignore
      }
      isAmbienceActive = false;
    }, 700);
  } catch (e) {
    isAmbienceActive = false;
  }
}

export function toggleAmbience(): boolean {
  if (isAmbienceActive) {
    stopAmbience();
    return false;
  } else {
    startAmbience();
    return true;
  }
}

// 14. Winamp Procedural Chiptune / Melodic Synth Player
let winampSynthTimer: number | null = null;
let isWinampPlaying = false;

// 2000s Classic Melodies for Winamp in Cyber Cafe
export const WINAMP_PLAYLIST: {
  title: string;
  artist: string;
  duration: string;
  notes: number[][]; // [freq, durSec]
}[] = [
  {
    title: 'In The End (2001).mp3',
    artist: 'Linkin Park',
    duration: '3:36',
    notes: [
      [329.63, 0.4], [392.00, 0.4], [392.00, 0.4], [370.00, 0.4], [329.63, 0.4], [293.66, 0.4],
      [329.63, 0.4], [392.00, 0.4], [370.00, 0.4], [293.66, 0.4], [246.94, 0.6],
      [329.63, 0.3], [329.63, 0.3], [392.00, 0.4], [370.00, 0.4], [329.63, 0.4]
    ]
  },
  {
    title: 'Numb (2003).mp3',
    artist: 'Linkin Park',
    duration: '3:07',
    notes: [
      [440.00, 0.35], [523.25, 0.35], [440.00, 0.35], [392.00, 0.35], [349.23, 0.5],
      [349.23, 0.35], [392.00, 0.35], [440.00, 0.35], [523.25, 0.5], [440.00, 0.7]
    ]
  },
  {
    title: 'Halo 2 Theme Mjolnir Mix.mp3',
    artist: 'Martin O\'Donnell',
    duration: '4:11',
    notes: [
      [220.00, 0.5], [261.63, 0.5], [293.66, 0.5], [329.63, 0.8],
      [293.66, 0.3], [261.63, 0.3], [220.00, 0.9], [196.00, 0.4], [220.00, 1.2]
    ]
  },
  {
    title: 'Lose Yourself.mp3',
    artist: 'Eminem',
    duration: '5:26',
    notes: [
      [293.66, 0.25], [293.66, 0.25], [329.63, 0.25], [349.23, 0.4],
      [329.63, 0.25], [293.66, 0.25], [261.63, 0.4], [293.66, 0.6]
    ]
  },
  {
    title: 'Bring Me To Life.mp3',
    artist: 'Evanescence',
    duration: '3:57',
    notes: [
      [329.63, 0.3], [370.00, 0.3], [392.00, 0.3], [440.00, 0.4], [392.00, 0.3],
      [370.00, 0.3], [329.63, 0.5], [293.66, 0.3], [329.63, 0.8]
    ]
  }
];

export function playWinampTrack(trackIndex: number, onSpectrumUpdate?: (bars: number[]) => void): () => void {
  stopWinampSynth();
  const track = WINAMP_PLAYLIST[trackIndex % WINAMP_PLAYLIST.length];
  const notes = track.notes;
  let currentNoteIdx = 0;
  isWinampPlaying = true;

  const ctx = getAudioContext();

  function playNext() {
    if (!isWinampPlaying) return;
    const [freq, dur] = notes[currentNoteIdx];
    currentNoteIdx = (currentNoteIdx + 1) % notes.length;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // warm 2000s square/triangle synth timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq / 2, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + dur);

      osc.connect(gain);
      subOsc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + dur);
      subOsc.stop(now + dur);

      if (onSpectrumUpdate) {
        const bars = [
          Math.min(100, Math.floor(Math.random() * 80 + 20)),
          Math.min(100, Math.floor(Math.random() * 95 + 10)),
          Math.min(100, Math.floor(Math.random() * 85 + 15)),
          Math.min(100, Math.floor(Math.random() * 90 + 20)),
          Math.min(100, Math.floor(Math.random() * 75 + 10)),
          Math.min(100, Math.floor(Math.random() * 65 + 5)),
          Math.min(100, Math.floor(Math.random() * 50 + 10)),
          Math.min(100, Math.floor(Math.random() * 40 + 5)),
        ];
        onSpectrumUpdate(bars);
      }
    } catch (e) {
      //
    }

    winampSynthTimer = window.setTimeout(playNext, dur * 1000);
  }

  playNext();

  return () => {
    stopWinampSynth();
  };
}

export function stopWinampSynth() {
  isWinampPlaying = false;
  if (winampSynthTimer) {
    clearTimeout(winampSynthTimer);
    winampSynthTimer = null;
  }
}
