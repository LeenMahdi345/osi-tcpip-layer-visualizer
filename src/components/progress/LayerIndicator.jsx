import Icon from '../common/Icon';
import Panel from '../common/Panel';
import { packetSummary } from '../../utils/encapsulation';
import { classNames } from '../../utils/format';

const PHASE_META = {
  idle: { label: 'Idle', icon: 'clock' },
  encapsulate: { label: 'Encapsulating at sender', icon: 'arrowDown' },
  transmit: { label: 'Travelling across the wire', icon: 'zap' },
  decapsulate: { label: 'Decapsulating at receiver', icon: 'arrowUp' },
  delivered: { label: 'Message delivered', icon: 'check' },
};

/** Big "what is happening right now" card that sits between the two stacks. */
export default function LayerIndicator({ step, protocol }) {
  const phase = PHASE_META[step.phase] ?? PHASE_META.idle;
  const layer = step.layer;
  const accent = layer?.color ?? 'var(--accent)';

  return (
    <Panel
      icon={phase.icon}
      title="Current layer"
      subtitle={phase.label}
      accent={accent}
      actions={
        <span className="chip chip--mono">
          {step.index + 1} / {step.total}
        </span>
      }
      className={classNames('indicator', `indicator--${step.phase}`)}
    >
      <div className="indicator__head" style={{ '--layer-color': accent }}>
        {layer ? <span className="indicator__number">{layer.number}</span> : null}
        <div>
          <h3 className="indicator__title">{step.title}</h3>
          <p className="indicator__purpose">{layer ? layer.purpose : step.description}</p>
        </div>
      </div>

      <dl className="indicator__facts">
        <div>
          <dt>Protocol</dt>
          <dd className="mono">{layer ? layer.exampleProtocol(protocol) : protocol.name}</dd>
        </div>
        <div>
          <dt>Data unit</dt>
          <dd className="mono">{layer ? layer.unit : 'Bits'}</dd>
        </div>
        <div>
          <dt>{step.phase === 'decapsulate' ? 'Header removed' : 'Header added'}</dt>
          <dd className="mono">
            {step.blocks?.length ? step.blocks.map((block) => block.label).join(' + ') : '—'}
          </dd>
        </div>
      </dl>

      {layer ? <p className="indicator__narration">{step.description}</p> : null}

      <div className="indicator__packet">
        <span className="field-label">Packet right now</span>
        <code>{packetSummary(step.packet) || '—'}</code>
      </div>

      {step.phase === 'delivered' ? (
        <div className="indicator__delivered">
          <Icon name="check" size={16} />
          <div>
            <span className="field-label">Decoded message</span>
            <strong>{step.decodedMessage}</strong>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
