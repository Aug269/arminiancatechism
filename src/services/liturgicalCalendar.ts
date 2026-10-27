/**
 * Calculador Litúrgico Automático.
 *
 * A partir de qualquer data civil, calcula:
 *  · a Páscoa e todas as datas móveis (Cinzas, Ramos, Ascensão, Pentecostes,
 *    Trindade, Cristo Rei, Primeiro Domingo do Advento);
 *  · o tempo litúrgico e a sua cor;
 *  · o Ano Litúrgico (A, B ou C) e o ciclo do Ofício Diário (Ano 1 ou 2);
 *  · o Próprio do Tempo Comum vigente (Próprio 1 a 29);
 *  · as festas de data fixa do dia e a chave do ofício no lecionário.
 */

import { HOLY_DAYS, getHolyDays, type HolyDay, type LiturgicalColor } from '../data/holyDays';
import {
  WEEKDAY_KEYS,
  addDays,
  diffDays,
  iso,
  parseIso,
  sundayOf,
  sundayOnOrAfter,
  weekdayOf,
  type IsoDate,
} from './dateUtils';

export type Season =
  | 'advent'
  | 'christmas'
  | 'epiphany'
  | 'lent'
  | 'holyWeek'
  | 'easter'
  | 'afterPentecost';

export type YearLetter = 'A' | 'B' | 'C';

export { HOLY_DAYS };
export type { HolyDay, LiturgicalColor };

export interface MovableFeasts {
  year: number;
  ashWednesday: IsoDate;
  palmSunday: IsoDate;
  maundyThursday: IsoDate;
  goodFriday: IsoDate;
  easter: IsoDate;
  ascension: IsoDate;
  pentecost: IsoDate;
  trinity: IsoDate;
  corpusChristi: IsoDate;
  christTheKing: IsoDate;
  advent1: IsoDate;
}

export interface OfficeKey {
  week: string | null;
  day: string;
  title?: string;
}

export interface LiturgicalDay {
  date: IsoDate;
  year: number;
  month: number;
  day: number;
  weekday: number;
  weekdayKey: string;
  isSunday: boolean;
  season: Season;
  seasonLabel: string;
  color: LiturgicalColor;
  yearLetter: YearLetter;
  /** Ciclo do Ofício Diário: 1 (Ano Um) ou 2 (Ano Dois). */
  officeCycle: 1 | 2;
  /** Ano civil em que começou o ano litúrgico (o Advento anterior). */
  churchYearStart: number;
  weekOfSeason: number | null;
  proper: number | null;
  sundayTitle: string;
  dayTitle: string;
  isFeastDay: boolean;
  feasts: HolyDay[];
  officeKey: OfficeKey;
  feastsOfTheWeek: MovableFeasts;
  collectIds: string[];
  /** Celebração móvel do dia, se houver. */
  movableFeastTitle?: string;
}

const SEASON_LABELS: Record<Season, string> = {
  advent: 'Advento',
  christmas: 'Tempo do Natal',
  epiphany: 'Tempo da Epifania',
  lent: 'Quaresma',
  holyWeek: 'Semana Santa',
  easter: 'Tempo Pascal',
  afterPentecost: 'Tempo Comum',
};

const SEASON_COLORS: Record<Season, LiturgicalColor> = {
  advent: 'roxo',
  christmas: 'branco',
  epiphany: 'verde',
  lent: 'roxo',
  holyWeek: 'vermelho',
  easter: 'branco',
  afterPentecost: 'verde',
};

const WEEKDAYS_PT = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

/**
 * Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher, calendário gregoriano).
 */
export function easterSunday(year: number): IsoDate {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return iso(year, month, day);
}

/** Primeiro Domingo do Advento: o domingo entre 27 de novembro e 3 de dezembro. */
export function firstSundayOfAdvent(year: number): IsoDate {
  return sundayOnOrAfter(iso(year, 11, 27));
}

/** Todas as datas móveis de um dado ano civil. */
export function getMovableFeasts(year: number): MovableFeasts {
  const easter = easterSunday(year);
  const advent1 = firstSundayOfAdvent(year);
  return {
    year,
    ashWednesday: addDays(easter, -46),
    palmSunday: addDays(easter, -7),
    maundyThursday: addDays(easter, -3),
    goodFriday: addDays(easter, -2),
    easter,
    ascension: addDays(easter, 39),
    pentecost: addDays(easter, 49),
    trinity: addDays(easter, 56),
    corpusChristi: addDays(easter, 60),
    christTheKing: addDays(firstSundayOfAdvent(year), -7),
    advent1,
  };
}

