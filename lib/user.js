User = UserClass();


function UserClass() {

  var service = {
    displayNameOf: displayNameOf,
    inc: inc,
    set: set,
    getRep: getRep
  };

  return service;

}

/********* Helper methods *********/
// displayNamesOf :: Object/String -> String
function displayNameOf(userOrId) {
  var name;
  if (!userOrId) return;
  user = ensureObject(userOrId);

  if (F.has(user, 'profile.name')) {
    name = user.profile.name;
  } else if (user.emails) { 
    name = user.emails[0].address.split('@')[0];
  } else {
    name = "Anonymous user";
  }

  return capitalize(name);
}

function getRep(userOrId) {
  user = ensureObject(userOrId);
  return user.reputation;
}

function ensureObject(userOrId) {
  return typeof userOrId === 'string' ? F.getUserBy(userOrId) : userOrId;
}

function set(uid, prop, v) {
  var query = { $set: { } };
  query.$set[prop] = v
  Meteor.users.update(uid, query);
}

function inc(uid, prop, n) {
  var query = { $inc: { } };
  query.$inc[prop] = n
  Meteor.users.update(uid, query);
}