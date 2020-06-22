'use strict';

(function () {

  var UTIL = window.util;
  var PIN = window.pin;
  var MAIN_PIN = window.mainPin;
  var MESSAGE = window.message;
  var BACKEND = window.backend;
  var CARD = window.card;

  var map = document.querySelector('.map');
  var pinsLocation = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filtersContainer = map.querySelector('.map__filters-container');
  var filters = map.querySelector('.map__filters');

  var mainPinLocationField = document.querySelector('#address');

  var pinNodes = [];
  var adverts = [];

  var getPinNodes = function () {
    return pinsLocation.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  var setVisibilityPins = function (isVisible) {
    pinNodes.forEach(function (pin) {
      if (isVisible) {
        UTIL.showElement(pin);
      } else {
        UTIL.hideElement(pin);
      }
    });
  };

  var onAdvertsLoad = function (uploadedAdverts) {
    adverts = uploadedAdverts;
    pinsLocation.appendChild(PIN.getPins(uploadedAdverts));
    pinNodes = getPinNodes();
    setVisibilityPins(false);
  };

  var onAdvertsError = function (errorMessage) {
    MESSAGE.showErrorMessage(errorMessage);
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
    if (
      evt.path.some(function (element) {
        return element.classList
          ? element.classList.contains('map__pin')
              && !element.classList.contains('map__pin--main')
          : false;
      })
    ) {
      evt.path.forEach(function (element) {
        if (element.classList && element.classList.contains('map__pin')) {
          onCloseButtonCardClick();

          UTIL.addClassToElement(element, 'map__pin--active');

          map.insertBefore(
              CARD.renderAdvert(adverts[Array.from(pinNodes).indexOf(element)]),
              filtersContainer
          );

          var closeButtonCard = map.querySelector('.popup__close');
          closeButtonCard.addEventListener('click', onCloseButtonCardClick);
          document.addEventListener('keydown', onCardEscPress);
        }
      });
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

    BACKEND.load(onAdvertsLoad, onAdvertsError);

    mainPin.addEventListener('mousedown', function (evt) {
      UTIL.isLeftMouseKeyEvent(evt, onMainPinAction);
    });

    mainPin.addEventListener('keydown', function (evt) {
      UTIL.isEnterEvent(evt, onMainPinAction);
    });

    setLocationMainPin(MAIN_PIN.getLocation(getStatus()));

    window.map.setMapEnable = setMapEnable;
  };

  window.map = {
    init: init,
  };

})();
