'use strict';

(function () {

  var UTIL = window.util;
  var DATA = window.data;
  var PIN = window.pin;
  var MAIN_PIN = window.mainPin;

  var ADVERTS_COUNT = 8;

  var map = document.querySelector('.map');
  var pinsLocation = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filter = map.querySelector('.map__filters');

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

  var setMapEnable = function (isEnabled) {
    if (isEnabled) {
      UTIL.removeClassFromElement(map, 'map--faded');
    } else {
      UTIL.addClassToElement(map, 'map--faded');
    }

    UTIL.setEnableForm(filter, isEnabled);
    setVisibilityPins(isEnabled);
  };

  var onMainPinAction = function (setLocationMainPin, getStatus, setStatus) {
    var isEnableMap = getStatus();
    if (getStatus() === false) {
      isEnableMap = true;
      setStatus(isEnableMap);
    }

    setLocationMainPin(MAIN_PIN.getLocation(isEnableMap));
  };

  var init = function (setLocationMainPin, getStatus, setStatus) {
    var similarAdverts = DATA.generateAdverts(ADVERTS_COUNT);
    var pinsFragment = PIN.getPins(similarAdverts);
    pinsLocation.appendChild(pinsFragment);

    pinNodes = getPinNodes();

    mainPin.addEventListener('mousedown', function (evt) {
      UTIL.isLeftMouseKeyEvent(
          evt,
          onMainPinAction.bind(null, setLocationMainPin, getStatus, setStatus)
      );
    });

    mainPin.addEventListener('keydown', function (evt) {
      UTIL.isEnterEvent(
          evt,
          onMainPinAction.bind(null, setLocationMainPin, getStatus, setStatus)
      );
    });

    setLocationMainPin(MAIN_PIN.getLocation(getStatus()));

    window.map.setMapEnable = setMapEnable;
  };

  window.map = {
    init: init,
  };

})();
