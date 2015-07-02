Comments = new Mongo.Collection('comments');

Comments.allow({
  insert: function () {
    return true;
  }
});

Meteor.methods({

});
