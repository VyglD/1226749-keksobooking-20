'use strict';

(function () {
  var DATA = window.data;

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_POINTER_HEIGHT = 16;
  var PX_VALUE_REGEX = /(-?\d*)px/;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var mainPinLocationField = document.querySelector('#address');

  var getCoordinate = function (stringArgument) {
    var value = PX_VALUE_REGEX.exec(stringArgument)[1];
    return parseInt(value, 10);
  };

  var calculateCoordinates = function (x, y, enabled) {
    return enabled
      ? {
        x: x + MAIN_PIN_WIDTH / 2,
        y: y + MAIN_PIN_HEIGHT + MAIN_PIN_POINTER_HEIGHT,
      }
      : {
        x: x + MAIN_PIN_WIDTH / 2,
        y: y + MAIN_PIN_HEIGHT / 2,
      };
  };

  var getLocation = function (enabledMap) {
    return calculateCoordinates(
        getCoordinate(mainPin.style.left),
        getCoordinate(mainPin.style.top),
        enabledMap
    );
  };

  var setLocationMainPin = function (enabledMap) {
    var coordinates = getLocation(enabledMap);
    mainPinLocationField.value = coordinates.x + ', ' + coordinates.y;
  };

  var onMainPinMove = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var offset = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y,
      };

      var newX = mainPin.offsetLeft + offset.x;
      var newY = mainPin.offsetTop + offset.y;
      var coordinates = calculateCoordinates(newX, newY, true);

      if (coordinates.y >= DATA.MainPinRestriction.TOP
          && coordinates.y <= DATA.MainPinRestriction.BOTTOM
          && coordinates.x >= map.clientLeft
          && coordinates.x <= map.offsetWidth) {

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY,
        };

        mainPin.style.left = newX + 'px';
        mainPin.style.top = newY + 'px';

        setLocationMainPin(true);
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      setLocationMainPin(true);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.mainPin = {
    setLocationMainPin: setLocationMainPin,
    onMainPinMove: onMainPinMove,
  };

})();
