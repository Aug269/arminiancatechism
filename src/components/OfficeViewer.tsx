import { Fragment, useMemo } from 'react';
import { APOSTLES_CREED, LORDS_PRAYER } from '../data/offices/prayers';
import { getCollect } from '../data/collects';
import { SENTENCES } from '../data/offices/sentences';
import type { DialogueLine, OfficeBlock, OfficeDefinition } from '../data/offices/types';
import { ReadingBlock } from './ReadingBlock';
import { SundayPropers } from './SundayPropers';
import { CanticleBlock } from './CanticleBlock';
import { CollectBlock } from './CollectBlock';
import { Psalmody } from './Psalmody';
import type { DailyReadings } from '../services/lectionary';
import type { LiturgicalDay } from '../services/liturgicalCalendar';
import { SilenceTimer } from './SilenceTimer';
import { Icon } from './Icon';

export interface OfficeViewerProps {
  office: OfficeDefinition;
  day: LiturgicalDay;
  readings: DailyReadings | null;
  sentence: string;
  /** Escolha do Próprio dominical (trilho 1 ou 2). */
  track: number;
  onTrackChange: (track: number) => void;
  onToggleTheme: () => void;
  theme: 'day' | 'night';
}

function pickSentence(day: LiturgicalDay, seed: number): string {
  const pool = SENTENCES[day.season] ?? SENTENCES.afterPentecost;
  if (pool.length === 0) return '';
  return pool[seed % pool.length];
}

function Dialogue({ lines }: { lines: DialogueLine[] }) {
  return (
    <div className="dialogue">
      {lines.map((line, index) => (
        <p className={`dialogue-line ${line.speaker === 'all' ? 'speaker-all' : 'speaker-leader'}`} key={index}>
          <span className="dialogue-mark" aria-hidden="true">
            {line.speaker === 'all' ? '℟' : line.speaker === 'leader' ? '℣' : '·'}
          </span>
          <span>{line.text}</span>
        </p>
      ))}
    </div>
  );
}

function collectIdsForBlock(day: LiturgicalDay): string[] {
  return day.collectIds;
}

/** Bloco «leitura» do Ofício: primeira leitura e Evangelho, com salmo opcional. */
function ReadingsSection({
  officeId,
  readings,
  day,
  track,
  onTrackChange,
}: {
  officeId: string;
  readings: DailyReadings | null;
  day: LiturgicalDay;
  track: number;
  onTrackChange: (track: number) => void;
}) {
  const lessons = readings?.lessons ?? {};
  const evening = officeId === 'vespertino' || officeId === 'completas';
  const specific = evening ? lessons.evening : lessons.morning;
  const set = specific ?? lessons.flat ?? lessons;

  const first = 'first' in set ? set.first : undefined;
  const second = 'second' in set ? set.second : undefined;
  const gospel = 'gospel' in set ? set.gospel : undefined;

  const order: Array<{ citation?: string; kicker: string }> = evening
    ? [
        { citation: first, kicker: 'Primeira Leitura' },
        { citation: gospel ?? second, kicker: 'Evangelho' },
      ]
    : [
        { citation: first, kicker: 'Primeira Leitura' },
        { citation: second, kicker: 'Segunda Leitura' },
        { citation: gospel, kicker: 'Evangelho' },
      ];

  const valid = order.filter((item) => Boolean(item.citation));

  if (!readings) {
    return <p className="reading-note">Não foi possível carregar as leituras deste dia.</p>;
  }

  return (
    <>
      {valid.map((item, index) => (
        <ReadingBlock
          key={`${item.kicker}-${item.citation}-${index}`}
          citation={item.citation as string}
          kicker={item.kicker}
        />
      ))}
      {valid.length === 0 && (
        <p className="reading-note">Este dia não tem leituras próprias na tábua do Ofício.</p>
      )}
      {readings.title && (
        <p className="reading-note">
          {readings.title}
          {readings.week ? ` · ${readings.week}` : ''}
          {readings.source === 'holy-day' ? ' · leituras próprias da festa' : ''}
        </p>
      )}
      {(day.isSunday || day.isFeastDay) && (
        <SundayPropers day={day} track={track} onTrackChange={onTrackChange} />
      )}
    </>
  );
}

