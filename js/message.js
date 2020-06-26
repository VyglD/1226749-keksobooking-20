'use strict';

(function () {
  var UTIL = window.util;

  var errorTemplate = document.querySelector('#error').content;

  var showErrorMessage = function () {
    var closeErrorMessage = function () {
      document.querySelector('.error').remove();

      document.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onPopupEscCPress);
    };

    var onPopupCloseClick = function (evt) {
      if (evt.target.closest('.error__button')
        || !evt.target.closest('.error__message')) {
        closeErrorMessage();
      }
    };

    var onPopupEscCPress = function (evt) {
      UTIL.isEscEvent(evt, closeErrorMessage);
    };

    var popup = errorTemplate.cloneNode(true);
    document.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onPopupEscCPress);

    document.querySelector('main').appendChild(popup);
  };

  window.message = {
    showErrorMessage: showErrorMessage,
  };

})();
