import Button from '../common/Button';
import Icon from '../common/Icon';
import Panel from '../common/Panel';
import SegmentedControl from '../common/SegmentedControl';
import { classNames, percent } from '../../utils/format';

const SPEEDS = [
  { value: 0.5, label: '0.5×' },
  { value: 1, label: '1×' },
  { value: 2, label: '2×' },
];

const PHASE_ICON = {
  encapsulate: 'arrowDown',
  transmit: 'zap',
  decapsulate: 'arrowUp',
  delivered: 'check',
  idle: 'clock',
};

/** Timeline of every step plus playback controls. */
export default function ProgressPanel({
  steps,
  currentIndex,
  progress,
  isPlaying,
  hasStarted,
  isFinished,
  speed,
  onSpeedChange,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onSeek,
}) {
  return (
    <Panel
      icon="gauge"
      title="Progress"
      subtitle={hasStarted ? `${percent(progress)} complete` : 'Waiting to start'}
      className="progress"
      bodyClassName="progress__body"
      actions={
        <>
          <Button
            icon="prev"
            size="sm"
            variant="ghost"
            title="Previous step"
            onClick={onStepBack}
            disabled={currentIndex <= 0}
          />
          <Button
            icon={isPlaying ? 'pause' : 'play'}
            size="sm"
            variant="ghost"
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={onTogglePlay}
            disabled={isFinished}
          />
          <Button
            icon="next"
            size="sm"
            variant="ghost"
            title="Next step"
            onClick={onStepForward}
            disabled={isFinished}
          />
        </>
      }
    >
      <div className="progress__bar" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
        <span className="progress__fill" style={{ width: percent(progress) }} />
      </div>

      <div className="progress__speed">
        <span className="field-label">Speed</span>
        <SegmentedControl
          label="Playback speed"
          size="sm"
          options={SPEEDS}
          value={speed}
          onChange={onSpeedChange}
        />
      </div>

      <ol className="timeline">
        {steps.map((step, index) => {
          const state = index === currentIndex ? 'active' : index < currentIndex ? 'done' : 'pending';
          return (
            <li key={step.id} className={classNames('timeline__item', `is-${state}`)}>
              <button
                type="button"
                className="timeline__button"
                style={{ '--layer-color': step.layer?.color ?? 'var(--accent)' }}
                onClick={() => onSeek(index)}
              >
                <span className="timeline__dot">
                  {state === 'done' ? <Icon name="check" size={10} /> : null}
                </span>
                <span className="timeline__text">
                  <span className="timeline__title">{step.title}</span>
                  <span className="timeline__meta">
                    <Icon name={PHASE_ICON[step.phase]} size={10} />
                    {step.phaseLabel}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
