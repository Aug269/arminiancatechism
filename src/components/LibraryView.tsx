import { useMemo, useState } from 'react';
import { COLLECT_SECTIONS, getCollect } from '../data/collects';
import { CANTICLES_ALPHABETICAL, CANTICLE_BY_ID } from '../data/offices/canticles';
import { ADDITIONAL_PRAYERS } from '../data/offices/prayers';
import { CollectBlock } from './CollectBlock';
import { CanticleBlock } from './CanticleBlock';
import { Icon } from './Icon';

export interface LibraryViewProps {
  onClose: () => void;
}

type Section = 'coletas' | 'canticos' | 'oracoes' | 'sobre';

/** Biblioteca litúrgica: coletas, cânticos, orações e notas de uso. */
export function LibraryView({ onClose }: LibraryViewProps) {
  const [section, setSection] = useState<Section>('coletas');
  const [query, setQuery] = useState('');
  const [collectId, setCollectId] = useState(COLLECT_SECTIONS[0]?.collects[0]?.id ?? '');
  const [canticleId, setCanticleId] = useState(CANTICLES_ALPHABETICAL[0]?.id ?? '');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSections = useMemo(
    () =>
      COLLECT_SECTIONS.map((group) => ({
        ...group,
        collects: group.collects.filter(
          (collect) =>
            normalizedQuery === '' ||
            collect.title.toLowerCase().includes(normalizedQuery) ||
            collect.text.toLowerCase().includes(normalizedQuery),
        ),
      })).filter((group) => group.collects.length > 0),
    [normalizedQuery],
  );

  const filteredCanticles = useMemo(
    () =>
      CANTICLES_ALPHABETICAL.filter(
        (canticle) =>
          normalizedQuery === '' ||
          canticle.title.toLowerCase().includes(normalizedQuery) ||
          (canticle.latinTitle ?? '').toLowerCase().includes(normalizedQuery) ||
          canticle.reference.toLowerCase().includes(normalizedQuery),
      ),
    [normalizedQuery],
  );

  const collect = getCollect(collectId);
  const canticle = CANTICLE_BY_ID[canticleId];

  return (
    <div className="paper">
      <div className="calendar-head" style={{ marginBottom: '0.5rem' }}>
        <h1 className="section-title" style={{ margin: 0 }}>
          Biblioteca Litúrgica
        </h1>
        <button type="button" className="icon-button" style={{ marginLeft: 'auto' }} onClick={onClose}>
          <Icon name="close" size={16} />
          <span className="label">Fechar</span>
        </button>
      </div>
      <p className="section-subtitle">
        Coletas do Ano Cristão, cânticos do Ofício, orações e notas sobre o uso do livro.
      </p>

      <div className="mode-switch" role="tablist" aria-label="Seções da biblioteca">
        <button type="button" role="tab" aria-selected={section === 'coletas'} onClick={() => setSection('coletas')}>
          Coletas
        </button>
        <button type="button" role="tab" aria-selected={section === 'canticos'} onClick={() => setSection('canticos')}>
          Cânticos
        </button>
        <button type="button" role="tab" aria-selected={section === 'oracoes'} onClick={() => setSection('oracoes')}>
          Orações
        </button>
        <button type="button" role="tab" aria-selected={section === 'sobre'} onClick={() => setSection('sobre')}>
          Sobre
        </button>
      </div>

      {section !== 'sobre' && (
        <label className="reading-note" style={{ display: 'block', marginBottom: '0.7rem' }}>
          <span className="sr-only">Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, texto ou referência…"
            style={{
              width: '100%',
              padding: '0.5rem 0.7rem',
              borderRadius: 8,
              border: '1px solid var(--borda)',
              background: 'color-mix(in srgb, var(--papel) 80%, transparent)',
              color: 'var(--tinta)',
              fontFamily: 'var(--serif)',
              fontStyle: 'normal',
              fontSize: '0.95rem',
            }}
          />
        </label>
      )}

      {section === 'coletas' && (
        <div className="library-grid two">
          <div>
            {filteredSections.map((group) => (
              <div key={group.section} style={{ marginBottom: '1rem' }}>
                <h2 className="card-title">{group.label}</h2>
                <ul className="index-list">
                  {group.collects.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="index-button"
                        aria-pressed={item.id === collectId}
                        onClick={() => setCollectId(item.id)}
                      >
                        <span className="title">{item.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {filteredSections.length === 0 && <p className="reading-note">Nenhuma coleta encontrada.</p>}
          </div>
          <div className="detail-panel">{collect && <CollectBlock collect={collect} />}</div>
        </div>
      )}

      {section === 'canticos' && (
        <div className="library-grid two">
          <div>
            <ul className="index-list">
              {filteredCanticles.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="index-button"
                    aria-pressed={item.id === canticleId}
                    onClick={() => setCanticleId(item.id)}
                  >
                    <span className="title">{item.title}</span>
                    <span className="ref">
                      {item.reference}
                      {item.latinTitle ? ` · ${item.latinTitle}` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {filteredCanticles.length === 0 && <p className="reading-note">Nenhum cântico encontrado.</p>}
          </div>
          <div className="detail-panel">
            {canticle && (
              <>
                <CanticleBlock canticleId={canticle.id} />
                {canticle.tradition && <p className="reading-note">{canticle.tradition}</p>}
              </>
            )}
          </div>
        </div>
      )}

      {section === 'oracoes' && (
        <div className="library-grid two">
          {ADDITIONAL_PRAYERS.map((prayer) => (
            <div key={prayer.id}>
              <h2 className="card-title">{prayer.category}</h2>
              <h3 style={{ fontFamily: 'var(--serif-display)', fontVariant: 'small-caps', color: 'var(--bordo)', margin: '0 0 0.25rem' }}>
                {prayer.title}
              </h3>
              <p className="verse-line">{prayer.text.join(' ')}</p>
            </div>
          ))}
        </div>
      )}

      {section === 'sobre' && (
        <div className="library-grid two">
          <section>
            <h2 className="card-title">O Ofício Diário</h2>
            <p className="verse-line">
              O Ofício Diário é a oração da Igreja distribuída pelas horas do dia. Neste
              aplicativo, os quatro ofícios (Matutino, Meio-Dia, Vespertino e Completas) são
              apresentados integralmente, com rubricas em vermelho e respostas da assembleia
              em negrito.
            </p>
          </section>
          <section>
            <h2 className="card-title">Lecionário</h2>
            <p className="verse-line">
              As leituras do Ofício seguem o ciclo de dois anos (Ano 1 e Ano 2). Nos domingos,
              o Próprio do Lecionário Comum Revisado é oferecido em dois trilhos: o
              semicontínuo e o complementar. As traduções bíblicas seguem a versão Almeida em
              português.
            </p>
          </section>
          <section>
            <h2 className="card-title">Ano litúrgico</h2>
            <p className="verse-line">
              O ano começa no Primeiro Domingo do Advento e gira em torno da Páscoa. A letra
              (A, B ou C) define o Evangelho dominical; o ciclo do Ofício (Ano 1 ou 2) define
              as leituras diárias. O calculador cobre de 2026 a 2075.
            </p>
          </section>
          <section>
            <h2 className="card-title">Uso offline</h2>
            <p className="verse-line">
              Todo o conteúdo é guardado no dispositivo. Depois da primeira visita, o Ofício, o
              Lecionário e as Coletas continuam disponíveis sem conexão. Use o botão «Instalar»
              para acrescentar o aplicativo à tela inicial.
            </p>
          </section>
          <section>
            <h2 className="card-title">Fontes</h2>
            <ul className="card-list">
              <li>
                <span>Lecionário Comum Revisado</span>
                <span className="meta">lectionarypage.net · neelsmith/rcl</span>
              </li>
              <li>
                <span>Daily Office Lectionary (BCP)</span>
                <span className="meta">reubenlillie/daily-office · MIT</span>
              </li>
              <li>
                <span>Texto bíblico em português</span>
                <span className="meta">thiagobodruk/bible · Almeida</span>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="card-title">Acessibilidade</h2>
            <p className="verse-line">
              Ajuste o tamanho do texto com A− e A+ na barra superior; o modo noturno reduz o
              brilho para a leitura à noite. Todos os controlos funcionam com teclado e leitores
              de tela.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
