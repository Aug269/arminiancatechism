import { CANTICLE_BY_ID } from '../data/offices/canticles';

export interface CanticleBlockProps {
  canticleId: string;
}

/** Cântico do Ofício, com a doxologia ao final quando prevista. */
export function CanticleBlock({ canticleId }: CanticleBlockProps) {
  const canticle = CANTICLE_BY_ID[canticleId];
  if (!canticle) {
    return <p className="reading-note">Cântico não encontrado.</p>;
  }

  return (
    <section className="reading reading-psalm" aria-label={canticle.title}>
      <div className="reading-head">
        <span className="reading-kicker">Cântico</span>
        <span className="reading-cite">{canticle.title}</span>
      </div>
      <div className="reading-body">
        <p className="reading-note">
          {canticle.reference}
          {canticle.latinTitle ? ` · ${canticle.latinTitle}` : ''}
        </p>
        <div className="verses">
          {canticle.verses.map((verse, index) => (
            <p key={index}>{verse}</p>
          ))}
        </div>
        {canticle.doxology && (
          <p className="doxology">
            Glória ao Pai, ao Filho e ao Espírito Santo; como era no princípio, agora e sempre.
            Amém.
          </p>
        )}
      </div>
    </section>
  );
}
