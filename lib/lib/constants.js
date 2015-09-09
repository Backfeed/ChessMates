USER_INITIAL_TOKENS = 80
USER_INITIAL_REP = 160

MOVE_COST = 10;
BASE_STAKE = 0.1;
BASE_FUNDS = 50;
STARS_VAL = [0, 1, 3, 7, 15];
STARS_TOKENS = [-10, 10, 20, 50, 100];
SUG_MOVE_TOKENS_REP_RATIO = 0.2;
MOVES_PER_TURN = 2;

if (Meteor.isServer) {
  inDevelopment = function () {
    return process.env.NODE_ENV === "development";
  };

  inProduction = function () {
    return process.env.NODE_ENV === "production";
  };
}

if (Meteor.isClient) {
  inDevelopment = function () {
    return Meteor.absoluteUrl().indexOf('localhost') > -1;
  };

  inProduction = function () {
    return Meteor.absoluteUrl().indexOf('localhost') < -1;
  };
}