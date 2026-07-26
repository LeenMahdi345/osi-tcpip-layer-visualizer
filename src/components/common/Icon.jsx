/**
 * Tiny inline icon set (stroke based, 24x24 grid).
 * Inline SVG keeps the app dependency-free and lets icons inherit `currentColor`.
 */
const PATHS = {
  globe: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M3.6 9h16.8M3.6 15h16.8', 'M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4', 'M12 15v2'],
  link: ['M10.5 13.5 13.5 10.5', 'M11 6.5 12.5 5A4 4 0 0 1 19 9.5L17.5 11', 'M13 17.5 11.5 19A4 4 0 0 1 5 14.5L6.5 13'],
  shuffle: ['M3 7h4.5l9 10H21', 'M3 17h4.5l9-10H21', 'M18 4l3 3-3 3', 'M18 14l3 3-3 3'],
  route: ['M6.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M17.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M14.5 6.5H11a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7H9.5'],
  cpu: ['M7 7h10v10H7z', 'M4.5 4.5h15v15h-15z', 'M9.5 2v2.5M14.5 2v2.5M9.5 19.5V22M14.5 19.5V22M2 9.5h2.5M2 14.5h2.5M19.5 9.5H22M19.5 14.5H22'],
  cable: ['M2 12c2-4.5 4-4.5 6 0s4 4.5 6 0 4-4.5 6 0'],
  send: ['M21.5 2.5 10.5 13.5', 'M21.5 2.5 14.5 22l-4-8.5L2 9.5z'],
  reset: ['M20.5 12a8.5 8.5 0 1 1-2.6-6.1', 'M20.5 3.5v5h-5'],
  play: ['M8 4.5 19 12 8 19.5z'],
  pause: ['M9 5v14M15 5v14'],
  next: ['M6 5l9 7-9 7z', 'M18.5 5v14'],
  prev: ['M18 5l-9 7 9 7z', 'M5.5 5v14'],
  package: ['M12 2.5 3 7.5l9 5 9-5-9-5Z', 'M3 7.5v9l9 5 9-5v-9', 'M12 12.5v9'],
  laptop: ['M4.5 5.5h15v10h-15z', 'M2 19h20', 'M10 19h4'],
  server: ['M3.5 4h17v6h-17z', 'M3.5 14h17v6h-17z', 'M7 7h.01M7 17h.01', 'M11 7h4M11 17h4'],
  search: ['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'M16 16l5 5'],
  mail: ['M3 5.5h18v13H3z', 'm3.5 6.5 8.5 6 8.5-6'],
  layers: ['M12 2.5 3 7l9 4.5L21 7l-9-4.5Z', 'M3 12l9 4.5L21 12', 'M3 16.5 12 21l9-4.5'],
  check: ['M4.5 12.5 9 17 19.5 6.5'],
  shield: ['M12 2.5 20 5.5v6c0 5-4 8.5-8 10-4-1.5-8-5-8-10v-6z', 'M9 12l2 2 4-4'],
  clock: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M12 7.5V12l3 2'],
  zap: ['M13.5 2 4.5 13.5H10l-1.5 8.5 9-11.5H12z'],
  gauge: ['M12 20a8 8 0 1 1 8-8', 'M12 12l4.5-3.5', 'M20 12h-2'],
  arrowDown: ['M12 4.5v15', 'm6.5 14 5.5 5.5L17.5 14'],
  arrowUp: ['M12 19.5v-15', 'm6.5 10 5.5-5.5L17.5 10'],
  terminal: ['M3.5 4.5h17v15h-17z', 'm7 10 2.5 2L7 14', 'M12.5 14.5h4'],
  info: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M12 11v5', 'M12 8h.01'],
};

export default function Icon({ name, size = 18, strokeWidth = 1.6, className, title }) {
  const paths = PATHS[name] ?? PATHS.info;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
