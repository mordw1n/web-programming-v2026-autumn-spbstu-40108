export function rgbToHex(str) {
  const [r, g, b] = str.match(/\d+/g).map(Number);
  const hex = [r, g, b]
    .map((n) => n.toString(16).toUpperCase().padStart(2, '0'))
    .join('');
  return `#${hex}`;
}
