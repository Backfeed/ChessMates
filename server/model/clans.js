Meteor.publish('clans', publish);

function publish(options, clanId) {
  return Clans.find({});
}