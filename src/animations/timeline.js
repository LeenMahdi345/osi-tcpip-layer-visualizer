import { layersBottomUp } from '../data/models';
import {
  addBlocks,
  createPayloadOnlyPacket,
  removeBlocks,
} from '../utils/encapsulation';
import { narrationFor } from '../utils/layers';

/**
 * Turns a (model, protocol, message) triple into the ordered list of steps the
 * animation plays back:
 *
 *   0            Ready to send (idle)
 *   1 … n        Encapsulation — one step per layer, top → bottom
 *   n + 1        Transmission across the wire
 *   n + 2 … 2n+1 Decapsulation — one step per layer, bottom → top
 *   last         Delivered — the decoded message
 *
 * Every step is a complete, self-contained snapshot: which layer is active on
 * which side, which blocks changed, the full packet at that instant, and where
 * the dot sits on the wire. The playback hook only moves an index; nothing has
 * to be recomputed while animating.
 */

const DURATIONS = {
  idle: 0,
  encapsulate: 1200,
  transmit: 1700,
  decapsulate: 1200,
  delivered: 1400,
};

export function buildTimeline(model, context) {
  const { message, protocol } = context;
  const steps = [];

  const idlePacket = createPayloadOnlyPacket(context);

  steps.push({
    id: 'idle',
    phase: 'idle',
    phaseLabel: 'Idle',
    side: 'sender',
    layer: null,
    blocks: [],
    packet: idlePacket,
    travel: 0,
    title: 'Ready to send',
    description: `"${message}" is still plain data in the application. Press Send to walk it down the ${model.name} stack.`,
    highlightIds: [idlePacket.payload.id],
    highlightLabel: 'payload',
    senderDoneIds: new Set(),
    receiverDoneIds: new Set(),
    senderActiveLayerId: null,
    receiverActiveLayerId: null,
  });

  // ---- Encapsulation: down the sender stack -------------------------------
  let packet = idlePacket;
  const senderDone = [];

  model.layers.forEach((layer) => {
    const blocks = layer.buildBlocks(context);
    packet = addBlocks(packet, blocks);
    senderDone.push(layer.id);

    steps.push({
      id: `encapsulate-${layer.id}`,
      phase: 'encapsulate',
      phaseLabel: `Sender · L${layer.number}`,
      side: 'sender',
      layer,
      blocks,
      packet,
      travel: 0,
      title: `${layer.number}. ${layer.name}`,
      description: narrationFor(layer, 'encapsulate', context),
      highlightIds: blocks.map((block) => block.id),
      highlightLabel: 'added',
      senderDoneIds: new Set(senderDone),
      receiverDoneIds: new Set(),
      senderActiveLayerId: layer.id,
      receiverActiveLayerId: null,
    });
  });

  const framePacket = packet;
  const allSenderDone = new Set(senderDone);

  // ---- Transmission -------------------------------------------------------
  steps.push({
    id: 'transmit',
    phase: 'transmit',
    phaseLabel: 'Wire',
    side: 'wire',
    layer: null,
    blocks: [],
    packet: framePacket,
    travel: 1,
    title: 'Across the wire',
    description: `The fully wrapped frame leaves as ${protocol.transport} traffic and races to the receiver as electrical pulses. No header changes on the way — only the physical signal.`,
    highlightIds: [],
    senderDoneIds: allSenderDone,
    receiverDoneIds: new Set(),
    senderActiveLayerId: null,
    receiverActiveLayerId: null,
  });

  // ---- Decapsulation: up the receiver stack -------------------------------
  const receiverDone = [];

  layersBottomUp(model).forEach((layer) => {
    const blocks = layer.buildBlocks(context);
    packet = removeBlocks(packet, blocks);
    receiverDone.push(layer.id);

    steps.push({
      id: `decapsulate-${layer.id}`,
      phase: 'decapsulate',
      phaseLabel: `Receiver · L${layer.number}`,
      side: 'receiver',
      layer,
      blocks,
      packet,
      travel: 1,
      title: `${layer.number}. ${layer.name}`,
      description: narrationFor(layer, 'decapsulate', context),
      // Highlight what is now exposed and will be handled by the layer above.
      highlightIds: [packet.headers[0]?.id ?? packet.payload.id],
      highlightLabel: packet.headers.length ? 'next' : 'payload',
      removedLabels: blocks.map((block) => block.label),
      senderDoneIds: allSenderDone,
      receiverDoneIds: new Set(receiverDone),
      senderActiveLayerId: null,
      receiverActiveLayerId: layer.id,
    });
  });

  // ---- Delivered ----------------------------------------------------------
  steps.push({
    id: 'delivered',
    phase: 'delivered',
    phaseLabel: 'Delivered',
    side: 'receiver',
    layer: null,
    blocks: [],
    packet,
    travel: 1,
    title: 'Message delivered',
    description: `Every header has been stripped. The receiving application reads exactly what was typed — nothing was lost on the way.`,
    highlightIds: [packet.payload.id],
    highlightLabel: 'payload',
    senderDoneIds: allSenderDone,
    receiverDoneIds: new Set(receiverDone),
    senderActiveLayerId: null,
    receiverActiveLayerId: null,
    decodedMessage: message,
  });

  return steps.map((step, index) => ({
    ...step,
    index,
    total: steps.length,
    durationMs: DURATIONS[step.phase],
  }));
}
