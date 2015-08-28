Meteor.publish('clans', publish);

var log = _DEV.log('MODEL: CLANS:');

/********* Helper methods *********/


/********* Publish and hooks *********/
function publish(options, clanId) {
  return Clans.find({});
}