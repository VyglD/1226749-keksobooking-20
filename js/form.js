'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;

  var MAX_ROOMS_GUESTS = 0;
  var IMAGE_TYPE = /(.*?)\.(gif|jpe?g|tiff?|png|bmp)$/i;

  var adForm = document.querySelector('.ad-form');
  var roomsField = document.querySelector('#room_number');
  var guestsField = document.querySelector('#capacity');
  var typeField = document.querySelector('#type');
  var priceField = document.querySelector('#price');
  var timeFields = [
    document.querySelector('#timein'),
    document.querySelector('#timeout')
  ];
  var resetButton = document.querySelector('.ad-form__reset');

  var ImageInput = {
    AVATAR: {
      link: document.querySelector('#avatar'),
      view: document.querySelector('.ad-form-header__preview'),
    },
    IMAGES: {
      link: document.querySelector('#images'),
      view: document.querySelector('.ad-form__photo'),
    },
  };

  var defaultValues = {};

  var getDefaultFormValues = function () {
    adForm.querySelectorAll('input:not(#address), select, textarea')
            .forEach(function (node) {
              if (node.type === 'checkbox') {
                defaultValues[node.id] = {
                  link: node,
                  property: 'checked',
                  value: node.checked,
                };
              } else if (node === ImageInput.AVATAR.link) {
                var img = ImageInput.AVATAR.view.querySelector('img');
                defaultValues[node.id] = {
                  link: img,
                  property: 'src',
                  value: img.src,
                };
              } else if (node === ImageInput.IMAGES.link) {
                defaultValues[node.id] = {
                  link: ImageInput.IMAGES.view,
                  property: 'innerHTML',
                  value: ImageInput.IMAGES.view.innerHTML,
                };
              } else {
                defaultValues[node.id] = {
                  link: node,
                  property: 'value',
                  value: node.value,
                };
              }
            });
  };

  var setDefaultFormValues = function () {
    Object.keys(defaultValues).forEach(function (field) {
      defaultValues[field]['link'][defaultValues[field]['property']]
                                             = defaultValues[field]['value'];
    });
  };

  var checkRoomsField = function () {
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

  var checkFileField = function (evt, input) {
    if (input.link.value !== '' && evt && evt.target === input.link) {
      if (!IMAGE_TYPE.exec(input.link.value)) {
        input.link.setCustomValidity('Выбранный файл не является изображением');
      } else {
        var img = input.view.querySelector('img');
        if (img) {
          img.src = URL.createObjectURL(input.link.files[0]);
        } else {
          var newImg = document.createElement('img');
          newImg.src = URL.createObjectURL(input.link.files[0]);
          newImg.width = '70';
          newImg.height = '70';
          newImg.alt = 'Фотография жилья';
          input.view.appendChild(newImg);
        }
        input.link.setCustomValidity('');
      }
    }
  };

  var checkTimeFields = function (evt) {
    if (timeFields[0].value !== timeFields[1].value) {
      if (evt && evt.target === timeFields[0]) {
        timeFields[1].value = timeFields[0].value;
      } else {
        timeFields[0].value = timeFields[1].value;
      }
    }
  };

  var checkPriceField = function () {
    var minValue = DATA.Placement[typeField.value.toUpperCase()].minPrice;
    priceField.placeholder = minValue;
    priceField.min = minValue;
  };

  var onFormInput = function (evt) {
    checkRoomsField();
    checkPriceField();
    checkTimeFields(evt);
    checkFileField(evt, ImageInput.AVATAR);
    checkFileField(evt, ImageInput.IMAGES);
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

    var onResetButtonClick = function (evt) {
      evt.preventDefault();

      setPageStatus(false);
      setDefaultFormValues();
    };

    getDefaultFormValues();
    onFormInput();

    window.form.setFormEnable = setFormEnable;
  };

  window.form = {
    init: init
  };

})();
