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
    return adverts.map(function (advert) {
      return advert.offer
        ? {
          link: createPinElement(advert).firstElementChild,
          advert: advert,
        }
        : null;
    })
    .filter(function (it) {
      return it;
    });
  };

  window.pin = {
    getPins: getPins,
  };

})();
