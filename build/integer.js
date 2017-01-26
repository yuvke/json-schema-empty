"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// create smallest number that satisfies:
// it bigger than minimum and it is mulitple of multipleOf
var minmul = function minmul(minimum, multipleOf, exclusive) {

  // if we can return 0, we do that
  if (minimum < 0 || !exclusive && minimum <= 0) {
    return 0;
  }

  var min = exclusive ? minimum + 1 : minimum;
  var rest = min % multipleOf;

  if (rest === 0) {
    return min;
  }

  var sign = multipleOf / Math.abs(multipleOf);
  var quot = (min - rest) / multipleOf;

  return (quot + sign) * multipleOf;
};

// create smallest number that satisfies:
// it bigger than minimum and it is mulitple of multipleOf
var maxmul = function maxmul(maximum, multipleOf, exclusive) {
  // this is symmtric to minmul
  var res = -minmul(-maximum, multipleOf, exclusive);
  return res === -0 ? 0 : res;
};

// var minmaxmul = function(minimum, maximum, multipleOf, xMin, xMax) {
//   // if we can return 0, we do that
//   if (    (( minimum < 0 ) || ( !xMin && minimum <= 0 ))
//        && (( maximum > 0 ) || ( !xMax && maximum >= 0 ))) {
//     return 0;
//   }
//
//   var min = xMin ? minimum + 1 : minimum;
//   var max = xMax ? maximum + 1 : maximum;
//
//   var minRest = min % mulitpleOf;
//   if ( minRest === 0 ) {
//     return min;
//   };
//
//   var maxRest = max % multipleOf;
//
//   var minQuot = (min - minRest) / multipleOf;
//   var maxQuot = (max - maxRest) / multipleOf;
//
//   var diff = maxQuot - diffQuot;
//
//   if ( diff >= 1 ) {
//     return
//   }
//
//
//
// };

var _integer = function _integer(schema) {
  // todo
  var multipleOf = schema.multipleOf,
      minimum = schema.minimum,
      maximum = schema.maximum,
      exclusiveMinimum = schema.exclusiveMinimum,
      exclusiveMaximum = schema.exclusiveMaximum;

  // check what is defined

  var mo = multipleOf !== undefined,
      mi = minimum !== undefined,
      ma = maximum !== undefined;

  if (mo && mi && ma || !mo && mi && ma) {
    // minimum and maximum
    if ((minimum < 0 || !exclusiveMinimum && minimum <= 0) && (maximum > 0 || !exclusiveMaximum && maximum >= 0)) {
      return 0;
    } else {
      return exclusiveMinimum ? minimum + 1 : minimum;
    }
  } else if (mo && !mi && ma) {
    // multipleOf and maximum
    return maxmul(maximum, multipleOf, exclusiveMaximum);
  } else if (mo && mi && !ma) {
    // multipleOf and minimum
    return minmul(minimum, multipleOf, exclusiveMinimum);
  } else if (mo && !mi && !ma) {
    // only multipleOf
    return 0;
  } else if (!mo && !mi && ma) {
    // only maximum
    if (exclusiveMaximum) {
      return maximum > 0 ? 0 : maximum - 1;
    } else {
      return maximum >= 0 ? 0 : maximum;
    }
  } else if (!mo && mi && !ma) {
    // only minimum
    if (exclusiveMinimum) {
      return minimum < 0 ? 0 : minimum + 1;
    } else {
      return minimum <= 0 ? 0 : minimum;
    }
  } else {
    // totally free choice
    return 0;
  }
};

exports.default = _integer;