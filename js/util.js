'use strict';

(function () {

  var KeyCode = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
  };

  var LEFT_KEY_MOUSE_CODE = 0;

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var getRandomElement = function (arr) {
    return arr[getRandomNumber(0, arr.length - 1)];
  };

  var getMaxElement = function (arr) {
    return Math.max.apply(null, arr);
  };

  var shuffleArray = function (arr) {
    return arr.slice().sort(function () {
      return 0.5 - Math.random();
    });
  };

  var getRandomSubArray = function (arr) {
    var half = arr.length / 2;
    var start = getRandomNumber(0, half);
    var end = getRandomNumber(half, arr.length);

    return shuffleArray(arr.slice(start, end));
  };

  var removeClassFromElement = function (element, nameClass) {
    if (element && element.classList.contains(nameClass)) {
      element.classList.remove(nameClass);
    }
  };

  var addClassToElement = function (element, nameClass) {
    if (element && !element.classList.contains(nameClass)) {
      element.classList.add(nameClass);
    }
  };

  var showElement = function (element) {
    removeClassFromElement(element, 'hidden');
  };

  var hideElement = function (element) {
    addClassToElement(element, 'hidden');
  };

  var setEnableForm = function (form, isEnabled) {
    Array.prototype.forEach.call(form.children, function (child) {
      child.disabled = !isEnabled;
    });
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ESC_KEYCODE) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ENTER_KEYCODE) {
      action();
    }
  };

  var isLeftMouseKeyEvent = function (evt, action) {
    if (evt.button === LEFT_KEY_MOUSE_CODE) {
      action();
    }
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomElement: getRandomElement,
    getMaxElement: getMaxElement,
    shuffleArray: shuffleArray,
    getRandomSubArray: getRandomSubArray,
    removeClassFromElement: removeClassFromElement,
    addClassToElement: addClassToElement,
    showElement: showElement,
    hideElement: hideElement,
    setEnableForm: setEnableForm,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isLeftMouseKeyEvent: isLeftMouseKeyEvent,
  };

})();
