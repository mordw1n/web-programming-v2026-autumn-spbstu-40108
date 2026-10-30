export class User {
  constructor(id, name, friends = []) {
    this.id = Number(id);
    this.name = String(name);
    this.friends = Array.isArray(friends)
      ? [...new Set(friends.map(Number))].filter((fId) => fId !== this.id)
      : [];
  }

  get friendCount() {
    return this.friends.length;
  }

  addFriend(friendId) {
    const id = Number(friendId);
    if (id === this.id) {
      throw new Error('Пользователь не может добавить самого себя в друзья.');
    }
    if (!this.friends.includes(id)) {
      this.friends.push(id);
      return true;
    }
    return false;
  }

  removeFriend(friendId) {
    const id = Number(friendId);
    const index = this.friends.indexOf(id);
    if (index !== -1) {
      this.friends.splice(index, 1);
      return true;
    }
    return false;
  }
}

export function groupUsersByFriendCount(users) {
  return users.reduce((acc, user) => {
    const count = user.friendCount;
    if (!acc[count]) {
      acc[count] = [];
    }
    acc[count].push(user);
    return acc;
  }, {});
}

export function getUniqueFriends(users) {
  const all = users.flatMap((user) => user.friends);
  return [...new Set(all)].sort((a, b) => a - b);
}

export function findUsersWithFriend(users, friendId) {
  const targetId = Number(friendId);
  return users.filter((user) => user.friends.includes(targetId));
}

export function findUsersAboveFriendCount(users, minFriends) {
  const min = Number(minFriends);
  return users.filter((user) => user.friendCount > min);
}

export function findUsersWithoutFriends(users) {
  return users.filter((user) => user.friendCount === 0);
}
