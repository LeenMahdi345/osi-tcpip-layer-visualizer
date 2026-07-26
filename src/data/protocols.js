import { RECEIVER, SENDER } from './endpoints';

/**
 * Application protocols the user can simulate.
 *
 * Every protocol declares:
 *  - how it is carried (transport = TCP or UDP, plus the well known port)
 *  - the request line / header fields it would realistically put on the wire
 *  - how the user message is framed inside the payload
 *
 * `buildHeaderFields(message)` returns [label, value] pairs so the UI can render
 * a protocol header without knowing anything protocol specific.
 */
export const PROTOCOLS = {
  http: {
    id: 'http',
    name: 'HTTP',
    fullName: 'HyperText Transfer Protocol',
    icon: 'globe',
    color: '#38bdf8',
    transport: 'TCP',
    port: 80,
    host: 'example.com',
    summary: 'Requests a web resource from a server.',
    presentation: { encoding: 'UTF-8 text', cipher: 'TLS 1.3 (AES-256-GCM)' },
    buildHeaderFields: (message) => [
      ['Request-Line', 'GET / HTTP/1.1'],
      ['Host', 'example.com'],
      ['User-Agent', 'OSI-Visualizer/1.0'],
      ['Accept', 'text/html'],
      ['Content-Length', String(new TextEncoder().encode(message).length)],
    ],
    buildPayload: (message) => message,
    payloadLabel: 'HTTP body',
  },

  dns: {
    id: 'dns',
    name: 'DNS',
    fullName: 'Domain Name System',
    icon: 'search',
    color: '#a78bfa',
    transport: 'UDP',
    port: 53,
    host: 'dns.google',
    summary: 'Resolves a hostname into an IP address.',
    presentation: { encoding: 'DNS wire format (labels)', cipher: 'None (plain UDP)' },
    buildHeaderFields: (message) => [
      ['Transaction ID', '0x1A2B'],
      ['Flags', '0x0100 (standard query, recursion desired)'],
      ['Questions', '1'],
      ['Query Name', toQueryName(message)],
      ['Query Type', 'A (IPv4 address)'],
      ['Query Class', 'IN (Internet)'],
    ],
    buildPayload: (message) => `QNAME=${toQueryName(message)} QTYPE=A QCLASS=IN`,
    payloadLabel: 'DNS question section',
  },

  smtp: {
    id: 'smtp',
    name: 'SMTP',
    fullName: 'Simple Mail Transfer Protocol',
    icon: 'mail',
    color: '#f472b6',
    transport: 'TCP',
    port: 25,
    host: 'mail.example.com',
    summary: 'Hands an e-mail message to a mail server.',
    presentation: { encoding: 'US-ASCII + Base64 body', cipher: 'STARTTLS' },
    buildHeaderFields: () => [
      ['EHLO', SENDER.device],
      ['MAIL FROM', '<leen@example.com>'],
      ['RCPT TO', '<student@example.com>'],
      ['DATA', 'Subject: Layer demo'],
    ],
    buildPayload: (message) => `${message}\r\n.`,
    payloadLabel: 'Mail body (DATA)',
  },
};

export const PROTOCOL_LIST = Object.values(PROTOCOLS);

export const DEFAULT_PROTOCOL_ID = 'http';

/** Turns any free text message into something that looks like a DNS QNAME. */
function toQueryName(message) {
  const slug = message
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24);
  return `${slug || 'hello'}.example.com`;
}

/** Convenience: the destination socket a protocol targets. */
export function destinationSocket(protocol) {
  return `${RECEIVER.ip}:${protocol.port}`;
}
