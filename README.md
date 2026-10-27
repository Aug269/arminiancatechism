# Ofício Diário & Lecionário — Rede Episcopal Brasileira

Aplicativo litúrgico e devocional progressivo (PWA) que transforma o livro oficial do
Ofício Diário da Rede Episcopal Brasileira numa experiência contemplativa no navegador —
com identificação automática da hora canônica, cálculo litúrgico perpétuo (2026–2075),
texto integral dos ofícios e lecionário bíblico diário com o texto bíblico embutido.

> **100 % offline**: depois da primeira visita, tudo funciona sem conexão. O aplicativo é
> instalável no celular, no tablet e no computador.

---

## O que está implementado

### 1. Os quatro ofícios do dia
| Ofício | Horário próprio | Conteúdo |
|---|---|---|
| **Matutino** — Oração da Manhã | 5h – 11h | Sentença, confissão, Pai Nosso, Invitatório (Venite), salmodia, leituras, Benedictus, Credo, preces, coletas |
| **Meio-Dia** — Oração das Doze Horas | 11h – 15h | Saudação, sentença, salmo, leitura breve, silêncio, coleta da hora |
| **Vespertino** — Oração da Tarde | 15h – 21h | Hino da luz (*Phos hilaron*), confissão, salmodia, leituras, Magnificat, Credo, preces, coletas |
| **Completas** — Fim do Dia | 21h – 5h | Exame do dia, salmodia, leitura breve, Nunc dimittis, Credo, Pai Nosso, coletas da noite |

- **Entrada automática**: o app abre no ofício correspondente à hora atual e acompanha a
  mudança de hora; a barra de acesso rápido permite trocar de ofício a qualquer momento.
- Rubricas litúrgicas em vermelho, respostas da assembleia em negrito (℣ / ℟).
- **Salmodia** e **leituras** vêm do lecionário do dia — com o texto bíblico completo
  exibido dentro do próprio ofício.

### 2. Ofício para Famílias e Indivíduos
Pela Manhã · Ao Meio-Dia · Ao Entardecer · Ao Anoitecer (antes e depois do jantar) · No Fim
do Dia, com o Credo dos Apóstolos, orações adicionais e orações às refeições.

### 3. Ofício para a Semana
Sentença, versículo de salmo, leitura e oração temáticas de domingo a sábado: A Ressurreição,
A Criação e o Espírito, A Encarnação, O Arrependimento, A Ceia do Senhor, A Cruz, O Túmulo e
o Descanso.

### 4. Coletas e Calendário Litúrgico
- **115 coletas**: Advento, Natal, Epifania, Quaresma, Semana Santa, Tempo Pascal, Próprios
  1–29 do Tempo Comum, Dias Santos e Festas, Coletas Comuns e Comemorações Especiais
  (Reforma, Rede Episcopal Brasileira, Pátria, Ação de Graças, unidade, missão, paz).
- **Calendário com três visões**: mês navegável (cor e festa de cada dia), tábua móvel
  2026–2075 e lista de dias santos.
- **Calculador litúrgico automático**: Páscoa (algoritmo de Meeus/Jones/Butcher), Cinzas,
  Ramos, Quinta e Sexta-Feira Santas, Ascensão, Pentecostes, Trindade, Cristo Rei, Primeiro
  Domingo do Advento; tempo litúrgico, cor, Próprio do dia, **Ano A/B/C** e ciclo do Ofício
  (**Ano 1/2**).

### 5. Lecionário bíblico integrado
- **Ofício Diário**: ciclo de dois anos (Ano 1 e Ano 2) com salmos da manhã e da tarde e três
  leituras por dia, mais as leituras próprias dos dias santos.
- **Próprio dominical**: Lecionário Comum Revisado para os Anos A, B e C, com os dois
  trilhos (semicontínuo e complementar) quando existem.
- **Texto bíblico em português**: os 66 livros da versão Almeida são carregados sob demanda
  por livro e guardados no dispositivo; os livros deuterocanônicos aparecem com nota
  explicativa.

### 6. Leitura imersiva e acessibilidade
- Ajuste fino do tamanho do texto (A− / A+, 85 %–160 %, persistido no dispositivo).
- Modo diurno (papel marfim) e noturno (grafite com texto creme e rubricas coral).
- **Temporizador de silêncio meditativo** em cada rubrica que pede silêncio, com predefinições
  de 1, 2 e 5 minutos, barra de progresso, campainha suave sintetizada e vibração.
- Navegação por teclado, marcos ARIA, `prefers-reduced-motion` e folha de estilos de
  impressão.

### 7. PWA
Manifesto completo, ícones (inclusive *maskable*), service worker com precache de todo o
conteúdo e botão **Instalar** quando o navegador permite.

---

