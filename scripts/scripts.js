let scheduleElem = document.querySelectorAll('.schedule__time-block');
let min = document.querySelectorAll('.min');
let hrs = document.querySelectorAll('.hour');
let scheduleList = document.querySelector('.schedule__block');
let savedSchedule = document.querySelector('.saved__schedules');
console.log(scheduleList);



function checkLength(name, num) {
  for (let i = 0; i < name.length; i++) {
    let inputLimit = name[i];
    inputLimit.oninput = function (e) {
      e.preventDefault();
      e.target.value =
        parseInt(e.target.value) < 0 || parseInt(e.target.value) > num || isNaN(e.target.value)
          ? ''
          : e.target.value;
    };
  }
}

function createFunc() {
  checkLength(hrs, 23);
  checkLength(min, 60);
}

createFunc();

document.querySelectorAll('.btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    if (btn.dataset.action === 'edit') {
      btn.dataset.action = 'save';
      let arg = e.target.parentNode;

      for (let nodes of arg.childNodes) {
        if (nodes.tagName === 'INPUT') {
          nodes.disabled = false;
        }
      }
      btn.textContent = 'S';
    } else if (btn.dataset.action === 'save') {
      btn.dataset.action = 'edit';
      let arg = e.target.parentNode;

      for (let nodes of arg.childNodes) {
        if (nodes.tagName === 'INPUT') {
          nodes.disabled = true;
        }
      }
      btn.textContent = 'E';
    }

    console.log(btn.dataset.action);
  });
});

let savedSchedules = document.querySelector('.saved__schedules');
let saves = document.querySelector('.saves');

let count = 1;
function createBtn() {
  let txt = document.createElement('h1');
  txt.textContent = `Рабочий график номер ${count}`;
  let loadButton = document.createElement('button');
  loadButton.classList.add('loadbutton');
  loadButton.textContent = 'Загрузить';

  let loadButtonDiv = document.createElement('div');
  loadButtonDiv.classList.add('sch');
  loadButtonDiv.appendChild(txt);
  loadButtonDiv.appendChild(loadButton);
  count++;
  saves.insertAdjacentElement('afterbegin', loadButtonDiv);

  document.querySelectorAll('.loadbutton').forEach(function (loadButton) {
    loadButton.addEventListener('click', function (e) {
      if (!localStorage.getItem('schedules')) return;
      loadSchedules(JSON.parse(localStorage.getItem('schedules')));
    });
  });
}
function loadSchedules(schedules) {
  scheduleElem.forEach((timeBlock, timeBlockIndex) => {
    Array.from(timeBlock.children).forEach((timeBlockChild, timeBlockChildIndex) => {
      if (timeBlockChild.tagName !== 'INPUT') return;
      const direction = timeBlockChildIndex > 1 ? 'to' : 'from';

      if (timeBlockChild.classList.contains('hour')) {
        timeBlockChild.value = schedules[timeBlockIndex][direction].hour;
      }

      if (timeBlockChild.classList.contains('min')) {
        timeBlockChild.value = schedules[timeBlockIndex][direction].minutes;
      }
    });
  });
}

function saveToLocalStorage() {
  const schedules = [];

  scheduleElem.forEach((timeBlock, index) => {
    const field = {
      from: {
        hour: '',
        minutes: '',
      },
      to: {
        hour: '',
        minutes: '',
      },
    };

    Array.from(timeBlock.children).forEach((timeBlockChild, timeBlockChildIndex) => {
      if (timeBlockChild.tagName !== 'INPUT') return;

      const direction = timeBlockChildIndex > 1 ? 'to' : 'from';

      if (timeBlockChild.classList.contains('hour')) {
        field[direction].hour = timeBlockChild.value;
      }

      if (timeBlockChild.classList.contains('min')) {
        field[direction].minutes = timeBlockChild.value;
      }
    });

    schedules.push(field);
  });

  localStorage.setItem('schedules', JSON.stringify(schedules));
}

document.querySelector('.savebtn').addEventListener('click', function (e) {
  e.preventDefault();

  saveToLocalStorage();

  createBtn();
});
