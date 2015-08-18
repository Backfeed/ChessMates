describe('GameController', function () {
  beforeEach(module('blockchess'));

  // Get a new controller and rootscope before each test is executed
  var $controller = {};
  var $scope = {};
  beforeEach(inject(function (_$rootScope_, _$controller_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
  }));

  it('should have a gameId', function () {
    $controller('GameController as ctrl', {
        $scope: $scope
    });
    expect($scope.ctrl.game.gameId).toBe('1');
  });

});