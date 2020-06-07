'use strict';

var ADS_COUNT = 8;
var MAX_HOUSE_PRICE = 1000000;
var MAX_ROOMS = 100;
var HOUSE_TYPE = ['bungalo', 'house', 'flat', 'palace'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 80;

var map = document.querySelector('.map');
var templatePin = document.querySelector('#pin').content;
var pinsLocation = document.querySelector('.map__pins');

var getRandomArrayElement = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var generateRandomSubArray = function (arr) {
  var resultArr = [];
  var cloneArr = arr.slice();
  var arrLength = getRandomNumber(0, arr.length - 1);

  for (var i = 0; i < arrLength; i++) {
    var index = getRandomNumber(0, cloneArr.length - 1);
    resultArr.push(cloneArr[index]);
    cloneArr.splice(index, 1);
  }

  return resultArr;
};

var generateRandomCountGuests = function (roomsCount) {
  return roomsCount === 0
    ? 0
    : getRandomNumber(0, roomsCount);
};

var generateRandomPrice = function (houseType) {
  var minHousePrice = 0;

  switch (houseType) {
    case 'house':
      minHousePrice = 1000;
      break;
    case 'flat':
      minHousePrice = 5000;
      break;
    case 'palace':
      minHousePrice = 10000;
      break;
  }

  return getRandomNumber(minHousePrice, MAX_HOUSE_PRICE);
};

var generateLocation = function () {
  var location = {};

  location['x'] = getRandomNumber(0, 650);
  location['y'] = getRandomNumber(130, 630);

  return location;
};

var generateOffer = function () {
  var offer = {};

  offer['title'] = 'Заголовок';
  offer['address'] = '600, 350';
  offer['type'] = getRandomArrayElement(HOUSE_TYPE);
  offer['price'] = generateRandomPrice(offer['type']);
  offer['rooms'] = getRandomNumber(0, MAX_ROOMS);
  offer['guests'] = generateRandomCountGuests(offer['rooms']);
  offer['checkin'] = getRandomArrayElement(TIMES);
  offer['checkout'] = offer['checkin'];
  offer['features'] = generateRandomSubArray(FEATURES);
  offer['description'] = 'Описание';
  offer['photos'] = generateRandomSubArray(PHOTOS);

  return offer;
};

var generateAuthorInfo = function (number) {
  return {avatar: 'img/avatars/user0' + number + '.png'};
};

var generateAd = function (number) {
  var ad = {};

  ad['author'] = generateAuthorInfo(number);
  ad['offer'] = generateOffer();
  ad['location'] = generateLocation();

  return ad;
};

var generateSimilarAds = function (count) {
  var adsArr = [];

  for (var i = 0; i < count; i++) {
    adsArr.push(generateAd(i + 1));
  }

  return adsArr;
};

var enableActiveModeMap = function () {
  if (map && map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  }
};

var renderPin = function (ad) {
  var newPin = templatePin.cloneNode(true);
  var button = newPin.querySelector('button');
  var img = newPin.querySelector('img');

  button.style.left = (ad.location.x - (PIN_WIDTH / 2)) + 'px';
  button.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
  img.src = ad.author.avatar;
  img.alt = ad.offer.title;

  return newPin;
};

var renderPinsOfSimilarAds = function (adsArr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < adsArr.length; i++) {
    fragment.appendChild(renderPin(adsArr[i]));
  }

  return fragment;
};

var init = function () {
  enableActiveModeMap();

  var pinsOfSimilarAds = renderPinsOfSimilarAds(generateSimilarAds(ADS_COUNT));
  pinsLocation.appendChild(pinsOfSimilarAds);
};

init();
