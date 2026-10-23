export function getZodiacSign(input, day) {
  let month;
  let date;

  if (
    input instanceof Date ||
    Object.prototype.toString.call(input) === '[object Date]'
  ) {
    const d = input;
    if (isNaN(d.getTime())) {
      return 'Некорректная дата';
    }
    month = d.getMonth() + 1;
    date = d.getDate();
  } else if (arguments.length === 2) {
    month = input;
    date = day;
    if (
      !Number.isInteger(month) ||
      !Number.isInteger(date) ||
      month < 1 ||
      month > 12 ||
      date < 1 ||
      date > 31
    ) {
      return 'Некорректная дата';
    }
  } else {
    return 'Некорректная дата';
  }

  if (month === 2 && date > 29) {
    return 'Некорректная дата';
  }
  if ([4, 6, 9, 11].includes(month) && date > 30) {
    return 'Некорректная дата';
  }

  if ((month === 1 && date >= 20) || (month === 2 && date <= 18)) {
    return 'Водолей';
  } else if ((month === 2 && date >= 19) || (month === 3 && date <= 20)) {
    return 'Рыбы';
  } else if ((month === 3 && date >= 21) || (month === 4 && date <= 19)) {
    return 'Овен';
  } else if ((month === 4 && date >= 20) || (month === 5 && date <= 20)) {
    return 'Телец';
  } else if ((month === 5 && date >= 21) || (month === 6 && date <= 20)) {
    return 'Близнецы';
  } else if ((month === 6 && date >= 21) || (month === 7 && date <= 22)) {
    return 'Рак';
  } else if ((month === 7 && date >= 23) || (month === 8 && date <= 22)) {
    return 'Лев';
  } else if ((month === 8 && date >= 23) || (month === 9 && date <= 22)) {
    return 'Дева';
  } else if ((month === 9 && date >= 23) || (month === 10 && date <= 22)) {
    return 'Весы';
  } else if ((month === 10 && date >= 23) || (month === 11 && date <= 21)) {
    return 'Скорпион';
  } else if ((month === 11 && date >= 22) || (month === 12 && date <= 21)) {
    return 'Стрелец';
  } else if ((month === 12 && date >= 22) || (month === 1 && date <= 19)) {
    return 'Козерог';
  } else {
    return 'Некорректная дата';
  }
}
