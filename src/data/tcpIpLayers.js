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
 * The TCP/IP (DoD) model, ordered top to bottom.
 *
 * It uses the exact same layer shape as OSI_LAYERS, so every component works
 * with either model. The difference is only in how the work is grouped:
 *   - Application    = OSI 7 + 6 + 5
 *   - Transport      = OSI 4
 *   - Internet       = OSI 3
 *   - Network Access = OSI 2 + 1
 */
export const TCP_IP_LAYERS = [
  {
    id: 'application',
    number: 4,
    name: 'Application',
    unit: 'Data',
    osiEquivalent: 'OSI 7 · 6 · 5',
    purpose: 'Everything the app itself does: formatting, encoding and sessions.',
    transformation: 'Adds protocol headers, encoding metadata and session state.',
    icon: 'globe',
    color: COLORS.application,
    exampleProtocol: (protocol) => `${protocol.name} / TLS`,
    buildBlocks: (ctx) => [
      buildApplicationHeader(ctx),
      buildPresentationHeader(ctx),
      buildSessionHeader(ctx),
    ],
    encapsulate: ({ protocol }) =>
      `${protocol.name} builds the request, encodes it as ${protocol.presentation.encoding} and tags the session — TCP/IP folds OSI 7, 6 and 5 into this one layer.`,
    decapsulate: ({ protocol }) =>
      `The server strips the session tag, decrypts and decodes the bytes, then parses the ${protocol.name} request.`,
  },
  {
    id: 'transport',
    number: 3,
    name: 'Transport',
    unit: 'Segment',
    osiEquivalent: 'OSI 4',
    purpose: 'Delivers data to the right process, in order and error-checked.',
    transformation: 'Adds the TCP/UDP header (ports, sequence, checksum).',
    icon: 'shuffle',
    color: COLORS.transport,
    exampleProtocol: (protocol) => protocol.transport,
    buildBlocks: (ctx) => [buildTransportHeader(ctx)],
    encapsulate: ({ protocol }) =>
      `${protocol.transport} segments the data and addresses it to port ${protocol.port}.`,
    decapsulate: ({ protocol }) =>
      `${protocol.transport} checks the checksum, reassembles the stream and delivers it to port ${protocol.port}.`,
  },
  {
    id: 'internet',
    number: 2,
    name: 'Internet',
    unit: 'Packet',
    osiEquivalent: 'OSI 3',
    purpose: 'Routes packets between networks using IP addresses.',
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
    id: 'network-access',
    number: 1,
    name: 'Network Access',
    unit: 'Frame / Bits',
    osiEquivalent: 'OSI 2 · 1',
    purpose: 'Frames the packet for the local link and puts it on the medium.',
    transformation: 'Adds MAC addresses and a checksum, then encodes the bits.',
    icon: 'cable',
    color: COLORS.dataLink,
    exampleProtocol: () => 'Ethernet / 1000BASE-T',
    buildBlocks: (ctx) => [
      buildDataLinkHeader(ctx),
      buildDataLinkTrailer(ctx),
      buildPhysicalSignal(ctx),
    ],
    encapsulate: () =>
      `The packet becomes a frame from ${SENDER.mac} to ${RECEIVER.mac}, then leaves as pulses on ${LINK.medium}.`,
    decapsulate: () =>
      'Pulses are sampled back into bits, the FCS is validated and the Ethernet header and trailer are removed.',
  },
];
