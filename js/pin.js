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
    var pins = [];

    adverts.forEach(function (advert) {
      var newPin = createPinElement(advert);
      pins.push(
          {
            fragment: newPin,
            link: newPin.firstElementChild,
            advert: advert,
          }
      );
    });

    return pins;
  };

  window.pin = {
    getPins: getPins,
  };

})();
