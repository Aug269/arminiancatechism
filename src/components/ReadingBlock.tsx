import { useEffect, useMemo, useState } from 'react';
import { CANTICLE_BY_ID } from '../data/offices/canticles';
import { localizeCitation, renderCitation, type RenderedPassage } from '../services/bibleService';

/** Cânticos do Livro de Oração Comum → cânticos deste Ofício. */
const BCP_CANTICLES: Record<number, string> = {
  1: 'benedicite',
  2: 'teDeum',
  4: 'benedictusDominusDeus',
  8: 'cantemusDomino',
  9: 'cantateDomino',
  12: 'ecceDeus',
  13: 'kyriePantokrator',
  15: 'magnificat',
  16: 'benedictus',
  17: 'nuncDimittis',
  18: 'dignusEs',
  19: 'magnaEtMirabilia',
  20: 'surgeIlluminare',
  21: 'quaeriteDominum',
  22: 'deusMisereatur',
};

interface PassageState {
  loading: boolean;
  passages: RenderedPassage[];
}

function usePassages(citation: string): PassageState {
  const [state, setState] = useState<PassageState>({ loading: true, passages: [] });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true }));
    renderCitation(citation)
      .then((passages) => {
        if (active) setState({ loading: false, passages });
      })
      .catch(() => {
        if (active) setState({ loading: false, passages: [] });
      });
    return () => {
      active = false;
    };
  }, [citation]);

  return state;
}

export interface ReadingBlockProps {
  citation: string;
  kicker?: string;
  showHeading?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  variant?: 'reading' | 'psalm' | 'inline';
}

/** Texto bíblico integral de uma citação do lecionário. */
export function ReadingBlock({
  citation,
  kicker,
  showHeading = true,
  collapsible = false,
  defaultOpen = true,
  variant = 'reading',
}: ReadingBlockProps) {
  const { loading, passages } = usePassages(citation);
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen, citation]);

  const body = useMemo(() => {
    if (loading) {
      return (
        <p className="reading-note" role="status">
          Carregando o texto…
        </p>
      );
    }
    if (passages.length === 0) {
      return <p className="reading-note">Texto não disponível nesta edição.</p>;
    }
    return passages.map((passage, index) => {
      const alternative = passages.length > 1 && index > 0;
      if (passage.canticleNumber) {
        const canticle = CANTICLE_BY_ID[BCP_CANTICLES[passage.canticleNumber]];
        if (canticle) {
          return (
            <div key={`${passage.label}-${index}`}>
              {alternative && <p className="alternative-label">Ou</p>}
              <p className="reading-note">
                {passage.bookName} — {canticle.title} ({canticle.reference})
              </p>
              <div className="verses">
                {canticle.verses.map((verse, verseIndex) => (
                  <p key={verseIndex}>{verse}</p>
                ))}
              </div>
            </div>
          );
        }
        return (
          <p className="reading-note" key={`${passage.label}-${index}`}>
            {passage.bookName}: cântico não incluído nesta edição; consulte o Livro de Oração.
          </p>
        );
      }

      if (passage.missing) {
        const isDeuterocanonical = /Macabeus|Eclesiástico|Sabedoria|Baruc|Judite|Esdras|Tobias/.test(
          passage.bookName,
        );
        return (
          <p className="reading-note" key={`${passage.label}-${index}`}>
            {alternative && <span className="alternative-label">Ou · </span>}
            {passage.bookName}
            {isDeuterocanonical
              ? ' — livro deuterocanônico não incluído nesta edição; leia na sua Bíblia.'
              : ' — texto não encontrado nesta edição.'}
          </p>
        );
      }

      return (
        <div key={`${passage.label}-${index}`}>
          {alternative && <p className="alternative-label">Ou</p>}
          <div className="verses">
            {passage.verses.map((verse) => (
              <p key={`${verse.chapter}-${verse.verse}`}>
                <span className="verse-num">
                  {verse.chapter}:{verse.verse}
                </span>
                {verse.text}
              </p>
            ))}
          </div>
          {passage.truncated && (
            <p className="reading-note">Trecho extenso: exibimos os primeiros versículos.</p>
          )}
        </div>
      );
    });
  }, [loading, passages]);

  if (variant === 'inline') {
    return <div>{body}</div>;
  }

  return (
    <div className={`reading reading-${variant}`}>
      {showHeading && (
        <div className="reading-head">
          <span className="reading-kicker">{kicker ?? 'Leitura'}</span>
          <span className="reading-cite">{localizeCitation(citation)}</span>
          <div className="reading-actions">
            {collapsible && (
              <button
                type="button"
                className="ghost-button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
              >
                {open ? 'Recolher' : 'Abrir texto'}
              </button>
            )}
          </div>
        </div>
      )}
      {(open || !collapsible) && <div className="reading-body">{body}</div>}
    </div>
  );
}

export { BCP_CANTICLES };
export function canticleForBcpNumber(number: number): string | undefined {
  const id = BCP_CANTICLES[number];
  return id && CANTICLE_BY_ID[id] ? id : undefined;
}
