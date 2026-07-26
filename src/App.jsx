import { useMemo, useState } from 'react';
import AppHeader from './components/layout/AppHeader';
import ControlBar from './components/controls/ControlBar';
import LayerStack from './components/stack/LayerStack';
import Wire from './components/wire/Wire';
import LayerIndicator from './components/progress/LayerIndicator';
import ProgressPanel from './components/progress/ProgressPanel';
import PacketInspector from './components/inspector/PacketInspector';
import { useSimulation } from './animations/useSimulation';
import { DEFAULT_MODEL_ID, getModel } from './data/models';
import { DEFAULT_PROTOCOL_ID, PROTOCOLS } from './data/protocols';
import { RECEIVER, SENDER } from './data/endpoints';

const DEFAULT_MESSAGE = 'Hello World';

export default function App() {
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [protocolId, setProtocolId] = useState(DEFAULT_PROTOCOL_ID);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const model = getModel(modelId);
  const protocol = PROTOCOLS[protocolId];

  // Stable context object so the timeline is only rebuilt on real input changes.
  const context = useMemo(() => ({ protocol, message }), [protocol, message]);

  const simulation = useSimulation(model, context);
  const { step } = simulation;

  const canSend = message.trim().length > 0;
  const isRunning = simulation.isPlaying;

  const handleReset = () => {
    simulation.reset();
    setMessage(DEFAULT_MESSAGE);
  };

  return (
    <div className="app">
      <AppHeader
        model={model}
        modelId={modelId}
        onModelChange={setModelId}
        disabled={isRunning}
      />

      <ControlBar
        message={message}
        onMessageChange={setMessage}
        protocolId={protocolId}
        onProtocolChange={setProtocolId}
        protocol={protocol}
        onSend={simulation.start}
        onReset={handleReset}
        isRunning={isRunning}
        canSend={canSend}
      />

      <div className="app__stage">
        <LayerStack
          title="Sender"
          icon="laptop"
          endpoint={SENDER}
          model={model}
          protocol={protocol}
          mode="encapsulate"
          activeLayerId={step.senderActiveLayerId}
          completedLayerIds={step.senderDoneIds}
          isBusy={step.phase === 'encapsulate'}
        />

        <div className="app__center">
          <LayerIndicator step={step} protocol={protocol} />
          <Wire
            travel={step.travel}
            phase={step.phase}
            protocol={protocol}
            isLive={simulation.hasStarted && !simulation.isFinished}
            durationMs={step.phase === 'transmit' ? step.durationMs / simulation.speed : 400}
          />
        </div>

        <LayerStack
          title="Receiver"
          icon="server"
          endpoint={RECEIVER}
          model={model}
          protocol={protocol}
          mode="decapsulate"
          activeLayerId={step.receiverActiveLayerId}
          completedLayerIds={step.receiverDoneIds}
          isBusy={step.phase === 'decapsulate'}
          deliveredMessage={step.decodedMessage}
        />
      </div>

      <div className="app__lower">
        <PacketInspector
          packet={step.packet}
          highlightIds={step.highlightIds}
          highlightLabel={step.highlightLabel}
          removedLabels={step.removedLabels}
        />
        <ProgressPanel
          steps={simulation.steps}
          currentIndex={simulation.index}
          progress={simulation.progress}
          isPlaying={simulation.isPlaying}
          hasStarted={simulation.hasStarted}
          isFinished={simulation.isFinished}
          speed={simulation.speed}
          onSpeedChange={simulation.setSpeed}
          onTogglePlay={simulation.togglePlay}
          onStepBack={simulation.stepBack}
          onStepForward={simulation.stepForward}
          onSeek={simulation.seek}
        />
      </div>
    </div>
  );
}
