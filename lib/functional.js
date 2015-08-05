curry = lodash.curry;
compose = lodash.compose;

/***************** PURE *****************/
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

// property :: Object -> a
property = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};

// sum :: [Number] -> Number
sum = function(xs) {
  return _.reduce(xs, add, 0);
}


/***************** App specific *****************/
// isMine :: Object -> String
isMine = function(x) { 
  return x.userId === Meteor.userId();
}

// getMine :: [Object] -> [Object]
getMine = function(xs) {
  return _.filter(xs, isMine);
}

// getUserBy :: String -> Object
getUserBy = function(userId) {
  return Meteor.users.findOne(userId);
}

// getUsersBy :: Object / undefined -> [Object / undefined]
getUsersBy = function(query) {
  query = query || {};
  return Meteor.users.find(query);
}