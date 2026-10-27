/**
 * Serviço bíblico: carrega o texto integral em português a partir do banco
 * local (um arquivo por livro, carregado sob demanda e guardado em cache pelo
 * service worker para uso 100% offline).
 */

import { parseCitation, type VerseSpan } from './citation';

export * from './citation';

export interface RenderedVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface RenderedPassage {
  citation: string;
  bookName: string;
  label: string;
  verses: RenderedVerse[];
  missing?: boolean;
  canticleNumber?: number;
  truncated?: boolean;
}

interface BookData {
  abbrev: string;
  name: string;
  chapters: string[][];
}

// Carrega cada livro sob demanda (chunk separado, preservado offline pelo PWA).
const BOOK_MODULES = import.meta.glob<{ default: BookData }>('../data/bible/books/*.json');
const bookCache = new Map<string, Promise<BookData | null>>();

export function loadBook(abbrev: string): Promise<BookData | null> {
  const cached = bookCache.get(abbrev);
  if (cached) return cached;
  const loader = BOOK_MODULES[`../data/bible/books/${abbrev}.json`];
  if (!loader) {
    const missing = Promise.resolve(null);
    bookCache.set(abbrev, missing);
    return missing;
  }
  const promise = loader().then((module) => module.default as BookData);
  bookCache.set(abbrev, promise);
  return promise;
}

function formatSpan(span: VerseSpan, chapters: string[][]): string {
  const chapter = chapters[span.chapter - 1];
  if (!chapter) return '';
  const start = Math.max(1, span.verseStart);
  const end = Math.min(chapter.length, span.verseEnd);
  if (start > end) return '';
  if (start === end) return `v. ${start}`;
  return `vv. ${start}–${end}`;
}

const MAX_VERSES = 400;

/** Renderiza o texto de uma citação (ou de cada alternativa). */
export async function renderCitation(raw: string): Promise<RenderedPassage[]> {
  const parsed = parseCitation(raw);
  const results: RenderedPassage[] = [];

  for (const part of parsed.alternatives) {
    if (part.canticleNumber) {
      results.push({
        citation: raw,
        bookName: part.bookName,
        label: part.bookName,
        verses: [],
        canticleNumber: part.canticleNumber,
      });
      continue;
    }

    if (part.missing || !part.bookAbbrev) {
      results.push({
        citation: raw,
        bookName: part.bookName,
        label: part.bookName,
        verses: [],
        missing: true,
      });
      continue;
    }

    const book = await loadBook(part.bookAbbrev);
    if (!book) {
      results.push({
        citation: raw,
        bookName: part.bookName,
        label: part.bookName,
        verses: [],
        missing: true,
      });
      continue;
    }

    const verses: RenderedVerse[] = [];
    const labels: string[] = [];

    const pushVerses = (chapterNumber: number, from: number, to: number) => {
      const chapter = book.chapters[chapterNumber - 1];
      if (!chapter) return;
      const start = Math.max(1, from);
      const end = Math.min(chapter.length, to);
      for (let verse = start; verse <= end && verses.length < MAX_VERSES; verse += 1) {
        const text = chapter[verse - 1];
        if (!text) continue;
        verses.push({ chapter: chapterNumber, verse, text: text.trim() });
      }
      labels.push(`${chapterNumber}:${start === end ? start : `${start}-${end}`}`);
    };

    for (const span of part.spans) {
      if (span.endChapter && span.endChapter !== span.chapter) {
        // Faixa entre capítulos: primeiro, capítulos intermediários, último.
        pushVerses(span.chapter, span.verseStart, 999);
        for (let extra = span.chapter + 1; extra < span.endChapter; extra += 1) {
          pushVerses(extra, 1, 999);
        }
        pushVerses(span.endChapter, 1, span.crossEndVerse ?? 999);
      } else {
        pushVerses(span.chapter, span.verseStart, span.verseEnd);
      }
      if (verses.length >= MAX_VERSES) break;
    }

    results.push({
      citation: raw,
      bookName: book.name,
      label: `${book.name} ${labels.join(', ')}`,
      verses,
      truncated: verses.length >= MAX_VERSES,
    });
  }

  return results;
}

/** Número aproximado de versículos citados (para resumos e tempos de leitura). */
export function estimateVerses(raw: string): number {
  const parsed = parseCitation(raw);
  return parsed.alternatives.reduce((total, part) => {
    if (part.missing) return total;
    return (
      total +
      part.spans.reduce((sum, span) => {
        const verses = span.verseEnd === 999 ? 25 : span.verseEnd - span.verseStart + 1;
        return sum + Math.max(1, verses);
      }, 0)
    );
  }, 0);
}

/** Salmo completo (para a salmodia, sem faixas de versículos). */
export function psalmCitation(psalm: string): string {
  const cleaned = psalm.replace(/[[\]]/g, '').trim();
  return `Salmo ${cleaned}`;
}

/** Utilidades expostas para o visualizador. */
export const bibleUtils = { formatSpan };
