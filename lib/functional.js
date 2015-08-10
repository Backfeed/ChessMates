curry = lodash.curry;
compose = lodash.compose;

/***************** PURE *****************/
/***************** PURE | Curry *****************/
filter = curry(function(f, xs) {
  return xs.filter(f);
});

max = curry(function(f, xs) {
  return _.max(xs, f);
});

each = curry(function(f, xs) {
  return _.each(xs, f);
});

find = curry(function(f, xs){
  return _.find(xs, f);
});

match = curry(function(what, x) {
  return x.match(what);
});

map = curry(function(f, xs) {
  return _.map(xs, f)
});

// split :: String -> [String]
split = curry(function(what, x) {
  return x.split(what);
});

// add :: Number, Number -> Number
add = curry(function(a, b) {
  return a + b;
});

multiply = curry(function(a, b) {
  return a * b;
});

divide = curry(function(a, b) {
  return b / a;
});

// toFixed :: Number, Number -> String
toFixed = curry(function(l, x) {
  return x.toFixed(l);
});

isEqual = curry(function(what, x) {
  return x === what;
});

trace = curry(function(tag, x){
  console.log(tag, x);
  return x;
});

/***************** PURE |  *****************/
// toString :: Number -> String
toString = function(x) {
  return x.toString();
};

// property :: Object -> a
property = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};

// head :: [a] -> a
head = function(xs) {
  return xs[0];
};

// sum :: [Number] -> Number
sum = function(xs) {
  return _.reduce(xs, add, 0);
};

// decimel :: Number, Number -> Number
decimel = curry(function(l, n) {
  if (!n) return;
  if (_.contains(n.toString(), 'e'))
    n = compose(parseFloat, head, split('e'), toString)(n);
  return compose(parseFloat, toFixed(l))(n);
});

// average :: [Number] -> Number
average = function(xs) {
  if (!xs || !xs.length) return 0;
  return sum(xs) / xs.length;
}

/***************** App specific *****************/
// isMine :: Object -> String
isMine = function(x) { 
  return x.userId === Meteor.userId();
};

// getMine :: [Object] -> [Object]
getMine = filter(isMine);

// getUserBy :: String -> Object
getUserBy = function(uid) {
  return Meteor.users.findOne(uid);
} 

// TODO :: Use _ or ramda for this
mapFields = function(fields, bool) {
  var fieldsObj = {};
  _.each(fields, function(field) {
    fieldsObj[field] = bool;
  });
  return fieldsObj;
}

// getUsersBy :: Object / undefined -> [Object]
getUsersBy = function(q, fields, bool) {
  q = q || {};
  if (fields)
    fields = mapFields(fields, !bool);
  return Meteor.users.find(q, { fields: fields });
}

mapUsersBy = map(getUserBy);

isNotationEquals = curry(function(what, x) {
  return x.notation === what;
});

toUid = property('userId');

mapUids = map(toUid);

addToRep = curry(function(n, u) {
  u.reputation += n;
  return u;
});