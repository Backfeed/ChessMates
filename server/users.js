Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: {emails: 1, status: 1} });
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ 'status.online': true }, { fields: {emails: 1, status: 1} });
});

connectionStream.permissions.write(function() { return true; });
connectionStream.permissions.read(function()  { return true; });
