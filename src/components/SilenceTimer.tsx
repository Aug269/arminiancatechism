import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';

export interface SilenceTimerProps {
  seconds?: number;
  label?: string;
}

/** Toque suave de sino, sintetizado (sem arquivos de áudio). */
function chime() {
  try {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const context = new AudioCtor();
    const now = context.currentTime;
    const partials = [528, 792, 1056];
    partials.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.16 / (index + 1), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 3.6);
    });
    window.setTimeout(() => void context.close(), 4000);
  } catch {
    /* áudio indisponível: o timer segue em silêncio */
  }
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const PRESETS = [60, 120, 300];

/** Temporizador de silêncio meditativo para as rubricas do Ofício. */
export function SilenceTimer({ seconds = 60, label }: SilenceTimerProps) {
  const [duration, setDuration] = useState(seconds);
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef<number | null>(null);
  const baseRemaining = useRef(seconds);

  useEffect(() => {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(false);
    setFinished(false);
    baseRemaining.current = seconds;
    startedAt.current = null;
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    startedAt.current = Date.now();
    baseRemaining.current = remaining;

    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000);
      const next = baseRemaining.current - elapsed;
      if (next <= 0) {
        window.clearInterval(timer);
        setRemaining(0);
        setRunning(false);
        setFinished(true);
        chime();
        if ('vibrate' in navigator) navigator.vibrate?.(200);
      } else {
        setRemaining(next);
      }
    }, 250);

    return () => window.clearInterval(timer);
    // `remaining` é capturado apenas no início de cada execução.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const progress = useMemo(() => {
    if (duration === 0) return 0;
    return Math.max(0, Math.min(100, ((duration - remaining) / duration) * 100));
  }, [duration, remaining]);

  const reset = useCallback(
    (next?: number) => {
      const value = next ?? duration;
      setDuration(value);
      setRemaining(value);
      setRunning(false);
      setFinished(false);
      baseRemaining.current = value;
      startedAt.current = null;
    },
    [duration],
  );

  return (
    <div className="silence">
      <div className="silence-head">
        <Icon name="bell" size={16} style={{ color: 'var(--rubrica)' }} />
        <span className="silence-label">{label ?? 'Guarda-se silêncio por alguns instantes'}</span>
        <div className="silence-controls">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="ghost-button"
              aria-pressed={duration === preset}
              onClick={() => reset(preset)}
            >
              {preset / 60} min
            </button>
          ))}
          <button
            type="button"
            className="ghost-button"
            onClick={() => (running ? setRunning(false) : (setFinished(false), setRunning(true)))}
          >
            <Icon name={running ? 'pause' : 'play'} size={12} />
            {running ? 'Pausar' : remaining < duration ? 'Continuar' : 'Iniciar'}
          </button>
          <button type="button" className="ghost-button" onClick={() => reset()} aria-label="Reiniciar">
            <Icon name="reset" size={12} />
          </button>
        </div>
      </div>

      <div className="silence-timer">
        <span className="silence-clock" aria-live="polite">
          {formatClock(remaining)}
        </span>
        <div className="silence-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {finished && <p className="silence-finished">O silêncio foi cumprido. Voltemos à oração.</p>}
    </div>
  );
}
