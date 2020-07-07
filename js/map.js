'use strict';

(function () {
  var UTIL = window.util;
  var PIN = window.pin;
  var MAIN_PIN = window.mainPin;
  var CARD = window.card;
  var DATA = window.data;
  var DEBOUNCE = window.debounce;

  var MAX_COUNT_PINS = 5;
  var NUMBER_TYPE = 'number';
  var NO_FILTER = 'any';
  var NAME_PRICE_FIELD = 'price';

  var map = document.querySelector('.map');
  var pinsLocation = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var filtersContainer = map.querySelector('.map__filters-container');
  var filters = map.querySelector('.map__filters');
  var filtersFields = Array.from(filters.querySelectorAll('select'));
  var features = Array.from(filters.querySelectorAll('#housing-features input'));

  var defaultPins = [];
  var defaultValues = {};

  // Функции заглушки, заменяются при вызове init
  var getPageStatus = function () {};
  var setPageStatus = function () {};

  var checkFilterField = function (it, select) {
    var advertValue = it.advert.offer[select.name];
    var filterValue = select.value;

    if (typeof advertValue === NUMBER_TYPE) {
      filterValue = parseInt(filterValue, 10);
    }

    if (advertValue !== filterValue) {
      return false;
    }

    return true;
  };

  var checkFilterPriceField = function (it, select) {
    switch (select.value) {
      case DATA.PriceName.LOW:
        if (it.advert.offer[select.name] >= DATA.PriceValue.MIN) {
          return false;
        }
        break;
      case DATA.PriceName.MIDDLE:
        if (it.advert.offer[select.name] < DATA.PriceValue.MIN
            || it.advert.offer[select.name] >= DATA.PriceValue.MAX) {
          return false;
        }
        break;
      case DATA.PriceName.HIGH:
        if (it.advert.offer[select.name] < DATA.PriceValue.MAX) {
          return false;
        }
    }

    return true;
  };

  var getSimilarAdvertsForSelectedFilterFields = function () {

    var checkedSelects = filtersFields
                        .filter(function (it) {
                          return it.value !== NO_FILTER;
                        })
                        .map(function (it) {
                          return {
                            name: it.id.split('-')[1],
                            value: it.value,
                          };
                        });

    return defaultPins.filter(function (it) {

      for (var i = 0; i < checkedSelects.length; i++) {
        var suitable = true;

        if (checkedSelects[i].name === NAME_PRICE_FIELD) {
          suitable = checkFilterPriceField(it, checkedSelects[i]);
        } else {
          suitable = checkFilterField(it, checkedSelects[i]);
        }

        if (!suitable) {
          return false;
        }
      }

      return true;
    });
  };

  var getSimilarAdvertsForSelectedFeatures = function (adverts) {
    var checkedFeatures = features
                          .filter(function (it) {
                            return it.checked;
                          })
                          .map(function (it) {
                            return it.id.split('-')[1];
                          });

    return adverts.filter(function (it) {
      for (var i = 0; i < checkedFeatures.length; i++) {
        if (!(it.advert.offer.features.includes(checkedFeatures[i]))) {
          return false;
        }
      }

      return true;
    });
  };

  var getSimilarAdverts = function () {
    var adverts = getSimilarAdvertsForSelectedFilterFields();

    if (adverts) {
      return getSimilarAdvertsForSelectedFeatures(adverts);
    }

    return [];
  };

  var onFilterInput = function () {

    onCloseButtonCardClick();

    var pins = getSimilarAdverts();

    DEBOUNCE.debounce(showPins.bind(null, pins));
  };

  var setMapAdvertsEnabled = function (enabled) {
    if (enabled && defaultPins.length > 0) {
      if (enabled) {
        UTIL.setEnableForm(filters, true);
        filters.addEventListener('input', onFilterInput);

        showPins(defaultPins);
      }
    } else {
      UTIL.setEnableForm(filters, false);
      filters.removeEventListener('input', onFilterInput);
    }

    setVisibilityPins(enabled);
  };

  var onCardEscPress = function (evt) {
    UTIL.isEscEvent(evt, onCloseButtonCardClick);
  };

  var onCloseButtonCardClick = function () {
    var oldAdvert = map.querySelector('.map__card.popup');
    if (oldAdvert) {
      UTIL.removeClassFromElement(
          map.querySelector('.map__pin--active'),
          'map__pin--active'
      );
      oldAdvert.remove();
    }
    document.removeEventListener('keydown', onCardEscPress);
  };

  var onPinClick = function (evt) {
    var currentPin = evt.target.closest('.map__pin:not(.map__pin--main)');

    if (currentPin) {
      var currentAdvert = map.querySelector('.map__card.popup');
      var newAdvert = CARD.renderAdvert(defaultPins.find(function (pin) {
        if (pin.link === currentPin) {
          return true;
        }
        return false;
      }).advert);

      if (!(currentAdvert && currentAdvert.innerHTML === newAdvert.innerHTML)) {
        onCloseButtonCardClick();

        UTIL.addClassToElement(currentPin, 'map__pin--active');

        map.insertBefore(
            newAdvert,
            filtersContainer
        );

        var closeButtonCard = map.querySelector('.popup__close');
        closeButtonCard.addEventListener('click', onCloseButtonCardClick);
        document.addEventListener('keydown', onCardEscPress);
      }
    }
  };

  var setMapEnable = function (enabled) {
    if (enabled) {
      UTIL.removeClassFromElement(map, 'map--faded');
      map.addEventListener('click', onPinClick);
    } else {
      UTIL.addClassToElement(map, 'map--faded');
      map.removeEventListener('click', onPinClick);

      onCloseButtonCardClick();

      UTIL.returnDefaultValues(defaultValues);
    }

    setMapAdvertsEnabled(enabled);

    MAIN_PIN.setLocationMainPin(enabled);
  };

  var setVisibilityPins = function (isVisible) {
    var pinNodes = pinsLocation.querySelectorAll('.map__pin:not(.map__pin--main)');

    pinNodes.forEach(function (pin) {
      if (isVisible) {
        UTIL.showElement(pin);
      } else {
        UTIL.hideElement(pin);
      }
    });
  };

  var removeOldPins = function () {
    var pinNodes = pinsLocation.querySelectorAll('.map__pin:not(.map__pin--main)');

    pinNodes.forEach(function (pin) {
      pin.remove();
    });
  };

  var showPins = function (filteredPins) {
    var pinsFragment = document.createDocumentFragment();

    removeOldPins();

    for (var i = 0; i < MAX_COUNT_PINS && i < filteredPins.length; i++) {
      pinsFragment.appendChild(filteredPins[i].link);
    }

    pinsLocation.insertBefore(
        pinsFragment,
        mainPin
    );
  };

  var onAdvertsLoad = function (uploadedAdverts) {
    defaultPins = PIN.getPins(uploadedAdverts);

    if (defaultPins.length > 0) {
      showPins(defaultPins);

      // Проверка на случай, если загрузка объявлений с сервера
      // произойдёт после перевода страницы в активный режим
      if (getPageStatus()) {
        UTIL.setEnableForm(filters, true);
      } else {
        setVisibilityPins(false);
      }
    }
  };

  var recordFiltersDefaultValues = function () {
    filters.querySelectorAll('input, select')
    .forEach(function (node) {
      if (node.type === 'checkbox') {
        defaultValues[node.id] = UTIL.createDefaultValue(node, 'checked', node.checked);
      } else {
        defaultValues[node.id] = UTIL.createDefaultValue(node, 'value', node.value);
      }
    });
  };

  var recordMainPinDefaultValue = function () {
    defaultValues['mainPin'] = UTIL.createDefaultValue(
        mainPin,
        'style',
        'left: ' + mainPin.offsetLeft + 'px; top: ' + mainPin.offsetTop + 'px;'
    );
  };

  var recordDefaultMapValues = function () {
    recordMainPinDefaultValue();
    recordFiltersDefaultValues();
  };

  var onMainPinAction = function () {
    if (!getPageStatus()) {
      setPageStatus(true);
    }
  };

  var init = function (getStatus, setStatus) {

    getPageStatus = getStatus;
    setPageStatus = setStatus;

    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      UTIL.isLeftMouseKeyEvent(evt, onMainPinAction);

      MAIN_PIN.onMainPinMove(evt);
    });

    mainPin.addEventListener('keydown', function (evt) {
      UTIL.isEnterEvent(evt, onMainPinAction);
    });

    MAIN_PIN.setLocationMainPin(false);

    recordDefaultMapValues();

    window.map.onAdvertsLoad = onAdvertsLoad;
    window.map.setMapEnable = setMapEnable;
  };

  window.map = {
    init: init,
  };

})();
