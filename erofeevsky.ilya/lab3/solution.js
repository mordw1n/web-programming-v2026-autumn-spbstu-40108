export function sortByFrequency(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Input must be an array');
  }
  const countMap = new Map();
  for (const num of arr) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }
  return [...arr].sort((a, b) => {
    const freqA = countMap.get(a);
    const freqB = countMap.get(b);
    if (freqB !== freqA) {
      return freqB - freqA;
    }
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }
    return String(a).localeCompare(String(b));
  });
}
