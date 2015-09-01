_DEV = (function() {

  var service = {
    log: log
  };

  return service;

  function log(prefix) {

    if (Meteor.isServer)
      prefix = "SERVER: " + prefix;
    if (Meteor.isClient)
      prefix = "CLIENT: " + prefix;

    return function() {
      if (Meteor.isServer && inProduction()) return;
      console.log('***************** ' + prefix + ' *******************');
      _.each(arguments, function(msg) { console.log(msg); });
      console.log('***************** /' + prefix + ' *******************');
      console.log('\n');
    };
  }

})();