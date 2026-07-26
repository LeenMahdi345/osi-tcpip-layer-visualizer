import { buildPayloadBlock } from '../data/packetBlocks';

/**
 * Pure helpers that turn (model, protocol, message) into packet snapshots.
 *
 * A packet snapshot is:
 *   {
 *     headers:  [outermost … innermost]  // prepended as we walk down the stack
 *     payload:  block                    // the user data
 *     trailers: [innermost … outermost]  // appended (e.g. the Ethernet FCS)
 *     signal:   block | null             // physical representation, if reached
 *   }
 *
 * Encapsulation prepends headers on the way down; decapsulation removes them on
 * the way up. Because both directions are plain data transforms, the animation
 * layer only has to pick the right snapshot for the current step.
 */

export function createPayloadOnlyPacket(context) {
  return {
    headers: [],
    payload: buildPayloadBlock(context),
    trailers: [],
    signal: null,
  };
}

/** Applies one layer's blocks to a packet, returning a new snapshot. */
export function addBlocks(packet, blocks) {
  const next = {
    ...packet,
    headers: [...packet.headers],
    trailers: [...packet.trailers],
  };

  blocks.forEach((block) => {
    if (block.kind === 'header') next.headers.unshift(block);
    else if (block.kind === 'trailer') next.trailers.push(block);
    else if (block.kind === 'signal') next.signal = block;
  });

  return next;
}

/** Removes one layer's blocks from a packet (the receiver side). */
export function removeBlocks(packet, blocks) {
  const removedIds = new Set(blocks.map((block) => block.id));
  const removesSignal = blocks.some((block) => block.kind === 'signal');

  return {
    ...packet,
    headers: packet.headers.filter((block) => !removedIds.has(block.id)),
    trailers: packet.trailers.filter((block) => !removedIds.has(block.id)),
    signal: removesSignal ? null : packet.signal,
  };
}

/**
 * Walks the whole sender stack once and returns, for every layer, the blocks it
 * adds and the resulting packet. Used by both the timeline and the UI previews.
 */
export function buildEncapsulationStages(model, context) {
  let packet = createPayloadOnlyPacket(context);

  return model.layers.map((layer) => {
    const blocks = layer.buildBlocks(context);
    packet = addBlocks(packet, blocks);
    return { layer, blocks, packet };
  });
}

/** Flat, top-to-bottom list of blocks for the Packet Inspector. */
export function flattenPacket(packet) {
  if (!packet) return [];
  return [...packet.headers, packet.payload, ...packet.trailers].filter(Boolean);
}

/** Compact one-line representation, e.g. "[Ethernet][IP][TCP][HTTP] Hello". */
export function packetSummary(packet) {
  if (!packet) return '';
  const tags = packet.headers.map((block) => `[${shortLabel(block)}]`).join('');
  const trailers = packet.trailers.map(() => '[FCS]').join('');
  const body = packet.payload?.fields?.[0]?.[1] ?? '';
  return `${tags} ${body} ${trailers}`.trim();
}

function shortLabel(block) {
  return block.label.replace(/\s*Header$/, '');
}

export function totalPacketBytes(packet) {
  return flattenPacket(packet).reduce((sum, block) => sum + estimateBlockBytes(block), 0);
}

function estimateBlockBytes(block) {
  const sizeField = block.fields?.find(([key]) => /size|length/i.test(key));
  const parsed = sizeField ? parseInt(sizeField[1], 10) : NaN;
  if (!Number.isNaN(parsed)) return parsed;
  return block.kind === 'trailer' ? 4 : 20;
}
