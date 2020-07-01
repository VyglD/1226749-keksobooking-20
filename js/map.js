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

  var getDefaultMapValues = function () {

    UTIL.getDefaultValue(
        defaultValues,
        'mainPin',
        mainPin,
        'style',
        'left: ' + mainPin.offsetLeft + 'px; top: ' + mainPin.offsetTop + 'px;'
    );

    filters.querySelectorAll('input, select')
    .forEach(function (node) {
      if (node.type === 'checkbox') {
        UTIL.getDefaultValue(defaultValues, node.id, node, 'checked', node.checked);
      } else {
        UTIL.getDefaultValue(defaultValues, node.id, node, 'value', node.value);
      }
    });
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

  var onCardEscPress = function (evt) {
    UTIL.isEscEvent(evt, onCloseButtonCardClick);
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

      if (!(currentAdvert
          && currentAdvert.innerHTML === newAdvert.firstElementChild.innerHTML)) {
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

  var getSimilarAdverts = function () {

    var checkedFeatures = features
                          .filter(function (it) {
                            return it.checked;
                          })
                          .map(function (it) {
                            return it.id.split('-')[1];
                          });

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
      var suitable = true;

      for (var i = 0; i < checkedSelects.length; i++) {
        var suitableValue = true;

        if (checkedSelects[i].name === NAME_PRICE_FIELD) {
          suitableValue = checkFilterPriceField(it, checkedSelects[i]);
        } else {
          suitableValue = checkFilterField(it, checkedSelects[i]);
        }

        if (!suitableValue) {
          suitable = false;
          break;
        }
      }

      if (suitable) {
        for (var j = 0; j < checkedFeatures.length; j++) {
          if (it.advert.offer.features.indexOf(checkedFeatures[j]) === -1) {
            suitable = false;
            break;
          }
        }
      }

      return suitable;
    });
  };

  var onFilterInput = function () {

    onCloseButtonCardClick();

    var pins = getSimilarAdverts();

    DEBOUNCE.debounce(showPins.bind(null, pins));
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

  var init = function (getStatus, setStatus) {

    var onAdvertsLoad = function (uploadedAdverts) {
      defaultPins = PIN.getPins(uploadedAdverts);
      showPins(defaultPins);

      setVisibilityPins(false);
      if (getStatus()) {
        UTIL.setEnableForm(filters, true);
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

        UTIL.setDefaultValues(defaultValues);
      }

      if (defaultPins.length > 0 && enabled) {
        UTIL.setEnableForm(filters, true);
        showPins(defaultPins);
        filters.addEventListener('input', onFilterInput);
      } else {
        UTIL.setEnableForm(filters, false);
        filters.removeEventListener('input', onFilterInput);
      }

      setVisibilityPins(enabled);
      MAIN_PIN.setLocationMainPin(enabled);
    };

    var onMainPinAction = function () {
      var enableMap = getStatus();
      if (getStatus() === false) {
        enableMap = true;
        setStatus(enableMap);
      }

      MAIN_PIN.setLocationMainPin(enableMap);
    };

    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      UTIL.isLeftMouseKeyEvent(evt, onMainPinAction);

      MAIN_PIN.onMainPinMove(evt);
    });

    mainPin.addEventListener('keydown', function (evt) {
      UTIL.isEnterEvent(evt, onMainPinAction);
    });

    MAIN_PIN.setLocationMainPin(getStatus());

    getDefaultMapValues();

    window.map.setMapEnable = setMapEnable;
    window.map.onAdvertsLoad = onAdvertsLoad;
  };

  window.map = {
    init: init,
  };

})();
