'use strict';

(function () {

  var UTIL = window.util;
  var PIN = window.pin;
  var MAIN_PIN = window.mainPin;
  var CARD = window.card;

  var map = document.querySelector('.map');
  var pinsLocation = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filtersContainer = map.querySelector('.map__filters-container');
  var filters = map.querySelector('.map__filters');

  var mainPinLocationField = document.querySelector('#address');

  var pins = [];

  var setVisibilityPins = function (isVisible) {
    var pinNodes = pinsLocation.querySelectorAll('.map__pin:not(.map__pin--main)')
    pinNodes.forEach(function (pin) {
      if (isVisible) {
        UTIL.showElement(pin);
      } else {
        UTIL.hideElement(pin);
      }
    });
  };

  var onAdvertsLoad = function (uploadedAdverts) {
    var pinsFragment = document.createDocumentFragment();
    pins = PIN.getPins(uploadedAdverts);
    pins.forEach(function (pin) {
      pinsFragment.appendChild(pin.fragment);
    });
    pinsLocation.insertBefore(
        pinsFragment,
        mainPin
    );
    setVisibilityPins(false);
  };

  var setLocationMainPin = function (location) {
    mainPinLocationField.value = location;
  };

  var onCloseButtonCardClick = function () {
    var oldAdvert = map.querySelector('.map__card.popup');
    if (oldAdvert) {
      UTIL.removeClassFromElement(
          map.querySelector('.map__pin--active'),
          'map__pin--active'
      );
      oldAdvert.remove();
    }
    document.removeEventListener('keydown', onCardEscPress);
  };

  var onCardEscPress = function (evt) {
    UTIL.isEscEvent(evt, onCloseButtonCardClick);
  };

  var onPinClick = function (evt) {
    var currentPin = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (currentPin) {
      var currentAdvert = map.querySelector('.map__card.popup');
      var newAdvert = CARD.renderAdvert(pins.find(function (pin) {
        if (pin.link === currentPin) {
          return true;
        }
        return false;
      }).advert);

      if (!(currentAdvert
          && currentAdvert.innerHTML === newAdvert.firstElementChild.innerHTML)) {
        onCloseButtonCardClick();

        UTIL.addClassToElement(currentPin, 'map__pin--active');

        map.insertBefore(
            newAdvert,
            filtersContainer
        );

        var closeButtonCard = map.querySelector('.popup__close');
        closeButtonCard.addEventListener('click', onCloseButtonCardClick);
        document.addEventListener('keydown', onCardEscPress);
      }
    }
  };

  var init = function (getStatus, setStatus) {

    var setMapEnable = function (enabled) {
      if (enabled) {
        UTIL.removeClassFromElement(map, 'map--faded');
        map.addEventListener('click', onPinClick);
      } else {
        UTIL.addClassToElement(map, 'map--faded');
        map.removeEventListener('click', onPinClick);
        onCloseButtonCardClick();
      }

      UTIL.setEnableForm(filters, enabled);
      setVisibilityPins(enabled);
      setLocationMainPin(MAIN_PIN.getLocation(getStatus()));
    };

    var onMainPinAction = function () {
      var enableMap = getStatus();
      if (getStatus() === false) {
        enableMap = true;
        setStatus(enableMap);
      }

      setLocationMainPin(MAIN_PIN.getLocation(enableMap));
    };

    mainPin.addEventListener('mousedown', function (evt) {
      UTIL.isLeftMouseKeyEvent(evt, onMainPinAction);
    });

    mainPin.addEventListener('keydown', function (evt) {
      UTIL.isEnterEvent(evt, onMainPinAction);
    });

    setLocationMainPin(MAIN_PIN.getLocation(getStatus()));

    window.map.setMapEnable = setMapEnable;
    window.map.onAdvertsLoad = onAdvertsLoad;
  };

  window.map = {
    init: init,
  };

})();
