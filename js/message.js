'use strict';

(function () {
  var UTIL = window.util;

  var errorTemplate = document.querySelector('#error').content;
  var successTemplate = document.querySelector('#success').content;

  var showMessage = function (popup) {

    var closeButton = popup.querySelector('button');
    var message = popup.querySelector('p');

    var closeMessage = function () {
      popup.remove();

      document.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onPopupEscPress);
    };

    var onPopupCloseClick = function (evt) {
      if (closeButton && evt.target.closest('.' + closeButton.className)
          || !(message && evt.target.closest('.' + message.className))) {
        closeMessage();
      }
    };

    var onPopupEscPress = function (evt) {
      UTIL.isEscEvent(evt, closeMessage);
    };

    document.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscPress);

    document.querySelector('main').appendChild(popup);
  };

  var showErrorMessage = function () {
    showMessage(errorTemplate.cloneNode(true).firstElementChild);
  };

  var showSuccessMessage = function () {
    showMessage(successTemplate.cloneNode(true).firstElementChild);
  };

  window.message = {
    showErrorMessage: showErrorMessage,
    showSuccessMessage: showSuccessMessage,
  };

})();
