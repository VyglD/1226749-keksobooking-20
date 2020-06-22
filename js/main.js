'use strict';

(function () {
  var MAP = window.map;
  var FORM = window.form;

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

  setPageEnabled(false);

})();
