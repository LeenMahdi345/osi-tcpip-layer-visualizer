import Icon from '../common/Icon';
import { classNames } from '../../utils/format';
import { transformationFor } from '../../utils/layers';

/**
 * One layer in a stack. Renders everything Step 5 asks for: number, name,
 * purpose, protocol in use and the header this layer adds (or removes).
 */
export default function LayerCard({ layer, protocol, status, mode, onSelect }) {
  const isActive = status === 'active';

  return (
    <article
      className={classNames('layer-card', `is-${status}`)}
      style={{ '--layer-color': layer.color }}
      aria-current={isActive ? 'step' : undefined}
      onClick={onSelect ? () => onSelect(layer) : undefined}
    >
      <span className="layer-card__number">{layer.number}</span>

      <div className="layer-card__main">
        <div className="layer-card__top">
          <h3 className="layer-card__name">
            <Icon name={layer.icon} size={14} />
            {layer.name}
          </h3>
          <span className="chip chip--mono layer-card__protocol">{layer.exampleProtocol(protocol)}</span>
        </div>

        <p className="layer-card__purpose">{layer.purpose}</p>

        <div className="layer-card__meta">
          <span className="layer-card__unit">{layer.unit}</span>
          {layer.osiEquivalent && <span className="layer-card__unit">{layer.osiEquivalent}</span>}
          <span className="layer-card__transform">
            <Icon name={mode === 'decapsulate' ? 'arrowUp' : 'arrowDown'} size={12} />
            {transformationFor(layer, mode)}
          </span>
        </div>
      </div>

      <span className="layer-card__status" aria-hidden="true">
        {status === 'done' ? <Icon name="check" size={13} /> : null}
        {isActive ? <span className="layer-card__pulse" /> : null}
      </span>
    </article>
  );
}
