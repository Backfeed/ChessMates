User = UserClass();


function UserClass() {

  var service = {
    displayNameOf: displayNameOf,
    updateRep: updateRep,
    incRep: incRep,
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

  if (F.has('profile.name', user)) {
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

function updateRep(uid, rep) {
  Meteor.users.update(uid, { $set: { reputation: rep } });
}

function incRep(uid, n) {
  Meteor.users.update(uid, { $inc: { reputation: n } });
}