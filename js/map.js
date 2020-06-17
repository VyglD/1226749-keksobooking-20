'use strict';

(function () {

  var UTIL_MODULE = window.util;
  var DATA_MODULE = window.data;
  var PIN_MODULE = window.pin;
  var MAIN_PIN_MODULE = window.mainPin;

  var ADVERTS_COUNT = 8;
  var LEFT_KEY_MOUSE_CODE = 0;

  var Key = {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
  };

  var map = document.querySelector('.map');
  var pinsLocation = map.querySelector('.map__pins');
  var filter = map.querySelector('.map__filters');

  var pinNodes = [];

  var getPinNodes = function () {
    return pinsLocation.querySelectorAll('.map__pin:not(.map__pin--main)');
  };

  var setVisibilityPins = function (isVisible) {
    pinNodes.forEach(function (pin) {
      if (isVisible) {
        UTIL_MODULE.showElement(pin);
      } else {
        UTIL_MODULE.hideElement(pin);
      }
    });
  };

  var setMapEnable = function (isEnabled) {
    if (isEnabled) {
      UTIL_MODULE.removeClassFromElement(map, 'map--faded');
    } else {
      UTIL_MODULE.addClassToElement(map, 'map--faded');
    }

    UTIL_MODULE.setEnableForm(filter, isEnabled);
    setVisibilityPins(isEnabled);
  };

  var onMainPinAction = function (setLocationMainPin, getStatus, setStatus) {
    var isEnableMap = getStatus();
    if (getStatus() === false) {
      isEnableMap = true;
      setStatus(isEnableMap);
    }

    setLocationMainPin(MAIN_PIN_MODULE.getLocation(isEnableMap));
  };

  var init = function (setLocationMainPin, getStatus, setStatus) {
    var mainPin = MAIN_PIN_MODULE.mainPin;
    var similarAdverts = DATA_MODULE.generateAdverts(ADVERTS_COUNT);
    var pinsFragment = PIN_MODULE.getPins(similarAdverts);
    pinsLocation.appendChild(pinsFragment);

    pinNodes = getPinNodes();

    map.addEventListener('mousedown', function (evt) {
      if ((evt.button === LEFT_KEY_MOUSE_CODE)
          && (evt.path.indexOf(mainPin) !== -1)) {
        onMainPinAction(setLocationMainPin, getStatus, setStatus);
      }
    });

    map.addEventListener('keydown', function (evt) {
      if (evt.key === Key.ENTER) {
        onMainPinAction(setLocationMainPin);
      }
    });

    setLocationMainPin(MAIN_PIN_MODULE.getLocation(getStatus()));
  };

  window.map = {
    init: init,
    setMapEnable: setMapEnable
  };
})();
