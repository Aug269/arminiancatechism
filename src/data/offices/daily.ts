import type { OfficeDefinition } from './types';

/**
 * Os quatro ofícios do dia, segundo o Ofício Diário da Rede Episcopal Brasileira.
 *
 * Rubricas em vermelho, respostas da assembleia em negrito. A salmodia e as
 * leituras são preenchidas pelo lecionário do dia; as coletas vêm do Próprio.
 */

export const OFFICE_MATUTINO: OfficeDefinition = {
  id: 'matutino',
  title: 'Ofício Matutino',
  subtitle: 'Oração da Manhã',
  summary:
    'A oração da Igreja ao nascer do dia: louvor, escuta da Palavra e entrega do dia que começa.',
  blocks: [
    {
      kind: 'rubric',
      text: 'Quem oficia pode iniciar a Oração da Manhã lendo uma sentença das Escrituras, conforme o tempo litúrgico, e convidando os presentes a orar.',
    },
    { kind: 'sentence' },
    { kind: 'silence', seconds: 30, label: 'Silêncio para recolher-se' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Senhor, abre os nossos lábios.' },
      { speaker: 'all', text: 'E a nossa boca anunciará o teu louvor.' },
    ] },
    { kind: 'rubric', text: 'Todos se põem de pé. Diz-se a Confissão de Pecados.' },
    { kind: 'heading', text: 'Confissão de Pecados' },
    {
      kind: 'text',
      text: 'Deus todo-poderoso, Pai de nosso Senhor Jesus Cristo, criador de todas as coisas, juiz de todos os homens: nós confessamos que temos pecado contra ti, em pensamentos, palavras e obras, e que não temos amado o próximo como a nós mesmos. Arrependemo-nos com sincero pesar pelos nossos pecados; lembra-te de nós, ó Deus, na tua misericórdia, e por amor do teu Filho concede-nos o perdão dos nossos pecados, para que sejamos renovados à imagem do teu Filho e caminhemos em novidade de vida, para a glória do teu nome. Amém.',
    },
    { kind: 'rubric', text: 'Guarda-se silêncio por alguns instantes.' },
    { kind: 'silence', seconds: 60, label: 'Silêncio da confissão' },
    { kind: 'dialogue', lines: [
      {
        speaker: 'leader',
        text: 'Deus todo-poderoso tenha compaixão de nós, perdoe os nossos pecados, confirme-nos no bem e nos conduza à vida eterna.',
      },
      { speaker: 'all', text: 'Amém.' },
    ] },
    { kind: 'heading', text: 'Pai Nosso' },
    { kind: 'lords-prayer' },
    { kind: 'heading', text: 'Invitatório' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Vinde, adoremos e prostremo-nos.' },
      { speaker: 'all', text: 'Louvemos o Senhor, nosso Criador.' },
    ] },
    {
      kind: 'rubric',
      text: 'Diz-se o Salmo 95 (Venite) ou, no Tempo Pascal, o Salmo 100 (Jubilate), alternando-se os versículos.',
    },
    { kind: 'canticle', canticleId: 'venite' },
    { kind: 'heading', text: 'Salmodia' },
    { kind: 'psalmody', label: 'Salmos do dia' },
    { kind: 'heading', text: 'Leituras' },
    { kind: 'readings' },
    { kind: 'rubric', text: 'Segue-se um cântico: o Benedictus, ou o Te Deum nos domingos e festas.' },
    { kind: 'canticle', canticleId: 'benedictus' },
    { kind: 'heading', text: 'Credo dos Apóstolos' },
    { kind: 'creed' },
    { kind: 'heading', text: 'Preces' },
    {
      kind: 'dialogue',
      lines: [
        { speaker: 'leader', text: 'Oremos pela paz que vem do alto e pela salvação do mundo.' },
        { speaker: 'all', text: 'Senhor, ouve a nossa oração.' },
        { speaker: 'leader', text: 'Pela santa Igreja, seus ministros e todos os batizados.' },
        { speaker: 'all', text: 'Senhor, ouve a nossa oração.' },
        { speaker: 'leader', text: 'Por esta nação, pelos que governam e pelos que sofrem injustiça.' },
        { speaker: 'all', text: 'Senhor, ouve a nossa oração.' },
        { speaker: 'leader', text: 'Pelos enfermos, pelos que cuidam deles e pelos que estão sós.' },
        { speaker: 'all', text: 'Senhor, ouve a nossa oração.' },
        { speaker: 'leader', text: 'Pelos frutos da criação e pelo trabalho humano.' },
        { speaker: 'all', text: 'Senhor, ouve a nossa oração.' },
        { speaker: 'leader', text: 'Pelos que partiram desta vida e por todos os santos.' },
        { speaker: 'all', text: 'Senhor, ouve a nossa oração.' },
      ],
    },
    { kind: 'rubric', text: 'Pode-se guardar silêncio, apresentando a Deus intenções particulares.' },
    { kind: 'silence', seconds: 90, label: 'Intenções particulares' },
    { kind: 'heading', text: 'Coletas' },
    { kind: 'collect' },
    {
      kind: 'collect',
      title: 'Coleta pela graça',
      text: 'Senhor Deus, que nos deste a vontade de orar: concede-nos, ao orarmos, a tua presença; e, ao recebermos o teu perdão, a alegria de te servir neste dia; por Jesus Cristo, nosso Senhor. Amém.',
    },
    { kind: 'collect', collectId: 'paz' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Louvado seja o Senhor.' },
      { speaker: 'all', text: 'O nome do Senhor seja louvado.' },
    ] },
    {
      kind: 'rubric',
      text: 'A assembleia se dispersa em silêncio, ou diz-se: «Vamos em paz, para servir ao Senhor. — Graças a Deus.»',
    },
  ],
};

