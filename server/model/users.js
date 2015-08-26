Meteor.publish(null, publish);
Meteor.publish("userStatus", publishStatus);
Accounts.onCreateUser(onCreate);


/********* Helper methods *********/


/********* Publish and hooks *********/
function publish() {
  return F.getUsersBy({}, ["emails", "status", "reputation", "tokens"]);
}

function publishStatus() {
  return F.getUsersBy({ 'status.online': true }, ["emails", "status", "reputation", "tokens"]);
}

function onCreate (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  user.tokens = 200;
  user.reputation = 100;

  return user;
}