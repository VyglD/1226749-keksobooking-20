'use strict';

(function () {

  var MAX_ROOMS = 100;
  var MAX_ROOMS_GUESTS = 0;

  var Placement = {
    BUNGALO: {
      name: 'Бунгало',
      minPrice: 0,
    },
    FLAT: {
      name: 'Квартира',
      minPrice: 1000,
    },
    HOUSE: {
      name: 'Дом',
      minPrice: 5000,
    },
    PALACE: {
      name: 'Дворец',
      minPrice: 10000,
    }
  };

  var MainPinRestriction = {
    TOP: 130,
    BOTTOM: 630,
  };

  var PriceName = {
    LOW: 'low',
    MIDDLE: 'middle',
    HIGH: 'high',
  };

  var PriceValue = {
    MIN: 10000,
    MAX: 50000,
  };

  window.data = {
    Placement: Placement,
    MAX_ROOMS: MAX_ROOMS,
    MAX_ROOMS_GUESTS: MAX_ROOMS_GUESTS,
    MainPinRestriction: MainPinRestriction,
    PriceName: PriceName,
    PriceValue: PriceValue,
  };

})();
