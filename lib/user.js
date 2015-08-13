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
  var name;
  if (!userOrId) return;
  user = typeof userOrId === 'string' ? F.getUserBy(userOrId) : userOrId;

  if (F.has('profile.name', user)) {
    name = user.profile.name;
  } else if (user.emails) { 
    name = user.emails[0].address.split('@')[0];
  } else {
    name = "Anonymous user";
  }

  return capitalize(name);
}
