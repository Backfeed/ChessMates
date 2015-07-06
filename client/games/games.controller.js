angular.module('blockchess.games.controller', [])
.controller('GamesController', GamesController)

function GamesController($scope, $meteor, CommonService, Engine) {
  var gameId = "1"; // TODO: Get dynamically from current game
  var ctrl = this;
  angular.extend(ctrl, {
    executeMove: executeMove,
    restart: restart, // DEV ONLY
    Engine : Engine, // DEV ONLY
    game: $meteor.object(Games, { game_id: gameId }).subscribe('games'),
    selectedMove  : {},
    fen            : 'start'
  });

  $scope.$watch('ctrl.game.fen', function(){
    if (ctrl.game.fen && ctrl.fen !== ctrl.game.fen)
    {
      ctrl.boardGame.load(ctrl.game.fen);
      ctrl.board.position(ctrl.game.fen);
      ctrl.fen = ctrl.game.fen;
    }
  });


  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$on('angularStockfish::bestMove', onAIMove);
  $scope.$watch('ctrl.selectedMove', selectedMoveChanged);

  function selectedMoveChanged(move) {
    cancelMoveHighlights();
    if (!move || !move.notation) { return; }
    var from = move.notation.substr(0,2);
    var to = move.notation.substr(2);
    $('.square-'+from + ', .square-'+to).addClass('highlight-square');
  }

  function cancelMoveHighlights() {
    $('.highlight-square').removeClass('highlight-square');
  }

  // For development
  function restart () {
    cancelMoveHighlights();
    ctrl.boardGame.reset();
    ctrl.board.position('start');
    angular.extend(ctrl.game, {
      fen: 'start',
      pgn: '',
      turns: [],
      suggested_moves: []
    });
  }

  function executeMove() {
    cancelMoveHighlights();
    //TODO fix this. For now pressing the button will play the first selected move(for dev)
    ctrl.boardGame.move(ctrl.game.suggested_moves[0].notation);
    ctrl.board.position(ctrl.boardGame.fen());
    Engine.getMove(ctrl.boardGame.history({ verbose: true }).map(function(move){ return move.from + move.to }).join(" "));
  }

  function onAIMove(e, from, to, promotion) {
    ctrl.boardGame.move({ from: from, to: to, promotion: promotion });
    ctrl.board.position(ctrl.boardGame.fen());
    ctrl.fen = ctrl.boardGame.fen(); // save for returning the piece to before suggestion position
    ctrl.game.fen = ctrl.boardGame.fen(); //TODO all users should see the updated position
    ctrl.game.pgn = ctrl.boardGame.pgn();
    logTurn();
  }

  function singleMove(e, notation) {
    if (getMoveBy('user_id', $scope.currentUser._id)) {
      CommonService.toast('Can only suggest one move per turn');
      ctrl.selectedMove = getMoveBy('user_id', $scope.currentUser._id);
    } else if (getMoveBy('notation', notation)) {
      CommonService.toast('move exists');
      ctrl.selectedMove = getMoveBy('notation', notation);
    } else {
      ctrl.game.suggested_moves.push({
        user_id: Meteor.userId(),
        notation: notation,
        avg_stars: '4.5',
        created_at: Date.now(),
        fen: ctrl.boardGame.fen(),
        comments: []
      });
    }

    //TODO move the piece back in a more elegant way
    ctrl.boardGame.undo();
    ctrl.board.position(ctrl.fen);
  }

  function getMoveBy(attr, val) {
    var move;
    ctrl.game.suggested_moves.forEach(function(m) {
      if (m[attr] === val) { move = m; }
    });
    return move;
  }

  function logTurn() {
    if (ctrl.game.turns) {
      ctrl.game.turns.push(ctrl.game.suggested_moves);
    } else {
      ctrl.game.turns = [ctrl.game.suggested_moves];
    }
    ctrl.game.suggested_moves = [];
  }

}