/**
 * Domingo mais próximo de 11 de maio: âncora do Próprio 1 do Tempo Comum.
 * O Próprio N é o domingo que cai entre 8 e 14 de maio, deslocado em (N−1)
 * semanas.
 */
function properAnchor(year: number): IsoDate {
  const closest = iso(year, 5, 11);
  const weekday = weekdayOf(closest);
  if (weekday === 0) return closest;
  if (weekday <= 3) return addDays(closest, -weekday);
  return addDays(closest, 7 - weekday);
}

/** Letra do ano litúrgico (A, B ou C) para o ano em que ele começou. */
export function yearLetterFor(churchYearStart: number): YearLetter {
  // O Advento de 2025 inaugurou o Ano A.
  const index = (((churchYearStart - 2025) % 3) + 3) % 3;
  return (['A', 'B', 'C'] as const)[index];
}

const ORDINALS = [
  'Primeiro',
  'Segundo',
  'Terceiro',
  'Quarto',
  'Quinto',
  'Sexto',
  'Sétimo',
  'Oitavo',
  'Nono',
  'Décimo',
];

function ordinal(n: number): string {
  return ORDINALS[n - 1] ?? `${n}º`;
}

/**
 * Próprio (1–29) correspondente ao domingo indicado.
 * Próprio 1 = domingo mais próximo de 11 de maio.
 */
export function properNumberFor(sunday: IsoDate): number {
  const { year } = parseIso(sunday);
  const anchor = properAnchor(year);
  const weeks = Math.round(diffDays(anchor, sunday) / 7);
  return Math.min(29, Math.max(1, weeks + 1));
}

interface SeasonInfo {
  season: Season;
  weekOfSeason: number | null;
  proper: number | null;
  sundayTitle: string;
  color: LiturgicalColor;
  officeKey: OfficeKey;
  movableFeastTitle?: string;
}

/**
 * Resolve o tempo litúrgico de uma data, com fronteiras absolutas relativas ao
 * ano litúrgico que a contém.
 */
