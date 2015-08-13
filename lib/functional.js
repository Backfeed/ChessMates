F = (function() {
  /***************** PURE *****************/
  // toFixed :: Number, Number -> String
  toFixed = R.curry(function(l, x) {
    return x.toFixed(l);
  });

  max = R.curry(function(f, xs) {
    return _.max(xs, f);
  });

  // sumBy :: String, [] -> Number
  sumBy = function(prop, xs) {
    return R.compose(R.sum, R.pluck(prop))(xs);
  }

  trace = R.curry(function(tag, x){
    console.log(tag, x);
    return x;
  });

  // decimel :: Number, Number -> Number
  decimel = R.curry(function(l, n) {
    if (!n) return;
    if (_.contains(n.toString(), 'e'))
      n = R.compose(parseFloat, R.head, R.split('e'), R.toString)(n);
    return R.compose(parseFloat, toFixed(l))(n);
  });

  /***************** App specific *****************/
  // isMine :: Object -> String
  isMine = R.propEq(this.uid, 'uid');

  // getMine :: [Object] -> [Object]
  getMine = R.filter(isMine);

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

  mapUsersBy = R.map(getUserBy);

  isNotationEquals = R.propEq('notation')

  toUid = R.prop('uid');

  mapUids = R.map(toUid);

  addToRep = R.curry(function(n, u) {
    u.reputation += n;
    return u;
  });

  return {

    toFixed: toFixed,
    max: max,
    sumBy: sumBy,
    trace: trace,
    decimel: decimel,
    isMine: isMine,
    getMine: getMine,
    getUserBy: getUserBy,
    mapFields: mapFields,
    getUsersBy: getUsersBy,
    mapUsersBy: mapUsersBy,
    isNotationEquals: isNotationEquals,
    toUid: toUid,
    mapUids: mapUids,
    addToRep: addToRep

  };

})();