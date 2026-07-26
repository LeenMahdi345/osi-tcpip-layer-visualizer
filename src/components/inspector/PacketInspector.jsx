import Icon from '../common/Icon';
import Panel from '../common/Panel';
import PacketBlock from './PacketBlock';
import { flattenPacket, packetSummary, totalPacketBytes } from '../../utils/encapsulation';
import { classNames } from '../../utils/format';

/**
 * Live view of the complete packet: every header currently wrapped around the
 * payload, outermost first — exactly what a sniffer would show.
 */
export default function PacketInspector({ packet, highlightIds = [], highlightLabel, removedLabels }) {
  const blocks = flattenPacket(packet);
  const headerCount = packet?.headers.length ?? 0;
  const highlighted = new Set(highlightIds);

  return (
    <Panel
      icon="package"
      title="Packet Inspector"
      subtitle={`${headerCount} header${headerCount === 1 ? '' : 's'} · ~${totalPacketBytes(packet)} bytes`}
      className="inspector"
      bodyClassName="inspector__body"
    >
      <code className="inspector__summary">{packetSummary(packet) || 'empty'}</code>

      {removedLabels?.length ? (
        <p className="inspector__removed">
          <Icon name="arrowUp" size={12} />
          Stripped at this layer: <strong>{removedLabels.join(', ')}</strong>
        </p>
      ) : null}

      {blocks.length ? (
        <ol className="inspector__list">
          {blocks.map((block, index) => (
            <PacketBlock
              key={block.id}
              block={block}
              depth={block.kind === 'header' ? index : 0}
              isNew={highlighted.has(block.id)}
              flag={highlightLabel}
            />
          ))}
        </ol>
      ) : (
        <p className="empty-note">Nothing captured yet — press Send to build a packet.</p>
      )}

      {packet?.signal ? (
        <div
          className={classNames('inspector__signal', highlighted.has(packet.signal.id) && 'is-new')}
          style={{ '--block-color': packet.signal.color }}
        >
          <span className="field-label">{packet.signal.label}</span>
          <code>{packet.signal.fields.find(([key]) => key === 'Bits')?.[1]}</code>
        </div>
      ) : null}
    </Panel>
  );
}
