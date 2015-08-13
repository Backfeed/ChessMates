User = UserClass();

function UserClass() {

  var service = {
    displayNameOf: displayNameOf
  };

  return service;

}

/********* Helper methods *********/
// displayNamesOf :: Object/String -> String
function displayNameOf(userOrId) {
  if (!userOrId) return;
  user = typeof userOrId === 'string' ? F.getUserBy(userOrId) : userOrId;
  if (F.has('profile.name', user)) return user.profile.name;
  if (user.emails) return user.emails[0].address.split('@')[0];
  return "Anonymous user";
}