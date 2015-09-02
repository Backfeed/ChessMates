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
  var backfeeders = Meteor.users.find({ 'emails.0.address': /backfeed.cc/ }).fetch();
  if (!backfeeders) 
    return log('Warning! no backfeeders found!');

  _.each(backfeeders, makeAdmin);
}

function makeAdmin(user) {
  Roles.addUsersToRoles([user._id], "admin");
}

/* jshint ignore:end */