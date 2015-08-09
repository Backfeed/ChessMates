Meteor.publish(null, publish);
Meteor.publish("userStatus", publishStatus);

Accounts.onCreateUser(onCreate);

function publish() {
  return getUsersBy({}, ["emails", "status", "reputation", "tokens"]);
}

function publishStatus() {
  return getUsersBy({ 'status.online': true }, ["emails", "status"]);
}

function onCreate (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  user.tokens = 100;

  return user;
}