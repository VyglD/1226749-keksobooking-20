'use strict';

var ADVERTS_COUNT = 8;
var MAX_HOUSE_PRICE = 1000000;
var MAX_ROOMS = 100;
var HOUSE_TYPE = ['bungalo', 'house', 'flat', 'palace'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 80;

var MinPrice = {
  'bungalo': 0,
  'house': 1000,
  'flat': 5000,
  'palace': 10000
};

var map = document.querySelector('.map');
var templatePin = document.querySelector('#pin').content;
var pinsLocation = document.querySelector('.map__pins');

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
  return getRandomNumber(MinPrice[houseType], MAX_HOUSE_PRICE);
};

var generateLocation = function () {
  return ({
    x: getRandomNumber(0, 650),
    y: getRandomNumber(130, 630)
  });
};

var getLocationValue = function (location) {
  return [location.x, location.y].join(',');
};

var generateOffer = function (location) {
  var offer = {};

  offer['title'] = 'Заголовок';
  offer['address'] = location;
  offer['type'] = getRandomElement(HOUSE_TYPE);
  offer['price'] = generateRandomPrice(offer['type']);
  offer['rooms'] = getRandomNumber(0, MAX_ROOMS);
  offer['guests'] = generateRandomCountGuests(offer['rooms']);
  offer['checkin'] = getRandomElement(TIMES);
  offer['checkout'] = offer['checkin'];
  offer['features'] = getRandomSubArray(FEATURES);
  offer['description'] = 'Описание';
  offer['photos'] = getRandomSubArray(PHOTOS);

  return offer;
};

var generateAuthorInfo = function (number) {
  return {avatar: 'img/avatars/user0' + number + '.png'};
};

var generateAdvert = function (number) {
  var advert = {};

  advert['author'] = generateAuthorInfo(number);
  advert['location'] = generateLocation();
  advert['offer'] = generateOffer(getLocationValue(advert.location));

  return advert;
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

var init = function () {
  enableMap();

  var pinsOfSimilarAdverts = renderAllPins(generateSimilarAdverts(ADVERTS_COUNT));
  if (pinsLocation) {
    pinsLocation.appendChild(pinsOfSimilarAdverts);
  }
};

init();
