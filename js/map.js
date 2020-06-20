'use strict';

(function () {

  var UTIL = window.util;
  var PIN = window.pin;
  var MAIN_PIN = window.mainPin;
  var MESSAGE = window.message;
  var BACKEND = window.backend;

  var map = document.querySelector('.map');
  var pinsLocation = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filter = map.querySelector('.map__filters');

  var mainPinLocationField = document.querySelector('#address');

  var pinNodes = [];

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

  var onAdvertsLoad = function (adverts) {
    pinsLocation.appendChild(PIN.getPins(adverts));
    pinNodes = getPinNodes();
    setVisibilityPins(false);
  };

  var onAdvertsError = function (errorMessage) {
    MESSAGE.showErrorMessage(errorMessage);
  };

  var setLocationMainPin = function (location) {
    mainPinLocationField.value = location;
  };

  var init = function (getStatus, setStatus) {

    var setMapEnable = function (enabled) {
      if (enabled) {
        UTIL.removeClassFromElement(map, 'map--faded');
      } else {
        UTIL.addClassToElement(map, 'map--faded');
      }

      UTIL.setEnableForm(filter, enabled);
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