function resolveSeason(date: IsoDate, churchYearStart: number): SeasonInfo {
  const { month, day } = parseIso(date);
  const weekday = weekdayOf(date);
  const weekdayKey = WEEKDAY_KEYS[weekday];
  const isSunday = weekday === 0;
  const sunday = sundayOf(date);

  const easterYear = churchYearStart + 1;
  const feast = getMovableFeasts(easterYear);
  const adventStart = firstSundayOfAdvent(churchYearStart);
  const christmasDay = iso(churchYearStart, 12, 25);
  const epiphany = iso(easterYear, 1, 6);

  // ------------------------------------------------------------------ Advento
  if (date >= adventStart && date < christmasDay) {
    const week = Math.min(4, Math.max(1, Math.floor(diffDays(adventStart, sunday) / 7) + 1));
    return {
      season: 'advent',
      weekOfSeason: week,
      proper: null,
      sundayTitle: `${ordinal(week)} Domingo do Advento`,
      color: week === 3 ? 'rosa' : 'roxo',
      officeKey:
        month === 12 && day === 24
          ? { week: 'Week of 4 Advent', day: 'Dec 24' }
          : { week: `Week of ${week} Advent`, day: weekdayKey },
    };
  }

  // -------------------------------------------------------------------- Natal
  if (date >= christmasDay && date < epiphany) {
    if (isSunday && date === christmasDay) {
      return {
        season: 'christmas',
        weekOfSeason: null,
        proper: null,
        sundayTitle: 'Natividade de Nosso Senhor Jesus Cristo',
        color: 'branco',
        officeKey: { week: 'Christmas Day and Following', day: 'Dec 25' },
        movableFeastTitle: 'Natividade de Nosso Senhor',
      };
    }
    if (isSunday) {
      const firstSunday = addDays(christmasDay, 7 - weekdayOf(christmasDay));
      const first = date === firstSunday;
      return {
        season: 'christmas',
        weekOfSeason: null,
        proper: null,
        sundayTitle: first ? 'Primeiro Domingo após o Natal' : 'Segundo Domingo após o Natal',
        color: 'branco',
        officeKey: {
          week: 'Christmas Day and Following',
          day: 'Sunday',
          title: first ? 'The First Sunday after Christmas' : 'The Second Sunday after Christmas',
        },
      };
    }
    const dayKey = `${month === 12 ? 'Dec' : 'Jan'} ${day}`;
    return {
      season: 'christmas',
      weekOfSeason: null,
      proper: null,
      sundayTitle: month === 12 ? 'Tempo do Natal' : 'Tempo do Natal',
      color: 'branco',
      officeKey: { week: 'Christmas Day and Following', day: dayKey },
      movableFeastTitle: day === 25 && month === 12 ? 'Natividade de Nosso Senhor' : undefined,
    };
  }

  // ----------------------------------------------------------------- Epifania
  if (date >= epiphany && date < feast.ashWednesday) {
    if (date === epiphany) {
      return {
        season: 'epiphany',
        weekOfSeason: null,
        proper: null,
        sundayTitle: 'A Epifania de Nosso Senhor',
        color: 'branco',
        officeKey: { week: 'The Epiphany and Following', day: 'Jan 6' },
        movableFeastTitle: 'A Epifania de Nosso Senhor',
      };
    }
    const epiphany1 = sundayOnOrAfter(addDays(epiphany, 1)); // Batismo do Senhor
    if (date < epiphany1) {
      return {
        season: 'epiphany',
        weekOfSeason: null,
        proper: null,
        sundayTitle: 'A Epifania de Nosso Senhor',
        color: 'verde',
        officeKey: { week: 'The Epiphany and Following', day: `Jan ${day}` },
      };
    }
    const lastSunday = sundayOf(addDays(feast.ashWednesday, -1));
    const isLast = sunday >= lastSunday;
    const week = Math.floor(diffDays(epiphany1, sunday) / 7) + 1;
    return {
      season: 'epiphany',
      weekOfSeason: isLast ? null : week,
      proper: null,
      sundayTitle: isLast
        ? 'Último Domingo após a Epifania: Transfiguração do Senhor'
        : week <= 1
          ? 'Primeiro Domingo após a Epifania: Batismo do Senhor'
          : `${ordinal(week)} Domingo após a Epifania`,
      color: 'verde',
      officeKey: { week: isLast ? 'Week of Last Epiphany' : `Week of ${week} Epiphany`, day: weekdayKey },
    };
  }

  // ---------------------------------------------------- Quaresma e Semana Santa
  if (date >= feast.ashWednesday && date < feast.easter) {
    if (date < feast.palmSunday) {
      const lent1 = sundayOnOrAfter(feast.ashWednesday);
      if (date < lent1) {
        return {
          season: 'lent',
          weekOfSeason: 0,
          proper: null,
          sundayTitle: 'Quarta-Feira de Cinzas',
          color: 'roxo',
          officeKey: { week: 'Ash Wednesday and Following', day: weekdayKey },
          movableFeastTitle: 'Quarta-Feira de Cinzas',
        };
      }
      const week = Math.min(5, Math.max(1, Math.floor(diffDays(lent1, sunday) / 7) + 1));
      return {
        season: 'lent',
        weekOfSeason: week,
        proper: null,
        sundayTitle:
          week === 4
            ? 'Quarto Domingo da Quaresma (Laetare)'
            : `${ordinal(week)} Domingo da Quaresma`,
        color: week === 4 ? 'rosa' : 'roxo',
        officeKey: { week: `Week of ${week} Lent`, day: weekdayKey },
      };
    }
    const holyWeekTitles: Record<number, string> = {
      0: 'Domingo de Ramos',
      4: 'Quinta-Feira Santa',
      5: 'Sexta-Feira Santa',
      6: 'Sábado Santo',
    };
    const title = holyWeekTitles[weekday];
    return {
      season: 'holyWeek',
      weekOfSeason: null,
      proper: null,
      sundayTitle: title ?? 'Semana Santa',
      color: weekday === 0 || weekday >= 4 ? 'vermelho' : 'roxo',
      officeKey: { week: 'Holy Week', day: weekdayKey },
      movableFeastTitle: title,
    };
  }

  // ------------------------------------------------------------------- Páscoa
  if (date >= feast.easter && date < feast.pentecost) {
    const week = Math.min(7, Math.max(1, Math.floor(diffDays(feast.easter, sunday) / 7) + 1));
    const sundayTitle =
      week === 1
        ? 'Domingo da Páscoa'
        : week === 2
          ? 'Segundo Domingo da Páscoa'
          : week === 7
            ? 'Sétimo Domingo da Páscoa'
            : `${ordinal(week)} Domingo da Páscoa`;
    return {
      season: 'easter',
      weekOfSeason: week,
      proper: null,
      sundayTitle,
      color: 'branco',
      officeKey: {
        week: week === 1 ? 'Easter Week' : `Week of ${week} Easter`,
        day: isSunday ? 'Sunday' : weekdayKey,
      },
      movableFeastTitle: date === feast.easter ? 'Domingo da Páscoa' : undefined,
    };
  }

  // ------------------------------------------ Pentecostes e Tempo Comum
  if (date === feast.pentecost) {
    return {
      season: 'afterPentecost',
      weekOfSeason: 0,
      proper: null,
      sundayTitle: 'Dia de Pentecostes',
      color: 'vermelho',
      officeKey: { week: 'Pentecost', day: 'Sunday' },
      movableFeastTitle: 'Dia de Pentecostes',
    };
  }

  if (date === feast.trinity) {
    return {
      season: 'afterPentecost',
      weekOfSeason: 0,
      proper: properNumberFor(sunday),
      sundayTitle: 'Domingo da Santíssima Trindade',
      color: 'branco',
      officeKey: { week: null, day: 'Sunday', title: 'The First Sunday after Pentecost: Trinity Sunday' },
      movableFeastTitle: 'Santíssima Trindade',
    };
  }

  const proper = properNumberFor(sunday);
  const isChristTheKing = proper >= 29;
  const pentecostSundayCount = Math.floor(diffDays(feast.trinity, sunday) / 7) + 1;
  return {
    season: 'afterPentecost',
    weekOfSeason: proper,
    proper,
    sundayTitle: isChristTheKing
      ? 'Último Domingo após Pentecostes: Cristo Rei'
      : `${Math.max(2, pentecostSundayCount)}º Domingo após Pentecostes`,
    color: isChristTheKing ? 'branco' : 'verde',
    officeKey: { week: `Proper ${proper}`, day: isSunday ? 'Sunday' : weekdayKey },
    movableFeastTitle: isChristTheKing ? 'Cristo Rei' : undefined,
  };
}

