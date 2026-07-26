/** Helpers that describe a layer relative to the current simulation state. */

export const LAYER_STATUS = {
  pending: 'pending',
  active: 'active',
  done: 'done',
};

/**
 * Wording for what a layer does in a given direction. The sender adds headers,
 * the receiver removes them, so the same layer data reads correctly on both sides.
 */
export function transformationFor(layer, mode) {
  if (mode !== 'decapsulate') return layer.transformation;

  return layer.transformation
    .replace(/^Adds\b/, 'Removes')
    .replace(/^Encodes\b/, 'Decodes')
    .replace(/^Turns\b/, 'Rebuilds');
}

export function narrationFor(layer, mode, context) {
  return mode === 'decapsulate' ? layer.decapsulate(context) : layer.encapsulate(context);
}

/** Status of one layer inside a stack, given the layers already processed. */
export function layerStatus(layerId, { activeLayerId, completedLayerIds }) {
  if (layerId === activeLayerId) return LAYER_STATUS.active;
  if (completedLayerIds?.has(layerId)) return LAYER_STATUS.done;
  return LAYER_STATUS.pending;
}
