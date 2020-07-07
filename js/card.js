'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;

  var FEATURE_CLASS_REGEX = /popup__feature--(.*)$/;

  var templateCard = document.querySelector('#card').content;

  var setTitle = function (advertInfo, newAdvert) {
    var title = newAdvert.querySelector('.popup__title');

    if (advertInfo.offer.title) {
      title.textContent = advertInfo.offer.title;
    } else {
      UTIL.hideElement(title);
    }
  };

  var setAvatar = function (advertInfo, newAdvert) {
    var avatar = newAdvert.querySelector('.popup__avatar');

    if (advertInfo.author.avatar) {
      avatar.src = advertInfo.author.avatar;
    } else {
      UTIL.hideElement(avatar);
    }
  };

  var setAddress = function (advertInfo, newAdvert) {
    var address = newAdvert.querySelector('.popup__text--address');

    if (advertInfo.offer.address) {
      address.textContent = advertInfo.offer.address;
    } else {
      UTIL.hideElement(address);
    }
  };

  var setPrice = function (advertInfo, newAdvert) {
    var price = newAdvert.querySelector('.popup__text--price');

    if (advertInfo.offer.price) {
      price.textContent = advertInfo.offer.price + '₽/ночь';
    } else {
      UTIL.hideElement();
    }
  };

  var setHouseType = function (advertInfo, newAdvert) {
    var houseType = newAdvert.querySelector('.popup__type');

    if (advertInfo.offer.type) {
      houseType.textContent = DATA.Placement[advertInfo.offer.type.toUpperCase()].name;
    } else {
      UTIL.hideElement(houseType);
    }
  };

  // rooms и guests могут быть нолями => проверка на undefined
  var setCapacity = function (advertInfo, newAdvert) {
    var capacity = newAdvert.querySelector('.popup__text--capacity');

    if ((typeof advertInfo.offer.rooms !== 'undefined')
          && (typeof advertInfo.offer.guests !== 'undefined')) {

      capacity.textContent = advertInfo.offer.rooms + ' комнаты для ' +
                              advertInfo.offer.guests + ' гостей';
    } else {
      UTIL.hideElement(capacity);
    }
  };

  var setTime = function (advertInfo, newAdvert) {
    var time = newAdvert.querySelector('.popup__text--time');

    if (advertInfo.offer.checkin && advertInfo.offer.checkout) {
      time.textContent = 'Заезд после ' + advertInfo.offer.checkin +
                            ', выезд до ' + advertInfo.offer.checkout;
    } else {
      UTIL.hideElement(time);
    }
  };

  var setFeatures = function (advertInfo, newAdvert) {
    var featuresContainer = newAdvert.querySelector('.popup__features');

    if (advertInfo.offer.features) {
      featuresContainer.querySelectorAll('li').forEach(function (node) {
        for (var i = 0; i < node.classList.length; i++) {
          var match = node.classList[i].match(FEATURE_CLASS_REGEX);

          if (match) {
            if (!advertInfo.offer.features.includes(match[1])) {
              node.classList.add('hidden');
            }
            break;
          }
        }
      });
    } else {
      UTIL.hideElement(featuresContainer);
    }
  };

  var setDescription = function (advertInfo, newAdvert) {
    var description = newAdvert.querySelector('.popup__description');

    if (advertInfo.offer.description) {
      description.textContent = advertInfo.offer.description;
    } else {
      UTIL.hideElement(description);
    }
  };

  var setPhoto = function (advertInfo, newAdvert) {
    var photoContainer = newAdvert.querySelector('.popup__photos');
    var photo = photoContainer.querySelector('img').cloneNode(true);

    if (advertInfo.offer.photos) {
      photoContainer.innerHTML = '';
      advertInfo.offer.photos.forEach(function (elem) {
        var img = photo.cloneNode(true);
        img.src = elem;
        photoContainer.appendChild(img);
      });
    } else {
      UTIL.hideElement(photoContainer);
    }
  };

  var renderAdvert = function (advertInfo) {
    var newAdvert = templateCard.cloneNode(true);

    setTitle(advertInfo, newAdvert);
    setAvatar(advertInfo, newAdvert);
    setAddress(advertInfo, newAdvert);
    setPrice(advertInfo, newAdvert);
    setHouseType(advertInfo, newAdvert);
    setCapacity(advertInfo, newAdvert);
    setTime(advertInfo, newAdvert);
    setFeatures(advertInfo, newAdvert);
    setDescription(advertInfo, newAdvert);
    setPhoto(advertInfo, newAdvert);

    return newAdvert.firstElementChild;
  };

  window.card = {
    renderAdvert: renderAdvert,
  };

})();

