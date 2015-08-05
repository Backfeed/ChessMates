curry = lodash.curry;

compose = lodash.compose;

filter = curry(function(f, xs) {
  return xs.filter(f);
});

match = curry(function(what, x) {
  return x.match(what);
});

map = curry(function(f, xs) {
  return _.map(xs, f)
});

// add :: Number, Number -> Number
add = curry(function(a, b) {
  return a + b;
});

// isMine :: Object -> String
isMine = function(x) { 
  return x.userId === Meteor.userId();
}

// getMine :: [Object] -> [Object]
getMine = function(xs) {
  return _.filter(xs, isMine);
}

// property :: Object -> a
property = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};

// getUserBy :: String -> Object
getUserBy = function(userId) {
  return Meteor.users.findOne(userId);
}

// sum :: [Number] -> Number
sum = function(xs) {
  return _.reduce(xs, add, 0);
}