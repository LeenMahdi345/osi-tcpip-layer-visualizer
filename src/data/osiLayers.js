import {
  COLORS,
  buildApplicationHeader,
  buildDataLinkHeader,
  buildDataLinkTrailer,
  buildNetworkHeader,
  buildPhysicalSignal,
  buildPresentationHeader,
  buildSessionHeader,
  buildTransportHeader,
} from './packetBlocks';
import { LINK, RECEIVER, SENDER } from './endpoints';

/**
 * The OSI model, ordered top (7 Application) to bottom (1 Physical) — the same
 * order encapsulation walks through on the sender side.
 *
 * Each layer describes itself completely so the UI never hard-codes layer facts:
 *   number, name, purpose, exampleProtocol(), transformation, colour, icon,
 *   the blocks it adds to the packet, and what it does on the way back up.
 */
export const OSI_LAYERS = [
  {
    id: 'application',
    number: 7,
    name: 'Application',
    unit: 'Data',
    purpose: 'Gives programs a way to ask for a network service.',
    transformation: 'Adds the protocol request line and its headers.',
    icon: 'globe',
    color: COLORS.application,
    exampleProtocol: (protocol) => protocol.name,
    buildBlocks: (ctx) => [buildApplicationHeader(ctx)],
    encapsulate: ({ protocol }) =>
      `${protocol.name} wraps your message in a ${protocol.name} request aimed at ${protocol.host}.`,
    decapsulate: ({ protocol }) =>
      `The server application reads the ${protocol.name} headers and hands the body to the app.`,
  },
  {
    id: 'presentation',
    number: 6,
    name: 'Presentation',
    unit: 'Data',
    purpose: 'Translates, compresses and encrypts data into a common format.',
    transformation: 'Adds character-set, compression and encryption metadata.',
    icon: 'lock',
    color: COLORS.presentation,
    exampleProtocol: (protocol) => (protocol.id === 'dns' ? 'DNS wire format' : 'TLS / UTF-8'),
    buildBlocks: (ctx) => [buildPresentationHeader(ctx)],
    encapsulate: ({ protocol }) =>
      `Text is encoded as ${protocol.presentation.encoding}, compressed, then encrypted with ${protocol.presentation.cipher}.`,
    decapsulate: () => 'Data is decrypted, decompressed and decoded back into readable text.',
  },
  {
    id: 'session',
    number: 5,
    name: 'Session',
    unit: 'Data',
    purpose: 'Opens, synchronises and closes the conversation between hosts.',
    transformation: 'Adds a session identifier and dialog state.',
    icon: 'link',
    color: COLORS.session,
    exampleProtocol: () => 'Sockets / RPC',
    buildBlocks: (ctx) => [buildSessionHeader(ctx)],
    encapsulate: () => 'A session is opened and tagged with SESS-4F2A9C so replies can be matched.',
    decapsulate: () => 'The session ID is matched to an open conversation and the tag is stripped.',
  },
  {
    id: 'transport',
    number: 4,
    name: 'Transport',
    unit: 'Segment',
    purpose: 'Delivers data to the right process, in order and error-checked.',
    transformation: 'Adds the TCP/UDP header (ports, sequence, checksum).',
    icon: 'shuffle',
    color: COLORS.transport,
    exampleProtocol: (protocol) => protocol.transport,
    encapsulate: ({ protocol }) =>
      `${protocol.transport} splits the data into segments addressed to port ${protocol.port}.`,
    decapsulate: ({ protocol }) =>
      `${protocol.transport} verifies the checksum, reorders segments and delivers them to port ${protocol.port}.`,
    buildBlocks: (ctx) => [buildTransportHeader(ctx)],
  },
  {
    id: 'network',
    number: 3,
    name: 'Network',
    unit: 'Packet',
    purpose: 'Finds a route between networks using logical addresses.',
    transformation: 'Adds the IP header (source and destination IP, TTL).',
    icon: 'route',
    color: COLORS.network,
    exampleProtocol: () => 'IPv4 / ICMP',
    buildBlocks: (ctx) => [buildNetworkHeader(ctx)],
    encapsulate: () => `IP addresses the packet ${SENDER.ip} → ${RECEIVER.ip} and sets TTL ${LINK.ttl}.`,
    decapsulate: () =>
      `The destination IP matches ${RECEIVER.ip}, so the IP header is removed and the segment moves up.`,
  },
  {
    id: 'data-link',
    number: 2,
    name: 'Data Link',
    unit: 'Frame',
    purpose: 'Moves frames between devices on the same physical link.',
    transformation: 'Adds MAC addresses plus a frame check sequence.',
    icon: 'cpu',
    color: COLORS.dataLink,
    exampleProtocol: () => 'Ethernet / ARP',
    buildBlocks: (ctx) => [buildDataLinkHeader(ctx), buildDataLinkTrailer(ctx)],
    encapsulate: () => `The packet becomes a frame from ${SENDER.mac} to ${RECEIVER.mac}.`,
    decapsulate: () => 'The FCS is validated, then the Ethernet header and trailer are discarded.',
  },
  {
    id: 'physical',
    number: 1,
    name: 'Physical',
    unit: 'Bits',
    purpose: 'Turns the frame into signals the cable or radio can carry.',
    transformation: 'Encodes the frame as bits on the medium.',
    icon: 'cable',
    color: COLORS.physical,
    exampleProtocol: () => '1000BASE-T',
    buildBlocks: (ctx) => [buildPhysicalSignal(ctx)],
    encapsulate: () => `Bits are line-coded and pushed onto ${LINK.medium}.`,
    decapsulate: () => 'Incoming pulses are sampled and rebuilt into the original bit stream.',
  },
];
