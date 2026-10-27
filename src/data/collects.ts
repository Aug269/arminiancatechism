/**
 * Coletas do Ano Cristão.
 *
 * Todas as coletas do Próprio (Advento ao Reino de Cristo), dos Dias Santos e
 * Festas Principais, das Coletas Comuns e das Comemorações Especiais.
 */

export type CollectSection =
  | 'advento'
  | 'natal'
  | 'epifania'
  | 'quaresma'
  | 'semana-santa'
  | 'pascoa'
  | 'tempo-comum'
  | 'dias-santos'
  | 'comuns'
  | 'especiais';

export interface Collect {
  id: string;
  title: string;
  section: CollectSection;
  text: string;
  /** Observação de uso (transferência, alternativa, etc.). */
  note?: string;
}

const throughChrist =
  'por Jesus Cristo, nosso Senhor, que vive e reina contigo e com o Espírito Santo, um só Deus, agora e para sempre. Amém.';

export const SECTION_LABELS: Record<CollectSection, string> = {
  advento: 'Advento',
  natal: 'Tempo do Natal',
  epifania: 'Tempo da Epifania',
  quaresma: 'Quaresma',
  'semana-santa': 'Semana Santa',
  pascoa: 'Tempo Pascal',
  'tempo-comum': 'Tempo Comum',
  'dias-santos': 'Dias Santos e Festas',
  comuns: 'Coletas Comuns',
  especiais: 'Comemorações Especiais',
};

const sectionsOrder: CollectSection[] = [
  'advento',
  'natal',
  'epifania',
  'quaresma',
  'semana-santa',
  'pascoa',
  'tempo-comum',
  'dias-santos',
  'comuns',
  'especiais',
];

