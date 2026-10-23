const SIZES = ['S', 'M', 'L', 'XL'];

function assertItems(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('Ожидается массив товаров');
  }
}

export class ClothingItem {
  constructor(id, name, size, colors = []) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new TypeError('ID должен быть целым положительным числом');
    }

    if (typeof name !== 'string' || name.trim() === '') {
      throw new TypeError('Название должно быть непустой строкой');
    }

    if (!SIZES.includes(size)) {
      throw new Error(`Размер должен быть одним из: ${SIZES.join(', ')}`);
    }

    if (!Array.isArray(colors)) {
      throw new TypeError('Цвета должны передаваться массивом');
    }

    this.id = id;
    this.name = name;
    this.size = size;
    this.colors = [...colors];
  }

  get colorsCount() {
    return this.colors.length;
  }

  addColor(color) {
    if (typeof color !== 'string' || color.trim() === '') {
      throw new TypeError('Цвет должен быть непустой строкой');
    }

    if (this.colors.includes(color)) {
      throw new Error(`Цвет «${color}» уже добавлен`);
    }

    this.colors.push(color);
  }

  removeColor(color) {
    const index = this.colors.indexOf(color);

    if (index === -1) {
      throw new Error(`Цвет «${color}» не найден`);
    }

    this.colors.splice(index, 1);
  }
}

export function groupItemsBySize(items) {
  assertItems(items);

  const groups = new Map();

  for (const item of items) {
    if (!groups.has(item.size)) {
      groups.set(item.size, []);
    }

    groups.get(item.size).push(item);
  }

  return groups;
}

export function getUniqueColors(items) {
  assertItems(items);

  const colors = [];

  for (const item of items) {
    for (const color of item.colors) {
      if (!colors.includes(color)) {
        colors.push(color);
      }
    }
  }

  return colors;
}

export function findItemsByColor(items, color) {
  assertItems(items);

  if (typeof color !== 'string') {
    throw new TypeError('Цвет должен быть строкой');
  }

  return items.filter((item) => item.colors.includes(color));
}

export function groupItemsByColorCount(items) {
  assertItems(items);

  const groups = new Map();

  for (const item of items) {
    if (!groups.has(item.colorsCount)) {
      groups.set(item.colorsCount, []);
    }

    groups.get(item.colorsCount).push(item);
  }

  return groups;
}

export function findItemsAboveColorCount(items, count) {
  assertItems(items);

  if (!Number.isFinite(count)) {
    throw new TypeError('Количество цветов должно быть числом');
  }

  return items.filter((item) => item.colorsCount > count);
}
