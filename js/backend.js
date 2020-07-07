'use strict';

(function () {

  var TIMEOUT_IN_MS = 10000;
  var JSON_RESPONSE_TYPE = 'json';

  var Url = {
    LOAD: 'https://javascript.pages.academy/keksobooking/data',
    SAVE: 'https://javascript.pages.academy/keksobooking',
  };

  var StatusCode = {
    OK: 200
  };

  var Method = {
    GET: 'GET',
    POST: 'POST',
  };

  var sendRequest = function (method, data, url, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = JSON_RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(method, url);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    sendRequest(Method.GET, null, Url.LOAD, onLoad, onError);
  };

  var save = function (data, onLoad, onError) {
    sendRequest(Method.POST, data, Url.SAVE, onLoad, onError);
  };

  window.backend = {
    load: load,
    save: save,
  };

})();