export const COLLECTS: Collect[] = [
  // ------------------------------------------------------------------ Advento
  {
    id: 'advento-1',
    title: 'Primeiro Domingo do Advento',
    section: 'advento',
    text: `Deus todo-poderoso, dá-nos a graça de lançar fora as obras das trevas e vestir-nos com a armadura da luz, agora, neste tempo mortal, enquanto esperamos a vinda gloriosa do teu Filho Jesus Cristo; ${throughChrist}`,
  },
  {
    id: 'advento-2',
    title: 'Segundo Domingo do Advento',
    section: 'advento',
    text: `Deus misericordioso, que enviaste os teus profetas para preparar o caminho do Salvador: afasta de nós a soberba e a indiferença, para que, arrependidos, acolhamos o teu Filho que vem; ${throughChrist}`,
  },
  {
    id: 'advento-3',
    title: 'Terceiro Domingo do Advento',
    section: 'advento',
    text: `Ó Deus, que vês o teu povo esperando com paciência a vinda do Senhor: fortalece as mãos cansadas e os joelhos vacilantes, e faze-nos exultar de alegria, porque a tua salvação está próxima; ${throughChrist}`,
  },
  {
    id: 'advento-4',
    title: 'Quarto Domingo do Advento',
    section: 'advento',
    text: `Deus eterno, que preparaste a vinda do teu Filho na humildade da carne: concede-nos, como à bem-aventurada Virgem Maria, um coração disponível, para que, acolhendo a tua palavra, sejamos habitação do teu amor; ${throughChrist}`,
  },
  {
    id: 'advento-vigilia-natal',
    title: 'Vigília do Natal',
    section: 'advento',
    text: `Deus, que neste tempo santo nos alegras com a expectativa do Natal do teu Filho: concede que, recebendo-o com fé, sejamos encontrados na sua paz e o anunciemos com alegria; ${throughChrist}`,
  },

  // -------------------------------------------------------------------- Natal
  {
    id: 'natal-vigilia',
    title: 'Véspera de Natal',
    section: 'natal',
    text: `Ó Deus, que fizeste resplandecer nesta noite a luz verdadeira: concede-nos que, conhecendo na terra o mistério do Verbo encarnado, sejamos no céu repletos da sua glória; ${throughChrist}`,
  },
  {
    id: 'natal-dia',
    title: 'Natividade de Nosso Senhor Jesus Cristo',
    section: 'natal',
    text: `Deus todo-poderoso, que maravilhosamente criaste o ser humano e mais maravilhosamente o restauraste: concede-nos participar da divindade daquele que se dignou assumir a nossa humanidade, Jesus Cristo, teu Filho e nosso Senhor. Amém.`,
  },
  {
    id: 'natal-1',
    title: 'Primeiro Domingo após o Natal',
    section: 'natal',
    text: `Deus onipotente, que derramaste sobre nós o novo esplendor da tua Palavra: concede que a luz de Cristo, que já brilhou entre nós, ilumine os nossos passos e governe a nossa vida; ${throughChrist}`,
  },
  {
    id: 'natal-2',
    title: 'Segundo Domingo após o Natal',
    section: 'natal',
    text: `Pai celeste, que no teu Filho nos revelaste o teu nome de amor: faze-nos crescer em sabedoria e graça, para que o mundo reconheça em nós os filhos que recebeste; ${throughChrist}`,
  },
  {
    id: 'nome-de-jesus',
    title: 'Santíssimo Nome de Jesus',
    section: 'natal',
    text: `Eterno Pai, que deste ao teu Filho o nome que está acima de todo nome: concede que no nome de Jesus se dobre todo joelho nos céus, na terra e debaixo da terra, e que os nossos lábios o invoquem com confiança e amor; ${throughChrist}`,
  },

  // ----------------------------------------------------------------- Epifania
  {
    id: 'epifania',
    title: 'A Epifania de Nosso Senhor',
    section: 'epifania',
    text: `Ó Deus, que pela estrela guiaste os Magos ao teu Filho: conduze-nos, pela luz da fé, à contemplação da tua glória, para que te adoremos com eles na alegria do Reino; ${throughChrist}`,
  },
  {
    id: 'epifania-1',
    title: 'Primeiro Domingo após a Epifania: Batismo do Senhor',
    section: 'epifania',
    text: `Pai, que no Jordão declaraste o teu Filho amado e o ungiu com o Espírito: guarda-nos no nosso batismo, para que guardemos a aliança que fizeste conosco e ouçamos a voz que nos chama de filhos; ${throughChrist}`,
  },
  {
    id: 'epifania-2',
    title: 'Segundo Domingo após a Epifania',
    section: 'epifania',
    text: `Deus de poder e bondade, que chamam cada pessoa pelo nome e a convidam à tua mesa: faze-nos atentos à tua voz, para que, deixando o que nos afasta de ti, sigamos o Cordeiro de Deus; ${throughChrist}`,
  },
  {
    id: 'epifania-3',
    title: 'Terceiro Domingo após a Epifania',
    section: 'epifania',
    text: `Senhor, que enviaste o teu Filho para anunciar a boa-nova aos humildes e libertar os cativos: concede-nos abrasar-nos no teu amor e vencer com coragem o medo que nos impede de servir; ${throughChrist}`,
  },
  {
    id: 'epifania-4',
    title: 'Quarto Domingo após a Epifania',
    section: 'epifania',
    text: `Deus de toda consolação, que não desprezas os pequenos nem os pobres de espírito: ensina-nos o caminho da bem-aventurança, para que tenhamos fome e sede de justiça e sejamos chamados filhos de Deus; ${throughChrist}`,
  },
  {
    id: 'epifania-5',
    title: 'Quinto Domingo após a Epifania',
    section: 'epifania',
    text: `Senhor, que chamam teu povo a ser sal da terra e luz do mundo: concede-nos ações que deem sabor à vida dos outros e palavras que iluminem, para que o teu Reino seja visível entre nós; ${throughChrist}`,
  },
  {
    id: 'epifania-6',
    title: 'Sexto Domingo após a Epifania',
    section: 'epifania',
    text: `Ó Deus, que nos colocas diante da vida e da morte: dá-nos liberdade para escolher o bem, coragem para recomeçar e perseverança para guardar a tua palavra até ao fim; ${throughChrist}`,
  },
  {
    id: 'epifania-7',
    title: 'Sétimo Domingo após a Epifania',
    section: 'epifania',
    text: `Pai santo, que nos chamas à santidade: ensina-nos a amar o próximo como a nós mesmos, a perdoar sem medida e a caminhar em tua presença com coração íntegro; ${throughChrist}`,
  },
  {
    id: 'epifania-8',
    title: 'Oitavo Domingo após a Epifania',
    section: 'epifania',
    text: `Deus providente, que cuidas das aves do céu e dos lírios do campo: livra-nos da ansiedade do dia de amanhã, para que busquemos primeiro o teu Reino e confiemos no teu cuidado; ${throughChrist}`,
  },
  {
    id: 'epifania-ultimo',
    title: 'Último Domingo após a Epifania: Transfiguração do Senhor',
    section: 'epifania',
    text: `Ó Deus, que no monte revelaste a glória do teu Filho e preparaste os discípulos para a sua paixão: concede-nos, no meio das nossas provações, contemplar a luz que não se apaga e descer do monte para servir; ${throughChrist}`,
  },

  // ----------------------------------------------------------------- Quaresma
  {
    id: 'quarta-feira-de-cinzas',
    title: 'Quarta-Feira de Cinzas',
    section: 'quaresma',
    text: `Deus todo-poderoso, que não desejas a morte do pecador mas o seu arrependimento: cria em nós um coração puro; renova-nos pelo teu Espírito, para que, neste tempo de jejum, nos convertamos de coração e sejamos fiéis no teu amor; ${throughChrist}`,
  },
  {
    id: 'quaresma-1',
    title: 'Primeiro Domingo da Quaresma',
    section: 'quaresma',
    text: `Deus, cujo Filho foi levado pelo Espírito ao deserto e tentado em nosso favor: dá-nos, nestes quarenta dias, a graça de vencer o mal pela oração e pela sobriedade, para que, livres do que nos prende, caminhemos para a Páscoa; ${throughChrist}`,
  },
  {
    id: 'quaresma-2',
    title: 'Segundo Domingo da Quaresma',
    section: 'quaresma',
    text: `Pai celeste, que nos chamas a ouvir o teu Filho amado: concede-nos contemplá-lo na sua humildade e, com o coração livre, segui-lo no caminho da cruz até à alegria da ressurreição; ${throughChrist}`,
  },
  {
    id: 'quaresma-3',
    title: 'Terceiro Domingo da Quaresma',
    section: 'quaresma',
    text: `Deus, fonte de água viva, que saciais a sede do teu povo: concede-nos beber do Espírito que nos purifica, para que, deixando os ídolos que nos cansam, adoremo-te em espírito e verdade; ${throughChrist}`,
  },
  {
    id: 'quaresma-4',
    title: 'Quarto Domingo da Quaresma',
    section: 'quaresma',
    text: `Deus, que abres os olhos aos que se reconhecem cegos: ilumina a nossa fé, para que, vendo a luz de Cristo, permaneçamos nela e testemunhemos, com alegria, o que os nossos olhos contemplaram; ${throughChrist}`,
  },
  {
    id: 'quaresma-5',
    title: 'Quinto Domingo da Quaresma',
    section: 'quaresma',
    text: `Senhor, que fazes brotar vida onde havia ossos secos: sopra sobre nós o teu Espírito, para que, ressuscitados com Cristo, andemos em novidade de vida e sirvamos aos irmãos com esperança; ${throughChrist}`,
  },

  // --------------------------------------------------------------- Semana Santa
  {
    id: 'domingo-de-ramos',
    title: 'Domingo de Ramos',
    section: 'semana-santa',
    text: `Deus eterno, que não desprezas a fraqueza dos que te aclamam e abandonam: concede-nos seguir o teu Filho no caminho da humildade e da cruz, para que participemos também da sua ressurreição; ${throughChrist}`,
  },
  {
    id: 'quinta-feira-santa',
    title: 'Quinta-Feira Santa',
    section: 'semana-santa',
    text: `Senhor Jesus Cristo, que na véspera da tua morte nos deixaste o mandamento do amor e o sacramento do teu corpo e sangue: faze de nós servos uns dos outros, para que o mundo conheça que somos teus discípulos; por ti, que vives e reinas com o Pai e o Espírito Santo, um só Deus, para sempre. Amém.`,
  },
  {
    id: 'sexta-feira-santa',
    title: 'Sexta-Feira Santa',
    section: 'semana-santa',
    text: `Deus todo-poderoso, que na cruz revelaste o teu amor mais forte que a morte: acolhe a nossa contrição, guarda-nos junto ao teu Filho sofredor e faze-nos fiéis até que a alegria da Páscoa amanheça; ${throughChrist}`,
  },
  {
    id: 'sabado-santo',
    title: 'Sábado Santo',
    section: 'semana-santa',
    text: `Deus, que guardas o teu povo no silêncio e na espera: acompanha os que sofrem sem consolo, sustenta a nossa fé e prepara-nos para receber a luz que não conhece ocaso; ${throughChrist}`,
  },

  // ------------------------------------------------------------------- Páscoa
  {
    id: 'vigilia-pascal',
    title: 'Vigília Pascal',
    section: 'pascoa',
    text: `Deus, que nesta noite santa abriste ao teu povo as portas da vida: acende em nós o desejo da páscoa eterna, para que, renascidos pelo Espírito, vivamos na alegria da ressurreição; ${throughChrist}`,
  },
  {
    id: 'pascoa',
    title: 'Domingo da Páscoa',
    section: 'pascoa',
    text: `Deus de misericórdia, que nesta manhã venceste a morte e nos abriste o caminho da vida: concede-nos, pela fé, viver como ressuscitados, com alegria que ninguém pode tirar; ${throughChrist}`,
  },
  {
    id: 'pascoa-2',
    title: 'Segundo Domingo da Páscoa',
    section: 'pascoa',
    text: `Deus onipotente, que na dúvida de Tomé confirmaste a fé da tua Igreja: faze-nos confiar na tua presença, mesmo quando não a vemos, e alegrar-nos com os que creem sem ter visto; ${throughChrist}`,
  },
  {
    id: 'pascoa-3',
    title: 'Terceiro Domingo da Páscoa',
    section: 'pascoa',
    text: `Senhor Jesus, que caminhas ao lado dos mesmos que não te reconhecem: abre as Escrituras ao nosso entendimento e faze arder o nosso coração, para que te conheçamos no partir do pão; ${throughChrist}`,
  },
  {
    id: 'pascoa-4',
    title: 'Quarto Domingo da Páscoa',
    section: 'pascoa',
    text: `Deus, pastor do teu povo, que em Cristo nos deste o bom pastor: faze-nos escutar a tua voz entre tantas vozes, para que, seguindo-te, tenhamos vida em abundância; ${throughChrist}`,
  },
  {
    id: 'pascoa-5',
    title: 'Quinto Domingo da Páscoa',
    section: 'pascoa',
    text: `Pai, que em Cristo nos dás o mandamento do amor: concede-nos amar como ele nos amou, sem reservas e sem fronteiras, para que o mundo reconheça o teu Reino; ${throughChrist}`,
  },
  {
    id: 'pascoa-6',
    title: 'Sexto Domingo da Páscoa',
    section: 'pascoa',
    text: `Deus, que não nos deixais órfãos e nos prometestes o Espírito Santo: guarda-nos na alegria da tua amizade e faze-nos testemunhas da esperança que recebemos; ${throughChrist}`,
  },
  {
    id: 'pascoa-7',
    title: 'Sétimo Domingo da Páscoa',
    section: 'pascoa',
    text: `Senhor, que nos confias o teu nome e o teu povo: concede-nos ser um só coração, para que, reunidos contigo, esperemos com fidelidade a promessa do Espírito; ${throughChrist}`,
  },
  {
    id: 'ascensao',
    title: 'Ascensão de Nosso Senhor',
    section: 'pascoa',
    text: `Deus todo-poderoso, cujo Filho subiu aos céus e está à tua direita intercedendo por nós: faze com que, elevando os nossos corações, vivamos atentos ao mundo que amas e sejamos testemunhas da sua vitória; ${throughChrist}`,
  },
  {
    id: 'pentecostes',
    title: 'Dia de Pentecostes',
    section: 'pascoa',
    text: `Deus, que no dia de Pentecostes abriste aos povos a Porta da fé: concede-nos o teu Espírito, para que compreendamos a verdade que ensinas e anunciemos, com coragem e alegria, que Jesus é o Senhor; ${throughChrist}`,
  },

  // --------------------------------------------------------------- Tempo Comum
  {
    id: 'trindade',
    title: 'Domingo da Santíssima Trindade',
    section: 'tempo-comum',
    text: `Deus todo-poderoso, que nos deste a graça de confessar a verdade eterna, adorando-te na unidade das três Pessoas e na trindade da tua majestade: guarda-nos na fé que recebemos, para que acreditemos com o coração e anunciemos com os lábios; ${throughChrist}`,
  },
  {
    id: 'proprio-1',
    title: 'Próprio 1',
    section: 'tempo-comum',
    text: `Deus de misericórdia, que não desejas a culpa do pecador nem o seu castigo: atende ao lamento do teu povo e renova as nossas forças, para que, livres do que nos prende, caminhemos com alegria no teu louvor; ${throughChrist}`,
  },
  {
    id: 'proprio-2',
    title: 'Próprio 2',
    section: 'tempo-comum',
    text: `Pai, que sustens o voo da ave e veste o lírio do campo: concede-nos um coração confiante, que não se entregue à ansiedade, mas busque primeiro o teu Reino; ${throughChrist}`,
  },
  {
    id: 'proprio-3',
    title: 'Próprio 3',
    section: 'tempo-comum',
    text: `Senhor, que chamas teu povo a ser sal e luz: faze as nossas obras tão visíveis que todos reconheçam o teu amor e glorifiquem o teu nome; ${throughChrist}`,
  },
  {
    id: 'proprio-4',
    title: 'Próprio 4',
    section: 'tempo-comum',
    text: `Deus, que nos ordenas amar o inimigo: dá-nos o teu Espírito, para que, perdoando, sejamos verdadeiramente seus filhos e imitemos o teu amor que a todos abraça; ${throughChrist}`,
  },
  {
    id: 'proprio-5',
    title: 'Próprio 5',
    section: 'tempo-comum',
    text: `Senhor, que chamas pelo nome os que te seguem: abre os nossos ouvidos à tua voz e a nossa casa à tua presença, para que, deixando tudo, te sigamos com alegria; ${throughChrist}`,
  },
  {
    id: 'proprio-6',
    title: 'Próprio 6',
    section: 'tempo-comum',
    text: `Deus, que enviaste o teu Filho a anunciar o Reino: concede-nos a coragem dos que não temem a indiferença, para que semeemos a tua palavra com fé e a colhamos com gratidão; ${throughChrist}`,
  },
  {
    id: 'proprio-7',
    title: 'Próprio 7',
    section: 'tempo-comum',
    text: `Pai, que nos acolhes como filhos: escuta o nosso medo, confirma a nossa fé, e faze-nos testemunhas de que não temos aqui morada definitiva, mas caminhamos para ti; ${throughChrist}`,
  },
  {
    id: 'proprio-8',
    title: 'Próprio 8',
    section: 'tempo-comum',
    text: `Senhor da vida, que na páscoa de Cristo nos abriste a esperança: concede-nos confiar no teu poder mais forte que a morte, para que, em qualquer sofrimento, tenhamos alegria; ${throughChrist}`,
  },
  {
    id: 'proprio-9',
    title: 'Próprio 9',
    section: 'tempo-comum',
    text: `Ó Deus, que nos ensinas que os pequenos e humildes são os primeiros no teu Reino: dá-nos um coração simples, para que acolhamos com ternura os mais frágeis e recebamos o teu abraço; ${throughChrist}`,
  },
  {
    id: 'proprio-10',
    title: 'Próprio 10',
    section: 'tempo-comum',
    text: `Deus, que não desprezas o mendigo nem o que grita no caminho: concede-nos ver as necessidades dos nossos irmãos e ser para eles a tua mão que sustenta; ${throughChrist}`,
  },
  {
    id: 'proprio-11',
    title: 'Próprio 11',
    section: 'tempo-comum',
    text: `Senhor, que te alegras com o pão partilhado: abençoa o nosso pouco e faze-o abundante na partilha, para que ninguém se sinta sozinho à mesa do mundo; ${throughChrist}`,
  },
  {
    id: 'proprio-12',
    title: 'Próprio 12',
    section: 'tempo-comum',
    text: `Pai, que nos chamas a seguir-te no caminho estreito: sustenta a nossa fé nos dias de cansaço, e faze-nos firmes na esperança que não decepciona; ${throughChrist}`,
  },
  {
    id: 'proprio-13',
    title: 'Próprio 13',
    section: 'tempo-comum',
    text: `Deus, que nos convidas à humildade: ensina-nos a ocupar com alegria o lugar do serviço, para que sejamos exaltados por ti e não pelos homens; ${throughChrist}`,
  },
  {
    id: 'proprio-14',
    title: 'Próprio 14',
    section: 'tempo-comum',
    text: `Senhor, que nos amas antes de sermos dignos: acende em nós o amor que não se irrita nem guarda rancor, para que o teu Espírito cure as feridas das nossas relações; ${throughChrist}`,
  },
  {
    id: 'proprio-15',
    title: 'Próprio 15',
    section: 'tempo-comum',
    text: `Ó Deus, que convidas ao teu banquete os que não podem retribuir: abre o nosso coração à gratuidade, para que sirvamos sem esperar recompensa e conheçamos a alegria dos que dão; ${throughChrist}`,
  },
  {
    id: 'proprio-16',
    title: 'Próprio 16',
    section: 'tempo-comum',
    text: `Pai celeste, que buscas a ovelha perdida: guarda-nos no teu rebanho e envia-nos aos que se perderam, para que ninguém fique fora da festa do teu amor; ${throughChrist}`,
  },
  {
    id: 'proprio-17',
    title: 'Próprio 17',
    section: 'tempo-comum',
    text: `Deus, que nos chamas à conversão e à ousadia: dá-nos hoje um projeto que honre o teu nome, alegria no trabalho e desprendimento dos bens que passam; ${throughChrist}`,
  },
  {
    id: 'proprio-18',
    title: 'Próprio 18',
    section: 'tempo-comum',
    text: `Senhor, que resistes aos soberbos e dás graça aos humildes: faze-nos escolher o caminho do serviço, para que o nosso orgulho não nos separe de ti nem dos irmãos; ${throughChrist}`,
  },
  {
    id: 'proprio-19',
    title: 'Próprio 19',
    section: 'tempo-comum',
    text: `Ó Deus, que nos ordenas vestir a armadura da luz: capacita-nos para o combate da fé, para que resistamos ao mal com a verdade, a justiça e a paz do Evangelho; ${throughChrist}`,
  },
  {
    id: 'proprio-20',
    title: 'Próprio 20',
    section: 'tempo-comum',
    text: `Deus, que nos dás a videira e o convite ao banquete: concede-nos os frutos do teu Espírito, para que a nossa vida seja mesa para os famintos e alegria para os que choram; ${throughChrist}`,
  },
  {
    id: 'proprio-21',
    title: 'Próprio 21',
    section: 'tempo-comum',
    text: `Senhor, que pedes contas da misericórdia recebida: livra-nos do egoísmo, para que, usando bem os teus dons, sirvamos ao próximo com generosidade e alegria; ${throughChrist}`,
  },
  {
    id: 'proprio-22',
    title: 'Próprio 22',
    section: 'tempo-comum',
    text: `Deus, que não desprezas nenhum povo nem pessoa: faze-nos denunciar a opressão e acolher o estrangeiro, para que a tua justiça seja visível na nossa cidade; ${throughChrist}`,
  },
  {
    id: 'proprio-23',
    title: 'Próprio 23',
    section: 'tempo-comum',
    text: `Pai, que nos chamas a ser cidadãos do teu Reino: ensina-nos a lealdade que não se divide, para que demos a ti o que é teu e ao mundo o testemunho da tua verdade; ${throughChrist}`,
  },
  {
    id: 'proprio-24',
    title: 'Próprio 24',
    section: 'tempo-comum',
    text: `Ó Deus, que nos mandas amar sem fingimento: faze-nos firmes na oração e atentos ao mundo, para que o teu amor alcance, por nós, os que dele precisam; ${throughChrist}`,
  },
  {
    id: 'proprio-25',
    title: 'Próprio 25',
    section: 'tempo-comum',
    text: `Senhor, que nos ensinas a perguntar o que importa: concede-nos a sabedoria do Evangelho, para que amemos a ti acima de tudo e ao próximo como a nós mesmos; ${throughChrist}`,
  },
  {
    id: 'proprio-26',
    title: 'Próprio 26',
    section: 'tempo-comum',
    text: `Deus dos vivos, que não és Deus de mortos: abre os nossos olhos à esperança que atravessa o sofrimento e faz de nós testemunhas da ressurreição; ${throughChrist}`,
  },
  {
    id: 'proprio-27',
    title: 'Próprio 27',
    section: 'tempo-comum',
    text: `Pai, que nos exortas a permanecer atentos: guarda-nos na fidelidade das pequenas coisas, para que, quando o Filho vier, nos encontre servindo com alegria; ${throughChrist}`,
  },
  {
    id: 'proprio-28',
    title: 'Próprio 28',
    section: 'tempo-comum',
    text: `Senhor, que nos confias dons que não são nossos: dá-nos a coragem de os multiplicar, para que a colheita do teu Reino encontre em nós trabalhadores fiéis; ${throughChrist}`,
  },
  {
    id: 'cristo-rei',
    title: 'Reino de Cristo (Próprio 29)',
    section: 'tempo-comum',
    text: `Deus todo-poderoso, que em teu Filho Jesus Cristo estabeleceste o Reino da verdade e da vida: concede-nos, neste fim do ano cristão, servir com alegria o Rei que hoje os povos ainda não conhecem, até que todos os vejam e o adorem; ${throughChrist}`,
  },

  // --------------------------------------------------------------- Dias Santos
  {
    id: 'santo-andre',
    title: 'Santo André, Apóstolo (30 de novembro)',
    section: 'dias-santos',
    text: `Deus, que chamaste o apóstolo André a seguir o teu Filho e a conduzir o irmão ao Messias: concede-nos, como ele, deixar as nossas redes e levar outros contigo no caminho da vida; ${throughChrist}`,
  },
  {
    id: 'santo-tome',
    title: 'São Tomé, Apóstolo (21 de dezembro)',
    section: 'dias-santos',
    text: `Deus onipotente, que na dúvida do apóstolo Tomé revelaste a certeza da ressurreição: concede-nos crer sem vacilar e anunciar, com coragem, que Jesus é o Senhor e Deus; ${throughChrist}`,
  },
  {
    id: 'santo-estevao',
    title: 'Santo Estêvão, Diácono e Mártir (26 de dezembro)',
    section: 'dias-santos',
    text: `Pai celeste, que deste a Santo Estêvão a coragem de perdoar aos que o apedrejavam: ensina-nos a amar os que nos ferem e a permanecer firmes no testemunho da tua verdade; ${throughChrist}`,
  },
  {
    id: 'sao-joao',
    title: 'São João, Apóstolo e Evangelista (27 de dezembro)',
    section: 'dias-santos',
    text: `Deus, que abriste ao apóstolo João a compreensão do mistério da tua Palavra: ilumina as nossas etapas e faze-nos anunciar que o teu Filho veio habitar entre nós; ${throughChrist}`,
  },
  {
    id: 'santos-inocentes',
    title: 'Santos Inocentes (28 de dezembro)',
    section: 'dias-santos',
    text: `Deus, que na matança dos inocentes revelaste a crueldade dos poderosos e o preço da tua luz: guarda as crianças do mundo, e faze-nos defender a vida que não pode falar por si; ${throughChrist}`,
  },
  {
    id: 'confissao-de-pedro',
    title: 'Confissão de São Pedro (18 de janeiro)',
    section: 'dias-santos',
    text: `Deus, que inspiraste a Pedro a confissão de que Jesus é o Cristo: dá-nos a mesma convicção e a mesma humildade, para que a nossa fé seja firme e o nosso serviço alegre; ${throughChrist}`,
  },
  {
    id: 'conversao-de-paulo',
    title: 'Conversão de São Paulo (25 de janeiro)',
    section: 'dias-santos',
    text: `Deus, que transformaste o perseguidor em apóstolo dos povos: concede-nos, como a Paulo, a coragem de mudar de caminho e a ousadia de anunciar o Evangelho que uma vez combatemos; ${throughChrist}`,
  },
  {
    id: 'apresentacao',
    title: 'Apresentação do Senhor (2 de fevereiro)',
    section: 'dias-santos',
    text: `Senhor, que hoje apresentas no templo o teu Filho, luz para os povos: acolhe-nos com Simeão nos teus braços e faz de nós luz que ilumina os que estão na sombra; ${throughChrist}`,
  },
  {
    id: 'sao-matias',
    title: 'São Matias, Apóstolo (24 de fevereiro)',
    section: 'dias-santos',
    text: `Deus, que escolheste Matias para completar o número dos apóstolos: concede-nos, no lugar que nos é dado, testemunhar com a vida a ressurreição do teu Filho; ${throughChrist}`,
  },
  {
    id: 'sao-jose',
    title: 'São José (19 de março)',
    section: 'dias-santos',
    text: `Deus, que confiaste a São José o cuidado da Sagrada Família: dá aos que criam, aos que trabalham e aos que velam a fidelidade silenciosa de quem serve sem buscar honra; ${throughChrist}`,
  },
  {
    id: 'anunciacao',
    title: 'Anunciação do Senhor (25 de março)',
    section: 'dias-santos',
    text: `Deus, que na Anunciação abriste ao mundo o caminho da salvação: concede-nos, como Maria, escutar a tua palavra e responder com um «sim» que transforme a nossa história; ${throughChrist}`,
  },
  {
    id: 'sao-marcos',
    title: 'São Marcos, Evangelista (25 de abril)',
    section: 'dias-santos',
    text: `Deus, que concedeste a Marcos anunciar os feitos do teu Filho: faze-nos testemunhas corajosas do Evangelho, prontos a sofrer e a servir por amor do teu nome; ${throughChrist}`,
  },
  {
    id: 'filipe-e-tiago',
    title: 'São Filipe e São Tiago, Apóstolos (1º de maio)',
    section: 'dias-santos',
    text: `Senhor, que revelaste ao apóstolo Filipe o caminho que leva ao Pai: mantém a nossa fé viva, para que vejamos o teu Filho e, nele, a tua glória; ${throughChrist}`,
  },
  {
    id: 'visitacao',
    title: 'Visitação de Maria (31 de maio)',
    section: 'dias-santos',
    text: `Deus, que inspiraste a Maria correr ao encontro da prima e cantar a tua justiça: faze-nos atentos aos sinais do teu Espírito e alegres no serviço aos irmãos; ${throughChrist}`,
  },
  {
    id: 'sao-barnabe',
    title: 'São Barnabé, Apóstolo (11 de junho)',
    section: 'dias-santos',
    text: `Deus, que deste a Barnabé um coração generoso para sustentar os fracos na fé: ensina-nos a encorajar os que duvidam e a partilhar com alegria o que recebemos; ${throughChrist}`,
  },
  {
    id: 'nascimento-do-batista',
    title: 'Natividade de São João Batista (24 de junho)',
    section: 'dias-santos',
    text: `Deus, que suscitaste João Batista para preparar o caminho do Salvador: concede-nos a humildade de diminuir para que Cristo cresça, e a coragem de dizer a verdade; ${throughChrist}`,
  },
  {
    id: 'pedro-e-paulo',
    title: 'São Pedro e São Paulo, Apóstolos (29 de junho)',
    section: 'dias-santos',
    text: `Deus, que na confissão de Pedro e na pregação de Paulo firmaste a tua Igreja: concede-nos a fé que confessa e a ousadia que anuncia, para que o Evangelho alcance todos os povos; ${throughChrist}`,
  },
  {
    id: 'santa-maria-madalena',
    title: 'Santa Maria Madalena (22 de julho)',
    section: 'dias-santos',
    text: `Senhor Jesus, que chamaste Maria Madalena pelo nome junto ao sepulcro e a fizeste anunciadora da Páscoa: chama-nos também, para que te reconheçamos e levemos a notícia da tua ressurreição; ${throughChrist}`,
  },
  {
    id: 'sao-tiago',
    title: 'São Tiago, Apóstolo (25 de julho)',
    section: 'dias-santos',
    text: `Deus, que deste a Tiago a coragem de beber o cálice do teu Filho: fortalece-nos para que, fiéis no testemunho, saibamos sofrer por amor e servir com alegria; ${throughChrist}`,
  },
  {
    id: 'transfiguracao',
    title: 'Transfiguração do Senhor (6 de agosto)',
    section: 'dias-santos',
    text: `Deus, que no monte revelaste a glória do teu Filho amado: concede-nos ouvir a sua voz e, transformados pela tua graça, descer ao vale para servir os irmãos; ${throughChrist}`,
  },
  {
    id: 'santa-maria',
    title: 'Santa Maria, Mãe de Nosso Senhor (15 de agosto)',
    section: 'dias-santos',
    text: `Deus de bondade, que escolheste Maria para ser a mãe do Redentor: concede-nos, pela sua intercessão, a alegria de acolher o teu Filho e de o levar ao mundo; ${throughChrist}`,
  },
  {
    id: 'sao-bartolomeu',
    title: 'São Bartolomeu, Apóstolo (24 de agosto)',
    section: 'dias-santos',
    text: `Senhor, que chamaste Bartolomeu sem que ele te conhecesse: ajuda-nos a reconhecer-te nos lugares inesperados e a seguir-te com coração sem engano; ${throughChrist}`,
  },
  {
    id: 'santa-cruz',
    title: 'Santa Cruz (14 de setembro)',
    section: 'dias-santos',
    text: `Deus, que na cruz do teu Filho revelaste a medida do teu amor: concede-nos carregar com paciência o peso dos nossos dias e encontrar nela a fonte da nossa salvação; ${throughChrist}`,
  },
  {
    id: 'sao-mateus',
    title: 'São Mateus, Apóstolo e Evangelista (21 de setembro)',
    section: 'dias-santos',
    text: `Deus, que chamaste Mateus do seu posto de cobrança para te seguir: convida-nos também à tua mesa, para que, perdoados, anunciemos com a vida o Evangelho da misericórdia; ${throughChrist}`,
  },
  {
    id: 'sao-miguel',
    title: 'São Miguel e Todos os Anjos (29 de setembro)',
    section: 'dias-santos',
    text: `Deus, que enviaste os teus anjos para guardar o teu povo: concede-nos a proteção dos mensageiros da tua paz e o desejo das coisas do alto; ${throughChrist}`,
  },
  {
    id: 'sao-lucas',
    title: 'São Lucas, Evangelista (18 de outubro)',
    section: 'dias-santos',
    text: `Deus, que chamaste Lucas, médico amado, a narrar a bondade do teu Filho: cura as nossas feridas e faze-nos contadores fiéis das maravilhas que realizas entre nós; ${throughChrist}`,
  },
  {
    id: 'sao-tiago-de-jerusalem',
    title: 'São Tiago de Jerusalém (23 de outubro)',
    section: 'dias-santos',
    text: `Senhor, que escolheste Tiago para guiar a tua Igreja em Jerusalém: dá-nos sabedoria nas decisões, fidelidade na oração e coragem no testemunho; ${throughChrist}`,
  },
  {
    id: 'simao-e-judas',
    title: 'São Simão e São Judas, Apóstolos (28 de outubro)',
    section: 'dias-santos',
    text: `Senhor, que revelaste aos apóstolos Simão e Judas o mistério da tua amizade: concede-nos conhecer-te como amigo e permanecer no teu amor, servindo a todos com alegria; ${throughChrist}`,
  },
  {
    id: 'todos-os-santos',
    title: 'Todos os Santos (1º de novembro)',
    section: 'dias-santos',
    text: `Deus todo-poderoso, que na multidão dos santos nos mostras a cidade que preparas para os teus filhos: concede-nos, pela fé e pela esperança, a certeza de que caminhamos para essa alegria; ${throughChrist}`,
  },
  {
    id: 'finados',
    title: 'Fiéis Defuntos (2 de novembro)',
    section: 'dias-santos',
    text: `Deus, que no teu Filho venceste a morte e abriste a porta da vida eterna: acolhe na tua misericórdia os que partiram, consola os que choram e guarda em nós a esperança da ressurreição; ${throughChrist}`,
  },

  // --------------------------------------------------------------- Coletas Comuns
  {
    id: 'comum-apostolo',
    title: 'Coleta comum dos apóstolos',
    section: 'comuns',
    text: `Deus eterno, que no ministério dos apóstolos edificaste a tua Igreja: concede-nos, como a eles, a coragem de anunciar o Evangelho e a alegria de ver muitos voltarem-se para ti; ${throughChrist}`,
  },
  {
    id: 'comum-martir',
    title: 'Coleta comum dos mártires',
    section: 'comuns',
    text: `Deus de poder e fidelidade, que fortalecesses os teus mártires até ao fim: dá-nos a graça de permanecer contigo na tribulação e de guardar a fé que eles selaram com a vida, pela qual vivem agora contigo na alegria eterna; ${throughChrist}`,
  },
  {
    id: 'comum-pastor',
    title: 'Coleta comum de um pastor',
    section: 'comuns',
    text: `Deus, pastor do teu povo, que confiaste ao teu servo o cuidado das ovelhas: concede que, ensinando com fidelidade e servindo com humildade, ele conduza o teu rebanho às pastagens da vida; ${throughChrist}`,
  },
  {
    id: 'comum-doutor',
    title: 'Coleta comum de um doutor da Igreja',
    section: 'comuns',
    text: `Deus, que na Igreja suscitas mestres para iluminar a fé do teu povo: acende em nós o desejo de aprender e a humildade de ensinar, para que a verdade do Evangelho seja compreendida e vivida; ${throughChrist}`,
  },
  {
    id: 'comum-santo',
    title: 'Coleta comum de um santo',
    section: 'comuns',
    text: `Deus de toda santidade, que nos chamaste a ser santos como tu és santo: pela intercessão e pelo exemplo dos Teus servos, concede-nos a graça de viver com fidelidade e alegria na presença do teu Filho; ${throughChrist}`,
  },
  {
    id: 'comum-fundador',
    title: 'Coleta comum de um fundador de comunidade',
    section: 'comuns',
    text: `Pai, que reuniste um povo em torno da tua Palavra e do teu amor: sustenta com o teu Espírito a comunidade que hoje te serve, para que, fiel à sua origem, permaneça aberta aos que procuram a tua casa; ${throughChrist}`,
  },

  // ----------------------------------------------------- Comemorações Especiais
  {
    id: 'reforma',
    title: 'Reforma da Igreja (31 de outubro)',
    section: 'especiais',
    text: `Deus de graça, que na Reforma chamaste a tua Igreja de volta às Escrituras: reconcilia o teu povo dividido, dá-nos humildade nas nossas memórias e alegria na verdade que nos une em Cristo; ${throughChrist}`,
  },
  {
    id: 'rede-episcopal',
    title: 'Aniversário da Rede Episcopal Brasileira',
    section: 'especiais',
    text: `Deus, que reúnes a tua Igreja em comunhão de oração e serviço: agradecemos-te pelo testemunho da Rede Episcopal Brasileira; concede-nos fidelidade à Palavra, dignidade na liturgia e coragem na missão, para que muitos encontrem no teu povo uma casa; ${throughChrist}`,
  },
  {
    id: 'patria',
    title: 'Pátria',
    section: 'especiais',
    text: `Deus, Rei de todas as nações, que deste esperança a este povo: concede aos brasileiros justiça, trabalho e paz; guarda-nos da violência e da corrupção; e faze de nós servidores do bem comum; ${throughChrist}`,
  },
  {
    id: 'independencia',
    title: 'Independência do Brasil (7 de setembro)',
    section: 'especiais',
    text: `Pai de todos os povos, que fazes nascer a liberdade onde plantaste a dignidade: agradecemos-te pela nossa nação; ensina-nos a merecer a liberdade que recebemos e a defender a de quem padece opressão; ${throughChrist}`,
  },
  {
    id: 'graças',
    title: 'Ação de Graças',
    section: 'especiais',
    text: `Senhor, que abres a tua mão e satisfazes todo ser vivente: agradecemos-te pela colheita, pelo trabalho e pela mesa partilhada; faze-nos generosos para com os famintos e gratos em toda circunstância; ${throughChrist}`,
  },
  {
    id: 'unidade',
    title: 'Pela unidade dos cristãos',
    section: 'especiais',
    text: `Venerado Pai, que em Cristo nos chamaste a ser um só povo: dá-nos a humildade de ouvir e a caridade de perdoar, para que, reunidos na fé que confessamos, sejamos no mundo sinal da tua paz; ${throughChrist}`,
  },
  {
    id: 'missao',
    title: 'Pela missão da Igreja',
    section: 'especiais',
    text: `Deus de misericórdia, que enviaste o teu Filho ao mundo para salvá-lo: envia-nos também, com a alegria do Evangelho, aos lugares onde a esperança se perdeu, para que todos conheçam o teu nome; ${throughChrist}`,
  },
  {
    id: 'entrega',
    title: 'Entrega confiante da noite',
    section: 'especiais',
    text: `Senhor, nas tuas mãos entregamos o dia que passou e a noite que vem. Guarda os que amamos, os que sofrem e os que vigiam; dá-nos repouso para o corpo e serenidade para a alma, e, se nos for concedido outro amanhecer, que o comecemos no teu louvor; ${throughChrist}`,
  },
  {
    id: 'paz',
    title: 'Pela paz',
    section: 'especiais',
    text: `Eterno Deus, na tua bondade orienta e governa a nossa vida e a de todos os povos; faz cessar as guerras e as contendas entre as nações; e, concedendo-nos a paz que o mundo não pode dar, ensina-nos a confiar em ti e a viver em caridade uns com os outros; ${throughChrist}`,
  },
];

export const COLLECT_BY_ID: Record<string, Collect> = Object.fromEntries(
  COLLECTS.map((collect) => [collect.id, collect]),
);

export const COLLECT_SECTIONS = sectionsOrder
  .map((section) => ({
    section,
    label: SECTION_LABELS[section],
    collects: COLLECTS.filter((collect) => collect.section === section),
  }))
  .filter((group) => group.collects.length > 0);

export function getCollect(id: string): Collect | undefined {
  return COLLECT_BY_ID[id];
}
