angular.module('blockchess.games', [])
.config(config)
.controller('BlockchessGames', GamesController)

function config($stateProvider){

    $stateProvider
        .state('games', {
            url: '/games',
            templateUrl: 'client/games/games.ng.html',
            controller: 'BlockchessGames'
        });
}

function GamesController($scope, $meteor, Engine) {
  $scope.Engine = Engine;
  var gameId = "1";

  angular.extend($scope, {
    game : $meteor.collection(Games),
    suggestedMoves : {},
    comments       : {},
    evaluations    : {},
    evaluateMove : evaluateMove,
    addComment : addComment,
    selected_move : {}
  });

  $meteor.autorun($scope, function() {
    $meteor.subscribe('games', {}, gameId).then(function(){
      console.log('Game loaded');
    });

    //$meteor.subscribe('evaluations', {}, $scope.getReactively('selected_move')._id).then(function(){
    //  console.log($scope.suggested_moves);
    //});

  });

  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$on('suggestedMovesSelected', suggestedMovesSelected);

  function singleMove(e, from, to, isLegal) {
    console.log(e, from, to, isLegal);
    if (isLegal) {
      //TODO validate that this is the first time the player makes a suggestion
      //TODO alert the user that the move has been suggested
      $scope.game.suggestedMoves.push({fen: from+to, game_id: gameId, currentUser_id: $scope.currentUser._id});
    } else {
      console.log("that's illegal fool");
    }
  }

  function evaluateMove() {
    $scope.game.evaluations.push({
      user_id: $scope.currentUser._id,
      game_id: gameId,
      suggested_move_id: $scope.selected_move._id,
      favorite_move: $scope.selected_move.favorite_move,
      stars: $scope.selected_move.stars
    });
  }

  function suggestedMovesSelected(e, move) {
    $scope.selected_move = move;
  }

  function addComment() {
    console.log($scope.comment);
    $scope.comments.push({
      user_id: $scope.currentUser._id,
      game_id: gameId,
      suggested_move_id: $scope.selected_move._id,
      body: $scope.comment.body
    });
    $scope.comment = ''
  }

}
