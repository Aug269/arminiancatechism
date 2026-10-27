import type { WeeklyOffice } from './types';

/**
 * Ofício para a Semana — oração breve para cada dia, com um tema, uma sentença,
 * um versículo de salmo, uma leitura e uma oração próprios.
 */
export const WEEKLY_OFFICES: WeeklyOffice[] = [
  {
    weekday: 0,
    theme: 'A Ressurreição',
    sentence:
      '«Não temais; sei que buscais Jesus, o crucificado. Ele não está aqui; ressuscitou, como disse.» (Mateus 28:5-6)',
    psalmVerse: 'Este é o dia que o Senhor fez; exultemos e alegremo-nos nele. (Salmo 118:24)',
    reading: 'João 20:1-18',
    prayer:
      'Senhor da vida, que venceste a morte e abriste o sepulcro: faze-nos testemunhas da tua ressurreição, com alegria que não se apaga e coragem para servir. Amém.',
  },
  {
    weekday: 1,
    theme: 'A Criação e o Espírito',
    sentence:
      '«O Espírito de Deus me fez, e o sopro do Todo-Poderoso me dá vida.» (Jó 33:4)',
    psalmVerse: 'Envias o teu Espírito, e eles são criados; e renovas a face da terra. (Salmo 104:30)',
    reading: 'Gênesis 1:1-5, 26-31',
    prayer:
      'Deus criador, que no princípio sopraste sobre as águas e continuas a criar: renova em nós o teu Espírito, para que cuidemos da vida que recebemos e a devolvamos em louvor. Amém.',
  },
  {
    weekday: 2,
    theme: 'A Encarnação',
    sentence:
      '«E o Verbo se fez carne e habitou entre nós, cheio de graça e de verdade.» (João 1:14)',
    psalmVerse: 'O Senhor anunciou a sua salvação; revelou a sua justiça às nações. (Salmo 98:2)',
    reading: 'Lucas 1:26-38',
    prayer:
      'Pai, que não te envergonhaste de habitar a nossa carne: ensina-nos a reconhecer-te no rosto do próximo, e faze da nossa vida um lugar de acolhida para o teu Filho. Amém.',
  },
  {
    weekday: 3,
    theme: 'O Arrependimento',
    sentence:
      '«Arrependei-vos, pois o Reino dos céus está próximo.» (Mateus 3:2)',
    psalmVerse: 'Cria em mim, ó Deus, um coração puro; renova em mim um espírito firme. (Salmo 51:10)',
    reading: 'Salmo 51:1-12',
    prayer:
      'Deus de misericórdia, que não desprezas o coração contrito: dá-nos a coragem de nomear o nosso pecado, a humildade de receber o perdão e a alegria de recomeçar. Amém.',
  },
  {
    weekday: 4,
    theme: 'A Ceia do Senhor',
    sentence:
      '«Isto é o meu corpo, que é dado por vós; fazei isto em memória de mim.» (Lucas 22:19)',
    psalmVerse: 'Provai e vede como o Senhor é bom; feliz o homem que nele confia. (Salmo 34:8)',
    reading: '1 Coríntios 11:23-29',
    prayer:
      'Senhor Jesus, que na véspera da tua paixão nos deixaste o pão e o cálice: alimenta a nossa fé, une o teu povo e faze de nós um só corpo, entregue por amor ao mundo. Amém.',
  },
  {
    weekday: 5,
    theme: 'A Cruz',
    sentence:
      '«Nós pregamos a Cristo crucificado, escândalo para uns e loucura para outros; mas para os que são chamados, poder de Deus.» (1 Coríntios 1:23-24)',
    psalmVerse: 'O Senhor é a minha força e o meu escudo; nele confiou o meu coração. (Salmo 28:7)',
    reading: 'Marcos 15:33-39',
    prayer:
      'Cristo crucificado, que estendeste os braços para abraçar o mundo: guarda-nos junto à tua cruz, para que não fujamos do sofrimento dos irmãos e encontremos nela a tua paz. Amém.',
  },
  {
    weekday: 6,
    theme: 'O Túmulo e o Descanso',
    sentence:
      '«Descansou no sétimo dia de toda a obra que fizera.» (Gênesis 2:2)',
    psalmVerse: 'Em paz me deito e durmo, porque só tu, Senhor, me fazes habitar em segurança. (Salmo 4:8)',
    reading: 'Marcos 15:42-47',
    prayer:
      'Deus que guardas o silêncio do sábado santo: recebe o nosso dia e o nosso cansaço; faze-nos esperar contigo, com a tranquilidade de quem sabe que a tua promessa amanhece. Amém.',
  },
];
