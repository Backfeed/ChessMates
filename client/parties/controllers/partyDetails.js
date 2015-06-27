angular.module("socially").controller("PartyDetailsCtrl", ['$scope', '$stateParams', '$meteor',
    function($scope, $stateParams, $meteor){

        $scope.party = $meteor.object(Parties, $stateParams.partyId);

        var subscriptionHandle;
        $meteor.subscribe('parties').then(function(handle) {
            subscriptionHandle = handle;
        });

        $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');

        $scope.invite = function(user){
            $meteor.call('invite', $scope.party._id, user._id).then(
                function(data){
                    console.log('success inviting', data);
                },
                function(err){
                    console.log('failed', err);
                }
            );
        };

        $scope.$on('$destroy', function() {
            subscriptionHandle.stop();
        });

        $scope.canInvite = function (){
            if (!$scope.party)
                return false;

            return !$scope.party.public &&
                $scope.party.owner === Meteor.userId();
        };

        var board,
            game = new Chess(),
            statusEl = $('#status');

    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
        var onDragStart = function(source, piece, position, orientation) {
            if (game.game_over() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        };

        var onDrop = function(source, target) {
            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';

            updateStatus();
        };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
        var onSnapEnd = function() {
            board.position(game.fen());
        };

        var updateStatus = function() {
            var status = '';

            var moveColor = 'White';
            if (game.turn() === 'b') {
                moveColor = 'Black';
            }

            // checkmate?
            if (game.in_checkmate() === true) {
                status = 'Game over, ' + moveColor + ' is in checkmate.';
            }

            // draw?
            else if (game.in_draw() === true) {
                status = 'Game over, drawn position';
            }

            // game still on
            else {
                status = moveColor + ' to move';

                // check?
                if (game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                }
            }

            statusEl.html(status);
        };

        var cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };

        board = new ChessBoard('board2', cfg);

        $scope.startGame = function () {
            board.start();
        };

        $scope.clearBoard = function () {
            board.clear();
        };

  //$scope.map = {
        //  center: {
        //    latitude: 45,
        //    longitude: -73
        //  },
        //  zoom: 8,
        //  events: {
        //    click: function (mapModel, eventName, originalEventArgs) {
        //      if (!$scope.party)
        //        return;
        //
        //      if (!$scope.party.location)
        //        $scope.party.location = {};
        //
        //      $scope.party.location.latitude = originalEventArgs[0].latLng.lat();
        //      $scope.party.location.longitude = originalEventArgs[0].latLng.lng();
        //      //scope apply required because this event handler is outside of the angular domain
        //      $scope.$apply();
        //    }
        //  },
        //  marker: {
        //    options: { draggable: true },
        //    events: {
        //      dragend: function (marker, eventName, args) {
        //        if (!$scope.party.location)
        //          $scope.party.location = {};
        //
        //        $scope.party.location.latitude = marker.getPosition().lat();
        //        $scope.party.location.longitude = marker.getPosition().lng();
        //      }
        //    }
        //  }
        //};

    }]);
