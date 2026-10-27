import { useMemo } from 'react';
import { getRclPropers, getRclTracks } from '../services/lectionary';
import type { LiturgicalDay } from '../services/liturgicalCalendar';
import { ReadingBlock } from './ReadingBlock';

export interface SundayPropersProps {
  day: LiturgicalDay;
  track: number;
  onTrackChange: (track: number) => void;
}

/** Próprio do domingo/festa no Lecionário Comum Revisado (Anos A, B e C). */
export function SundayPropers({ day, track, onTrackChange }: SundayPropersProps) {
  const entry = useMemo(() => getRclPropers(day), [day]);
  const tracks = useMemo(() => getRclTracks(entry), [entry]);

  if (!entry) return null;

  const available = tracks.length > 0 ? tracks : entry.tracks;
  const selected = available.find((item) => item.track === track) ?? available[0];

  const hasTracks = available.length > 1;

  return (
    <section aria-labelledby="propers-title" style={{ marginTop: '1.6rem' }}>
      <h2 className="block-heading" id="propers-title">
        Próprio do Lecionário · {entry.label}
      </h2>
      <p className="reading-note" style={{ marginBottom: '0.6rem' }}>
        Ano {day.yearLetter}
        {entry.notes ? ` · ${entry.notes}` : ''}
      </p>

      {hasTracks && (
        <div className="track-tabs" role="tablist" aria-label="Trilho do lecionário">
          {available.map((item) => (
            <button
              key={item.track}
              type="button"
              role="tab"
              aria-selected={selected.track === item.track}
              onClick={() => onTrackChange(item.track)}
            >
              Trilho {item.track === 1 ? '1 · semicontínuo' : '2 · complementar'}
            </button>
          ))}
        </div>
      )}

      {selected ? (
        <>
          {[
            ['Primeira Leitura', selected.first, 'reading'],
            ['Salmo', selected.psalm, 'psalm'],
            ['Segunda Leitura', selected.second, 'reading'],
            ['Evangelho', selected.gospel, 'reading'],
          ]
            .filter(([, citation]) => Boolean(citation && String(citation).trim()))
            .map(([kicker, citation, variant]) => (
              <ReadingBlock
                key={`${kicker}-${citation}`}
                citation={citation as string}
                kicker={kicker as string}
                variant={variant as 'reading' | 'psalm'}
              />
            ))}
        </>
      ) : (
        <p className="reading-note">Próprio não encontrado para este dia.</p>
      )}
    </section>
  );
}
