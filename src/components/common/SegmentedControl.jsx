import Icon from './Icon';
import { classNames } from '../../utils/format';

/**
 * Reusable pill switch — used for both the OSI/TCP-IP model toggle and the
 * protocol selector, so the two controls stay visually consistent.
 *
 * options: [{ value, label, icon?, hint?, color? }]
 */
export default function SegmentedControl({ options, value, onChange, label, size = 'md', disabled }) {
  return (
    <div
      className={classNames('segmented', `segmented--${size}`, disabled && 'is-disabled')}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            title={option.hint}
            disabled={disabled}
            className={classNames('segmented__option', isActive && 'is-active')}
            style={isActive && option.color ? { '--segment-accent': option.color } : undefined}
            onClick={() => onChange(option.value)}
          >
            {option.icon && <Icon name={option.icon} size={14} />}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
