import {User} from './model.js';

const STORAGE_KEY = 'users';
const ASYNC_DELAY_MS = 80;

let users = loadUsers();

const form = document.querySelector('form[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        return data.map((item) => new User(item.id, item.name, item.friends));
      }
    }
  } catch (error) {
    console.error('Ошибка чтения из localStorage:', error);
  }

  return [
    new User(1, 'Алексей Смирнов', [2]),
    new User(2, 'Мария Кузнецова', [1]),
  ];
}

function saveUsers() {
  try {
    const payload = JSON.stringify(
      users.map((user) => ({
        id: user.id,
        name: user.name,
        friends: user.friends,
      })),
    );
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (error) {
    console.error('Ошибка записи в localStorage:', error);
  }
}

function renderUsers() {
  if (!list) {
    return;
  }

  list.innerHTML = '';

  if (users.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-message';
    empty.textContent = 'Список пользователей пуст.';
    list.appendChild(empty);
    return;
  }

  users.forEach((user) => {
    const card = document.createElement('article');
    card.className = 'user-card';
    card.setAttribute('data-testid', 'entity-card');

    const info = document.createElement('div');
    info.className = 'user-info';

    const name = document.createElement('span');
    name.className = 'user-name';
    name.textContent = `${user.name} (ID: ${user.id})`;

    const meta = document.createElement('span');
    meta.className = 'user-meta';
    meta.textContent = `Друзей: ${user.friendCount}`;

    info.appendChild(name);
    info.appendChild(meta);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.setAttribute('data-testid', 'delete-entity');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.dataset.userId = String(user.id);
    deleteBtn.textContent = 'Удалить';

    card.appendChild(info);
    card.appendChild(deleteBtn);
    list.appendChild(card);
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const idInput = form.querySelector('[name="id"]');
    const nameInput = form.querySelector('[name="name"]');

    if (!idInput || !nameInput) {
      return;
    }

    const id = Number(idInput.value);
    const name = nameInput.value.trim();

    if (!id || !name) {
      return;
    }

    form.reset();

    // Асинхронное добавление сущности через setTimeout
    setTimeout(() => {
      users.push(new User(id, name, []));
      saveUsers();
      renderUsers();
    }, ASYNC_DELAY_MS);
  });
}

if (list) {
  list.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const deleteBtn = target.closest('[data-testid="delete-entity"]');
    if (deleteBtn instanceof HTMLElement && deleteBtn.dataset.userId) {
      const targetId = Number(deleteBtn.dataset.userId);

      // Асинхронное удаление сущности через setTimeout
      setTimeout(() => {
        users = users.filter((u) => u.id !== targetId);
        saveUsers();
        renderUsers();
      }, ASYNC_DELAY_MS);
    }
  });
}

renderUsers();
