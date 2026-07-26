import { LINK, RECEIVER, SENDER } from './endpoints';
import { toBitPreview, byteLength } from '../utils/format';

/**
 * Builders for the individual pieces of a packet ("blocks").
 *
 * A block is the unit the Packet Inspector renders:
 *   { id, label, kind, color, summary, fields }
 *
 * kind:
 *   'header'  -> prepended in front of everything already built (encapsulation)
 *   'trailer' -> appended after the payload (e.g. the Ethernet FCS)
 *   'payload' -> the user data being carried
 *   'signal'  -> not really a header, the physical representation of the frame
 *
 * Every builder takes the same context object so layers can stay declarative:
 *   { protocol, message }
 */

export const COLORS = {
  application: '#38bdf8',
  presentation: '#22d3ee',
  session: '#a78bfa',
  transport: '#34d399',
  network: '#fbbf24',
  dataLink: '#fb7185',
  physical: '#94a3b8',
  payload: '#e2e8f0',
};

export function buildPayloadBlock({ protocol, message }) {
  const payload = protocol.buildPayload(message);
  return {
    id: 'payload',
    label: protocol.payloadLabel,
    kind: 'payload',
    color: COLORS.payload,
    summary: 'The user data every layer below is wrapping.',
    fields: [
      ['Data', payload],
      ['Size', `${byteLength(payload)} bytes`],
    ],
  };
}

export function buildApplicationHeader({ protocol, message }) {
  return {
    id: 'app-header',
    label: `${protocol.name} Header`,
    kind: 'header',
    color: COLORS.application,
    summary: protocol.summary,
    fields: protocol.buildHeaderFields(message),
  };
}

export function buildPresentationHeader({ protocol, message }) {
  const { encoding, cipher } = protocol.presentation;
  return {
    id: 'presentation-header',
    label: 'Encoding / Encryption',
    kind: 'header',
    color: COLORS.presentation,
    summary: 'Agrees on a byte representation both sides understand.',
    fields: [
      ['Charset', encoding],
      ['Encryption', cipher],
      ['Compression', 'gzip'],
      ['Encoded length', `${byteLength(message)} bytes`],
    ],
  };
}

export function buildSessionHeader({ protocol }) {
  // Connectionless protocols (DNS over UDP) have no real session to keep, so the
  // session layer only correlates a request with its reply.
  const isStateful = protocol.transport === 'TCP';

  return {
    id: 'session-header',
    label: 'Session Info',
    kind: 'header',
    color: COLORS.session,
    summary: isStateful
      ? 'Identifies and keeps track of this conversation.'
      : 'Correlates the reply with this request — no connection is kept.',
    fields: [
      ['Session ID', isStateful ? 'SESS-4F2A9C' : 'txid 0x1A2B'],
      ['Mode', isStateful ? 'Full-duplex' : 'Request / response'],
      ['Dialog', `${SENDER.device} ↔ ${protocol.host}`],
      ['State', isStateful ? 'ESTABLISHED' : 'Stateless'],
    ],
  };
}

export function buildTransportHeader({ protocol, message }) {
  const isTcp = protocol.transport === 'TCP';
  const fields = [
    ['Source Port', String(SENDER.port)],
    ['Destination Port', String(protocol.port)],
    ['Length', `${byteLength(message) + (isTcp ? 20 : 8)} bytes`],
    ['Checksum', '0x8B3D'],
  ];

  if (isTcp) {
    fields.splice(
      2,
      0,
      ['Sequence Number', '1024'],
      ['Ack Number', '2048'],
      ['Flags', 'PSH, ACK'],
      ['Window', '64240'],
    );
  }

  return {
    id: 'transport-header',
    label: `${protocol.transport} Header`,
    kind: 'header',
    color: COLORS.transport,
    summary: isTcp
      ? 'Reliable, ordered delivery between two ports.'
      : 'Connectionless, low-overhead delivery between two ports.',
    fields,
  };
}

export function buildNetworkHeader({ protocol, message }) {
  return {
    id: 'network-header',
    label: 'IP Header',
    kind: 'header',
    color: COLORS.network,
    summary: 'Carries the packet across networks using logical addresses.',
    fields: [
      ['Version', 'IPv4'],
      ['Source IP', SENDER.ip],
      ['Destination IP', RECEIVER.ip],
      ['Protocol', `${protocol.transport} (${protocol.transport === 'TCP' ? 6 : 17})`],
      ['TTL', String(LINK.ttl)],
      ['Total Length', `${byteLength(message) + 40} bytes`],
    ],
  };
}

export function buildDataLinkHeader() {
  return {
    id: 'frame-header',
    label: 'Ethernet Header',
    kind: 'header',
    color: COLORS.dataLink,
    summary: 'Delivers the frame to the next device on the local link.',
    fields: [
      ['Destination MAC', RECEIVER.mac],
      ['Source MAC', SENDER.mac],
      ['EtherType', '0x0800 (IPv4)'],
      ['MTU', `${LINK.mtu} bytes`],
    ],
  };
}

export function buildDataLinkTrailer() {
  return {
    id: 'frame-trailer',
    label: 'Ethernet Trailer (FCS)',
    kind: 'trailer',
    color: COLORS.dataLink,
    summary: 'Checksum that lets the receiver detect a corrupted frame.',
    fields: [['Frame Check Sequence', '0x1C4D2E9A']],
  };
}

export function buildPhysicalSignal({ protocol, message }) {
  const sample = `${protocol.name}:${message}`;
  return {
    id: 'physical-signal',
    label: 'Physical Signal',
    kind: 'signal',
    color: COLORS.physical,
    summary: 'The whole frame as electrical pulses on the medium.',
    fields: [
      ['Medium', LINK.medium],
      ['Encoding', '4D-PAM5 line code'],
      ['Bit rate', '1 Gbit/s'],
      ['Bits', toBitPreview(sample)],
    ],
  };
}
