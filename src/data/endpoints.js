/**
 * Fictional sender / receiver identities used across every layer of the
 * simulation. Centralised so the same MAC/IP pair appears in the layer cards,
 * the packet inspector and the narration text.
 */
export const SENDER = {
  label: 'Sender',
  device: 'Leen-Laptop',
  ip: '192.168.1.10',
  mac: 'AA:BB:CC:11:22:33',
  port: 51514,
};

export const RECEIVER = {
  label: 'Receiver',
  device: 'remote-server',
  ip: '8.8.8.8',
  mac: 'FF:EE:DD:44:55:66',
  port: null, // filled in from the selected protocol
};

export const LINK = {
  medium: '1000BASE-T copper (Ethernet)',
  mtu: 1500,
  ttl: 64,
};
