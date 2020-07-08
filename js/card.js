'use strict';

(function () {
  var UTIL = window.util;
  var DATA = window.data;

  var FEATURE_CLASS_REGEX = /popup__feature--(.*)$/;

  var templateCard = document.querySelector('#card').content;

  var setTitle = function (advertTitle, newAdvert) {
    var titleNode = newAdvert.querySelector('.popup__title');

    if (advertTitle) {
      titleNode.textContent = advertTitle;
    } else {
      UTIL.hideElement(titleNode);
    }
  };

  var setAvatar = function (advertAvatar, newAdvert) {
    var avatarNode = newAdvert.querySelector('.popup__avatar');

    if (advertAvatar) {
      avatarNode.src = advertAvatar;
    } else {
      UTIL.hideElement(avatarNode);
    }
  };

  var setAddress = function (advertAddress, newAdvert) {
    var address = newAdvert.querySelector('.popup__text--address');

    if (advertAddress) {
      address.textContent = advertAddress;
    } else {
      UTIL.hideElement(address);
    }
  };

  var setPrice = function (advertPrice, newAdvert) {
    var price = newAdvert.querySelector('.popup__text--price');

    if (advertPrice) {
      price.textContent = advertPrice + '₽/ночь';
    } else {
      UTIL.hideElement();
    }
  };

  var setHouseType = function (advertHouseType, newAdvert) {
    var houseType = newAdvert.querySelector('.popup__type');

    if (advertHouseType) {
      houseType.textContent = DATA.Placement[advertHouseType.toUpperCase()].name;
    } else {
      UTIL.hideElement(houseType);
    }
  };

  var setCapacity = function (advertRooms, advertGuests, newAdvert) {
    var capacity = newAdvert.querySelector('.popup__text--capacity');

    if ((typeof advertRooms !== 'undefined')
          && (typeof advertGuests !== 'undefined')) {
      capacity.textContent = advertRooms + ' комнаты для ' + advertGuests + ' гостей';
    } else {
      UTIL.hideElement(capacity);
    }
  };

  var setTime = function (advertCheckIn, advertCheckOut, newAdvert) {
    var time = newAdvert.querySelector('.popup__text--time');

    if (advertCheckIn && advertCheckOut) {
      time.textContent = 'Заезд после ' + advertCheckIn + ', выезд до ' + advertCheckOut;
    } else {
      UTIL.hideElement(time);
    }
  };

  var setFeatures = function (advertFeatures, newAdvert) {
    var featuresContainer = newAdvert.querySelector('.popup__features');

    if (advertFeatures) {
      featuresContainer.querySelectorAll('li').forEach(function (node) {
        for (var i = 0; i < node.classList.length; i++) {
          var match = node.classList[i].match(FEATURE_CLASS_REGEX);

          if (match) {
            if (!advertFeatures.includes(match[1])) {
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

  var setDescription = function (advertDescription, newAdvert) {
    var description = newAdvert.querySelector('.popup__description');

    if (advertDescription) {
      description.textContent = advertDescription;
    } else {
      UTIL.hideElement(description);
    }
  };

  var setPhoto = function (advertPhotos, newAdvert) {
    var photoContainer = newAdvert.querySelector('.popup__photos');
    var photo = photoContainer.querySelector('img').cloneNode(true);

    if (advertPhotos) {
      photoContainer.innerHTML = '';
      advertPhotos.forEach(function (elem) {
        var img = photo.cloneNode(true);
        img.src = elem;
        photoContainer.appendChild(img);
      });
    } else {
      UTIL.hideElement(photoContainer);
    }
  };

  var renderAdvert = function (advertCard) {
    var newAdvert = templateCard.cloneNode(true);

    setTitle(advertCard.offer.title, newAdvert);
    setAvatar(advertCard.author.avatar, newAdvert);
    setAddress(advertCard.offer.address, newAdvert);
    setPrice(advertCard.offer.price, newAdvert);
    setHouseType(advertCard.offer.type, newAdvert);
    setCapacity(advertCard.offer.rooms, advertCard.offer.guests, newAdvert);
    setTime(advertCard.offer.checkin, advertCard.offer.checkout, newAdvert);
    setFeatures(advertCard.offer.features, newAdvert);
    setDescription(advertCard.offer.description, newAdvert);
    setPhoto(advertCard.offer.photos, newAdvert);

    return newAdvert.firstElementChild;
  };

  window.card = {
    renderAdvert: renderAdvert,
  };

})();

