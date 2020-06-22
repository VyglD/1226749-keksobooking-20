'use strict';

(function () {

  var KeyCode = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
  };

  var LEFT_KEY_MOUSE_CODE = 0;

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

  var setEnableForm = function (form, enabled) {
    Array.prototype.forEach.call(form.children, function (child) {
      child.disabled = !enabled;
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
