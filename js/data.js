'use strict';

(function () {

  var MAX_ROOMS = 100;

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
    }
  };

  window.data = {
    Placement: Placement,
    MAX_ROOMS: MAX_ROOMS,
  };

})();
