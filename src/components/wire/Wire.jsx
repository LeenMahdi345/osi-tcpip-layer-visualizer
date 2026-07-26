import Icon from '../common/Icon';
import Panel from '../common/Panel';
import { RECEIVER, SENDER, LINK } from '../../data/endpoints';
import { classNames } from '../../utils/format';

/**
 * The physical medium between the two hosts.
 *
 * `travel` (0 → 1) positions the packet: 0 = still at the sender, 1 = arrived at
 * the receiver. The dot itself is positioned with a CSS custom property so the
 * movement is a cheap transform-only transition.
 */
export default function Wire({ travel, phase, protocol, isLive, durationMs = 480 }) {
  const atSender = travel <= 0.02;
  const atReceiver = travel >= 0.98;

  return (
    <Panel
      icon="cable"
      title="Transmission medium"
      subtitle={LINK.medium}
      actions={<span className="chip chip--mono">{protocol.transport}</span>}
      className="wire-panel"
    >
      <div
        className={classNames('wire', isLive && 'is-live')}
        style={{ '--travel': travel, '--wire-duration': `${durationMs}ms` }}
      >
        <div className={classNames('wire__node', atSender && 'is-hot')}>
          <Icon name="laptop" size={20} />
          <span className="wire__node-label">{SENDER.device}</span>
          <span className="wire__node-sub mono">{SENDER.ip}</span>
        </div>

        <div className="wire__track" role="presentation">
          <span className="wire__line" />
          <span className="wire__flow" />
          <span
            className={classNames('wire__packet', phase === 'transmit' && 'is-flying')}
            style={{ background: protocol.color }}
          >
            <Icon name="package" size={13} />
          </span>
        </div>

        <div className={classNames('wire__node', atReceiver && 'is-hot')}>
          <Icon name="server" size={20} />
          <span className="wire__node-label">{RECEIVER.device}</span>
          <span className="wire__node-sub mono">{RECEIVER.ip}</span>
        </div>
      </div>

      <div className="wire__legend">
        <span>
          <Icon name="arrowDown" size={12} /> Encapsulation
        </span>
        <span>
          <Icon name="zap" size={12} /> {LINK.mtu} byte MTU · TTL {LINK.ttl}
        </span>
        <span>
          <Icon name="arrowUp" size={12} /> Decapsulation
        </span>
      </div>
    </Panel>
  );
}
