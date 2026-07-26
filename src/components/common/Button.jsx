import Icon from './Icon';
import { classNames } from '../../utils/format';

/**
 * Single button component with variants, so Send / Reset / playback controls all
 * share hover, focus and disabled behaviour.
 */
export default function Button({
  children,
  icon,
  iconRight,
  variant = 'default',
  size = 'md',
  title,
  disabled,
  onClick,
  type = 'button',
}) {
  const iconOnly = !children;

  return (
    <button
      type={type}
      title={title}
      aria-label={iconOnly ? title : undefined}
      disabled={disabled}
      onClick={onClick}
      className={classNames('btn', `btn--${variant}`, `btn--${size}`, iconOnly && 'btn--icon')}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}
