/*свертывание меню мобильной версии*/

let navMain = document.querySelector('.main-nav');
let navToggle = document.querySelector('.main-nav__button');
let map = document.querySelector('.address__map');

navMain.classList.remove('main-nav--nojs');
map.classList.remove('address__map-nojs');

navToggle.addEventListener('click', function () {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
  }
});
