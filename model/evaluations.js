Evaluations = new Mongo.Collection('evaluations');

Evaluations.allow({
  insert: function () {
    return true;
  }
});

Meteor.methods({

});
