Common = (function Common() {
  
  return {
    displayNamesOf: displayNamesOf,
    displayNameOf: displayNameOf
  };

  function displayNameOf(userOrId) {
    if (!userOrId) return;
    user = typeof userOrId === 'string' ? F.getUserBy(userOrId) : userOrId;
    if (user.profile && user.profile.name) return user.profile.name;
    if (user.emails) return user.emails[0].address;
    return "Anonymous user";
  }

  function displayNamesOf(usersIds) {
    return _.map(usersIds, F.displayNameOf);
  }

})();