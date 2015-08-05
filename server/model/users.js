Meteor.publish(null, publish);
Meteor.publish("userStatus", publishStatus);

Accounts.onCreateUser(onCreate);

function publish() {
  return getUsersBy({}, { fields: { emails: 1, status: 1, reputation: 1, tokens: 1 } });
}

function publishStatus() {
  return getUsersBy({ 'status.online': true }, { fields: {emails: 1, status: 1} });
}

function onCreate (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  user.tokens = 100;

  return user;
}