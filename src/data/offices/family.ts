import type { OfficeDefinition } from './types';

/**
 * Ofício para Famílias e Indivíduos — devoções breves para os momentos do dia.
 * Seguem a tradição das «Devoções Diárias para Indivíduos e Famílias».
 */

export const FAMILY_MORNING: OfficeDefinition = {
  id: 'familia-manha',
  title: 'Pela Manhã',
  subtitle: 'Devoção da família ao despertar',
  summary: 'Ao levantar, a família entrega a Deus o dia que começa.',
  blocks: [
    { kind: 'rubric', text: 'Todos se reúnem, se possível diante de uma cruz ou de uma vela acesa.' },
    { kind: 'sentence' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Senhor, abre os nossos lábios.' },
      { speaker: 'all', text: 'E a nossa boca anunciará o teu louvor.' },
    ] },
    { kind: 'heading', text: 'Salmo' },
    { kind: 'psalmody', label: 'Salmo do dia' },
    { kind: 'heading', text: 'Leitura' },
    { kind: 'readings' },
    { kind: 'heading', text: 'Oração' },
    {
      kind: 'text',
      text: 'Deus, que nos guardaste durante a noite e nos trouxeste ao alvorecer: concede-nos hoje pensamentos limpos, palavras verdadeiras e obras de misericórdia, para que o teu nome seja louvado em nossa casa e fora dela; por Jesus Cristo, nosso Senhor. Amém.',
    },
    { kind: 'creed' },
    { kind: 'lords-prayer' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Que o Senhor nos abençoe e nos guarde.' },
      { speaker: 'all', text: 'Amém.' },
    ] },
  ],
};

export const FAMILY_MIDDAY: OfficeDefinition = {
  id: 'familia-meiodia',
  title: 'Ao Meio-Dia',
  subtitle: 'Devoção da pausa do trabalho',
  summary: 'Uma pausa breve para recordar a presença de Deus no meio das tarefas.',
  blocks: [
    { kind: 'rubric', text: 'Onde estiverem, os membros da família podem fazer esta pausa, mesmo em silêncio.' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Deus, vem em nosso auxílio.' },
      { speaker: 'all', text: 'Senhor, apressa-te em nos socorrer.' },
    ] },
    { kind: 'sentence' },
    { kind: 'heading', text: 'Salmo' },
    { kind: 'psalmody', label: 'Versículo do salmo' },
    { kind: 'heading', text: 'Leitura' },
    { kind: 'readings' },
    {
      kind: 'text',
      text: 'Senhor Deus, que sustentas o nosso trabalho e conheces o nosso cansaço: renova as nossas forças, guarda-nos da pressa e da vaidade, e ensina-nos a reconhecer-te nos rostos que encontramos hoje. Amém.',
    },
    { kind: 'lords-prayer' },
  ],
};

export const FAMILY_EVENING: OfficeDefinition = {
  id: 'familia-entardecer',
  title: 'Ao Entardecer',
  subtitle: 'Devoção do fim da tarde',
  summary: 'Quando o dia declina, a família agradece e acende a luz.',
  blocks: [
    { kind: 'sentence' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'A luz e a paz de Jesus Cristo estejam conosco.' },
      { speaker: 'all', text: 'E também contigo.' },
    ] },
    { kind: 'heading', text: 'Salmo' },
    { kind: 'psalmody', label: 'Salmo do entardecer' },
    { kind: 'heading', text: 'Leitura' },
    { kind: 'readings' },
    {
      kind: 'text',
      text: 'Pai de bondade, recebe a nossa gratidão pelo dia que passou: pelo pão, pelo trabalho, pelos encontros e pela tua paciência conosco. Guarda os que ainda estão a caminho e dá repouso aos que chegaram. Por Cristo, nosso Senhor. Amém.',
    },
    { kind: 'canticle', canticleId: 'magnificat' },
    { kind: 'lords-prayer' },
  ],
};

export const FAMILY_SUPPER_BEFORE: OfficeDefinition = {
  id: 'familia-anoitecer-antes',
  title: 'Ao Anoitecer — antes do jantar',
  subtitle: 'Devoção da mesa',
  summary: 'Antes da refeição da noite, a família agradece e abençoa a mesa.',
  blocks: [
    { kind: 'sentence' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Demos graças ao Senhor nosso Deus.' },
      { speaker: 'all', text: 'Digno é o Senhor de receber a nossa gratidão.' },
    ] },
    { kind: 'heading', text: 'Salmo' },
    { kind: 'psalmody', label: 'Versículo do salmo' },
    { kind: 'heading', text: 'Leitura' },
    { kind: 'readings' },
    {
      kind: 'text',
      text: 'Senhor Jesus, que te sentastes à mesa com os discípulos e não recusaste a companhia dos pequenos: sê nosso convidado nesta casa; abençoa o alimento, a conversa e o silêncio; e faze-nos lembrar dos que hoje não têm mesa. Amém.',
    },
    { kind: 'lords-prayer' },
  ],
};

export const FAMILY_SUPPER_AFTER: OfficeDefinition = {
  id: 'familia-anoitecer-depois',
  title: 'Ao Anoitecer — depois do jantar',
  subtitle: 'Devoção do fim da refeição',
  summary: 'Depois do jantar, a família lê juntos e entrega a noite.',
  blocks: [
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'O Senhor nos conceda uma noite tranquila.' },
      { speaker: 'all', text: 'E um fim perfeito.' },
    ] },
    { kind: 'heading', text: 'Leitura' },
    { kind: 'readings' },
    { kind: 'heading', text: 'Salmo' },
    { kind: 'psalmody', label: 'Salmo da noite' },
    {
      kind: 'text',
      text: 'Obrigado, Senhor, pelo alimento e pela casa. Perdoa o que hoje nos faltou de paciência e de atenção; guarda os que amamos, os que viajam e os que velam; e dá-nos, no descanso, a memória do teu amor. Amém.',
    },
    { kind: 'canticle', canticleId: 'nuncDimittis' },
    { kind: 'lords-prayer' },
  ],
};

export const FAMILY_NIGHT: OfficeDefinition = {
  id: 'familia-fim-do-dia',
  title: 'No Fim do Dia',
  subtitle: 'Entrega do repouso',
  summary: 'A última devoção antes de dormir: exame breve, perdão e confiança.',
  blocks: [
    { kind: 'rubric', text: 'Todos se recolhem; convém apagar as telas e falar em voz baixa.' },
    { kind: 'sentence' },
    { kind: 'silence', seconds: 60, label: 'Exame silencioso do dia' },
    {
      kind: 'text',
      text: 'Deus, que nos vês no silêncio: agradecemos o bem deste dia e pedimos perdão pelo mal. Cobre com a tua misericórdia os que sofrem; guarda a nossa casa; e, ao amanhecer, chama-nos de novo ao teu louvor. Amém.',
    },
    { kind: 'canticle', canticleId: 'nuncDimittis' },
    { kind: 'creed' },
    { kind: 'lords-prayer' },
    { kind: 'collect', collectId: 'entrega' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Em paz nos deitaremos e dormiremos.' },
      { speaker: 'all', text: 'Porque tu, Senhor, nos fazes habitar em segurança.' },
    ] },
  ],
};

export const FAMILY_OFFICES: OfficeDefinition[] = [
  FAMILY_MORNING,
  FAMILY_MIDDAY,
  FAMILY_EVENING,
  FAMILY_SUPPER_BEFORE,
  FAMILY_SUPPER_AFTER,
  FAMILY_NIGHT,
];
