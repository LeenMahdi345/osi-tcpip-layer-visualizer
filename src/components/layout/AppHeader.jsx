import Icon from '../common/Icon';
import SegmentedControl from '../common/SegmentedControl';
import { MODEL_LIST } from '../../data/models';

/** Top bar: product identity plus the OSI / TCP-IP model toggle. */
export default function AppHeader({ modelId, onModelChange, model, disabled }) {
  const options = MODEL_LIST.map((entry) => ({
    value: entry.id,
    label: `${entry.name} · ${entry.layers.length}`,
    icon: 'layers',
    hint: entry.description,
  }));

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark">
          <Icon name="layers" size={22} strokeWidth={1.8} />
        </span>
        <div>
          <h1 className="app-header__title">Network Layer Visualizer</h1>
          <p className="app-header__tagline">
            Watch a message get encapsulated, travel the wire and be decoded again.
          </p>
        </div>
      </div>

      <div className="app-header__meta">
        <span className="chip chip--accent">
          <Icon name="info" size={12} />
          {model.fullName}
        </span>
        <div className="app-header__model">
          <span className="field-label">Reference model</span>
          <SegmentedControl
            label="Reference model"
            options={options}
            value={modelId}
            onChange={onModelChange}
            disabled={disabled}
          />
        </div>
      </div>
    </header>
  );
}
