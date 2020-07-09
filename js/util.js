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

  var createDefaultValue = function (link, property, value) {
    return {
      link: link,
      property: property,
      value: value,
    };
  };

  var returnDefaultValues = function (defaultValues) {
    Object.keys(defaultValues).forEach(function (field) {
      var element = defaultValues[field]['link'];
      var property = defaultValues[field]['property'];

      element[property] = defaultValues[field]['value'];
    });
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
    createDefaultValue: createDefaultValue,
    returnDefaultValues: returnDefaultValues,
  };

})();