function Block({
  block,
  office,
  day,
  readings,
  sentence,
  track,
  onTrackChange,
}: {
  block: OfficeBlock;
  office: OfficeDefinition;
  day: LiturgicalDay;
  readings: DailyReadings | null;
  sentence: string;
  track: number;
  onTrackChange: (track: number) => void;
}) {
  switch (block.kind) {
    case 'rubric':
      return (
        <p className="rubric">
          {block.text}
          <span className="rubric-note">Rubrica</span>
        </p>
      );
    case 'sentence':
      return <p className="paragraph dropcap">{sentence}</p>;
    case 'heading':
      return <h2 className="block-heading">{block.text}</h2>;
    case 'text':
      return <p className="paragraph dropcap">{block.text}</p>;
    case 'verse':
      return (
        <div className="verses">
          {block.lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    case 'response':
      return <p className="response">{block.text}</p>;
    case 'dialogue':
      return <Dialogue lines={block.lines} />;
    case 'psalmody': {
      const source =
        office.id === 'completas' || office.id === 'vespertino'
          ? readings?.psalms.evening ?? []
          : readings?.psalms.morning ?? [];
      const fallback = readings?.psalms.morning ?? [];
      const psalms = source.length > 0 ? source : fallback;
      return <Psalmody psalms={psalms} label={block.label} />;
    }
    case 'readings':
      return (
        <ReadingsSection
          officeId={office.id}
          readings={readings}
          day={day}
          track={track}
          onTrackChange={onTrackChange}
        />
      );
    case 'canticle':
      return <CanticleBlock canticleId={block.canticleId} />;
    case 'silence':
      return <SilenceTimer seconds={block.seconds ?? 60} label={block.label} />;
    case 'creed':
      return (
        <div className="verses">
          {APOSTLES_CREED.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    case 'lords-prayer':
      return (
        <div className="verses">
          {LORDS_PRAYER.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    case 'collect': {
      if (block.text) {
        return <CollectBlock collect={{ id: 'inline', title: block.title ?? 'Coleta', section: 'comuns', text: block.text }} />;
      }
      const ids = block.collectId ? [block.collectId] : collectIdsForBlock(day);
      const collects = ids.map((id) => getCollect(id)).filter(Boolean);
      return (
        <>
          {collects.map((collect) => (
            <CollectBlock key={collect!.id} collect={collect!} />
          ))}
          {collects.length === 0 && <p className="reading-note">Coleta não encontrada.</p>}
        </>
      );
    }
    case 'prayer':
      return <p className="paragraph">{block.prayerId}</p>;
    default:
      return null;
  }
}

/** Visualizador do Ofício: texto litúrgico completo, com leituras e silêncios. */
export function OfficeViewer({
  office,
  day,
  readings,
  sentence,
  track,
  onTrackChange,
  onToggleTheme,
  theme,
}: OfficeViewerProps) {
  const seededSentence = useMemo(() => {
    if (day.movableFeastTitle) {
      const feastSentence = SENTENCES[day.season]?.[0];
      if (feastSentence) return feastSentence;
    }
    const seed = day.year * 372 + day.month * 31 + day.day;
    return pickSentence(day, seed);
  }, [day]);

  return (
    <article className="paper" aria-labelledby="office-title">
      <header className="office-head">
        <p className="office-eyebrow">Rede Episcopal Brasileira · Ofício Diário</p>
        <h1 className="office-title" id="office-title">
          {office.title}
        </h1>
        <p className="office-subtitle">{office.subtitle}</p>
        <p className="office-summary">{office.summary}</p>
        <div className="rule">
          <span>
            {day.dayTitle}
            {day.isFeastDay && day.feasts.length > 0 ? ` · ${day.feasts[0].name}` : ''}
          </span>
        </div>
        <div className="reading-actions" style={{ justifyContent: 'center', marginLeft: 0 }}>
          <button
            type="button"
            className="ghost-button"
            onClick={onToggleTheme}
            aria-pressed={theme === 'night'}
          >
            <Icon name={theme === 'night' ? 'sun' : 'moon'} size={12} />
            {theme === 'night' ? 'Modo diurno' : 'Modo noturno'}
          </button>
        </div>
      </header>

      {office.blocks.map((block, index) => (
        <Fragment key={index}>
          <Block
            block={block}
            office={office}
            day={day}
            readings={readings}
            sentence={sentence || seededSentence}
            track={track}
            onTrackChange={onTrackChange}
          />
        </Fragment>
      ))}

      <div className="rule">
        <span>Fim do {office.title}</span>
      </div>
    </article>
  );
}
