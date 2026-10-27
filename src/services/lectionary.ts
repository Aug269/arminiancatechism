/**
 * Lecionário: leituras do Ofício Diário (ciclo de dois anos) e Próprio
 * dominical do Lecionário Comum Revisado (Anos A, B e C).
 */

import type { LiturgicalDay } from './liturgicalCalendar';
import dailyOfficeYear1 from '../data/lectionary/dailyOfficeYear1.json';
import dailyOfficeYear2 from '../data/lectionary/dailyOfficeYear2.json';
import dailyOfficeHolyDays from '../data/lectionary/dailyOfficeHolyDays.json';
import rclSundays from '../data/lectionary/rclSundays.json';
import { addDays } from './dateUtils';

export interface LessonSet {
  first?: string;
  second?: string;
  third?: string;
  gospel?: string;
  altFirst?: string;
  altSecond?: string;
  altGospel?: string;
}

export interface OfficeLessonGroup {
  flat?: LessonSet;
  morning?: LessonSet;
  evening?: LessonSet;
}

export interface OfficeEntry {
  title?: string;
  season?: string;
  week?: string;
  day?: string;
  psalmsMorning?: string[];
  psalmsEvening?: string[];
  lessons: OfficeLessonGroup;
  notes?: string;
}

export interface DailyReadings {
  psalms: { morning: string[]; evening: string[] };
  lessons: OfficeLessonGroup;
  title?: string;
  source: 'year1' | 'year2' | 'holy-day';
  week?: string;
  notes?: string;
}

const YEAR_ONE = dailyOfficeYear1 as unknown as OfficeEntry[];
const YEAR_TWO = dailyOfficeYear2 as unknown as OfficeEntry[];
const HOLY_DAYS = dailyOfficeHolyDays as unknown as OfficeEntry[];

/** Índice `semana|dia` → entradas (algumas semanas têm dois domingos). */
type Index = Map<string, OfficeEntry[]>;

function buildIndex(entries: OfficeEntry[]): Index {
  const index: Index = new Map();
  for (const entry of entries) {
    const key = `${entry.week ?? ''}|${entry.day ?? ''}`;
    const bucket = index.get(key);
    if (bucket) bucket.push(entry);
    else index.set(key, [entry]);
  }
  return index;
}

const YEAR_ONE_INDEX = buildIndex(YEAR_ONE);
const YEAR_TWO_INDEX = buildIndex(YEAR_TWO);

function pickEntry(
  index: Index,
  week: string | null,
  candidates: string[],
  title?: string,
): OfficeEntry | undefined {
  for (const day of candidates) {
    const bucket = index.get(`${week ?? ''}|${day}`);
    if (!bucket) continue;
    if (title) {
      const match = bucket.find((entry) => entry.title === title);
      if (match) return match;
      continue;
    }
    if (bucket.length === 1) return bucket[0];
  }
  // Fallback: procurar por título em toda a tabela.
  if (title) {
    const all = [...index.values()].flat();
    return all.find((entry) => entry.title === title);
  }
  return undefined;
}

