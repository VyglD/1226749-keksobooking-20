'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var templatePin = document.querySelector('#pin').content;

  var createPinElement = function (advert) {
    var newPin = templatePin.cloneNode(true);
    var button = newPin.querySelector('button');
    var img = newPin.querySelector('img');

    button.style.left = (advert.location.x - (PIN_WIDTH / 2)) + 'px';
    button.style.top = (advert.location.y - PIN_HEIGHT) + 'px';
    img.src = advert.author.avatar;
    img.alt = advert.offer.title;

    return newPin;
  };

  var getPins = function (adverts) {
    var pins = document.createDocumentFragment();

    adverts.forEach(function (advert) {
      pins.appendChild(createPinElement(advert));
    });

    return pins;
  };

  window.pin = {
    getPins: getPins,
  };

})();
