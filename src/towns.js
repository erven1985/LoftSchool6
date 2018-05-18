/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загруки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
const newDiv = document.createElement('div');
const newDiv2 = document.createElement('div');
const newList = document.createElement('ul');
const newInput = document.createElement('input');
let towns;

newDiv.innerText = "Загрузка..."
newDiv.setAttribute('id', 'loading-block')
newDiv2.setAttribute('id','filter-block')
newDiv2.setAttribute('style','display:none')
newList.setAttribute('id','filter-result')

newInput.setAttribute('type','text')
newInput.setAttribute('placeholder','название города')
newInput.setAttribute('id','filter-input')

homeworkContainer.appendChild(newDiv);
homeworkContainer.appendChild(newDiv2);
newDiv2.appendChild(newInput);
newDiv2.appendChild(newList);

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
    xhr.send();
    xhr.addEventListener('load', function() {
      let towns = JSON.parse(xhr.responseText).sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        let comparison = 0;
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        }
        return comparison;
      });
      resolve(towns)
    })
  })
}


/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
  let term = chunk.toUpperCase(), 
      town = full.toUpperCase()
  return town.includes(term);
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let promise = loadTowns();
let allTowns = []

promise.then(towns => {
  loadingBlock.style.display = 'none';
  filterBlock.style.display = 'block';
  allTowns = towns;
  })



filterInput.addEventListener('keyup', function() {
    // это обработчик нажатия кливиш в текстовом поле

    filterResult.innerHTML = '';

    let inputValue = filterInput.value;

    if(!inputValue) {
      return ;
    } 

    let filtered = allTowns.filter(town => {
      return isMatching(town.name, inputValue)
    });

    filtered.forEach(town => {
      let newElement = document.createElement('li');
      newElement.innerText = town.name;
      newList.appendChild(newElement)
    })


});

export {
    loadTowns,
    isMatching
};