/** Coletas do dia, em ordem de precedência. */
function collectIdsFor(
  season: Season,
  date: IsoDate,
  feast: MovableFeasts,
  proper: number | null,
  churchYearStart: number,
): string[] {
  const { month, day } = parseIso(date);
  const ids: string[] = [];

  if (date === feast.pentecost) ids.push('pentecostes');
  else if (date === feast.trinity) ids.push('trindade');
  else if (date === feast.easter) ids.push('pascoa');
  else if (date === feast.ascension) ids.push('ascensao');
  else if (date === feast.ashWednesday) ids.push('quarta-feira-de-cinzas');
  else if (date === feast.palmSunday) ids.push('domingo-de-ramos');
  else if (date === feast.maundyThursday) ids.push('quinta-feira-santa');
  else if (date === feast.goodFriday) ids.push('sexta-feira-santa');
  else if (date === addDays(feast.easter, -1)) ids.push('sabado-santo');
  else if (month === 12 && day === 25) ids.push('natal-dia');
  else if (month === 12 && day === 24) ids.push('natal-vigilia');

  if (ids.length > 0) return ids;

  switch (season) {
    case 'advent': {
      const advent = firstSundayOfAdvent(churchYearStart);
      const week = Math.min(4, Math.max(1, Math.floor(diffDays(advent, sundayOf(date)) / 7) + 1));
      ids.push(`advento-${week}`);
      break;
    }
    case 'christmas':
      ids.push(month === 1 ? 'nome-de-jesus' : 'natal-1');
      break;
    case 'epiphany': {
      if (month === 1 && day === 6) {
        ids.push('epifania');
        break;
      }
      const epiphany1 = sundayOnOrAfter(iso(parseIso(date).year, 1, 7));
      const week = Math.floor(diffDays(epiphany1, sundayOf(date)) / 7) + 1;
      const lastSunday = sundayOf(addDays(feast.ashWednesday, -1));
      if (month === 1 && day < 7) ids.push('epifania');
      else if (sundayOf(date) >= lastSunday) ids.push('epifania-ultimo');
      else if (week <= 1) ids.push('epifania-1');
      else ids.push(`epifania-${Math.min(8, week)}`);
      break;
    }
    case 'lent': {
      if (date < sundayOnOrAfter(feast.ashWednesday)) {
        ids.push('quarta-feira-de-cinzas');
      } else {
        const lent1 = sundayOnOrAfter(feast.ashWednesday);
        const week = Math.min(5, Math.max(1, Math.floor(diffDays(lent1, sundayOf(date)) / 7) + 1));
        ids.push(`quaresma-${week}`);
      }
      break;
    }
    case 'holyWeek':
      ids.push('domingo-de-ramos');
      break;
    case 'easter': {
      const week = Math.min(7, Math.max(1, Math.floor(diffDays(feast.easter, sundayOf(date)) / 7) + 1));
      ids.push(week === 1 ? 'pascoa' : `pascoa-${week}`);
      break;
    }
    case 'afterPentecost': {
      if (proper === null || proper <= 2) ids.push('trindade');
      else if (proper >= 29) ids.push('cristo-rei');
      else ids.push(`proprio-${proper}`);
      break;
    }
  }

  return ids;
}

