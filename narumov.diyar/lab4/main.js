import {
  ClothingItem,
  findItemsAboveColorCount,
  findItemsByColor,
  getUniqueColors,
  groupItemsByColorCount,
  groupItemsBySize,
} from './model.js';

const STORAGE_KEY = 'lab4-clothing-items';
const ASYNC_DELAY = 300;

const itemForm = document.querySelector('form[data-testid="entity-form"]');
const submitButton = itemForm.querySelector('button[type="submit"]');
const itemList = document.querySelector('[data-testid="entity-list"]');
const statusOutput = document.querySelector('[data-status]');
const colorFilter = document.querySelector('[data-color-filter]');
const countFilter = document.querySelector('[data-count-filter]');
const uniqueColorsOutput = document.querySelector('[data-unique-colors]');
const bySizeOutput = document.querySelector('[data-by-size]');
const byColorCountOutput = document.querySelector('[data-by-color-count]');
const itemsByColorOutput = document.querySelector('[data-items-by-color]');
const itemsAboveOutput = document.querySelector('[data-items-above]');

let items = loadItems();

function showStatus(message, isError) {
  statusOutput.textContent = message;
  statusOutput.classList.toggle('status-error', isError);
}

function createInitialItems() {
  return [
    new ClothingItem(1, 'Футболка', 'M', ['белый', 'черный']),
    new ClothingItem(2, 'Джинсы', 'L', ['синий']),
    new ClothingItem(3, 'Худи', 'M', ['серый', 'черный', 'зеленый']),
  ];
}

function loadItems() {
  let stored;

  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    return createInitialItems();
  }

  if (stored === null) {
    return createInitialItems();
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return createInitialItems();
    }

    return parsed.map(
      (item) => new ClothingItem(item.id, item.name, item.size, item.colors),
    );
  } catch {
    return createInitialItems();
  }
}

function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    throw new Error('Не удалось сохранить данные в local storage');
  }
}

function findItemById(id) {
  const item = items.find((entry) => entry.id === id);

  if (item === undefined) {
    throw new Error(`Товар с ID ${id} не найден`);
  }

  return item;
}

function runAsync(change) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(change());
      } catch (error) {
        reject(error);
      }
    }, ASYNC_DELAY);
  });
}

