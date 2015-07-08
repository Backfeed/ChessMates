Games = new Mongo.Collection('games');

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

Meteor.methods({
  updateGameState: function updateGameState(gameId, fen, pgn) {
    check(gameId, String);
    check(fen, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    var game = Games.findOne(partyId);
    if (! game)
      throw new Meteor.Error(404, "No such game");

    if (fen) {

      if (Meteor.isServer) {
        Games.update(
          {_id: gameId},
          {$set: {"fen": fen, "pgn": pgn}});
      } else {
        var modifier = {$set: {}};
        modifier.$set["fen"] = fen;
        modifier.$set["pgn"] = pgn;
        Games.update(gameId, modifier);
      }
    } else {
      // add new position entry
      Games.update(gameId,
        {$push: {fen: fen, pgn: pgn}});
    }
  },
  suggestMove: function suggestMove(gameId, fen, notation) {

    // validations
    // check that this move hasn't yet been suggested
    // check that user is logged in

    // Callback
    // After creating a suggested move you must pass params to create a evaluation
    // createEvaluation(evaluationParams);

    // SuggestedMove
    //   belongs_to :game

    //   suggestor_user_id
    //   fen (the new board position)
    //   next_pgn (All the moves including the suggested move)
    //   avg_stars (1-5)
    //   reputation_sum (1-5)
    //   created_at (datetime)
    //   updated_at (datetime)
    //   relevance_score
    //   chosen:boolean

    check(gameId, String);
    check(fen, String);
    check(notation, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    var game = Games.findOne({ game_id: gameId });
    if (! game)
      throw new Meteor.Error(404, "No such game");

    if (Meteor.isServer) {
      Games.update({ game_id: gameId },
        {$push: {
          suggested_moves: {
            user_id: this.userId,
            notation: notation,
            avg_stars: '4.5',
            created_at: Date.now(),
            fen: fen
          }
        }});
    } else {
      var modifier = {$set: {}};
      modifier.$set["suggested_moves"] = {
        user_id: this.userId,
        notation: notation,
        avg_stars: '4.5',
        created_at: Date.now(),
        fen: fen
      };
      Games.update({ game_id: gameId }, modifier);
    }
    //if (fen) {
    //  Games.update({ game_id: gameId },
    //    {$push: {
    //      suggested_moves: {
    //        user_id: this.userId,
    //        notation: notation,
    //        avg_stars: '4.5',
    //        created_at: Date.now(),
    //        fen: fen
    //      }
    //    }});
    //}
  },
  evaulateMove: function evaulateMove(moveId, stars) {

    // Callbacks
    // distributeRepution

    // belongs_to :suggested_move

    // suggested_move_id
    // user_id
    // stars
    // reputation
    // tokens
    // favorite_move:boolean
  },
  favoriteMove: function favoriteMove(moveId) {
    // update users favorite moveId and remove from all others
  },
  distributeRepution: function distributeRepution(gameId) {
    // Redistribute reputation after move

    console.log('distributeRepution');

  },
  endTurn: function endTurn(gameId) {
    console.log('endTurn');
    Meteor.clearInterval(GameInterval);
    whosTurnStream.emit('whosTurn', 'AI');
  },
  updateTimer: function updateTimer(gameId, timeLeft) {
    //console.log('updateTimer', timeLeft);
    timerStream.emit('timer', timeLeft);
  },
  startTurn: function startTurn(gameId) {
    check(gameId, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    var game = Games.findOne({ game_id: gameId });
    if (! game)
      throw new Meteor.Error(404, "No such game");

    whosTurnStream.emit('whosTurn', 'Clan');
    if (Meteor.isServer) {
      var timeLeft = 30000;
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
  startGame: function startGame(gameId) {

  },
  stopGame: function stopGame(gameId) {
    check(gameId, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    var game = Games.findOne({ game_id: gameId });
    if (! game)
      throw new Meteor.Error(404, "No such game");

    if (Meteor.isServer) {
      SyncedCron.stop();
      Games.update(
        {game_id: gameId},
        {$set: {"settings": {
          'inPlay': false,
          'timePerMove': +15000,
          'timeLeft': +15000
        }
        }});
    }
  },
  pauseGame: function pauseGame(gameId) {
    check(gameId, String);
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");
    var game = Games.findOne({ game_id: gameId });
    if (! game)
      throw new Meteor.Error(404, "No such game");

    if (Meteor.isServer) {
      SyncedCron.pause();
    }
  }
});

if (Meteor.isServer) {
  GameInterval = {};
}
