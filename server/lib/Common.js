console.log('common!');
Common = (function Common() {
  
  return {
    displayNamesOf: displayNamesOf,
    displayNameOf: displayNameOf
  };

  function displayNameOf(user) {
    if (!user) return;
    if (user.profile && user.profile.name) return user.profile.name;
    if (user.emails) return user.emails[0].address;
    return "Anonymous user";
  }

  function displayNamesOf(usersIds) {
    return usersIds.map(function(userId) {
      return Common.displayNameOf(Meteor.users.findOne(userId));
    });
  }


})();