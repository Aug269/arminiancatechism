import { getCollect, type Collect } from '../data/collects';

export interface CollectBlockProps {
  collect?: Collect;
  title?: string;
}

/** Coleta litúrgica, com o «Amém» destacado. */
export function CollectBlock({ collect, title }: CollectBlockProps) {
  if (!collect) return null;
  const text = collect.text;
  const amenIndex = text.lastIndexOf('Amém');

  return (
    <div className="collect">
      <p className="collect-title">{title ?? collect.title}</p>
      <p>
        {amenIndex > 0 ? (
          <>
            {text.slice(0, amenIndex).trim()}{' '}
            <span className="collect-amen">Amém.</span>
          </>
        ) : (
          text
        )}
      </p>
    </div>
  );
}

export function CollectById({ id, title }: { id: string; title?: string }) {
  const collect = getCollect(id);
  if (!collect) return null;
  return <CollectBlock collect={collect} title={title} />;
}
