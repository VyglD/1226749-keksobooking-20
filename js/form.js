'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;

  var MAX_ROOMS_GUESTS = 0;

  var adForm = document.querySelector('.ad-form');
  var roomsField = document.querySelector('#room_number');
  var guestsField = document.querySelector('#capacity');
  var resetButton = document.querySelector('.ad-form__reset');

  var onFormInput = function () {
    var guestsCount = parseInt(guestsField.value, 10);
    var roomsCount = parseInt(roomsField.value, 10);

    if (guestsCount > roomsCount) {
      guestsField.setCustomValidity(
          'Количество мест не может быть больше количества комнат'
      );
    } else if (
      ((roomsCount === DATA.MAX_ROOMS) && (guestsCount === MAX_ROOMS_GUESTS))
      || ((roomsCount !== DATA.MAX_ROOMS) && (guestsCount !== MAX_ROOMS_GUESTS))
    ) {
      guestsField.setCustomValidity('');
    } else if (roomsCount === DATA.MAX_ROOMS) {
      guestsField.setCustomValidity('Для ' + DATA.MAX_ROOMS +
                      ' комнат доступен только вариант "не для гостей"');
    } else {
      guestsField.setCustomValidity('Вариант "не для гостей" доступен только для ' +
                                      DATA.MAX_ROOMS + ' комнат');
    }
  };

  var onSubmitClick = function (evt) {
    onFormInput();

    if (!adForm.checkValidity()) {
      evt.preventDefault();
    }
  };

  var init = function (setPageStatus) {

    var setFormEnable = function (enable) {
      if (enable) {
        UTIL.removeClassFromElement(adForm, 'ad-form--disabled');

        resetButton.addEventListener('click', onResetButtonClick);
        adForm.addEventListener('submit', onSubmitClick);
        adForm.addEventListener('input', onFormInput);
      } else {
        UTIL.addClassToElement(adForm, 'ad-form--disabled');

        resetButton.removeEventListener('click', onResetButtonClick);
        adForm.removeEventListener('submit', onSubmitClick);
        adForm.removeEventListener('input', onFormInput);
      }

      UTIL.setEnableForm(adForm, enable);
    };

    // Временная функция заглушка
    var onResetButtonClick = function (evt) {
      evt.preventDefault();

      setPageStatus(false);
    };

    window.form.setFormEnable = setFormEnable;
  };

  window.form = {
    init: init
  };

})();
