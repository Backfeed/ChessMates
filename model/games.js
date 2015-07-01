Games = new Mongo.Collection("games");

Games.allow({
    insert: function (userId, game) {
        return userId && game.owner === userId;
    },
    update: function (userId, game, fields, modifier) {
        if (userId !== game.owner)
            return false;

        return true;
    },
    remove: function (userId, game) {
        if (userId !== game.owner)
            return false;

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
    suggestMove: function suggestMove(gameId, fen, next_pgn) {

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
    distributeRepution: function distributeRepution(options) {
        // Redistribute reputation after move


    },
    commentOnMove: function commentOnMove(moveId, text) {

      // Validations
      // check if move is still active

      // belongs_to :suggested_move

      // suggested_move_id
      // user_id
      // text
      // created_at


    }
});
