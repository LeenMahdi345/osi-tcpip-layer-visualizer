import Icon from './Icon';
import { classNames } from '../../utils/format';

/** Reusable card used by every panel in the app (header + body + optional actions). */
export default function Panel({
  icon,
  title,
  subtitle,
  actions,
  accent,
  flush = false,
  className,
  bodyClassName,
  children,
}) {
  return (
    <section className={classNames('panel', className)}>
      {(title || actions) && (
        <header className="panel__header">
          {icon && (
            <span
              className="panel__icon"
              style={accent ? { color: accent, background: `${accent}1f` } : undefined}
            >
              <Icon name={icon} size={16} />
            </span>
          )}
          <div className="panel__titles">
            {title && <h2 className="panel__title">{title}</h2>}
            {subtitle && <p className="panel__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="panel__actions">{actions}</div>}
        </header>
      )}
      <div className={classNames('panel__body', flush && 'panel__body--flush', bodyClassName)}>
        {children}
      </div>
    </section>
  );
}
