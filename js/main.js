'use strict';

var ADVERTS_COUNT = 8;
var MAX_HOUSE_PRICE = 1000000;
var MAX_ROOMS = 100;
var HOUSE_TYPES = ['bungalo', 'house', 'flat', 'palace'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 80;

var Placement = {
  BUNGALO: {
    name: 'Бунгало',
    minPrice: 0,
  },
  HOUSE: {
    name: 'Дом',
    minPrice: 1000,
  },
  FLAT: {
    name: 'Квартира',
    minPrice: 5000,
  },
  PALACE: {
    name: 'Дворец',
    minPrice: 10000,
  },
  fromId: function (id) {
    return this[id.toUpperCase()];
  },
};

var map = document.querySelector('.map');
var templatePin = document.querySelector('#pin').content;
var templateCard = document.querySelector('#card').content;
var pinsLocation = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');

var getRandomElement = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var shuffleArray = function (arr) {
  return arr.slice().sort(function () {
    return 0.5 - Math.random();
  });
};

var getRandomSubArray = function (arr) {
  var half = arr.length / 2;
  var start = getRandomNumber(0, half);
  var end = getRandomNumber(half, arr.length);

  return shuffleArray(arr.slice(start, end));
};

var generateRandomCountGuests = function (roomsCount) {
  return roomsCount === 0
    ? 0
    : getRandomNumber(0, roomsCount);
};

var generateRandomPrice = function (houseType) {
  return getRandomNumber(Placement.fromId(houseType).minPrice, MAX_HOUSE_PRICE);
};

var generateAdvert = function (number) {
  return {
    author: {
      avatar: 'img/avatars/user0' + number + '.png',
    },
    location: {
      x: getRandomNumber(0, 650),
      y: getRandomNumber(130, 630),
    },
    offer: {
      title: 'Заголовок',
      type: getRandomElement(HOUSE_TYPES),
      rooms: getRandomNumber(0, MAX_ROOMS),
      checkin: getRandomElement(TIMES),
      features: getRandomSubArray(FEATURES),
      description: 'Описание',
      photos: getRandomSubArray(PHOTOS),
    },
    init: function () {
      this.offer.address = [this.location.x, this.location.y].join(',');
      this.offer.price = generateRandomPrice(this.offer.type);
      this.offer.guests = generateRandomCountGuests(this.offer.rooms);
      this.offer.checkout = this.offer.checkin;

      return this;
    }
  }.init();
};

var generateSimilarAdverts = function (count) {
  var adverts = [];

  for (var i = 0; i < count; i++) {
    adverts.push(generateAdvert(i + 1));
  }

  return adverts;
};

var enableMap = function () {
  if (map && map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  }
};

var renderPin = function (advert) {
  var newPin = templatePin.cloneNode(true);
  var button = newPin.querySelector('button');
  var img = newPin.querySelector('img');

  button.style.left = (advert.location.x - (PIN_WIDTH / 2)) + 'px';
  button.style.top = (advert.location.y - PIN_HEIGHT) + 'px';
  img.src = advert.author.avatar;
  img.alt = advert.offer.title;

  return newPin;
};

var renderAllPins = function (adverts) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adverts.length; i++) {
    fragment.appendChild(renderPin(adverts[i]));
  }

  return fragment;
};

var renderAdvert = function (advert) {
  var newAdvert = templateCard.cloneNode(true);
  var avatar = newAdvert.querySelector('.popup__avatar');
  var title = newAdvert.querySelector('.popup__title');
  var address = newAdvert.querySelector('.popup__text--address');
  var price = newAdvert.querySelector('.popup__text--price');
  var houseType = newAdvert.querySelector('.popup__type');
  var capacity = newAdvert.querySelector('.popup__text--capacity');
  var time = newAdvert.querySelector('.popup__text--time');
  var features = newAdvert.querySelector('.popup__features');
  var description = newAdvert.querySelector('.popup__description');
  var photoContainer = newAdvert.querySelector('.popup__photos');
  var photo = photoContainer.querySelector('img').cloneNode(true);

  title.textContent = advert.offer.title;
  address.textContent = advert.offer.address;
  price.textContent = advert.offer.price + '₽/ночь';
  houseType.textContent = Placement.fromId(advert.offer.type).name;
  capacity.textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  time.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  description.textContent = advert.offer.description;
  avatar.src = advert.author.avatar;

  Array.prototype.forEach.call(features.children, function (node) {
    if ((advert.offer.features).indexOf(node.classList[1].split('--')[1]) < 0) {
      node.classList.add('hidden');
    }
  });

  photoContainer.innerHTML = '';
  advert.offer.photos.forEach(function (elem) {
    var img = photo.cloneNode(true);
    img.src = elem;
    photoContainer.appendChild(img);
  });

  return newAdvert;
};

var init = function () {
  var similarAdverts = generateSimilarAdverts(ADVERTS_COUNT);
  var pinsOfSimilarAdverts = renderAllPins(similarAdverts);

  enableMap();

  if (filtersContainer) {
    filtersContainer.before(renderAdvert(similarAdverts[0]));
  }

  if (pinsLocation) {
    pinsLocation.appendChild(pinsOfSimilarAdverts);
  }
};

init();
