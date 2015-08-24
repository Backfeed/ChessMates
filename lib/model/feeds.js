Feeds = new Mongo.Collection('feeds');

// TODO :: why this doens't work 
// Feeds.allow({
//   insert: function (uid)                         {//     return false;   },
//   update: function (uid, game, fields, modifier) { return true; },
//   remove: function (uid, game)                   { return true; }
// });