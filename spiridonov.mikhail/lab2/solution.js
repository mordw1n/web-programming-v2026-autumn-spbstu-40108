export function reverseWords(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Входной параметр должен быть строкой');
  }

  return str
    .split(' ')
    .map((word) => word.split('').reverse().join(''))
    .join(' ');
}
