'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;

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

  var imageInput = {
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
          UTIL.getDefaultValue(defaultValues, node.id, node, 'checked', node.checked);
        } else if (node === imageInput.AVATAR.link) {
          var img = imageInput.AVATAR.view.querySelector('img');
          UTIL.getDefaultValue(defaultValues, node.id, img, 'src', img.src);
        } else if (node === imageInput.IMAGES.link) {
          UTIL.getDefaultValue(
              defaultValues,
              node.id,
              imageInput.IMAGES.view,
              'innerHTML',
              imageInput.IMAGES.view.innerHTML
          );
        } else {
          UTIL.getDefaultValue(defaultValues, node.id, node, 'value', node.value);
        }
      });
  };

  var checkRoomsField = function () {
    var guestsCount = parseInt(guestsField.value, 10);
    var roomsCount = parseInt(roomsField.value, 10);
    var errorMessage = '';

    if (roomsCount === DATA.MAX_ROOMS && guestsCount !== DATA.MAX_ROOMS_GUESTS) {
      errorMessage = 'Для ' + DATA.MAX_ROOMS + ' комнат доступен только вариант "не для гостей"';
    } else if (roomsCount !== DATA.MAX_ROOMS && guestsCount === DATA.MAX_ROOMS_GUESTS) {
      errorMessage = 'Вариант "не для гостей" доступен только для ' + DATA.MAX_ROOMS + ' комнат';
    } else if (guestsCount > roomsCount) {
      errorMessage = 'Количество мест не может быть больше количества комнат';
    }

    guestsField.setCustomValidity(errorMessage);
  };

  var checkTimeFields = function (evt) {
    if (timeFields[0].value !== timeFields[1].value
          && timeFields.indexOf(evt.target) !== -1) {
      timeFields.forEach(function (field) {
        field.value = evt.target.value;
      });
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
    if (evt) {
      checkTimeFields(evt);
      saveImg(isFileInput(evt));
    }
  };

  var isFileInput = function (evt) {
    var fileInput = false;
    Object.keys(imageInput).forEach(function (element) {
      if (evt.target === imageInput[element].link) {
        fileInput = imageInput[element];
      }
    });
    return fileInput;
  };

  var checkFileField = function (fileInput) {
    if (fileInput.link.value === '' || IMAGE_TYPE.exec(fileInput.link.value)) {
      fileInput.link.setCustomValidity('');
      return true;
    }

    fileInput.link.setCustomValidity('Выбранный файл не является изображением');
    return false;
  };

  var saveImg = function (fileInput) {
    if (fileInput) {
      if (checkFileField(fileInput) && fileInput.link.files[0]) {
        var img = fileInput.view.querySelector('img');
        if (img) {
          img.src = URL.createObjectURL(fileInput.link.files[0]);
        } else {
          var newImg = document.createElement('img');
          newImg.src = URL.createObjectURL(fileInput.link.files[0]);
          newImg.width = '70';
          newImg.height = '70';
          newImg.alt = 'Фотография жилья';
          fileInput.view.appendChild(newImg);
        }
      } else {
        var restoreElement = defaultValues[fileInput.link.id];
        restoreElement.link[restoreElement.property] = restoreElement.value;
      }
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

    var onResetButtonClick = function (evt) {
      evt.preventDefault();

      setPageStatus(false);
      UTIL.setDefaultValues(defaultValues);
    };

    getDefaultFormValues();
    onFormInput();

    window.form.setFormEnable = setFormEnable;
  };

  window.form = {
    init: init
  };

})();
