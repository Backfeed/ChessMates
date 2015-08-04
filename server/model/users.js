Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: { emails: 1, status: 1, reputation: 1, tokens: 1 } });
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ 'status.online': true }, { fields: {emails: 1, status: 1} });
});

Accounts.onCreateUser(function (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  user.tokens = 100;

  return user;
});