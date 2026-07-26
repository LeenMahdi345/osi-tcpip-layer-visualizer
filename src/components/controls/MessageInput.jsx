import Icon from '../common/Icon';
import { byteLength } from '../../utils/format';

const MAX_LENGTH = 120;

/** Single-line message field with a live byte counter. */
export default function MessageInput({ value, onChange, onSubmit, disabled }) {
  return (
    <div className="message-input">
      <Icon name="terminal" size={16} className="message-input__icon" />
      <input
        type="text"
        value={value}
        maxLength={MAX_LENGTH}
        disabled={disabled}
        placeholder="Type a message, e.g. Hello World"
        aria-label="Message to send"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSubmit?.();
        }}
      />
      <span className="message-input__count">{byteLength(value)} B</span>
    </div>
  );
}
