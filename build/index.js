'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _simpleJsonSchemaDeref = require('simple-json-schema-deref');

var _simpleJsonSchemaDeref2 = _interopRequireDefault(_simpleJsonSchemaDeref);

var _merge = require('./merge');

var _merge2 = _interopRequireDefault(_merge);

var _integer2 = require('./integer');

var _integer3 = _interopRequireDefault(_integer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $RefParser = require('json-schema-ref-parser');

var _empty;

// array <<
var _array = function _array(schema, global) {
  var items = schema.items,
      minItems = schema.minItems;


  if (items instanceof Array) {
    return items.map(function (item) {
      return _empty(item, global);
    });
  } else if (minItems && items) {
    // we need at least this amount of items
    return Array.from(new Array(minItems), function () {
      return _empty(items, global);
    });
  } else {
    // minItems is not given or we don't know item
    // type, so jsut make empty array
    return [];
  }
};
// >>

// boolean <<
var _boolean = function _boolean() {
  // just return a value
  // randomly picked at implementation time :)
  return false;
};
// >>

// integer <<

// >>

// number <<
var _number = function _number(schema, global) {
  // just return an integer
  return (0, _integer3.default)(schema, global);
};
// >>

// null <<
var _null = function _null() {
  // this one was easy
  return null;
};
// >>

/*// object <<
var _object = function(schema, global) {
  var {
    required
  , properties
  } = schema;

  if ( !required ) {
    // no required fields, return empty object
    return {};
  } else {
    return required
      .reduce(function(prev, next) {
        var s = properties[next];
        if ( !s ) {
          throw new Error(`property \`${next}\` not defined on object`);
        }
        prev[next] = empty(s, global);
        return prev;
      }, {});
  }
};
// >>*/

// object <<
var _object = function _object(schema, global) {
  var properties = schema.properties;

  if (!properties) {
    return {};
  }

  return Object.keys(properties).reduce(function (prev, next) {
    var s = properties[next];
    if (s['x-hidden'] === true) {
      return prev;
    }
    prev[next] = _empty(s, global);
    return prev;
  }, {});
};
// >>

// string <<
var _string = function _string() {
  // we do not know what we need
  // so return empty string
  return '';
};
// >>

// create empty value based on schema <<
_empty = function empty(schema, global) {
  var type = schema.type,
      default_ = schema['default'],
      enum_ = schema['enum'],
      oneOf = schema.oneOf,
      anyOf = schema.anyOf,
      allOf = schema.allOf;


  if (default_) {
    // if a default is given, return that
    return default_;
  } else if (enum_) {
    // if it is an enum, just use an enum value
    // json schema enums must have at least one value
    return enum_[0];
    // } else if ( $ref ) {
    //   // a ref is passed, deref it and go on from there
    //   var s = deref($ref, global);
    //   return empty(s, global);
  } else if (type) {
    // type is given
    var t;
    if (type instanceof Array) {
      // select first one
      // jsons type unions always have at least one element
      t = type.sort()[0];
    } else {
      t = type;
    }
    switch (t) {
      case 'array':
        return _array(schema, global);

      case 'boolean':
        return _boolean(schema, global);

      case 'integer':
        return (0, _integer3.default)(schema, global);

      case 'number':
        return _number(schema, global);

      case 'null':
        return _null(schema, global);

      case 'object':
        return _object(schema, global);

      case 'string':
        return _string(schema, global);

      default:
        throw new Error('cannot create value of type ' + type);
    }
  } else if (allOf) {
    // merge schema's and follow that
    return _empty((0, _merge2.default)(allOf), global);
  } else if (anyOf) {
    // any of the schema's is ok so pick the first
    // todo: is this deterministic?
    return _empty(anyOf[0], global);
  } else if (oneOf) {
    // one of the schema's is ok so pick the first
    // todo: is this deterministic?
    return _empty(oneOf[0], global);
  } else {
    throw new Error('cannot generate data from schema ' + schema);
  }
};
// >>

var make = function make(schema) {
  return $RefParser.dereference(schema).then(function (s) {
    return _empty(s, s);
  }).catch(function (err) {
    console.error(err);
  });
};

exports.default = make;