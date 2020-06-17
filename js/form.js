'use strict';

(function () {
  var UTIL_MODULE = window.util;

  var adForm = document.querySelector('.ad-form');
  var addressField = document.querySelector('#address');
  var roomsField = document.querySelector('#room_number');
  var guestsField = document.querySelector('#capacity');

  var maxRooms = UTIL_MODULE.getMaxElement(
      Array.prototype.map.call(
          document.querySelectorAll('#room_number option'), function (option) {
            return option.value;
          })
  );

  var setCurrentAddress = function (address) {
    addressField.value = address;
  };

  var setFormEnable = function (isEnable) {
    if (isEnable) {
      UTIL_MODULE.removeClassFromElement(adForm, 'ad-form--disabled');
    } else {
      UTIL_MODULE.addClassToElement(adForm, 'ad-form--disabled');
    }

    UTIL_MODULE.setEnableForm(adForm, isEnable);
  };

  var checkValidityGuestsField = function () {
    if (parseInt(guestsField.value, 10) > parseInt(roomsField.value, 10)) {
      guestsField.setCustomValidity(
          'Количество мест не может быть больше количества комнат'
      );
      return false;
    }

    if (roomsField.value % maxRooms && !(guestsField.value % maxRooms)
        || ((parseInt(roomsField.value, 10) === maxRooms)
             && parseInt(guestsField.value, 10) !== 0)) {
      guestsField.setCustomValidity('Неверное количество мест');
      return false;
    }

    guestsField.setCustomValidity('');

    return true;
  };

  var init = function () {
    adForm.addEventListener('submit', function (evt) {
      if (!checkValidityGuestsField()) {
        evt.preventDefault();
      }
    });

    adForm.addEventListener('input', function () {
      checkValidityGuestsField();
    });
  };

  window.form = {
    init: init,
    setCurrentAddress: setCurrentAddress,
    setFormEnable: setFormEnable,
  };

})();
