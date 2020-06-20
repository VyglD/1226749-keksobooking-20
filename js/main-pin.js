'use strict';

(function () {

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_POINTER_HEIGHT = 16;
  var PX_VALUE_REGEX = /(\d*)px/;

  var mainPin = document.querySelector('.map__pin--main');

  var getCoordinate = function (stringArgument) {
    var value = PX_VALUE_REGEX.exec(stringArgument)[1];
    return parseInt(value, 10);
  };

  var getLocation = function (enabledMap) {
    var x = getCoordinate(mainPin.style.left) + MAIN_PIN_WIDTH / 2;
    var y = getCoordinate(mainPin.style.top) + MAIN_PIN_HEIGHT / 2;
    return enabledMap
      ? x + ', ' + (y + (MAIN_PIN_HEIGHT / 2) + MAIN_PIN_POINTER_HEIGHT)
      : x + ', ' + y;
  };

  window.mainPin = {
    getLocation: getLocation,
  };

})();