function applyChange(change, successMessage, control) {
  control.disabled = true;
  showStatus('Выполняется…', false);

  return runAsync(() => {
    change();
    saveItems();
  })
    .then(() => {
      render();
      showStatus(successMessage, false);
    })
    .catch((error) => {
      showStatus(error.message, true);
    })
    .finally(() => {
      control.disabled = false;
    });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  element.className = className;

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function createColorList(item) {
  const colorList = createElement('ul', 'color-list');

  for (const color of item.colors) {
    const colorItem = createElement('li', 'color-item');
    const removeButton = createElement(
      'button',
      'button button-small',
      'Удалить цвет',
    );

    removeButton.type = 'button';
    removeButton.dataset.action = 'remove-color';
    removeButton.dataset.color = color;

    colorItem.append(createElement('span', 'color-name', color));
    colorItem.append(removeButton);
    colorList.append(colorItem);
  }

  return colorList;
}

function createColorForm() {
  const colorForm = createElement('form', 'color-form');
  const label = createElement('label', 'field');
  const input = createElement('input', 'field-control');
  const addButton = createElement(
    'button',
    'button button-small',
    'Добавить цвет',
  );

  input.type = 'text';
  input.name = 'color';
  input.required = true;
  addButton.type = 'submit';

  label.append(createElement('span', 'field-label', 'Новый цвет'));
  label.append(input);
  colorForm.append(label);
  colorForm.append(addButton);

  return colorForm;
}

function createCard(item) {
  const card = createElement('article', 'card');
  const deleteButton = createElement(
    'button',
    'button button-danger',
    'Удалить товар',
  );

  card.dataset.testid = 'entity-card';
  card.dataset.id = item.id;

  card.append(createElement('h3', 'card-title', item.name));
  card.append(createElement('p', 'card-row', `ID: ${item.id}`));
  card.append(createElement('p', 'card-row', `Размер: ${item.size}`));
  card.append(createElement('p', 'card-row', `Цветов: ${item.colorsCount}`));

  if (item.colorsCount === 0) {
    card.append(createElement('p', 'card-row', 'Цвета не добавлены'));
  } else {
    card.append(createColorList(item));
  }

  card.append(createColorForm());

  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  card.append(deleteButton);

  return card;
}

function renderList() {
  itemList.textContent = '';

  if (items.length === 0) {
    itemList.append(createElement('p', 'empty', 'Список пуст'));

    return;
  }

  for (const item of items) {
    itemList.append(createCard(item));
  }
}

function formatNames(list) {
  if (list.length === 0) {
    return 'нет';
  }

  return list.map((item) => item.name).join(', ');
}

function formatGroups(groups, suffix) {
  if (groups.size === 0) {
    return 'нет';
  }

  const parts = [];

  for (const [key, group] of groups) {
    parts.push(`${key}${suffix} — ${group.length}`);
  }

  return parts.join(', ');
}

function renderFilters() {
  const colors = getUniqueColors(items);
  const selected = colorFilter.value;

  colorFilter.textContent = '';
  colorFilter.disabled = colors.length === 0;

  if (colors.length === 0) {
    const placeholder = createElement('option', 'filter-option', 'нет цветов');

    placeholder.value = '';
    colorFilter.append(placeholder);
  }

  for (const color of colors) {
    const option = createElement('option', 'filter-option', color);

    option.value = color;
    colorFilter.append(option);
  }

  if (colors.includes(selected)) {
    colorFilter.value = selected;
  }

  if (colorFilter.value === '') {
    itemsByColorOutput.textContent = 'нет';
  } else {
    itemsByColorOutput.textContent = formatNames(
      findItemsByColor(items, colorFilter.value),
    );
  }

  itemsAboveOutput.textContent = formatNames(
    findItemsAboveColorCount(items, Number(countFilter.value)),
  );
}

function renderSummary() {
  const colors = getUniqueColors(items);

  uniqueColorsOutput.textContent =
    colors.length === 0 ? 'нет' : colors.join(', ');
  bySizeOutput.textContent = formatGroups(groupItemsBySize(items), '');
  byColorCountOutput.textContent = formatGroups(
    groupItemsByColorCount(items),
    ' цв.',
  );

  renderFilters();
}

function render() {
  renderList();
  renderSummary();
}

itemForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(itemForm);
  const id = Number(formData.get('id'));
  const name = String(formData.get('name')).trim();
  const size = String(formData.get('size'));

  submitButton.disabled = true;
  showStatus('Выполняется…', false);

  runAsync(() => {
    if (items.some((item) => item.id === id)) {
      throw new Error(`Товар с ID ${id} уже существует`);
    }

    items.push(new ClothingItem(id, name, size));
    saveItems();
  })
    .then(() => {
      itemForm.reset();
      render();
      showStatus(`Товар «${name}» добавлен`, false);
    })
    .catch((error) => {
      showStatus(error.message, true);
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});

itemList.addEventListener('submit', (event) => {
  event.preventDefault();

  const card = event.target.closest('[data-testid="entity-card"]');

  if (card === null) {
    return;
  }

  const id = Number(card.dataset.id);
  const color = String(new FormData(event.target).get('color')).trim();
  const control = event.target.querySelector('button[type="submit"]');

  event.target.reset();

  applyChange(
    () => {
      findItemById(id).addColor(color);
    },
    `Цвет «${color}» добавлен`,
    control,
  );
});

itemList.addEventListener('click', (event) => {
  const card = event.target.closest('[data-testid="entity-card"]');

  if (card === null) {
    return;
  }

  const id = Number(card.dataset.id);
  const deleteButton = event.target.closest('[data-testid="delete-entity"]');

  if (deleteButton !== null) {
    applyChange(
      () => {
        const item = findItemById(id);

        items = items.filter((entry) => entry !== item);
      },
      'Товар удалён',
      deleteButton,
    );

    return;
  }

  const removeButton = event.target.closest('[data-action="remove-color"]');

  if (removeButton !== null) {
    const color = removeButton.dataset.color;

    applyChange(
      () => {
        findItemById(id).removeColor(color);
      },
      `Цвет «${color}» удалён`,
      removeButton,
    );
  }
});

colorFilter.addEventListener('change', renderSummary);
countFilter.addEventListener('input', renderSummary);

try {
  saveItems();
} catch (error) {
  showStatus(error.message, true);
}

render();