export const OFFICE_MEIODIA: OfficeDefinition = {
  id: 'meiodia',
  title: 'Ofício do Meio-Dia',
  subtitle: 'Oração das Doze Horas',
  summary:
    'Uma pausa breve no centro do dia: salmo, leitura, silêncio e oração, para que o trabalho não nos afaste de Deus.',
  blocks: [
    {
      kind: 'rubric',
      text: 'O ofício do meio-dia pode ser rezado em casa, no trabalho ou em comunidade. Quem oficia inicia com uma saudação.',
    },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Deus, vem em nosso auxílio.' },
      { speaker: 'all', text: 'Senhor, apressa-te em nos socorrer.' },
    ] },
    { kind: 'sentence' },
    { kind: 'heading', text: 'Salmo do Meio-Dia' },
    { kind: 'psalmody', label: 'Salmo do meio-dia' },
    { kind: 'heading', text: 'Leitura' },
    { kind: 'readings' },
    { kind: 'rubric', text: 'Guarda-se silêncio por alguns instantes.' },
    { kind: 'silence', seconds: 60, label: 'Silêncio do meio-dia' },
    {
      kind: 'collect',
      title: 'Coleta da hora',
      text: 'Senhor Deus, que no meio do dia reúnes o teu povo em oração: santifica o nosso trabalho, orienta os nossos projetos e faze-nos atentos às necessidades dos irmãos; por Jesus Cristo, nosso Senhor. Amém.',
    },
    { kind: 'lords-prayer' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'Louvado seja o Senhor.' },
      { speaker: 'all', text: 'O nome do Senhor seja louvado.' },
    ] },
  ],
};

export const OFFICE_VESPERTINO: OfficeDefinition = {
  id: 'vespertino',
  title: 'Ofício Vespertino',
  subtitle: 'Oração da Tarde',
  summary:
    'Quando a luz declina, a Igreja acende a lâmpada e bendiz a Cristo, luz do mundo.',
  blocks: [
    {
      kind: 'rubric',
      text: 'Quem oficia pode iniciar a Oração da Tarde lendo uma sentença das Escrituras e acendendo a lâmpada, se houver.',
    },
    { kind: 'sentence' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'A luz e a paz de Jesus Cristo estejam convosco.' },
      { speaker: 'all', text: 'E também contigo.' },
    ] },
    { kind: 'rubric', text: 'Acendem-se as luzes; todos se põem de pé. Diz-se o hino da luz.' },
    { kind: 'canticle', canticleId: 'phosHilaron' },
    { kind: 'heading', text: 'Confissão de Pecados' },
    {
      kind: 'text',
      text: 'Pai compassivo, que conheces o nosso coração: confessamos as palavras ásperas, os gestos omitidos e o bem que deixamos de fazer. Perdoa-nos, Senhor, e dá-nos a graça de recomeçar, para que o fim deste dia seja verdadeiro e a nossa noite seja em paz. Amém.',
    },
    { kind: 'silence', seconds: 60, label: 'Silêncio da confissão' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'O Senhor todo-poderoso tenha compaixão de nós, perdoe os nossos pecados e nos conduza à vida eterna.' },
      { speaker: 'all', text: 'Amém.' },
    ] },
    { kind: 'heading', text: 'Salmodia' },
    { kind: 'psalmody', label: 'Salmos do dia' },
    { kind: 'heading', text: 'Leituras' },
    { kind: 'readings' },
    { kind: 'rubric', text: 'Segue-se o Magnificat, ou outro cântico próprio do tempo litúrgico.' },
    { kind: 'canticle', canticleId: 'magnificat' },
    { kind: 'heading', text: 'Credo dos Apóstolos' },
    { kind: 'creed' },
    { kind: 'heading', text: 'Preces' },
    {
      kind: 'dialogue',
      lines: [
        { speaker: 'leader', text: 'Pelo povo de Deus disperso pelo mundo e pelos que anunciam o Evangelho.' },
        { speaker: 'all', text: 'Cristo, ouve-nos.' },
        { speaker: 'leader', text: 'Pelos que hoje não têm pão, teto ou companhia.' },
        { speaker: 'all', text: 'Cristo, ouve-nos.' },
        { speaker: 'leader', text: 'Pelos doentes, pelos que velam e pelos que choram.' },
        { speaker: 'all', text: 'Cristo, ouve-nos.' },
        { speaker: 'leader', text: 'Pelos governantes e por todos os que buscam a justiça.' },
        { speaker: 'all', text: 'Cristo, ouve-nos.' },
        { speaker: 'leader', text: 'Pelos que partiram e por aqueles que amamos.' },
        { speaker: 'all', text: 'Cristo, ouve-nos.' },
      ],
    },
    { kind: 'silence', seconds: 90, label: 'Intenções particulares' },
    { kind: 'heading', text: 'Coletas' },
    { kind: 'collect' },
    {
      kind: 'collect',
      title: 'Coleta da luz',
      text: 'Senhor Jesus Cristo, luz que não se apaga: guarda-nos na paz desta noite, para que, ao amanhecer, te sirvamos com alegria e vejamos, no fim de todos os dias, a luz da tua glória. Amém.',
    },
    { kind: 'collect', collectId: 'entrega' },
    { kind: 'lords-prayer' },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'O Senhor nos abençoe e nos guarde.' },
      { speaker: 'all', text: 'Amém.' },
      { speaker: 'leader', text: 'Vamos em paz.' },
      { speaker: 'all', text: 'Graças a Deus.' },
    ] },
  ],
};

