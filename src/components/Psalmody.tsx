import { ReadingBlock } from './ReadingBlock';

export interface PsalmodyProps {
  psalms: string[];
  label?: string;
}

/** Converte "146", "[120]", "119:145–176" em citação legível. */
export function psalmCitation(psalm: string): string {
  const cleaned = psalm.replace(/[[\]]/g, '').trim();
  if (/^\d/.test(cleaned)) return `Salmo ${cleaned}`;
  return cleaned;
}

/** Salmodia do ofício, com o Gloria Patri ao final. */
export function Psalmody({ psalms, label }: PsalmodyProps) {
  if (psalms.length === 0) return null;

  return (
    <div className="psalmody">
      {label && <p className="alternative-label">{label}</p>}
      {psalms.map((psalm) => (
        <ReadingBlock
          key={psalm}
          citation={psalmCitation(psalm)}
          kicker="Salmo"
          variant="psalm"
        />
      ))}
      <p className="doxology">
        Glória ao Pai, ao Filho e ao Espírito Santo; como era no princípio, agora e sempre.
        Amém.
      </p>
    </div>
  );
}
