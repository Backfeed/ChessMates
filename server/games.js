Meteor.publish('games', function (options) {
  return Games.find({} ,options);
});
