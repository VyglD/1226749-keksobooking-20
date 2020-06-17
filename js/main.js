'use strict';

(function () {
  var MAP_MODULE = window.map;
  var FORM_MODULE = window.form;

  var isEnablePage = false;

  var getPageStatus = function () {
    return isEnablePage;
  };

  var setPageStatus = function (isEnable) {
    isEnablePage = isEnable;
    MAP_MODULE.setMapEnable(isEnable);
    FORM_MODULE.setFormEnable(isEnable);
  };

  MAP_MODULE.init(
      FORM_MODULE.setCurrentAddress,
      getPageStatus,
      setPageStatus
  );
  FORM_MODULE.init(
      getPageStatus,
      setPageStatus
  );
  setPageStatus(false);

})();
