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

  // проверка наличия advert.offer добавлена по ТЗ: 5.2
  var getPins = function (adverts) {
    var pins = [];

    for (var i = 0; i < adverts.length; i++) {
      if (adverts[i].offer) {
        pins.push({
          link: createPinElement(adverts[i]).firstElementChild,
          advert: adverts[i],
        });
      }
    }

    return pins;
  };

  window.pin = {
    getPins: getPins,
  };

})();
