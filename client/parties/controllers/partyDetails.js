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

        $scope.updatePosition = function(position, pgn){
            $meteor.call('updatePosition', $scope.party._id, position, pgn).then(
                function(){
                    console.log('success on new position');
                },
                function(err){
                    console.log('failed', err);
                }
            );
        };

        $scope.updateStatus = function(status){
            $meteor.call('updateStatus', $scope.party._id, status).then(
                function(){
                    console.log('status updated');
                },
                function(err){
                    console.log('failed', err);
                }
            );
        };

        $scope.$watch('party.position', function(){
            if ($scope.party && $scope.party.position) {
                console.log($scope.party.position);
                board.position($scope.party.position);
            }
        });

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
            game = new Chess();
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
            $scope.updatePosition(game.fen(), game.pgn());
            //board.position(game.fen());
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

            $scope.updateStatus(status);
        };

        var cfg = {
            draggable: true,
            //position: 'start',
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

        function init()
        {
            var game = engineGame(null, $scope);

            var newGame = function newGame() {
                var baseTime = parseFloat($('#timeBase').val()) * 60;
                var inc = parseFloat($('#timeInc').val());
                var skill = parseInt($('#skillLevel').val());
                game.reset();
                game.setTime(baseTime, inc);
                game.setSkillLevel(skill);
                game.setPlayerColor($('#color-white').hasClass('active') ? 'white' : 'black');
                game.setDisplayScore($('#showScore').is(':checked'));
                game.start();
            }

            game.setSkillLevel

            document.getElementById("skillLevel").addEventListener("change", function ()
            {
                game.setSkillLevel(parseInt(this.value, 10));
            });

            newGame();
        }
        init();



    }]);
