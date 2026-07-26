import { OSI_LAYERS } from './osiLayers';
import { TCP_IP_LAYERS } from './tcpIpLayers';

/**
 * Registry of the reference models the visualizer can render.
 * Layers are always stored top-down (Application first), which is the order
 * encapsulation follows on the sender side.
 */
export const MODELS = {
  osi: {
    id: 'osi',
    name: 'OSI',
    fullName: 'OSI Reference Model',
    description: '7 conceptual layers — the teaching model.',
    layers: OSI_LAYERS,
  },
  tcpip: {
    id: 'tcpip',
    name: 'TCP/IP',
    fullName: 'TCP/IP Model',
    description: '4 practical layers — what the internet actually runs.',
    layers: TCP_IP_LAYERS,
  },
};

export const MODEL_LIST = Object.values(MODELS);

export const DEFAULT_MODEL_ID = 'osi';

export function getModel(modelId) {
  return MODELS[modelId] ?? MODELS[DEFAULT_MODEL_ID];
}

/** Layers ordered bottom-up (Physical first) — the receiver's decapsulation order. */
export function layersBottomUp(model) {
  return [...model.layers].reverse();
}
