import Icon from '../common/Icon';
import Panel from '../common/Panel';
import LayerCard from './LayerCard';
import { layerStatus } from '../../utils/layers';

/**
 * A sender or receiver node: device identity plus its layer stack.
 *
 * Both sides render the same `model.layers` array (Application at the top) so
 * layers line up visually; only the arrow direction and the active/done
 * highlighting differ.
 */
export default function LayerStack({
  title,
  icon,
  endpoint,
  model,
  protocol,
  mode,
  activeLayerId,
  completedLayerIds,
  isBusy,
  onSelectLayer,
  deliveredMessage,
}) {
  return (
    <Panel
      icon={icon}
      title={title}
      subtitle={`${endpoint.device} · ${endpoint.ip}`}
      actions={
        <span className="chip chip--mono">
          <Icon name={mode === 'decapsulate' ? 'arrowUp' : 'arrowDown'} size={11} />
          {mode === 'decapsulate' ? 'Decapsulate' : 'Encapsulate'}
        </span>
      }
      className={isBusy ? 'panel--busy' : undefined}
      bodyClassName="layer-stack"
    >
      {model.layers.map((layer) => (
        <LayerCard
          key={layer.id}
          layer={layer}
          protocol={protocol}
          mode={mode}
          status={layerStatus(layer.id, { activeLayerId, completedLayerIds })}
          onSelect={onSelectLayer}
        />
      ))}

      {deliveredMessage ? (
        <div className="layer-stack__delivered">
          <Icon name="check" size={14} />
          <span className="field-label">Received</span>
          <code>{deliveredMessage}</code>
        </div>
      ) : null}

      <footer className="layer-stack__footer">
        <span className="mono">{endpoint.mac}</span>
        <span className="mono">
          {mode === 'decapsulate' ? 'in' : 'out'} :{endpoint.port ?? protocol.port}
        </span>
      </footer>
    </Panel>
  );
}
