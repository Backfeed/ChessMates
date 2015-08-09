angular.module('blockchess.game', [
  'blockchess.game.routes',
  'blockchess.game.controller',
  'blockchess.game.model',
  // Components
  'blockchess.game.chess',
  // Services
  'blockchess.game.service',
  // Directives
  'blockchess.game.suggestedMoves',
  'blockchess.game.bottomBar',
  'blockchess.game.comments',
  'blockchess.game.players',
  'blockchess.game.timer'
  // Filters
]);