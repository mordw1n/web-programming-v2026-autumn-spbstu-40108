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

    const topRow = document.createElement('div');
    topRow.className = 'user-card-top';

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

    topRow.appendChild(info);
    topRow.appendChild(deleteBtn);
    card.appendChild(topRow);

    const friendsBlock = document.createElement('div');
    friendsBlock.className = 'friends-block';

    const friendsHeader = document.createElement('div');
    friendsHeader.className = 'friends-header';

    const friendsTitle = document.createElement('span');
    friendsTitle.textContent = 'Список друзей:';
    friendsHeader.appendChild(friendsTitle);

    const friendsChips = document.createElement('div');
    friendsChips.className = 'friends-chips';

    if (user.friends.length === 0) {
      const noFriends = document.createElement('span');
      noFriends.className = 'no-friends-text';
      noFriends.textContent = 'нет друзей';
      friendsChips.appendChild(noFriends);
    } else {
      user.friends.forEach((friendId) => {
        const chip = document.createElement('span');
        chip.className = 'friend-chip';
        chip.textContent = `ID: ${friendId}`;

        const removeFriendBtn = document.createElement('button');
        removeFriendBtn.className = 'btn-remove-friend';
        removeFriendBtn.setAttribute('type', 'button');
        removeFriendBtn.setAttribute('title', 'Удалить друга');
        removeFriendBtn.dataset.action = 'remove-friend';
        removeFriendBtn.dataset.userId = String(user.id);
        removeFriendBtn.dataset.friendId = String(friendId);
        removeFriendBtn.textContent = '×';

        chip.appendChild(removeFriendBtn);
        friendsChips.appendChild(chip);
      });
    }

    friendsHeader.appendChild(friendsChips);
    friendsBlock.appendChild(friendsHeader);

    const addFriendForm = document.createElement('form');
    addFriendForm.className = 'add-friend-form';
    addFriendForm.dataset.userId = String(user.id);

    const friendInput = document.createElement('input');
    friendInput.className = 'form-input form-input-sm';
    friendInput.type = 'number';
    friendInput.placeholder = 'ID друга';
    friendInput.required = true;

    const addFriendBtn = document.createElement('button');
    addFriendBtn.className = 'btn btn-secondary btn-sm';
    addFriendBtn.type = 'submit';
    addFriendBtn.textContent = '+ Добавить друга';

    addFriendForm.appendChild(friendInput);
    addFriendForm.appendChild(addFriendBtn);
    friendsBlock.appendChild(addFriendForm);

    card.appendChild(friendsBlock);
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

    if (users.some((u) => u.id === id)) {
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
      return;
    }

    const removeFriendBtn = target.closest('[data-action="remove-friend"]');
    if (
      removeFriendBtn instanceof HTMLElement &&
      removeFriendBtn.dataset.userId &&
      removeFriendBtn.dataset.friendId
    ) {
      const userId = Number(removeFriendBtn.dataset.userId);
      const friendId = Number(removeFriendBtn.dataset.friendId);
      const targetUser = users.find((u) => u.id === userId);

      if (targetUser) {
        setTimeout(() => {
          targetUser.removeFriend(friendId);
          saveUsers();
          renderUsers();
        }, ASYNC_DELAY_MS);
      }
    }
  });

  list.addEventListener('submit', (event) => {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) {
      return;
    }

    const userId = Number(target.dataset.userId);
    const input = target.querySelector('input[type="number"]');
    if (!input) {
      return;
    }

    const friendId = Number(input.value);
    const targetUser = users.find((u) => u.id === userId);

    if (!targetUser || !friendId) {
      return;
    }

    setTimeout(() => {
      try {
        targetUser.addFriend(friendId);
        saveUsers();
        renderUsers();
      } catch (err) {
        console.warn('Не удалось добавить друга:', err);
      }
    }, ASYNC_DELAY_MS);
  });
}

renderUsers();
