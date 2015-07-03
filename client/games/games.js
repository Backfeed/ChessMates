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
  // For development
  $scope.Engine = Engine;
  // avoid binding break
  $scope.foo = {};
  // For development
  $scope.playAI = function() {
    Engine.getMove($scope.foo.game.history({ verbose: true }).map(function(move){ return move.from + move.to }).join(" "));
  }

  var gameId = "1";

  angular.extend($scope, {
    suggestedMoves: $meteor.collection(SuggestedMoves),
    comments      : $meteor.collection(Comments),
    evaluations   : $meteor.collection(Evaluations),
    evauluateMove : evauluateMove,
    history: "",
    selected_move : {}
  });

  $scope.$on('singleMove', singleMove);
  $scope.$on('suggestedMovesSelected', suggestedMovesSelected);
  $scope.$on('angularStockfish::bestMove', onBestMove);

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

  function onBestMove(e, from, to, promotion) {
    $scope.foo.game.move({ from: from, to: to, promotion: promotion });
    $scope.foo.board.position($scope.foo.game.fen());
  }

  function singleMove(e, from, to, isLegal) {
    console.log(e, from, to, isLegal);
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

}