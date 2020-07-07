'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;
  var BACKEND = window.backend;
  var MESSAGE = window.message;

  var IMAGE_TYPE_REGEX = /(.*?)\.(gif|jpe?g|tiff?|png|bmp)$/i;

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

  // Функция заглушка, заменяется при вызове init
  var setPageStatus = function () {};

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

      UTIL.returnDefaultValues(defaultValues);
    }

    UTIL.setEnableForm(adForm, enable);
    correctPriceField();
  };

  var onResetButtonClick = function (evt) {
    evt.preventDefault();

    setPageStatus(false);
  };

  var onSubmitClick = function (evt) {
    evt.preventDefault();

    onFormInput();

    if (adForm.checkValidity()) {
      BACKEND.save(
          new FormData(adForm),
          MESSAGE.showSuccessMessage,
          MESSAGE.showErrorMessage
      );

      setPageStatus(false);
    }
  };

  var showChoosenImg = function (fileInput, result) {
    var img = fileInput.view.querySelector('img');
    if (img) {
      img.src = result;
    } else {
      var newImg = document.createElement('img');
      newImg.src = result;
      newImg.width = '70';
      newImg.height = '70';
      newImg.alt = 'Фотография жилья';
      fileInput.view.appendChild(newImg);
    }
  };

  var changeFileInputPreview = function (fileInput) {
    var file = fileInput.link.files[0];

    if (file) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        showChoosenImg(fileInput, reader.result);
      });

      reader.readAsDataURL(file);
    } else {
      var restoreElement = defaultValues[fileInput.link.id];
      restoreElement.link[restoreElement.property] = restoreElement.value;
    }
  };

  var checkFileInput = function (fileInput) {
    if (fileInput.link.value === '' || IMAGE_TYPE_REGEX.exec(fileInput.link.value)) {
      fileInput.link.setCustomValidity('');
      return true;
    }

    fileInput.link.setCustomValidity('Выбранный файл не является изображением');
    return false;
  };


  var getFileInput = function (evt) {
    return Object.keys(imageInput).map(function (it) {
      return imageInput[it];
    })
    .find(function (it) {
      if (evt.target === it.link) {
        return true;
      }

      return false;
    });
  };

  var correctTimeFields = function (evt) {
    if (timeFields[0].value !== timeFields[1].value
          && timeFields.includes(evt.target)) {
      timeFields[0].value = evt.target.value;
      timeFields[1].value = evt.target.value;
    }
  };

  var correctPriceField = function () {
    var minValue = DATA.Placement[typeField.value.toUpperCase()].minPrice;

    priceField.placeholder = minValue;
    priceField.min = minValue;
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

  var onFormInput = function (evt) {
    checkRoomsField();
    correctPriceField();
    if (evt) {
      correctTimeFields(evt);
      var changedFileInput = getFileInput(evt);
      if (changedFileInput && checkFileInput(changedFileInput)) {
        changeFileInputPreview(changedFileInput);
      }
    }
  };

  var recordDefaultCheckboxValue = function (node) {
    defaultValues[node.id] = UTIL.createDefaultValue(node, 'checked', node.checked);
  };

  var recordDefaultSelectValue = function (node) {
    defaultValues[node.id] = UTIL.createDefaultValue(node, 'value', node.value);
  };

  var recordDefaultAvatarValue = function (node) {
    var img = imageInput.AVATAR.view.querySelector('img');

    defaultValues[node.id] = UTIL.createDefaultValue(img, 'src', img.src);

    recordDefaultFileInputValue(node);
  };

  var recordDefaultFileInputValue = function (node) {
    defaultValues[node.id + '-files'] = UTIL.createDefaultValue(node, 'files', node.files);
  };

  var recordDefaultImagesValue = function (node) {
    defaultValues[node.id] = UTIL.createDefaultValue(
        imageInput.IMAGES.view,
        'innerHTML',
        imageInput.IMAGES.view.innerHTML
    );

    recordDefaultFileInputValue(node);
  };

  var recordDefaultFormValues = function () {
    adForm.querySelectorAll('input:not(#address), select, textarea')
      .forEach(function (node) {
        if (node.type === 'checkbox') {
          recordDefaultCheckboxValue(node);
        } else if (node === imageInput.AVATAR.link) {
          recordDefaultAvatarValue(node);
        } else if (node === imageInput.IMAGES.link) {
          recordDefaultImagesValue(node);
        } else {
          recordDefaultSelectValue(node);
        }
      });
  };

  var init = function (setStatus) {

    setPageStatus = setStatus;

    recordDefaultFormValues();
    onFormInput();

    window.form.setFormEnable = setFormEnable;
  };

  window.form = {
    init: init
  };

})();
