'use strict';

(function () {
  var MAP = window.map;
  var FORM = window.form;
  var BACKEND = window.backend;
  var MESSAGE = window.message;

  var pageEnabled = false;

  var getPageStatus = function () {
    return pageEnabled;
  };

  var setPageEnabled = function (enabled) {
    pageEnabled = enabled;
    MAP.setMapEnable(enabled);
    FORM.setFormEnable(enabled);
  };

  FORM.init(setPageEnabled);
  MAP.init(getPageStatus, setPageEnabled);

  BACKEND.load(MAP.onAdvertsLoad, MESSAGE.showErrorMessage);

  setPageEnabled(false);

})();
