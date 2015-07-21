Meteor.publish('clans', function (options, clanId) {
  return Clans.find({});
});

Meteor.methods({
});