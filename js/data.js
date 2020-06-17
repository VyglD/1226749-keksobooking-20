'use strict';

(function () {
  var UTIL_MODULE = window.util;

  var MAX_HOUSE_PRICE = 1000000;
  var MAX_ROOMS = 100;
  var ROOMS_COUNT = [
    1,
    2,
    3,
    MAX_ROOMS,
  ];
  var HOUSE_TYPES = [
    'bungalo',
    'house',
    'flat',
    'palace'
  ];
  var TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

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

  var generateRandomCountGuests = function (roomsCount) {
    return roomsCount === MAX_ROOMS
      ? 0
      : UTIL_MODULE.getRandomNumber(1, roomsCount);
  };

  var generateRandomPrice = function (houseType) {
    return UTIL_MODULE.getRandomNumber(
        Placement.fromId(houseType).minPrice, MAX_HOUSE_PRICE
    );
  };

  var generateAdvert = function (number) {
    return {
      author: {
        avatar: 'img/avatars/user0' + number + '.png',
      },
      location: {
        x: UTIL_MODULE.getRandomNumber(0, 650),
        y: UTIL_MODULE.getRandomNumber(130, 630),
      },
      offer: {
        title: 'Заголовок',
        type: UTIL_MODULE.getRandomElement(HOUSE_TYPES),
        rooms: UTIL_MODULE.getRandomElement(ROOMS_COUNT),
        checkin: UTIL_MODULE.getRandomElement(TIMES),
        features: UTIL_MODULE.getRandomSubArray(FEATURES),
        description: 'Описание',
        photos: UTIL_MODULE.getRandomSubArray(PHOTOS),
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

  var generateAdverts = function (count) {
    return new Array(count).fill().map(function (element, index) {
      return generateAdvert(index + 1);
    });
  };

  window.data = {
    generateAdverts: generateAdverts,
    Placement: Placement,
  };

})();
