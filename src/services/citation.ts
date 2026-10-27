/**
 * Interpretação de citações bíblicas do lecionário.
 *
 * Aceita as formas usadas nas fontes: "Isa 1:1–9", "Psalm 119:145–176",
 * "Neh 7:73b–8:3, 5–18", "Matt 9:9-9:13, 9:18-9:26", "Canticle 15",
 * "Isaiah 49:1-6 or Job 5:8-21".
 */

import BOOK_INDEX from '../data/bible/index.json';
import ALIASES from '../data/bible/aliases.json';

export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: number;
}

export interface VerseSpan {
  chapter: number;
  verseStart: number;
  verseEnd: number;
  /** Capítulo final quando a faixa atravessa capítulos ("7:73-8:3"). */
  endChapter?: number;
  /** Versículo final no capítulo de destino de uma faixa entre capítulos. */
  crossEndVerse?: number;
}

export interface CitationPart {
  /** Abreviação do livro no banco bíblico (quando disponível). */
  bookAbbrev?: string;
  bookName: string;
  spans: VerseSpan[];
  /** Cântico do Ofício (não é texto bíblico corrido). */
  canticleNumber?: number;
  /** O livro não consta desta edição (deuterocanônicos). */
  missing?: boolean;
}

export interface ParsedCitation {
  raw: string;
  alternatives: CitationPart[];
}

const BOOKS = BOOK_INDEX as BibleBook[];
const BOOK_BY_ABBREV = new Map(BOOKS.map((book) => [book.abbrev, book]));
const ALIAS_MAP = ALIASES as Record<string, string>;

/** Aliases adicionais em português e variantes do lecionário. */
const EXTRA_ALIASES: Record<string, string> = {
  'genesis': 'gn',
  'gênesis': 'gn',
  'exodo': 'ex',
  'êxodo': 'ex',
  'levitico': 'lv',
  'levítico': 'lv',
  'numeros': 'nm',
  'números': 'nm',
  'deuteronomio': 'dt',
  'deuteronômio': 'dt',
  'josue': 'js',
  'josué': 'js',
  'juizes': 'jz',
  'juízes': 'jz',
  'rute': 'rt',
  '1 samuel': '1sm',
  '2 samuel': '2sm',
  '1 reis': '1rs',
  '2 reis': '2rs',
  '1 cronicas': '1cr',
  '2 cronicas': '2cr',
  'esdras': 'ed',
  'neemias': 'ne',
  'ester': 'et',
  'jó': 'job',
  'jo': 'job',
  'salmo': 'sl',
  'salmos': 'sl',
  'proverbios': 'pv',
  'provérbios': 'pv',
  'eclesiastes': 'ec',
  'cantares': 'ct',
  'isaias': 'is',
  'isaías': 'is',
  'jeremias': 'jr',
  'lamentacoes': 'lm',
  'lamentações': 'lm',
  'ezequiel': 'ez',
  'daniel': 'dn',
  'oseias': 'os',
  'oséias': 'os',
  'joel': 'jl',
  'amos': 'am',
  'obadias': 'ob',
  'jonas': 'jn',
  'miqueias': 'mq',
  'naum': 'na',
  'habacuc': 'hc',
  'habacuque': 'hc',
  'sofonias': 'sf',
  'ageu': 'ag',
  'zacarias': 'zc',
  'malaquias': 'ml',
  'mateus': 'mt',
  'marcos': 'mc',
  'lucas': 'lc',
  'joao': 'jo',
  'joão': 'jo',
  'atos': 'atos',
  'atos dos apostolos': 'atos',
  'romanos': 'rm',
  '1 corintios': '1co',
  '2 corintios': '2co',
  'galatas': 'gl',
  'efesios': 'ef',
  'filipenses': 'fp',
  'colossenses': 'cl',
  '1 tessalonicenses': '1ts',
  '2 tessalonicenses': '2ts',
  '1 timoteo': '1tm',
  '2 timoteo': '2tm',
  'tito': 'tt',
  'filemom': 'fm',
  'hebreus': 'hb',
  'tiago': 'tg',
  '1 pedro': '1pe',
  '2 pedro': '2pe',
  '1 joao': '1jo',
  '2 joao': '2jo',
  '3 joao': '3jo',
  'judas': 'jd',
  'apocalipse': 'ap',
  // Livros deuterocanônicos — citados no lecionário, ausentes desta edição.
  'sir': 'miss:sir',
  'sirach': 'miss:sir',
  'eclesiastico': 'miss:sir',
  'wis': 'miss:wis',
  'wisdom': 'miss:wis',
  'sabedoria': 'miss:wis',
  '1 macc': 'miss:1macc',
  '2 macc': 'miss:2macc',
  '1 macabeus': 'miss:1macc',
  '2 macabeus': 'miss:2macc',
  '2 esd': 'miss:2esd',
  '2 esdras': 'miss:2esd',
  'tob': 'miss:tob',
  'tobit': 'miss:tob',
  'jdt': 'miss:jdt',
  'judite': 'miss:jdt',
  'bar': 'miss:bar',
  'baruc': 'miss:bar',
  'baruque': 'miss:bar',
};

