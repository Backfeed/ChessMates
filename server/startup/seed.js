log = function() {
  _DEV.log('STARTUP');
}

/* jshint ignore:start */
Meteor.startup(function () {
  console.log('\n');
  console.log('************************************');
  console.log('********** SERVER STARTUP **********');
  console.log('************************************');
  console.log('\n');

  makeBackfeedersAdmins();
});

function makeBackfeedersAdmins() {
  var backfeeders = User.getBackfeeders();
  if (!backfeeders) 
    return log('Warning! no backfeeders found!');

  _.each(backfeeders, User.makeAdmin);
}
/* jshint ignore:end */