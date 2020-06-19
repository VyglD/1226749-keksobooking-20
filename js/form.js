'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;

  var COUNT_GUESTS_FOR_MAX_ROOMS = 0;

  var adForm = document.querySelector('.ad-form');
  var addressField = document.querySelector('#address');
  var roomsField = document.querySelector('#room_number');
  var guestsField = document.querySelector('#capacity');
  var resetButton = document.querySelector('.ad-form__reset');

  var setCurrentAddress = function (address) {
    addressField.value = address;
  };

  var checkGuestsField = function () {
    if (parseInt(guestsField.value, 10) > parseInt(roomsField.value, 10)) {
      guestsField.setCustomValidity(
          'Количество мест не может быть больше количества комнат'
      );
    } else if (
      ((parseInt(roomsField.value, 10) === DATA.MAX_ROOMS)
        && (parseInt(guestsField.value, 10) === COUNT_GUESTS_FOR_MAX_ROOMS))
      || ((parseInt(roomsField.value, 10) !== DATA.MAX_ROOMS)
        && ((parseInt(guestsField.value, 10) !== COUNT_GUESTS_FOR_MAX_ROOMS)))
    ) {
      guestsField.setCustomValidity('');
    } else if (parseInt(roomsField.value, 10) === DATA.MAX_ROOMS) {
      guestsField.setCustomValidity('Для ' + DATA.MAX_ROOMS +
                      ' комнат доступен только вариант "не для гостей"');
    } else {
      guestsField.setCustomValidity('Данная опция доступна только для ' +
                                      DATA.MAX_ROOMS + ' комнат');
    }
  };

  var onSubmitClick = function (evt) {
    checkGuestsField();

    if (!adForm.checkValidity()) {
      evt.preventDefault();
    }
  };

  var init = function (getPageStatus, setPageStatus) {

    var setFormEnable = function (isEnable) {
      if (isEnable) {
        UTIL.removeClassFromElement(adForm, 'ad-form--disabled');

        resetButton.addEventListener('click', onResetButtonClick);
        adForm.addEventListener('submit', onSubmitClick);
        adForm.addEventListener('input', checkGuestsField);
      } else {
        UTIL.addClassToElement(adForm, 'ad-form--disabled');

        resetButton.removeEventListener('click', onResetButtonClick);
        adForm.removeEventListener('submit', onSubmitClick);
        adForm.removeEventListener('input', checkGuestsField);
      }

      UTIL.setEnableForm(adForm, isEnable);
    };

    // Временная функция заглушка
    var onResetButtonClick = function (evt) {
      evt.preventDefault();

      setPageStatus(false);
    };

    window.form.setCurrentAddress = setCurrentAddress;
    window.form.setFormEnable = setFormEnable;
  };

  window.form = {
    init: init
  };

})();
