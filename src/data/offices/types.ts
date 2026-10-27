/**
 * Modelo de dados dos ofícios.
 *
 * Um ofício é uma sequência de blocos. Rubricas (em vermelho), respostas da
 * assembleia (em negrito), salmodia e leituras do dia são resolvidas em tempo de
 * execução pelo visualizador, a partir do lecionário.
 */

export type BlockKind =
  | 'rubric'
  | 'heading'
  | 'text'
  | 'verse'
  | 'response'
  | 'dialogue'
  | 'sentence'
  | 'psalmody'
  | 'readings'
  | 'canticle'
  | 'silence'
  | 'collect'
  | 'creed'
  | 'lords-prayer'
  | 'prayer';

export interface DialogueLine {
  /** `leader` = quem oficia; `all` = assembleia (negrito); `none` = texto corrido. */
  speaker: 'leader' | 'all' | 'none';
  text: string;
}

export type OfficeBlock =
  | { kind: 'rubric'; text: string }
  | { kind: 'sentence' }
  | { kind: 'heading'; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'verse'; lines: string[] }
  | { kind: 'response'; text: string }
  | { kind: 'dialogue'; lines: DialogueLine[] }
  | { kind: 'psalmody'; label?: string }
  | { kind: 'readings' }
  | { kind: 'canticle'; canticleId: string }
  | { kind: 'silence'; seconds?: number; label?: string }
  | { kind: 'collect'; collectId?: string; text?: string; title?: string }
  | { kind: 'creed' }
  | { kind: 'lords-prayer' }
  | { kind: 'prayer'; prayerId: string };

export interface OfficeDefinition {
  id: string;
  title: string;
  subtitle: string;
  /** Sentença de abertura própria do ofício, se houver. */
  summary: string;
  blocks: OfficeBlock[];
}

export interface Canticle {
  id: string;
  title: string;
  latinTitle?: string;
  reference: string;
  /** Tradição em que o cântico é usado. */
  tradition?: string;
  verses: string[];
  doxology?: boolean;
}

export interface WeeklyOffice {
  weekday: number;
  theme: string;
  sentence: string;
  psalmVerse: string;
  reading: string;
  prayer: string;
}
