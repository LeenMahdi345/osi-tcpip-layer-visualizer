/** Small formatting helpers shared by the data model and the UI. */

export function byteLength(text) {
  return new TextEncoder().encode(String(text)).length;
}

/** First few characters of a string rendered as binary, for the physical layer. */
export function toBitPreview(text, charCount = 6) {
  const bits = Array.from(String(text).slice(0, charCount))
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
  return `${bits} …`;
}

export function truncate(text, max = 48) {
  const value = String(text);
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function percent(value) {
  return `${Math.round(value * 100)}%`;
}

export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}
