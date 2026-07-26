# Network Layer Visualizer — OSI & TCP/IP

An interactive, animated web app that shows exactly what happens to a message as it travels from a sender to a receiver across a network — layer by layer, header by header.

Type a message, pick a protocol, press **Send**, and watch it get wrapped on the way down the sender's stack, cross the wire, and get unwrapped on the way up the receiver's stack until the original text appears again.

> This is an **educational visualization**. No sockets are opened and no packets leave your machine — every address, port and header is simulated so the process can be paused, replayed and inspected.

---

## Main concepts covered

### OSI model (7 layers)

| # | Layer | Adds on the way down |
|---|-------|----------------------|
| 7 | Application | Protocol request line and headers (HTTP / DNS / SMTP) |
| 6 | Presentation | Character set, compression, encryption metadata |
| 5 | Session | Session identifier and dialog state |
| 4 | Transport | TCP/UDP header — ports, sequence, checksum |
| 3 | Network | IP header — source/destination IP, TTL |
| 2 | Data Link | MAC addresses + frame check sequence (FCS) |
| 1 | Physical | Line-coded bits on the medium |

### TCP/IP model (4 layers)

| # | Layer | OSI equivalent |
|---|-------|----------------|
| 4 | Application | OSI 7 · 6 · 5 |
| 3 | Transport | OSI 4 |
| 2 | Internet | OSI 3 |
| 1 | Network Access | OSI 2 · 1 |

### Encapsulation & decapsulation

Each layer wraps the data it receives from the layer above in its own header — the packet grows as it descends:

```
Payload
→ [HTTP] Payload
→ [Session][Encoding][HTTP] Payload
→ [TCP][Session][Encoding][HTTP] Payload
→ [IP][TCP][Session][Encoding][HTTP] Payload
→ [Ethernet][IP][TCP][Session][Encoding][HTTP] Payload [FCS]
```

At the receiver the process runs in reverse — each layer reads its own header, strips it, and passes the rest upward. Switching between the OSI and TCP/IP views puts **byte-identical frames on the wire**; only the grouping of responsibilities changes. That's the point the toggle is there to make.

---

## Features

- **Two reference models** — switch between OSI (7 layers) and TCP/IP (4 layers); the whole visualization reshapes, and TCP/IP layers show which OSI layers they absorb.
- **Three real protocols** — HTTP, DNS and SMTP, each with realistic headers (`GET / HTTP/1.1` · `Host:` · `User-Agent:` / `Transaction ID` · `Query Name` · `Query Type` / `MAIL FROM` · `RCPT TO` · `DATA`).
- **Transport awareness** — HTTP and SMTP travel over TCP (sequence numbers, flags, window); DNS travels over UDP (no sequence, stateless session).
- **Step-by-step encapsulation** — every layer shows its number, purpose, protocol in use, the header it adds and the resulting packet.
- **Live Packet Inspector** — the complete packet at any instant, outermost header first, with expandable field-level detail and a "just added" / "next" indicator.
- **Decapsulation with explanations** — the receiver mirrors the sender and reports exactly which header was stripped at each layer.
- **Animated wire** — a glowing packet crosses an animated transmission line, its travel time bound to the actual step duration.
- **Full playback control** — play, pause, step forward/back, jump to any step from the timeline, and 0.5× / 1× / 2× speed.
- **Progress panel** — overall completion plus a clickable timeline of all 17 (OSI) or 11 (TCP/IP) steps.
- **Live packet size** — byte counts recomputed as headers are added and removed.
- **Modern dark UI** — colour-coded layers, hover reveals, glow effects, gradient progress, smooth transitions, and a `prefers-reduced-motion` fallback.
- **Responsive** — three columns on desktop, two on tablet, single column on mobile.

---

## Technologies used

| Technology | Purpose |
|---|---|
| **React 19** | Component architecture and state |
| **Vite 8** | Dev server and production build |
| **JavaScript (ES modules)** | Application logic — no TypeScript required |
| **Plain CSS** | Design tokens, custom properties, grid/flex layout, keyframe animations |
| **Inline SVG** | Hand-written icon set — zero icon dependencies |
| **Oxlint** | Linting |

No UI framework, no animation library, no icon package — runtime dependencies are React and React DOM only.

---

## Running it locally

**Requirements:** Node.js 20.19+ (or 22.12+) and npm.

```bash
# 1. Clone
git clone https://github.com/LeenMahdi345/osi-tcpip-layer-visualizer.git
cd osi-tcpip-layer-visualizer

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL Vite prints (usually <http://localhost:5173>).

### Other scripts

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run lint      # run Oxlint
```

