'use strict';

(function () {
  var MAP = window.map;
  var FORM = window.form;

  var isEnablePage = false;

  var getPageStatus = function () {
    return isEnablePage;
  };

  var setPageStatus = function (isEnable) {
    isEnablePage = isEnable;
    MAP.setMapEnable(isEnable);
    FORM.setFormEnable(isEnable);
  };

  FORM.init(
      getPageStatus,
      setPageStatus
  );
  MAP.init(
      FORM.setCurrentAddress,
      getPageStatus,
      setPageStatus
  );

  setPageStatus(false);

})();