/** Formata `MM-DD` no padrão do lecionário ("Dec 25", "Jan 2"). */
function dateKey(month: number, day: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}`;
}

/**
 * Leituras do Ofício Diário para um dia.
 *
 * Nos domingos e dias de semana usa a tábua do Ofício (Ano Um/Ano Dois); nas
 * festas de data fixa usa as leituras próprias da festa.
 */
export function getDailyOfficeReadings(day: LiturgicalDay): DailyReadings | null {
  const index = day.officeCycle === 1 ? YEAR_ONE_INDEX : YEAR_TWO_INDEX;
  const source = day.officeCycle === 1 ? 'year1' : 'year2';

  // 1. Festa de data fixa (fora dos domingos, que seguem o Próprio).
  const feast = HOLY_DAYS.find((entry) => entry.day === dateKey(day.month, day.day));
  if (feast && !day.isSunday && !day.movableFeastTitle) {
    return {
      psalms: {
        morning: feast.psalmsMorning ?? [],
        evening: feast.psalmsEvening ?? [],
      },
      lessons: feast.lessons,
      title: feast.title,
      source: 'holy-day',
      notes: feast.notes,
    };
  }

  const { week, day: dayName, title } = day.officeKey;
  const candidates = [dayName, day.weekdayKey, 'Sunday'];
  const entry = pickEntry(index, week, candidates, title);
  if (!entry) return null;

  return {
    psalms: {
      morning: entry.psalmsMorning ?? [],
      evening: entry.psalmsEvening ?? [],
    },
    lessons: entry.lessons,
    title: entry.title,
    source,
    week: entry.week,
    notes: entry.notes,
  };
}

/** Ofícios de ocasiões especiais (dedicação de igreja, festa padroeira…). */
export function getSpecialOccasions(): OfficeEntry[] {
  return dailyOfficeHolyDays as unknown as OfficeEntry[];
}

// ---------------------------------------------------------------------- RCL
export interface RclTrack {
  track: number;
  first: string;
  psalm: string;
  second: string;
  gospel: string;
}

export interface RclEntry {
  id: string;
  label: string;
  year: string;
  season: string;
  fixedDate: string | null;
  notes: string | null;
  tracks: RclTrack[];
  /** Tradução do título para o português, quando conhecida. */
  labelPt?: string;
}

const RCL = rclSundays as unknown as RclEntry[];
const RCL_BY_ID = new Map(RCL.map((entry) => [entry.id, entry]));

const SEASON_PT: Record<string, string> = {
  advent: 'Advento',
  christmas: 'Natal',
  epiphany: 'Epifania',
  lent: 'Quaresma',
  holy_week: 'Semana Santa',
  easter: 'Páscoa',
  after_pentecost: 'Tempo Comum',
  holy_day: 'Dia Santo',
};

export function seasonPt(season: string): string {
  return SEASON_PT[season] ?? season;
}

/** Próprio dominical do RCL para o dia (Ano A/B/C). */
export function getRclPropers(day: LiturgicalDay): RclEntry | undefined {
  const letter = day.yearLetter.toLowerCase();
  const id = rclIdFor(day, letter);
  if (id) {
    const entry = RCL_BY_ID.get(id);
    if (entry) return entry;
    // Propers com dois trilhos: `a-proper-5` → `a-proper-5-t1`.
    const withTrack = RCL.filter((item) => item.id.startsWith(`${id}-t`));
    if (withTrack.length > 0) return withTrack[0];
    if (id.endsWith('-t1')) {
      const base = RCL_BY_ID.get(id.replace('-t1', ''));
      if (base) return base;
    }
  }
  const fixed = RCL.find(
    (entry) =>
      entry.fixedDate === `${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}` &&
      (entry.year === 'ABC' || entry.year === day.yearLetter),
  );
  return fixed;
}

/** Todos os trilhos de um Próprio (quando há leitura semicontínua/complementar). */
export function getRclTracks(entry: RclEntry | undefined): RclTrack[] {
  if (!entry) return [];
  const baseId = entry.id.replace(/-t\d$/, '');
  const grouped = RCL.filter((item) => item.id.replace(/-t\d$/, '') === baseId);
  const tracks = grouped.flatMap((item) => item.tracks);
  return tracks.sort((a, b) => a.track - b.track);
}

function rclIdFor(day: LiturgicalDay, letter: string): string | null {
  const { season, weekOfSeason, feastsOfTheWeek: feast, date } = day;

  switch (season) {
    case 'advent':
      return weekOfSeason ? `${letter}-advent-${weekOfSeason}` : null;
    case 'christmas': {
      if (date === `${day.year}-12-25`) return 'abc-christmas-day-1';
      if (date === `${day.year}-01-01`) return 'abc-holy-name';
      if (day.isSunday) {
        const isFirst = day.officeKey.title === 'The First Sunday after Christmas';
        return isFirst ? 'abc-christmas-1' : 'abc-christmas-2';
      }
      return null;
    }
    case 'epiphany': {
      if (date === `${day.year}-01-06`) return 'abc-epiphany';
      if (weekOfSeason === null) return `${letter}-epiphany-last`;
      return `${letter}-epiphany-${weekOfSeason}`;
    }
    case 'lent': {
      if (date === feast.ashWednesday) return 'abc-ash-wednesday';
      return weekOfSeason ? `${letter}-lent-${weekOfSeason}` : null;
    }
    case 'holyWeek': {
      if (date === feast.palmSunday) return `${letter}-palm-sunday`;
      if (date === feast.maundyThursday) return 'abc-maundy-thursday';
      if (date === feast.goodFriday) return 'abc-good-friday';
      if (date === addDays(feast.easter, -1)) return 'abc-holy-saturday';
      const map: Record<number, string> = {
        1: 'abc-holy-monday',
        2: 'abc-holy-tuesday',
        3: 'abc-holy-wednesday',
      };
      return map[day.weekday] ?? null;
    }
    case 'easter': {
      if (date === feast.easter) return `${letter}-easter-day`;
      if (date === feast.ascension) return 'abc-ascension';
      if (date === feast.pentecost) return `${letter}-pentecost`;
      return weekOfSeason ? `${letter}-easter-${weekOfSeason}` : null;
    }
    case 'afterPentecost': {
      if (date === feast.pentecost) return `${letter}-pentecost`;
      if (date === feast.trinity) return `${letter}-trinity`;
      return day.proper ? `${letter}-proper-${day.proper}` : null;
    }
    default:
      return null;
  }
}

export { RCL };
