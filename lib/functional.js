// isMine :: Object -> String
isMine = function(x) { 
  console.log("isMine: <- ", x);
  console.log("isMine: -> ", x.userId === Meteor.userId());
  return x.userId === Meteor.userId();
}

// getMine :: [Object] -> [Object]
getMine = function(arr) {
  console.log("getMine: <- ", arr);
  console.log("getMine: -> ", _.filter(arr, isMine));
  if (!arr || !arr.length) return false;
  return _.filter(arr, isMine);
}

// property :: Object -> a
property = function(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
};

// toRaw :: cursor -> a
toRaw = function(cursor) {
  var raw = cursor.getRawObject();
  if (_.isEmpty(raw)) { return undefined; }
  else                { return raw; }
}