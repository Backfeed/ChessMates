angular.module('blockchess.util.desktopNotifier', [])
.service('DesktopNotifier', DesktopNotifier);

log = _DEV.log('DESKTOP NOTIFIER');

function DesktopNotifier($window, $timeout, Toast) {

  var service = {
    notify: notify
  };

  return service;

  // body, autoCloseTime are optional
  function notify(title, body) {
    if (! $window.Notification) {
      delegateToToast(title, body);
      return;
    }

    var permission = $window.Notification.permission;

    if (permission === 'default') {
      $window.Notification.requestPermission(create);
    } 

    else if (permission === 'granted') {
      create();
    } 

    else if (permission === 'denied') {
      delegateToToast(title, body);
    }

    function create() {
      var notification = new Notification(title, { body: body });
      
      $timeout(function() {
        notification.close();
      }, 3000);
    }

  }

  function delegateToToast(title, body) {
    if (body) {
      Toast.toast(title + " " + body);
    } else {
      Toast.toast(title);
    }
  }

}