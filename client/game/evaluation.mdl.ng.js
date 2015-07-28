angular.module('blockchess.game.evaluationModel', [])
.service('EvaluationModel', EvaluationModel);

function EvaluationModel(GameModel) {

//   var model = {
//     getUserEvaluationBy: getUserEvaluationBy,
//     getFavoriteByUser: getFavoriteByUser,
//     flagFavorite: flagFavorite,
//     rate: rate
//   };

//   return model;

//   function rate(move, stars) {
//     var evaluation = getUserEvaluationBy(move);
//     if (evaluation) { evaluation.stars = stars; }
//     else            { create(move, stars); }
//   }

//   function getUserEvaluationBy(move) {
//     if (!move.evaluations || !move.evaluations.length) { return false; }
//     var evaluation = false;
//     move.evaluations.forEach(function(evl) {
//       if (evl.userId === Meteor.userId()) {
//         evaluation = evl;
//       }
//     });
//     return evaluation;
//   }

//   function flagFavorite(move, flag) {
//     if (flag && getFavoriteByUser()) { unFlagFavorite(); } // In case another move is already flagged
//     var evaluation = getUserEvaluationBy(move);
//     evaluation.favoriteMove = flag;
//   }

//   function unFlagFavorite() {
//     var move = getFavoriteByUser();
//     var evaluation = getUserEvaluationBy(move);
//     evaluation.favoriteMove = false;
//   }

//   function getFavoriteByUser(userId) {
//     var moveId = getFavoriteId(userId);
//     if (!moveId) { return false; }

//     return _.find(GameModel.suggestedMoves, function(sugMove) {
//       return sugMove._id === moveId;
//     });

//   }

//   function getFavoriteId(userId) {
    
//     return _.find(GameModel.evaluations, function(evl) {
//       if (evl.favoriteMove && evl.userId === (userId || Meteor.userId()) ) {
//         return moveId = evl.moveId;
//       }
//     })
//   }

}