Evaluations = new Mongo.Collection("evaluations");

Evaluations.allow({
  insert: function (userId, evaluation) {
    return userId;
  }
});

Meteor.methods({
})