/** Informação litúrgica completa de uma data. */
export function getLiturgicalDay(value: IsoDate): LiturgicalDay {
  const { year, month, day } = parseIso(value);
  const weekday = weekdayOf(value);

  const adventThisYear = firstSundayOfAdvent(year);
  const churchYearStart = value >= adventThisYear ? year : year - 1;
  const letter = yearLetterFor(churchYearStart);

  // Datas móveis do ano litúrgico que contém a data.
  const feast = getMovableFeasts(churchYearStart + 1);
  const info = resolveSeason(value, churchYearStart);

  const feasts = getHolyDays(month, day);
  const primaryFeast = feasts[0];

  const collectIds = collectIdsFor(info.season, value, feast, info.proper, churchYearStart);
  if (primaryFeast && !collectIds.includes(primaryFeast.collectId)) {
    if (primaryFeast.rank === 'festa') collectIds.unshift(primaryFeast.collectId);
    else collectIds.push(primaryFeast.collectId);
  }

  const isSunday = weekday === 0;
  const color =
    primaryFeast && info.season !== 'lent' && info.season !== 'advent' && !info.movableFeastTitle
      ? primaryFeast.color
      : info.color;

  return {
    date: value,
    year,
    month,
    day,
    weekday,
    weekdayKey: WEEKDAY_KEYS[weekday],
    isSunday,
    season: info.season,
    seasonLabel: SEASON_LABELS[info.season],
    color,
    yearLetter: letter,
    officeCycle: churchYearStart % 2 === 1 ? 1 : 2,
    churchYearStart,
    weekOfSeason: info.weekOfSeason,
    proper: info.season === 'afterPentecost' ? info.proper : null,
    sundayTitle: info.sundayTitle,
    dayTitle: isSunday
      ? primaryFeast && primaryFeast.rank === 'festa'
        ? `${info.sundayTitle} · ${primaryFeast.name}`
        : info.sundayTitle
      : info.movableFeastTitle && weekday !== 0
        ? info.movableFeastTitle
        : primaryFeast
          ? primaryFeast.name
          : WEEKDAYS_PT[weekday],
    isFeastDay: Boolean(primaryFeast) || Boolean(info.movableFeastTitle),
    feasts,
    officeKey: info.officeKey,
    feastsOfTheWeek: feast,
    collectIds,
    movableFeastTitle: info.movableFeastTitle,
  };
}

/** Nome curto do tempo litúrgico para o cabeçalho. */
export function seasonHeadline(day: LiturgicalDay): string {
  if (day.season === 'afterPentecost') {
    if (day.proper && day.proper >= 29) return 'Tempo Comum · Reino de Cristo';
    if (day.proper === 0) return 'Pentecostes';
    return day.proper ? `Tempo Comum (Próprio ${day.proper})` : 'Tempo Comum';
  }
  if (day.season === 'easter' && day.weekOfSeason) {
    return `Tempo Pascal · Semana ${day.weekOfSeason}`;
  }
  return SEASON_LABELS[day.season];
}

export function seasonColor(season: Season): LiturgicalColor {
  return SEASON_COLORS[season];
}

/** Tábua móvel 2026–2075. */
export interface MovableTableRow {
  year: number;
  easter: IsoDate;
  ashWednesday: IsoDate;
  palmSunday: IsoDate;
  ascension: IsoDate;
  pentecost: IsoDate;
  trinity: IsoDate;
  christTheKing: IsoDate;
  advent1: IsoDate;
  yearLetter: YearLetter;
}

export function getMovableTable(startYear = 2026, endYear = 2075): MovableTableRow[] {
  const rows: MovableTableRow[] = [];
  for (let year = startYear; year <= endYear; year += 1) {
    const feast = getMovableFeasts(year);
    rows.push({
      year,
      easter: feast.easter,
      ashWednesday: feast.ashWednesday,
      palmSunday: feast.palmSunday,
      ascension: feast.ascension,
      pentecost: feast.pentecost,
      trinity: feast.trinity,
      christTheKing: feast.christTheKing,
      advent1: feast.advent1,
      yearLetter: yearLetterFor(year),
    });
  }
  return rows;
}
