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

    var similarAdverts = DATA.generateAdverts(ADVERTS_COUNT);
    var pinsFragment = PIN.getPins(similarAdverts);
    pinsLocation.appendChild(pinsFragment);

    pinNodes = getPinNodes();

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
