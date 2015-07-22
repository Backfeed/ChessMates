Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: { emails: 1, status: 1, reputation: 1, tokens: 1 } });
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ 'status.online': true }, { fields: {emails: 1, status: 1} });
});

//Meteor.users.find({ "status.online": true }).observe({
//  added: function(user) { connectionStream.emit('connections'); },
//  removed: function(user) { connectionStream.emit('connections'); }
//});
