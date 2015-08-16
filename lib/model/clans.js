Clans = new Mongo.Collection('clans');

Clans.allow({
    insert: function (uid)                         { return true; },
    update: function (uid, game, fields, modifier) { return true; },
    remove: function (uid, game)                   { return true; }
});

