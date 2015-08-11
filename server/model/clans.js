Meteor.publish('clans', publish);


/********* Helper methods *********/


/********* Publish and hooks *********/
function publish(options, clanId) {
  return Clans.find({});
}