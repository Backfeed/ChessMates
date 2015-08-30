Meteor.methods({
  evaluate: evaluate,
  getAiMove: getAiMove
});

var log = _DEV.log('Evaluator');

Evaluator = (function() {
  var Promise = Meteor.npmRequire('promise');
  var ev = Meteor.npmRequire('stockfish')();
  var promise = new Promise(function (resolve, reject) {
    var line;
    ev.onmessage = function(e) {
      if (e && typeof e === "object") {
          line = e.data;
      } else {
          line = e;
      }
      if (line.indexOf('Total Evaluation') > -1) {
        var score = parseFloat(line.split('Total Evaluation: ')[1].split('(')[0])
        resolve(score);
      }
    };
  });
  
  
  return function(movesStr) { 
    ev.postMessage('position startpos moves ' + movesStr);
    ev.postMessage("eval");
    return promise;
  }
  
})();

function evaluate(movesStr) {
  return Evaluator(movesStr);
}

Enginator = (function() {
  var Promise = Meteor.npmRequire('promise');
  var eng = Meteor.npmRequire('stockfish')();
  var getPromise = function() {
    return new Promise(function (resolve, reject) {
      var line;
      eng.onmessage = Meteor.bindEnvironment(function(e) {
        if (e && typeof e === "object") {
            line = e.data;
        } else {
            line = e;
        }
        var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
        if (match) {
          var move = {
            from: match[1],
            to: match[2],
            promotion: match[3]
          };
          resolve(move)
        }

      });

    });
  }
  
  return function(movesStr, config) {
    eng.postMessage('position startpos moves ' + movesStr);

    if (config.time && config.time.wtime) {
      eng.postMessage("go depth " + config.depth + " wtime " + config.time.wtime + " winc " + config.time.winc + " btime " + config.time.btime + " binc " + config.time.binc);
    } else {
      eng.postMessage("go depth " + config.depth);
    }

    return getPromise();
  }
  
})();

function getAiMove(movesStr, config) {  
  config = config || { depth: 3 };

  return Enginator(movesStr, config);
}