export const OFFICE_COMPLETAS: OfficeDefinition = {
  id: 'completas',
  title: 'Completas',
  subtitle: 'Oração ao Fim do Dia',
  summary:
    'A última oração antes do repouso: exame do dia, perdão, confiança e entrega da noite a Deus.',
  blocks: [
    {
      kind: 'rubric',
      text: 'Completas se reza ao fim do dia, depois de todas as atividades. Quem oficia inicia em voz baixa, com a luz da casa já reduzida.',
    },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'O Senhor todo-poderoso nos conceda uma noite tranquila e um fim perfeito.' },
      { speaker: 'all', text: 'Amém.' },
    ] },
    { kind: 'heading', text: 'Exame do Dia' },
    {
      kind: 'rubric',
      text: 'Todos recordam em silêncio as horas que passaram: o bem que fizeram, o mal que evitaram e o bem que deixaram de fazer.',
    },
    { kind: 'silence', seconds: 120, label: 'Exame silencioso do dia' },
    {
      kind: 'text',
      text: 'Senhor, que me conheces melhor do que eu mesmo: obrigado pelo bem que hoje recebi e pelo bem que, na tua graça, pude fazer. Perdoa as minhas omissões, as minhas palavras impacientes e o meu coração distraído. Recebe o que hoje fiz de bom, para que não se perca; e cura o que em mim ficou ferido. Amém.',
    },
    { kind: 'heading', text: 'Salmo' },
    { kind: 'psalmody', label: 'Salmos do dia' },
    { kind: 'heading', text: 'Leitura Breve' },
    { kind: 'readings' },
    { kind: 'rubric', text: 'Responde-se com o Simeão: «Guarda-nos, Senhor, enquanto velamos; protege-nos enquanto dormimos.»' },
    { kind: 'canticle', canticleId: 'nuncDimittis' },
    { kind: 'heading', text: 'Credo e Pai Nosso' },
    { kind: 'creed' },
    { kind: 'lords-prayer' },
    { kind: 'collect' },
    {
      kind: 'collect',
      title: 'Coleta da noite',
      text: 'Visita, Senhor, esta casa e afasta dela todas as ciladas do inimigo. Habitem aqui os teus anjos e nos guardem em paz; e a tua bênção permaneça sobre nós para sempre. Amém.',
    },
    {
      kind: 'collect',
      title: 'Antífona final',
      text: 'Salvadora do mundo, que geraste o Cristo, nosso Redentor: acompanha-nos na vigília desta noite e, ao despertar, conduze-nos à alegria do dia que não tem fim. Amém.',
    },
    { kind: 'dialogue', lines: [
      { speaker: 'leader', text: 'A paz do Senhor esteja sempre conosco.' },
      { speaker: 'all', text: 'E com o teu espírito.' },
      { speaker: 'leader', text: 'Bendigamos ao Senhor.' },
      { speaker: 'all', text: 'Graças a Deus.' },
    ] },
    { kind: 'rubric', text: 'Apagam-se as luzes. Guarda-se silêncio.' },
  ],
};

export const DAILY_OFFICES: OfficeDefinition[] = [
  OFFICE_MATUTINO,
  OFFICE_MEIODIA,
  OFFICE_VESPERTINO,
  OFFICE_COMPLETAS,
];
