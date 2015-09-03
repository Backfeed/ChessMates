angular.module('blockchess.game.suggestedMoves.service', [])
.service('SugMovService', SugMovService);

var log = _DEV.log('SugMovService');

function SugMovService($rootScope, $meteor, GameModel) {
  var $scope = $rootScope.$new();

  var service = {
    getCurrentUserMoveCount: getCurrentUserMoveCount,
    isMoveExists: isMoveExists,
    getByNotation: getByNotation,
    init: init,
    moves: {}
  };

  // TODO :: Implement autorun here instead ofgame tcrl
  // Tracker.autorun(function () {
  //   log('AUTORUN')
  //   var gameId = "vW3SNdaZen5HDZvFm";
  //   var game = GameModel.game[gameId];
  //   $scope.$meteorSubscribe('suggestedMoves', gameId).then(function() {
  //     log('AUTORUN subscription then')
  //     service.moves[gameId] = $scope.$meteorCollection(SuggestedMoves, { gameId: gameId, turnIndex: game.turnIndex }, false);
  //   })
  // });

  return service;

  function init(gameId) {
    var game = GameModel.game[gameId];
    var subscriptionPromise;
    service.moves[gameId] = $scope.$meteorCollection(SuggestedMoves, { gameId: gameId, turnIndex: game.turnIndex }, false);

    return $scope.$meteorSubscribe('suggestedMoves', gameId);
  }

  function getCurrentUserMoveCount(gameId) {
    var game = GameModel.game[gameId];
    var moves = service.moves[gameId];
    return _.where(moves, { 
      turnIndex: game.turnIndex,
      uid: Meteor.userId()
    }).length;
  }

  function getByNotation(gameId, notation) {
    var game = GameModel.game[gameId];
    var moves = service.moves[gameId];
    return F.filterBy('notation', notation, moves);
  }

  function isMoveExists(gameId, notation) {
    return getByNotation(gameId, notation).length > 0;
  }

}