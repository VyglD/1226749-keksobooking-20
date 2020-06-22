'use strict';

(function () {

  var showErrorMessage = function (errorMessage) {
    var onErrorAction = function () {
      document.querySelector('#' + nodeId).remove();
      document.removeEventListener('click', onErrorAction);
      document.removeEventListener('keydown', onErrorAction);
    };

    var node = document.createElement('div');
    var nodeWidth = 300;
    var nodeId = 'error-message';

    node.id = nodeId;
    node.style = 'position: fixed;' +
                  'top: 50%;' +
                  'left: 50%;' +
                  'z-index: 100;' +
                  'width: ' + nodeWidth + 'px;' +
                  'margin: 0 0 0 ' + (nodeWidth / -2) + 'px;' +
                  'padding: 10px;' +
                  'font-size: 30px;' +
                  'text-align: center;' +
                  'color: white;' +
                  'background-color: red;' +
                  'cursor: pointer;';

    document.addEventListener('click', onErrorAction);
    document.addEventListener('keydown', onErrorAction);

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.message = {
    showErrorMessage: showErrorMessage,
  };

})();
