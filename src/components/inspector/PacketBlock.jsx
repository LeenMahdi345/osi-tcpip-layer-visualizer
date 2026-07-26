import Icon from '../common/Icon';
import { classNames } from '../../utils/format';

const KIND_LABEL = {
  header: 'Header',
  trailer: 'Trailer',
  payload: 'Payload',
  signal: 'Physical',
};

const FLAG_TEXT = {
  added: 'added',
  next: 'next',
  payload: 'payload',
};

/** One header / payload / trailer row inside the Packet Inspector. */
export default function PacketBlock({ block, isNew, depth, flag = 'added' }) {
  return (
    <li
      className={classNames('pblock', `pblock--${block.kind}`, isNew && 'is-new')}
      style={{ '--block-color': block.color, '--depth': depth }}
    >
      <div className="pblock__bar" aria-hidden="true" />
      <div className="pblock__body">
        <div className="pblock__top">
          <span className="pblock__label">{block.label}</span>
          <span className="pblock__kind">{KIND_LABEL[block.kind] ?? block.kind}</span>
        </div>
        <p className="pblock__summary">{block.summary}</p>
        <dl className="pblock__fields">
          {block.fields.map(([key, value]) => (
            <div key={key} className="pblock__field">
              <dt>{key}</dt>
              <dd className="mono">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {isNew ? (
        <span className="pblock__flag">
          <Icon name={flag === 'added' ? 'zap' : 'arrowUp'} size={11} />
          {FLAG_TEXT[flag] ?? flag}
        </span>
      ) : null}
    </li>
  );
}
