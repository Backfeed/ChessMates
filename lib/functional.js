F = (function() {
  /***************** PURE *****************/
  // toFixed :: Number, Number -> String
  toFixed = R.curry(function(l, x) {
    return x.toFixed(l);
  });

  max = R.curry(function(f, xs) {
    return _.max(xs, f);
  });

  // sumBy :: String, [Object] -> Number
  sumBy = R.curry(function(prop, xs) {
    return R.compose(R.sum, R.pluck(prop))(xs);
  });

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

  // TODO :: Make functional
  // Object, *String -> a
  deepProp = function (obj) {
    for (var i=1; i<arguments.length; i++) {
      if (typeof obj === 'object')
        obj = obj[arguments[i]];
    }
    return obj;
  }

  toBool = function(x) {
    return !!x;
  }

  // TODO :: Make functional
  has = function(obj) {
    return !!deepProp(obj)
  }

  // capitalize :: String -> String
  capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  isActive = R.compose(toBool, R.prop('active'));

  filterActive = R.filter(isActive);


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

  toUid = R.prop('uid');
  mapUids = R.map(toUid);

  toId = R.prop('_id');
  mapIds = R.map(toId);

  return {

    deepProp: deepProp, // NOT FUNCTIONAL !!
    has: has, // NOT FUNCTIONAL !!
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
    toUid: toUid,
    mapUids: mapUids,
    toId: toId,
    mapIds: mapIds,
    filterActive: filterActive

  };

})();