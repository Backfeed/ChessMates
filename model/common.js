Games = new Mongo.Collection('games');
whosTurnStream = new Meteor.Stream('turnChanged');
timerStream = new Meteor.Stream('timer');
connectionStream = new Meteor.Stream('connection');

Games.allow({
    insert: function (userId) {
        //return userId && game.owner === userId;
      return true;
    },
    update: function (userId, game, fields, modifier) {
        //if (userId !== game.owner)
        //    return false;

        return true;
    },
    remove: function (userId, game) {
        //if (userId !== game.owner)
        //    return false;

        return true;
    }
});

//Games.after.update(function(userId, doc, fieldNames, modifier, options){
//  console.log('game collection updated');
//});

Meteor.methods({
  distributeReputation: function distributeReputation(gameId) {
    validateGame(gameId);
    // Redistribute reputation after move
    console.log('distributeReputation');
  },
  executeMove: function executeMove(history) {
    console.log('executeMove');
    if (Meteor.isServer) {
      console.log('my history ', history);
      //var promise = Engine.getMove(history);
      //promise.then(function(data) {
      //  console.log(data);
      //});
        Meteor.wrapAsync(Engine.getMove(history), function(data) {
          console.log(data);
        });
    }
  },
  endTurn: function endTurn(gameId) {
    console.log('endTurn');
    Meteor.clearInterval(GameInterval);
    whosTurnStream.emit('turnChanged', 'AI');
  },
  updateTimer: function updateTimer(gameId, timeLeft) {
    timerStream.emit('timer', timeLeft);
  },
  startTurn: function startTurn(gameId) {
    validateGame(gameId);

    whosTurnStream.emit('turnChanged', 'Clan');
    if (Meteor.isServer) {
      var game = Games.findOne({ game_id: gameId });
      var timeLeft = game.settings.timePerMove;
      Meteor.clearInterval(GameInterval);
      GameInterval = Meteor.setInterval(function(){
        timeLeft -= 1000;
        if (timeLeft <= 0)
        {
          Meteor.call('endTurn', gameId);
        } else {
          Meteor.call('updateTimer', gameId, timeLeft);
        }
      }, 1000);
    }
  },
  endGame: function endGame(gameId) {
    validateGame(gameId);

    if (Meteor.isServer) {
      Meteor.clearInterval(GameInterval);
    }
  },
  pauseGame: function pauseGame(gameId) {
    validateGame(gameId);

    if (Meteor.isServer) {

    }
  },
  clientDone: function clientDone(gameId) {
    validateGame(gameId);

    ClientsDone.push(this.userId);
    // check if all online users pressed the I'm Done button
    if (Meteor.users.find({ "status.online": true }).count() === ClientsDone.length){
      whosTurnStream.emit('turnChanged', 'AI');
      Meteor.call('executeMove', 'e2e4');
      ClientsDone = [];
    }
  }
});

function validateGame(gameId) {
  check(gameId, String);
  if (! Meteor.userId())
    throw new Meteor.Error(403, "You must be logged in");
  var game = Games.findOne({ game_id: gameId });
  if (! game)
    throw new Meteor.Error(404, "No such game");
}

if (Meteor.isServer) {
  GameInterval = {};
}

ClientsDone = [];


Meteor.users.find({ "status.online": true }).observe({
  added: function(user) {
    //console.log('added user', user);
    connectionStream.emit('connections');
  },
  removed: function(user) {
    //console.log('removed user', user);
    connectionStream.emit('connections');
  }
});
