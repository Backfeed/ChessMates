User = UserClass();


var log = _DEV.log("SHARED USER")

function UserClass() {

  var service = {
    isBackfeeder: isBackfeeder,
    getBackfeeders: getBackfeeders,
    displayNameOf: displayNameOf,
    makeAdmin: makeAdmin,
    isOwner: isOwner,
    isAdmin: isAdmin,
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

  if (user && user.profile && user.profile.name) {
    name = user.profile.name;
  } else if (user.emails) { 
    name = user.emails[0].address.split('@')[0];
  } else {
    name = "Anonymous user";
  }

  return F.capitalize(name);
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

function inc(uid, prop, amount) {
  check(amount, Number);
  var query = { $inc: { } };
  query.$inc[prop] = amount
  Meteor.users.update(uid, query);
}

function isOwner(item) {
  return item.ownerId === Meteor.userId();
}

function isAdmin(uid) {
  uid = uid || Meteor.userId();
  return _.contains(getRoles(uid), "admin");
}

function getRoles(uid) {
  uid = uid || Meteor.userId();
  return Roles.getRolesForUser(uid);
}

function makeAdmin(userOrId) {
  userOrId = userOrId || Meteor.userId();
  return Roles.addUsersToRoles(userOrId, "admin");
}

function getBackfeeders () { 
  return Meteor.users.find({ 'emails.0.address': /backfeed.cc/ }).fetch();
}

function isBackfeeder(userOrId) {
  var user = ensureObject(userOrId);
  return user.emails[0].address.indexOf('backfeed.cc') > -1;
}