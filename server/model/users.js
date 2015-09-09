Meteor.publish(null, publish);
Meteor.publish("userStatus", publishStatus);

Accounts.onCreateUser(onCreate);

var log = _DEV.log('MODEL: USERS:');


/********* Helper methods *********/


/********* Publish and hooks *********/
function publish() {
  return F.getUsersBy({}, ["emails", "status", "reputation", "tokens", "admin", "profile"]);
}

function publishStatus() {
  return F.getUsersBy({ 'status.online': true }, ["emails", "status", "reputation", "tokens", "admin", "profile"]);
}

function onCreate (options, user) {
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  user.tokens = USER_INITIAL_TOKENS;
  user.reputation = USER_INITIAL_REP;

  if ( User.isBackfeeder(user) ) {
    Meteor.setTimeout(function() {
      // Doesn't work withoutthe timeout.
      // It could be that Roles package needs the after create method (which I can't find, maybe it doesn't even exist in meteor accountspackage)
      User.makeAdmin(user._id);
    }, 5000);
  }

  return user;
}