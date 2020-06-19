'use strict';

(function () {
  var DATA = window.data;

  var templateCard = document.querySelector('#card').content;

  var renderAdvert = function (advert) {
    var newAdvert = templateCard.cloneNode(true);
    var avatar = newAdvert.querySelector('.popup__avatar');
    var title = newAdvert.querySelector('.popup__title');
    var address = newAdvert.querySelector('.popup__text--address');
    var price = newAdvert.querySelector('.popup__text--price');
    var houseType = newAdvert.querySelector('.popup__type');
    var capacity = newAdvert.querySelector('.popup__text--capacity');
    var time = newAdvert.querySelector('.popup__text--time');
    var features = newAdvert.querySelector('.popup__features');
    var description = newAdvert.querySelector('.popup__description');
    var photoContainer = newAdvert.querySelector('.popup__photos');
    var photo = photoContainer.querySelector('img').cloneNode(true);

    title.textContent = advert.offer.title;
    address.textContent = advert.offer.address;
    price.textContent = advert.offer.price + '₽/ночь';
    houseType.textContent = DATA.Placement[advert.offer.type.toUpperCase()].name;
    capacity.textContent = advert.offer.rooms + ' комнаты для ' +
                            advert.offer.guests + ' гостей';
    time.textContent = 'Заезд после ' + advert.offer.checkin +
                          ', выезд до ' + advert.offer.checkout;
    description.textContent = advert.offer.description;
    avatar.src = advert.author.avatar;

    Array.prototype.forEach.call(features.children, function (node) {
      if ((advert.offer.features)
          .indexOf(node.classList[1].split('--')[1]) < 0) {
        node.classList.add('hidden');
      }
    });

    photoContainer.innerHTML = '';
    advert.offer.photos.forEach(function (elem) {
      var img = photo.cloneNode(true);
      img.src = elem;
      photoContainer.appendChild(img);
    });

    return newAdvert;
  };

  window.card = {
    renderAdvert: renderAdvert,
  };

})();

