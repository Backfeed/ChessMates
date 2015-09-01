Meteor.publish(null, publish);
Meteor.publish("userStatus", publishStatus);

Accounts.onCreateUser(onCreate);

var log = _DEV.log('MODEL: USERS:');


/********* Helper methods *********/


/********* Publish and hooks *********/
function publish() {
  return F.getUsersBy({}, ["emails", "status", "reputation", "tokens", "admin"]);
}

function publishStatus() {
  return F.getUsersBy({ 'status.online': true }, ["emails", "status", "reputation", "tokens", "admin"]);
}

function onCreate (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  user.tokens = 80;
  user.reputation = 160;

  return user;
}