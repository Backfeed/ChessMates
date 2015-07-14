angular.module('blockchess.games.util', [
  // Models (angular services who handle DB data)
  'blockchess.games.util.evaluationModel',
  'blockchess.games.util.model',
  // Services
  'blockchess.games.util.gameBoardService',
  'blockchess.games.util.boardService',
  'blockchess.games.util.service',
  // Directives
  'blockchess.games.util.suggestedMovesPanel',
  'blockchess.games.util.suggestedMoves',
  'blockchess.games.util.comments',
  'blockchess.games.util.players',
  'blockchess.games.util.board',
  'blockchess.games.util.timer',
  // Modals
  'blockchess.games.util.suggestMoveModal'
]);
