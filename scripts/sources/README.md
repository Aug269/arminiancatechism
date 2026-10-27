# Fontes de dados

Arquivos brutos usados por `scripts/generate-data.py`. Não edite os arquivos gerados em
`src/data/` à mão: altere a fonte (ou o script) e regenere.

| Arquivo | Origem | Licença / observação |
|---|---|---|
| `rcl_readings.txt` | [neelsmith/rcl](https://github.com/neelsmith/rcl) — Lecionário Comum Revisado com propers dominicais e dias santos (Anos A, B e C), compilado a partir de lectionarypage.net | Dados litúrgicos de uso livre; citações bíblicas referenciadas, não transcritas |
| `dol-year-1.json`, `dol-year-2.json`, `dol-holy-days.json`, `dol-special-occasions.json` | [reubenlillie/daily-office](https://github.com/reubenlillie/daily-office) — Daily Office Lectionary | MIT (ver `LICENSE-daily-office-MIT.txt`); o *Book of Common Prayer* é de domínio público |
| `pt_aa.json` | [thiagobodruk/bible](https://github.com/thiagobodruk/bible) — Bíblia em português, versão Almeida, 66 livros | Texto Almeida em domínio público |

## Formatos

- **`rcl_readings.txt`**: texto separado por `|`, com cabeçalho
  `id|label|year|season|track|fixed_date|first_reading|psalm|second_reading|gospel|notes|source_url`.
  Cada Próprio pode ter dois trilhos (`track` 1 e 2); citações alternativas aparecem com
  `or` no mesmo campo.
- **`dol-*.json`**: arrays de ofícios com `season`, `week`, `day`, `title`, `psalms`
  (`morning`/`evening`) e `lessons` (podendo ser `morning`/`evening` ou plano).
- **`pt_aa.json`**: lista de 66 livros, cada um com `abbrev`, `name` e `chapters`
  (array de arrays de versículos).

## Notas de conversão

- `Neh 7:73b–8:3, 5–18` e outras faixas entre capítulos são normalizadas em `src/services/citation.ts`.
- Citações numéricas puras (`146`, `119:145–176`) são interpretadas como Salmos.
- `Canticle 15` e afins são mapeados para os cânticos do próprio Ofício
  (`src/components/ReadingBlock.tsx`).
- Livros deuterocanônicos (Eclesiástico, Sabedoria, Baruc, Judite, Macabeus, 2 Esdras) não
  constam da edição bíblica local: a interface exibe nota e mantém a referência.
