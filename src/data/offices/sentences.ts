import type { Season } from '../../services/liturgicalCalendar';

/**
 * Sentenças de abertura do Ofício (uma para cada dia, escolhida de forma
 * determinística entre as opções do tempo litúrgico).
 */
export const SENTENCES: Record<Season, string[]> = {
  advent: [
    '«Eis que vem o Senhor dos Exércitos; e todos os santos com ele, e haverá naquele dia uma grande luz.» (Zacarias 14:5, 7)',
    '«Preparai o caminho do Senhor, endireitai as suas veredas.» (Isaías 40:3)',
    '«A noite está quase passada, e o dia está próximo. Despojemo-nos das obras das trevas e vistamo-nos das armas da luz.» (Romanos 13:12)',
    '«Voz do que clama no deserto: preparai o caminho do Senhor.» (Marcos 1:3)',
  ],
  christmas: [
    '«O povo que andava em trevas viu uma grande luz; sobre os que habitavam na terra da sombra da morte, uma luz resplandeceu.» (Isaías 9:2)',
    '«E o Verbo se fez carne e habitou entre nós, e vimos a sua glória.» (João 1:14)',
    '«Hoje vos nasceu, na cidade de Davi, o Salvador, que é Cristo, o Senhor.» (Lucas 2:11)',
  ],
  epiphany: [
    '«Levanta-te e resplandece, porque chegou a tua luz, e a glória do Senhor nasceu sobre ti.» (Isaías 60:1)',
    '«Vimos a sua estrela no Oriente e viemos adorá-lo.» (Mateus 2:2)',
    '«Este é o meu Filho amado, em quem me comprazo.» (Mateus 3:17)',
  ],
  lent: [
    '«Se hoje ouvires a sua voz, não endureças o teu coração.» (Salmo 95:7-8)',
    '«Rasgai o vosso coração, e não as vossas vestes, e convertei-vos ao Senhor nosso Deus, porque é compassivo e misericordioso.» (Joel 2:13)',
    '«O Senhor é a minha luz e a minha salvação; a quem temerei?» (Salmo 27:1)',
  ],
  holyWeek: [
    '«Não me escondas o teu rosto no dia da angústia; inclina para mim o teu ouvido.» (Salmo 102:2)',
    '«Ele foi ferido por causa das nossas transgressões, e moído por causa das nossas iniquidades.» (Isaías 53:5)',
    '«Nós anunciamos Cristo crucificado, poder de Deus e sabedoria de Deus.» (1 Coríntios 1:23-24)',
  ],
  easter: [
    '«Cristo, nossa Páscoa, foi imolado; celebremos, pois, a festa.» (1 Coríntios 5:7-8)',
    '«Se, pois, ressuscitastes com Cristo, buscai as coisas do alto.» (Colossenses 3:1)',
    '«Este é o dia que o Senhor fez; exultemos e alegremo-nos nele.» (Salmo 118:24)',
    '«Eu sou a ressurreição e a vida, diz o Senhor.» (João 11:25)',
  ],
  afterPentecost: [
    '«O Senhor está no seu santo templo; o Senhor tem o seu trono nos céus.» (Salmo 11:4)',
    '«A tua palavra é lâmpada para os meus pés e luz para o meu caminho.» (Salmo 119:105)',
    '«Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.» (Mateus 11:28)',
    '«Deus é espírito, e importa que os que o adoram o adorem em espírito e em verdade.» (João 4:24)',
    '«Grande é o Senhor e muito digno de louvor, e a sua grandeza não se pode medir.» (Salmo 145:3)',
  ],
};

/** Sentenças das festas principais, usadas quando o dia é de festa. */
export const FEAST_SENTENCES: Record<string, string> = {
  'todos-os-santos':
    '«Depois destas coisas vi uma grande multidão, que ninguém podia contar, de todas as nações, tribos, povos e línguas, diante do trono e do Cordeiro.» (Apocalipse 7:9)',
  trindade:
    '«A graça do Senhor Jesus Cristo, o amor de Deus e a comunhão do Espírito Santo sejam com todos vós.» (2 Coríntios 13:13)',
  pentecostes: '«E todos foram cheios do Espírito Santo e começaram a falar.» (Atos 2:4)',
  pascoa: '«Ele não está aqui; ressuscitou, como disse. Vinde, vede o lugar onde o Senhor jazia.» (Mateus 28:6)',
  natal: '«Hoje vos nasceu o Salvador, que é Cristo, o Senhor.» (Lucas 2:11)',
  epifania: '«As nações caminharão à tua luz, e os reis ao esplendor do teu amanhecer.» (Isaías 60:3)',
};
