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
    suggestedMoves: $meteor.collection(SuggestedMoves),
    comments      : $meteor.collection(Comments).subscribe('evaluations', $scope.selected_move._id),
    evaluations   : $meteor.collection(Evaluations),
    evauluateMove : evauluateMove,
    addComment : addComment,
    selected_move : {}
  });

  $meteor.autorun($scope, function() {
    $meteor.subscribe('suggested_moves', {}, gameId).then(function(){
      console.log($scope.suggested_moves);
    });

    $meteor.subscribe('evaluations', {}, $scope.getReactively('selected_move')._id).then(function(){
      console.log($scope.suggested_moves);
    });

    $meteor.subscribe('comments', {}, $scope.getReactively('selected_move')._id).then(function(){
      console.log($scope.suggested_moves);
    });

  });

  $scope.$on('singleMove', singleMove);
  $scope.$on('suggestedMovesSelected', suggestedMovesSelected);

  function singleMove(e, from, to, isLegal) {
    console.log(e, from, to, isLegal)
    if (isLegal) {
      $scope.suggestedMoves.push({fen: from+to, game_id: gameId, currentUser_id: $scope.currentUser._id});
    } else {
      console.log("that's illegal fool");
      alert("that's illegal fool");
    }
  }

  function evauluateMove() {
    $scope.evaluations.push({
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