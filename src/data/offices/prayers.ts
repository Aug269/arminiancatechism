/**
 * Orações, credos e respostas comuns ao Ofício.
 */

export const APOSTLES_CREED: string[] = [
  'Creio em Deus Pai todo-poderoso, Criador do céu e da terra;',
  'e em Jesus Cristo, seu único Filho, nosso Senhor;',
  'que foi concebido pelo poder do Espírito Santo; nasceu da virgem Maria;',
  'padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado;',
  'desceu à mansão dos mortos; ressuscitou ao terceiro dia;',
  'subiu aos céus; está sentado à direita de Deus Pai todo-poderoso,',
  'donde há de vir a julgar os vivos e os mortos.',
  'Creio no Espírito Santo; na santa Igreja católica; na comunhão dos santos;',
  'na remissão dos pecados; na ressurreição do corpo; na vida eterna. Amém.',
];

export const LORDS_PRAYER: string[] = [
  'Pai nosso, que estás nos céus, santificado seja o teu nome;',
  'venha o teu Reino; seja feita a tua vontade, assim na terra como no céu.',
  'Dá-nos hoje o nosso pão de cada dia.',
  'Perdoa as nossas dívidas, assim como perdoamos aos nossos devedores.',
  'E não nos deixes cair em tentação, mas livra-nos do mal.',
  'Pois teu é o Reino, o poder e a glória para sempre. Amém.',
];

export const GENERAL_CONFESSION: string[] = [
  'Deus todo-poderoso, Pai de nosso Senhor Jesus Cristo, criador de todas as coisas,',
  'juiz de todos os homens: nós confessamos que temos pecado contra ti,',
  'em pensamentos, palavras e obras, e que não temos amado o próximo como a nós mesmos.',
  'Arrependemo-nos com sincero pesar pelos nossos pecados;',
  'lembra-te de nós, ó Deus, na tua misericórdia,',
  'e por amor do teu Filho concede-nos o perdão dos nossos pecados,',
  'para que sejamos renovados à imagem do teu Filho',
  'e caminhemos em novidade de vida, para a glória do teu nome. Amém.',
];

export const ABSOLUTION = [
  'Deus todo-poderoso tenha compaixão de nós, perdoe os nossos pecados,',
  'confirme-nos no bem e nos conduza à vida eterna. Amém.',
];

export const VERSICLES = {
  opening: [
    { speaker: 'leader' as const, text: 'Senhor, abre os nossos lábios.' },
    { speaker: 'all' as const, text: 'E a nossa boca anunciará o teu louvor.' },
  ],
  light: [
    { speaker: 'leader' as const, text: 'A luz e a paz de Jesus Cristo estejam convosco.' },
    { speaker: 'all' as const, text: 'E também contigo.' },
  ],
  evening: [
    { speaker: 'leader' as const, text: 'Deus, vem em nosso auxílio.' },
    { speaker: 'all' as const, text: 'Senhor, apressa-te em nos socorrer.' },
  ],
  closing: [
    { speaker: 'leader' as const, text: 'Louvado seja o Senhor.' },
    { speaker: 'all' as const, text: 'O nome do Senhor seja louvado.' },
  ],
  thanks: [
    { speaker: 'leader' as const, text: 'Demos graças ao Senhor nosso Deus.' },
    { speaker: 'all' as const, text: 'Digno é o Senhor de receber a nossa gratidão.' },
  ],
};

export interface PrayerResource {
  id: string;
  title: string;
  category: 'intercessão' | 'súplica' | 'gratidão' | 'entrega' | 'refeição' | 'silêncio';
  text: string[];
}

