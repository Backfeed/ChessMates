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
    game : $meteor.collection(Games),
    suggestedMoves : {},
    comments       : {},
    evaluations    : {},
    evaluateMove : evaluateMove,
    addComment : addComment,
    fen : 'start',
    selected_move : {}
  });

  $meteor.autorun($scope, function() {
    //TODO gameId should become game._id in production(using mongo default _id value)
    $meteor.subscribe('games', {}, gameId).then(function(){
      $scope.game = $scope.game[0]; //Games.findOne(gameId);
      //$scope.fen = $scope.getReactively('game').fen;
      $scope.suggestedMoves = $scope.getReactively('game', true).suggested_moves;
      console.log('Game loaded start position');
    });

    //$meteor.subscribe('evaluations', {}, $scope.getReactively('selected_move')._id).then(function(){
    //  console.log($scope.suggested_moves);
    //});

  });


  function onBestMove(e, from, to, promotion) {
    $scope.foo.game.move({ from: from, to: to, promotion: promotion });
    $scope.foo.board.position($scope.foo.game.fen());
  }


  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$on('suggestedMovesSelected', suggestedMovesSelected);
  $scope.$on('angularStockfish::bestMove', onBestMove);

  function singleMove(e, board, game) {
    //TODO validate that this is the first time the player makes a suggestion
    var pgn = game.pgn();
    var notation = pgn.slice(pgn.lastIndexOf('.')+2, pgn.length);
    $meteor.call('suggestMove', gameId, board.fen(), notation).then(
      function(){
        //TODO alert the user that the move has been suggested
        console.log('success on suggesting a move');
        alert('success on suggesting a move');
        //TODO move the piece back
        board.position($scope.fen);
      },
      function(err){
        console.log('failed', err);
      }
    );
  }

  function evaluateMove() {
    $scope.game.evaluations.push({
      user_id: $scope.currentUser._id,
      game_id: gameId,
      suggested_move_id: $scope.selectedMove._id,
      favorite_move: $scope.selectedMove.favorite_move,
      stars: $scope.selectedMove.stars
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
