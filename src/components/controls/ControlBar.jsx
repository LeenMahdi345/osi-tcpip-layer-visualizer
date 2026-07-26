import Button from '../common/Button';
import Icon from '../common/Icon';
import Panel from '../common/Panel';
import SegmentedControl from '../common/SegmentedControl';
import MessageInput from './MessageInput';
import { PROTOCOL_LIST } from '../../data/protocols';

/** Message input, protocol selector and the Send / Reset actions. */
export default function ControlBar({
  message,
  onMessageChange,
  protocolId,
  onProtocolChange,
  protocol,
  onSend,
  onReset,
  isRunning,
  canSend,
}) {
  const protocolOptions = PROTOCOL_LIST.map((entry) => ({
    value: entry.id,
    label: entry.name,
    icon: entry.icon,
    color: entry.color,
    hint: `${entry.fullName} — ${entry.transport} port ${entry.port}`,
  }));

  return (
    <Panel className="panel--controls">
      <div className="controls">
        <div className="controls__group">
          <span className="field-label">Message</span>
          <MessageInput
            value={message}
            onChange={onMessageChange}
            onSubmit={canSend ? onSend : undefined}
            disabled={isRunning}
          />
        </div>

        <div className="controls__group">
          <span className="field-label">Protocol</span>
          <SegmentedControl
            label="Application protocol"
            options={protocolOptions}
            value={protocolId}
            onChange={onProtocolChange}
            disabled={isRunning}
          />
        </div>

        <div className="controls__group">
          <span className="field-label">Simulation</span>
          <div className="controls__actions">
            <Button icon="send" variant="primary" onClick={onSend} disabled={!canSend}>
              Send
            </Button>
            <Button icon="reset" variant="danger" onClick={onReset} title="Reset simulation">
              Reset
            </Button>
          </div>
        </div>

        <p className="controls__hint">
          <Icon name="info" size={13} />
          {protocol.fullName} travels over {protocol.transport} port {protocol.port} — {protocol.summary}
        </p>
      </div>
    </Panel>
  );
}