---

## Project structure

```
src/
├── animations/
│   ├── animations.css        # every keyframe, plus reduced-motion guard
│   ├── timeline.js           # builds the ordered step list for a run
│   └── useSimulation.js      # playback engine (play/pause/step/seek/speed)
├── components/
│   ├── common/               # reusable primitives
│   │   ├── Button.jsx
│   │   ├── Icon.jsx          # inline SVG icon set
│   │   ├── Panel.jsx         # the card every panel is built from
│   │   └── SegmentedControl.jsx
│   ├── controls/
│   │   ├── ControlBar.jsx    # message + protocol + send/reset
│   │   └── MessageInput.jsx
│   ├── inspector/
│   │   ├── PacketBlock.jsx   # one header/payload/trailer row
│   │   └── PacketInspector.jsx
│   ├── layout/
│   │   └── AppHeader.jsx     # title + OSI/TCP-IP toggle
│   ├── progress/
│   │   ├── LayerIndicator.jsx# "what is happening right now"
│   │   └── ProgressPanel.jsx # progress bar + timeline + playback
│   ├── stack/
│   │   ├── LayerCard.jsx     # one layer in a stack
│   │   └── LayerStack.jsx    # a sender or receiver node
│   └── wire/
│       └── Wire.jsx          # the transmission medium
├── data/
│   ├── endpoints.js          # simulated sender/receiver identities
│   ├── models.js             # model registry (OSI / TCP-IP)
│   ├── osiLayers.js          # the 7 OSI layers
│   ├── packetBlocks.js       # header/trailer/payload builders
│   ├── protocols.js          # HTTP, DNS, SMTP definitions
│   └── tcpIpLayers.js        # the 4 TCP/IP layers
├── styles/
│   ├── index.css             # single stylesheet entry point
│   ├── tokens.css            # design tokens (colour, spacing, motion)
│   ├── global.css            # base styles + app layout
│   ├── controls.css
│   ├── layers.css
│   ├── wire.css
│   ├── inspector.css
│   └── progress.css
├── utils/
│   ├── encapsulation.js      # packet snapshots: add/remove blocks
│   ├── format.js             # byte length, bit preview, class names
│   └── layers.js             # per-direction layer wording and status
├── App.jsx                   # composition root
└── main.jsx                  # React entry point
```

### How it fits together

1. **`data/`** describes layers and protocols declaratively — every layer knows its own purpose, colour, icon and which packet blocks it contributes. Both models share one interface, so components never branch on which model is active.
2. **`utils/encapsulation.js`** treats a packet as plain data (`headers[] / payload / trailers / signal`); adding a header prepends, removing one filters.
3. **`animations/timeline.js`** walks the stack once and produces a list of self-contained snapshots — one per step.
4. **`animations/useSimulation.js`** only moves an index through that list, which is why stepping backwards and scrubbing work without any reverse-animation logic.
5. **`components/`** render whatever snapshot is current.

---

## Screenshots

<!-- Add screenshots or a GIF here -->

| | |
|---|---|
| _Encapsulation at the sender_ | _Transmission across the wire_ |
| `docs/screenshot-encapsulation.png` | `docs/screenshot-wire.png` |
| _Decapsulation at the receiver_ | _TCP/IP (4-layer) view_ |
| `docs/screenshot-decapsulation.png` | `docs/screenshot-tcpip.png` |

---

## Future improvements

- **More protocols** — FTP, SSH, DHCP, ARP and ICMP (ping) walkthroughs.
- **Routers and hops** — send the packet through intermediate devices so TTL decrements and MAC addresses are rewritten per hop while the IP addresses stay put.
- **Fragmentation** — messages larger than the MTU split into multiple fragments and reassemble at the receiver.
- **TCP handshake and teardown** — animate SYN / SYN-ACK / ACK before the data and FIN afterwards.
- **Error scenarios** — corrupted FCS, TTL expiry, dropped segments and retransmission.
- **Real hex dump view** — a byte-accurate representation next to the field view.
- **Export** — download the run as a `.pcap`-style JSON or share a permalink of a specific step.
- **Quiz mode** — hide a layer's name and ask the learner which one adds a given header.
- **Bidirectional flow** — animate the response travelling back from server to client.
- **Light theme toggle** — the token layer already supports it; it just needs a switch in the UI.
- **Localisation** — the layer explanations are the only text that would need translating.

---

## License

Released for educational use.