export const ADDITIONAL_PRAYERS: PrayerResource[] = [
  {
    id: 'paz',
    title: 'Pela paz',
    category: 'súplica',
    text: [
      'Eterno Deus, na tua bondade orienta e governa a nossa vida e a de todos os povos;',
      'faz cessar as guerras e as contendas entre as nações;',
      'e, concedendo-nos a paz que o mundo não pode dar, ensina-nos a confiar em ti',
      'e a viver em caridade uns com os outros; por Jesus Cristo, nosso Senhor. Amém.',
    ],
  },
  {
    id: 'igreja',
    title: 'Pela Igreja',
    category: 'intercessão',
    text: [
      'Deus de poder e bondade, que enviaste o teu Filho para ser o nosso Redentor:',
      'sustenta a tua Igreja no ensino dos apóstolos e na comunhão dos santos,',
      'para que os seus membros manifestem em palavras e obras a luz do Evangelho',
      'e, unidos em espírito de humildade e serviço, sejam uma só família em Cristo. Amém.',
    ],
  },
  {
    id: 'enfermos',
    title: 'Pelos enfermos e pelos que sofrem',
    category: 'intercessão',
    text: [
      'Pai compassivo, que não te alegras com o sofrimento dos teus filhos:',
      'assiste os enfermos, consola os que choram, fortalece os que cuidam deles;',
      'dá sabedoria aos que tratam, e, a todos nós, a certeza de que nenhuma dor passa',
      'desapercebida aos teus olhos, em Cristo Jesus. Amém.',
    ],
  },
  {
    id: 'mortos',
    title: 'Pelos que partiram',
    category: 'intercessão',
    text: [
      'Deus dos vivos e dos mortos, cuja aliança não se rompe pela morte:',
      'recebe na tua paz os que partiram desta vida,',
      'e, junto com eles, conduz-nos à plenitude da alegria da tua ressurreição;',
      'por Jesus Cristo, primícias dos que dormem. Amém.',
    ],
  },
  {
    id: 'familia',
    title: 'Pela família e pela comunidade',
    category: 'intercessão',
    text: [
      'Senhor Deus, fonte de todo amor: santifica os laços que nos unem;',
      'ensina-nos a paciência, a escuta e o perdão;',
      'faz da nossa casa um lugar de acolhida e do nosso trabalho um serviço ao próximo;',
      'para que a paz de Cristo habite em nós. Amém.',
    ],
  },
  {
    id: 'criacao',
    title: 'Pela criação',
    category: 'intercessão',
    text: [
      'Deus criador, que confiaste a terra aos cuidados das nossas mãos:',
      'dá-nos reverência diante da obra das tuas mãos,',
      'sobriedade no uso dos bens e coragem na defesa dos mais frágeis;',
      'para que todas as criaturas louvem o teu nome. Amém.',
    ],
  },
  {
    id: 'nação',
    title: 'Pela nação e pelos que governam',
    category: 'intercessão',
    text: [
      'Senhor nosso Governador, que julgas com justiça e não te agradas da opressão:',
      'concede aos que exercem autoridade retidão e temor de ti;',
      'e a nós, cidadãos, espírito de serviço, honestidade e coragem na defesa do direito;',
      'por aquele que é Rei dos reis, Jesus Cristo, nosso Senhor. Amém.',
    ],
  },
  {
    id: 'unidade',
    title: 'Pela unidade dos cristãos',
    category: 'súplica',
    text: [
      'Pai santo, que em Cristo nos chamaste a ser um só povo:',
      'afasta de nós a soberba das divisões,',
      'e, na verdade e na caridade, reúne os que confessam o nome do teu Filho,',
      'para que o mundo creia que tu o enviaste. Amém.',
    ],
  },
  {
    id: 'entrega',
    title: 'Entrega confiante',
    category: 'entrega',
    text: [
      'Senhor, nas tuas mãos entregamos o dia que passou e a noite que vem.',
      'Guarda os que amamos, os que sofrem e os que vigiam;',
      'dá-nos repouso para o corpo e serenidade para a alma,',
      'e, se nos for concedido outro amanhecer, que o comecemos no teu louvor. Amém.',
    ],
  },
  {
    id: 'silêncio',
    title: 'Oração no silêncio',
    category: 'silêncio',
    text: [
      'Pai, que conheces o que nem sabemos pedir: acolhe este silêncio como oração;',
      'nele apresentamos as pessoas e as dores que não cabem em palavras,',
      'confiando na intercessão do teu Espírito. Amém.',
    ],
  },
];

export const MEAL_PRAYERS = {
  morning: {
    before: [
      'Deus criador, que renovas as tuas misericórdias a cada manhã:',
      'recebe a nossa gratidão por este alimento e pela luz deste dia. Amém.',
    ],
    after: [
      'Obrigado, Senhor, pelo pão e pela companhia;',
      'faze de nós servidores atentos ao próximo. Amém.',
    ],
  },
  midday: {
    before: [
      'Senhor, que alimentas os famintos e não desprezas os pequenos:',
      'abençoa esta mesa e faze-nos lembrar dos que não têm o que comer. Amém.',
    ],
    after: [
      'Obrigado, Senhor, pelo alimento recebido;',
      'dá-nos força para o trabalho que resta até ao fim do dia. Amém.',
    ],
  },
  evening: {
    before: [
      'Senhor Jesus, que te sentastes à mesa com os discípulos:',
      'sê nosso convidado agora, e faze da nossa casa lugar de paz. Amém.',
    ],
    after: [
      'Obrigado, Senhor, pela mesa compartilhada e pelo descanso que nos espera. Amém.',
    ],
  },
  night: {
    before: [
      'Pai celeste, recebe esta refeição e, ao fim do dia, o nosso coração cansado.',
      'Amém.',
    ],
    after: ['Obrigado, Senhor, por tudo o que recebemos hoje. Amém.'],
  },
};

export const PRAYER_BY_ID: Record<string, PrayerResource> = Object.fromEntries(
  ADDITIONAL_PRAYERS.map((prayer) => [prayer.id, prayer]),
);
