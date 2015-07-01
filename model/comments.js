Comments = new Mongo.Collection("comments");

Comments.allow({
  insert: function (userId, comment) {
    return true;
  }
});

Meteor.methods({
})