## Como rodar

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build de produção em dist/ (inclui o service worker)
npm run preview      # pré-visualiza os arquivos gerados
```

### Verificações

```bash
npm run typecheck         # TypeScript
npm run verify:calendar   # Páscoa 2026–2075, datas móveis, continuidade e coerência dos Próprios
npm run verify:lectionary # 15 anos de leituras, citações, texto bíblico e integridade das coletas
npm run verify:render     # renderiza as telas principais (detecta erros de execução)
```

### Regenerar dados

Os bancos de dados são versionados em `src/data/`. Para regenerá-los a partir das fontes
brutas em `scripts/sources/`:

```bash
python3 scripts/generate-data.py    # lecionário + bíblia + aliases
python3 scripts/generate-icons.py   # ícones PNG/SVG do PWA
```

---

## Arquitetura

```
src/
├── App.tsx                      # estados globais (data, ofício, modo, preferências)
├── main.tsx                     # montagem + registro do service worker
├── styles.css                   # sistema visual (papel, bordô, rubricas, ouro)
├── components/
│   ├── Masthead.tsx             # identidade, fonte, tema, instalar, offline
│   ├── DayHeader.tsx            # data litúrgica, cor, ano, navegação de dias
│   ├── QuickHourBar.tsx         # Matutino · Meio-Dia · Vespertino · Completas
│   ├── OfficeViewer.tsx         # motor de blocos do Ofício
│   ├── ReadingBlock.tsx         # texto bíblico de uma citação (com alternativas)
│   ├── SundayPropers.tsx        # Próprio do RCL com os dois trilhos
│   ├── Psalmody.tsx             # salmodia + Gloria Patri
│   ├── CanticleBlock.tsx        # cânticos do Ofício
│   ├── CollectBlock.tsx         # coletas
│   ├── SilenceTimer.tsx         # temporizador de silêncio
│   ├── CalendarView.tsx         # mês, tábua móvel e dias santos
│   ├── FamilyView.tsx           # Ofício para Famílias e Indivíduos
│   ├── WeeklyView.tsx           # Ofício para a Semana
│   └── LibraryView.tsx          # coletas, cânticos, orações e notas
├── data/
│   ├── offices/                 # textos litúrgicos (ofícios, cânticos, orações, semana)
│   ├── collects.ts              # 115 coletas do ano cristão
│   ├── holyDays.ts              # dias santos e festas de data fixa
│   ├── lectionary/              # RCL (A/B/C) e Ofício Diário (Anos 1 e 2)
│   └── bible/                   # 66 livros (1 arquivo por livro) + índice + aliases
├── hooks/                       # preferências e hora canônica
└── services/
    ├── liturgicalCalendar.ts    # cálculo litúrgico
    ├── lectionary.ts            # resolução das leituras do dia
    ├── citation.ts              # interpretação de citações ("Neh 7:73b–8:3, 5–18")
    ├── bibleService.ts          # carregamento do texto bíblico
    └── dateUtils.ts             # datas em UTC, formatação em português
scripts/
├── generate-data.py             # pipeline de dados
├── generate-icons.py            # ícones do PWA
├── sources/                     # fontes brutas + licenças
├── verify-*.mjs                 # verificações automatizadas
└── smoke/render-smoke.tsx       # renderização das telas
```

### Modelo dos ofícios

Um ofício é uma lista de blocos tipados (`rubric`, `sentence`, `heading`, `text`,
`dialogue`, `psalmody`, `readings`, `canticle`, `silence`, `collect`, `creed`,
`lords-prayer`). O visualizador resolve cada bloco com o dia litúrgico corrente: as rubricas
saem em vermelho, as respostas em negrito, os salmos e leituras vêm do lecionário e as
coletas do Próprio — de modo que o mesmo texto litúrgico serve a qualquer dia do ano.

### Cálculo litúrgico

- Páscoa pelo algoritmo de Meeus/Jones/Butcher (calendário gregoriano).
- Advento: domingo entre 27/11 e 3/12.
- Próprio do Tempo Comum: o Próprio 1 é o domingo mais próximo de 11 de maio; os demais
  seguem de sete em sete dias, até o Próprio 29 (Cristo Rei).
- Letra do ano: o Advento de 2025 inaugurou o **Ano A** (ciclo de três anos).
- Ciclo do Ofício: anos litúrgicos iniciados em ano ímpar usam o **Ano 1**.

---

## Fontes e créditos

| Conteúdo | Fonte | Licença |
|---|---|---|
| Lecionário Comum Revisado (A/B/C) | [neelsmith/rcl](https://github.com/neelsmith/rcl) · lectionarypage.net | dados litúrgicos de uso livre |
| Ofício Diário (Anos 1 e 2, dias santos, ocasiões) | [reubenlillie/daily-office](https://github.com/reubenlillie/daily-office) | MIT · *Book of Common Prayer* em domínio público |
| Texto bíblico em português | [thiagobodruk/bible](https://github.com/thiagobodruk/bible) | Almeida (domínio público) |

As fontes brutas e as licenças correspondentes estão em `scripts/sources/`. O texto
litúrgico em português segue a tradição do Livro de Oração Comum, adaptado para a Rede
Episcopal Brasileira.

## Conteúdo legado

A pasta `legacy/` guarda o protótipo Expo do Catecismo Arminiano de 1640 que ocupava este
repositório antes do aplicativo litúrgico. Ele não faz parte do build atual.