const ALL_ALIASES: Record<string, string> = { ...ALIAS_MAP, ...EXTRA_ALIASES };

/** Lista de aliases ordenada do mais longo para o mais curto. */
const ALIAS_KEYS = Object.keys(ALL_ALIASES).sort((a, b) => b.length - a.length);

export const BIBLE_BOOKS = BOOKS;

function normalize(value: string): string {
  return value
    .replace(/[–—−]/g, '-')
    .replace(/[\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Converte "1:1-1:9" em spans de versículos. */
function parseSpans(text: string): VerseSpan[] {
  const spans: VerseSpan[] = [];
  let lastChapter: number | null = null;
  const segments = text
    .split(/[,;]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (const segment of segments) {
    const cleaned = segment.replace(/\s+/g, '');
    if (!cleaned) continue;

    // Capítulo inteiro: "122" ou "13"
    const chapterOnly = /^(\d+)$/.exec(cleaned);
    if (chapterOnly) {
      const chapter = Number(chapterOnly[1]);
      lastChapter = chapter;
      spans.push({ chapter, verseStart: 1, verseEnd: 999 });
      continue;
    }

    // Capítulo e versículo: "5:1-5:10", "3:1-7", "7:73b-8:3", "2:1"
    const withChapter = /^(\d+):(\d+)[ab]?(?:-(\d+):(\d+)[ab]?|-(\d+)[ab]?)?$/.exec(cleaned);
    if (withChapter) {
      const chapter = Number(withChapter[1]);
      const verseStart = Number(withChapter[2]);
      const endChapter = withChapter[3] ? Number(withChapter[3]) : chapter;
      const endVerse = withChapter[4]
        ? Number(withChapter[4])
        : withChapter[5]
          ? Number(withChapter[5])
          : verseStart;
      lastChapter = endChapter;
      spans.push(
        endChapter === chapter
          ? { chapter, verseStart, verseEnd: endVerse }
          : { chapter, verseStart, verseEnd: 999, endChapter, crossEndVerse: endVerse },
      );
      continue;
    }

    // Apenas versículos, herdando o capítulo anterior: "5-18", "15-21"
    const verseOnly = /^(\d+)[ab]?(?:-(\d+)[ab]?)?$/.exec(cleaned);
    if (verseOnly && lastChapter !== null) {
      const verseStart = Number(verseOnly[1]);
      const verseEnd = verseOnly[2] ? Number(verseOnly[2]) : verseStart;
      spans.push({ chapter: lastChapter, verseStart, verseEnd });
      continue;
    }
  }

  return spans;
}

const BOOK_NAME_PT: Record<string, string> = {
  sir: 'Eclesiástico (Sirácida)',
  wis: 'Sabedoria',
  '1macc': '1 Macabeus',
  '2macc': '2 Macabeus',
  '2esd': '2 Esdras',
  tob: 'Tobias',
  jdt: 'Judite',
  bar: 'Baruc',
};

/** Interpreta uma citação do lecionário. */
export function parseCitation(raw: string): ParsedCitation {
  const normalized = normalize(raw);
  const alternatives: CitationPart[] = [];

  for (const chunk of normalized.split(/\s+(?:or|ou)\s+/i)) {
    const part = chunk.trim();
    if (!part) continue;

    const canticle = /^canticle\s+(\d+)$/i.exec(part);
    if (canticle) {
      alternatives.push({
        bookName: `Cântico ${canticle[1]}`,
        spans: [],
        canticleNumber: Number(canticle[1]),
      });
      continue;
    }

    const lower = part.toLowerCase();
    const alias = ALIAS_KEYS.find((key) => {
      if (!lower.startsWith(key)) return false;
      const nextChar = lower.charAt(key.length);
      return nextChar === '' || nextChar === ' ' || /\d/.test(nextChar);
    });

    if (!alias) {
      // Citações numéricas puras ("146", "119:145-176") são salmos.
      if (/^\d/.test(part)) {
        const spans = parseSpans(part);
        alternatives.push({
          bookAbbrev: 'sl',
          bookName: 'Salmos',
          spans: spans.length > 0 ? spans : [{ chapter: Number(part), verseStart: 1, verseEnd: 999 }],
          missing: false,
        });
        continue;
      }
      alternatives.push({ bookName: part, spans: [], missing: true });
      continue;
    }

    const target = ALL_ALIASES[alias];
    const rest = part.slice(alias.length).trim();
    const spans = parseSpans(rest);

    if (target.startsWith('miss:')) {
      alternatives.push({
        bookName: BOOK_NAME_PT[target.slice(5)] ?? part.slice(0, alias.length),
        spans,
        missing: true,
      });
      continue;
    }

    const book = BOOK_BY_ABBREV.get(target);
    alternatives.push({
      bookAbbrev: target,
      bookName: book?.name ?? part.slice(0, alias.length),
      spans: spans.length > 0 ? spans : [{ chapter: 1, verseStart: 1, verseEnd: 999 }],
      missing: !book,
    });
  }

  return { raw, alternatives };
}



/** Formata uma faixa de versículos em português ("5:1-17", "119:145-176"). */
export function formatSpanPt(span: VerseSpan): string {
  if (span.endChapter) {
    return `${span.chapter}:${span.verseStart}-${span.endChapter}:${span.crossEndVerse ?? ''}`;
  }
  if (span.verseEnd >= 999) return `${span.chapter}`;
  if (span.verseStart === span.verseEnd) return `${span.chapter}:${span.verseStart}`;
  return `${span.chapter}:${span.verseStart}-${span.verseEnd}`;
}

/** Nome do livro em português para uma abreviação do banco bíblico. */
export function bookNamePt(abbrev: string): string {
  if (abbrev === 'sl') return 'Salmo';
  return BOOK_BY_ABBREV.get(abbrev)?.name ?? abbrev;
}

/**
 * Converte uma citação do lecionário em forma legível em português:
 * "Matt 9:9-13, 9:18-26" → "Mateus 9:9-13, 18-26".
 */
export function localizeCitation(raw: string): string {
  const parsed = parseCitation(raw);
  if (parsed.alternatives.length === 0) return raw;

  return parsed.alternatives
    .map((part) => {
      const name = part.bookAbbrev ? bookNamePt(part.bookAbbrev) : part.bookName;
      const spans = part.spans.map(formatSpanPt);
      // Simplifica "9:9-13, 9:18-26" → "9:9-13, 18-26" quando o capítulo se repete.
      let lastChapter = '';
      const compact = spans.map((span) => {
        const [chapter, rest] = span.split(':');
        if (rest && chapter === lastChapter) return rest;
        lastChapter = chapter;
        return span;
      });
      const range = compact.length > 0 ? ` ${compact.join(', ')}` : '';
      return `${name}${range}`;
    })
    .join(' ou ');
}
