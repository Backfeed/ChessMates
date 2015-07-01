angular.module("blockchess").controller("GameCtrl", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){

    $scope.selected_move = {}

    $scope.suggested_moves = $meteor.collection(SuggestedMoves);
    $scope.evaluations = $meteor.collection(Evaluations).subscribe('evaluations', $scope.selected_move_id);;

    $scope.sort = { 'fen': 1 };

    //$scope.suggested_moves = $meteor.collection(function() {
    //  return SuggestedMoves.find({ 'game_id': $stateParams.game_id });
    //}).subscribe('suggested_moves');

    $scope.evaluations = $meteor.collection(function() {
        return Evaluations.find();
    }).subscribe('evaluations');

    // $scope.sort_types = [
    //                       { 'value': 'updated_at',       'text': 'Recent'},
    //                       { 'value': 'user_rank',        'text': 'By Players Rank'},
    //                       { 'value': 'total_reputation', 'text': 'Top Ranked'},
    //                       { 'value': 'avg_stars',        'text': 'Most Valued'}
    //                     ]
    // $scope.selected_sort_type = 'updated_at'

     $meteor.autorun($scope, function() {

       $meteor.subscribe('suggested_moves', {
          sort: $scope.getReactively('sort')
       }, $stateParams.game_id).then(function(){
          console.log($scope.suggested_moves);
       });

     });

    $scope.setSelectedMove = function(move){
      $scope.selected_move = move;
    }

    $scope.createMoveSuggestion = function(){
      $scope.suggested_move.user_id   = $scope.currentUser._id;
      $scope.suggested_move.game_id = $stateParams.game_id;
      $scope.suggested_moves.push($scope.suggested_move);
      $scope.suggested_move = '';
    }

    $scope.evauluateMove = function(){
      $scope.evaluation.user_id           = $scope.currentUser._id;
      $scope.evaluation.game_id           = $stateParams.game_id;
      $scope.evaluation.suggested_move_id = $scope.selected_move._id;
      $scope.evaluations.push($scope.evaluation);
      $scope.evaluation = '';
    }

    $scope.updateGameState = function(gameId, fen, pgn){
      $meteor.call('updateGameState', gameId, fen, pgn).then(
        function(){    console.log('success on new position'); },
        function(err){ console.log('failed', err); }
      );
    };

    $scope.suggestMove = function(gameId, fen, next_pgn){
      $meteor.call('suggestMove', gameId, fen, next_pgn).then(
        function(){    console.log('success on suggestion'); },
        function(err){ console.log('failed', err); }
      );
    };

    $scope.evaulateMove = function(moveId, stars){
      $meteor.call('evaulateMove', moveId, stars).then(
        function(){    console.log('success on evaluation'); },
        function(err){ console.log('failed', err); }
      );
    };

    $scope.favoriteMove = function(moveId){
      $meteor.call('favoriteMove', moveId).then(
        function(){    console.log('chose favororite move'); },
        function(err){ console.log('failed', err); }
      );
    };

    $scope.commentOnMove = function(moveId, text){
      $meteor.call('commentOnMove', moveId, text).then(
        function(){    console.log('comment submitted'); },
        function(err){ console.log('comment failed', err); }
      );
    };

  }]);
