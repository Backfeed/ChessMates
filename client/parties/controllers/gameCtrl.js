angular.module("blockchess").controller("GameCtrl", ['$scope', '$stateParams', '$meteor',
  function($scope, $stateParams, $meteor){
    // $scope.games = $meteor.collection(Games, false).subscribe('games');

    //$scope.suggested_moves = $meteor.collection(SuggestedMoves, true).subscribe('suggested_moves', $stateParams.game_id);
    $scope.suggested_moves = $meteor.collection(SuggestedMoves);

    // $scope.suggested_moves = $meteor.object(SuggestedMoves, 1);

     $scope.sort = { 'fen': 1 };

    //$scope.suggested_moves = $meteor.collection(function() {
    //  return SuggestedMoves.find({ 'game_id': $stateParams.game_id });
    //}).subscribe('suggested_moves');

    $scope.evaluations = $meteor.collection(function() {
        return Evaluations.find({ 'game_id': $stateParams.game_id });
    }).subscribe('suggested_moves');

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


    $scope.createMoveSuggestion = function(){
      $scope.suggested_move.user_id   = $scope.currentUser._id;
      $scope.suggested_move.game_id = $stateParams.game_id;
      $scope.suggested_moves.push($scope.suggested_move);
      $scope.suggested_move = '';
    }


    $scope.evauluateMove = function(move){
      $scope.evaluation.user_id           = $scope.currentUser._id;
      $scope.evaluation.game_id           = $stateParams.game_id;
      $scope.evaluation.suggested_move_id = move._id;
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
