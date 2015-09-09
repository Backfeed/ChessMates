angular.module('blockchess.util.desktopNotifier', [])
.service('DesktopNotifier', DesktopNotifier);

log = _DEV.log('DESKTOP NOTIFIER');

function DesktopNotifier($window, $timeout, Toast) {
  var notificationSound = new Audio('audio/notification.mp3');
  var service = {
    
    notify: notify
    
  };

  return service;

  // body is optional
  function notify(title, body) {

    resetNotificationSoundIfActive(notificationSound);

    notificationSound.play();

    if (! $window.Notification) {
      delegateToToast(title, body);
      return;
    }

    var permission = $window.Notification.permission;

    if (permission === 'default') {
      $window.Notification.requestPermission(R.partial(create, title, body));
    } 

    else if (permission === 'granted') {
      create(title, body);
    } 

    else if (permission === 'denied') {
      delegateToToast(title, body);
    }

  }

  function create(title, body) {
    var notification = new Notification(title, { body: body, silent: true });
    
    $timeout(function() {
      notification.close();
    }, 3000);

  }

  function delegateToToast(title, body) {

    if (body) {
      Toast.toast(title + " " + body);
    }
    
    else {
      Toast.toast(title);
    }

  }

}

function resetNotificationSoundIfActive(notificationSound) {
  if (! notificationSound.paused) {
    notificationSound.pause();
    notificationSound.currentTime = 0;
  }
}