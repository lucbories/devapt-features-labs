require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* llang 0.0.2 by Petr Nevyhoštěný <petr.nevyhosteny@gmail.com> */
(function () {
    'use strict';

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //for n = 2 it returns
    // [ 0, 0 ]
    // [ 0, 1 ]
    // [ 1, 0 ]
    // [ 1, 1 ]


    function generateCombinations(n) {
        var combs = [];
        var comb;
        var str;

        for (var i = 0; i < Math.pow(2, n); i++) {
            str = i.toString(2);
            comb = [];

            for (var j = 0; j < n; j++)
            comb.push(j < n - str.length ? 0 : +str[j - n + str.length]);

            combs.push(comb.slice(0));
        }

        return combs;
    }


    /**
     * @requires util.js
     */

    function getVariables(tokens) {
        tokens = clone(tokens);
        var token;
        var variables = [];

        while (next()) {
            if (token.type == 'variable') {
                variables.push(token.value);
            }
        }

        return variables.sort(function (a, b) {
            return a > b ? 1 : -1;
        }).filter(function (item, index, arr) {
            return arr.indexOf(item) == index;
        });

        function next() {
            //TODO: use pointer instead of shifting
            //(parse would not need to clone tokens array)
            return (token = tokens.shift());
        }
    }

    function getInitializator(variables) {
        return function () {
            var substitutions = {};
            var values = arguments;

            variables.forEach(function (primitive, index) {
                substitutions[primitive] = !! values[index];
            });

            return substitutions;
        };
    }


    /**
     * @requires util.js
     */

    function parse(tokens) {
        tokens = clone(tokens);
        var token;
        return process();

        function process(operation) {
            operation = operation || null;
            var args = [];

            while (next()) {
                if (token.type == 'boundary') {
                    if (token.value == '(') args.push(process());
                    else if (token.value == ')') return node(operation, args);
                }

                else if (token.type == 'variable') {
                    args.push(node('substitution', [token.value]));
                    if (isUnary(operation)) return node(operation, args);
                }

                else if (token.type == 'operator') {
                    if (isUnary(token.value)) {
                        args.push(process(token.value));
                        continue;
                    }

                    if (operation) {
                        var tmp = args.slice(0);
                        args = [];
                        args.push(node(operation, tmp));
                    }

                    operation = token.value;
                }
            }

            return node(operation, args);
        }

        function next() {
            //TODO: use pointer instead of shifting
            //(parse would not need to clone tokens array)
            return (token = tokens.shift());
        }

        function node(action, args) {
            return {
                action: translate(action),
                args: args
            };
        }

        function translate(operator) {
            var map = {
                '!': 'negation',
                '|': 'disjunction',
                '&': 'conjunction',
                '->': 'implication',
                '<->': 'equivalence'
            };

            return map[operator] || operator;
        }

        function isUnary(op) {
            return op === '!';
        }

        function syntaxError() {
            throw new Error('Syntax error!');
        }
    }


    /**
     * @requires util.js
     */

    function interpret(tree, substitutions) {
        tree = clone(tree);
        var actions = {
            substitution: function (args) {
                return substitutions[args[0]];
            },
            negation: function (args) {
                return !args[0];
            },
            disjunction: function (args) {
                return args[0] || args[1];
            },
            conjunction: function (args) {
                return args[0] && args[1];
            },
            implication: function (args) {
                return !args[0] || args[1];
            },
            equivalence: function (args) {
                return (args[0] && args[1]) || (!args[0] && !args[1]);
            }
        };

        return process(tree.action, tree.args);

        function process(action, args) {
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] == 'object') args[i] = process(args[i].action, args[i].args);
            }

            return actions[action](args);
        }
    }


    function lex(input) {
        var pointer = 0;
        var tokens = [];
        var c;
        var operator = '';

        while (next()) {
            if (isSpecial(c)) {
                operator += c;
                if (operatorExists(operator)) {
                    push('operator', operator);
                    operator = '';
                }
            }

            else {
                if (operator.length) unrecognizedToken(operator, pointer - operator.length - 1);

                if (isWhiteSpace(c)) continue;
                else if (isVariable(c)) push('variable', c.toUpperCase());
                else if (isExpressionBoundary(c)) push('boundary', c);
                else unrecognizedToken(c, pointer - 2);
            }
        }

        return tokens;

        function next() {
            return (c = input[pointer++]);
        }

        function push(type, value) {
            tokens.push({
                type: type,
                value: value
            });
        }

        function isWhiteSpace(c) {
            return /\s/.test(c);
        }

        function isVariable(c) {
            return /[A-Za-z]/.test(c);
        }

        function isSpecial(c) {
            return /[<>\-|&!]/.test(c);
        }

        function isExpressionBoundary(c) {
            return /[\(\)]/.test(c);
        }

        function operatorExists(op) {
            return ['!', '|', '&', '->', '<->'].indexOf(op) !== -1;
        }

        function unrecognizedToken(token, position) {
            throw new Error('Unrecognized token "' + token + '" on position ' + position + '!');
        }
    }


    /**
     * @requires lex.js, parse.js, scope.js, interpret.js
     */
    var llang = {
        _evaluate: function (formula, evaluation, tokens, vars) {
            var tree = parse(tokens);
            var initializator = getInitializator(vars);
            return interpret(tree, initializator.apply(initializator, evaluation));
        },
        evaluate: function (formula, evaluation) {
            var tokens = lex(formula);
            return this._evaluate(formula, evaluation, tokens, getVariables(tokens));
        },
        evaluateAll: function (formula) {
            var tokens = lex(formula);
            var vars = getVariables(tokens);
            var n = vars.length;
            var result = [];
            var combinations = generateCombinations(n);

            for (var i = 0, count = Math.pow(2, n); i < count; i++) {
                result.push(this._evaluate(formula, combinations[i], tokens, vars));
            }

            return result;
        },
        _: {
            lex: lex,
            parse: parse,
            getInitializator: getInitializator,
            getVariables: getVariables,
            interpret: interpret
        }
    };

    if (typeof window != 'undefined') {
        window.llang = llang;
    }

    else {
        module.exports = llang;
    }
})();
},{}],2:[function(require,module,exports){
module.exports = require('./dest/build');

},{"./dest/build":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

/*


https://dzone.com/articles/scala-calculating-distance-between-two-locations

class DistanceCalculatorImpl extends DistanceCalcular {
    private val AVERAGE_RADIUS_OF_EARTH_KM = 6371
    override def calculateDistanceInKilometer(userLocation: Location, warehouseLocation: Location): Int = {
        val latDistance = Math.toRadians(userLocation.lat - warehouseLocation.lat)
        val lngDistance = Math.toRadians(userLocation.lon - warehouseLocation.lon)
        val sinLat = Math.sin(latDistance / 2)
        val sinLng = Math.sin(lngDistance / 2)
        val a = sinLat * sinLat +
        (Math.cos(Math.toRadians(userLocation.lat)) *
            Math.cos(Math.toRadians(warehouseLocation.lat)) *
            sinLng * sinLng)
        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        
		(AVERAGE_RADIUS_OF_EARTH_KM * c).toInt
    }
}
new DistanceCalculatorImpl().calculateDistanceInKilometer(Location(10, 20), Location(40, 20))
=>3335
http://www.nhc.noaa.gov/gccalc.shtml


Law of Haversines
\operatorname {hav} (c)=\operatorname {hav} (a-b)+\sin(a)\sin(b)\,\operatorname {hav} (C).

Haversine Formula
For any two points on a sphere, the haversine of the central angle between them is given by:

{\displaystyle \operatorname {hav} \left({\frac {d}{r}}\right)=\operatorname {hav} (\varphi _{2}-\varphi _{1})+\cos(\varphi _{1})\cos(\varphi _{2})\operatorname {hav} (\lambda _{2}-\lambda _{1})}
Where

hav is the haversine function: 
\operatorname {hav} (\theta )=\sin ^{2}\left({\frac {\theta }{2}}\right)={\frac {1-\cos(\theta )}{2}}
d is the distance between the two points (along a great circle of the sphere; see spherical distance).
r is the radius of the sphere.
φ1, φ2: latitude of point 1 and latitude of point 2, in radians.
λ1, λ2: longitude of point 1 and longitude of point 2, in radians.
*/

var AVERAGE_RADIUS_OF_EARTH_KM = 6371;

function func_to_radians(scope, angle) {
	return angle / 180.0 * Math.PI;
}

function func_distance(scope, lat1, lng1, lat2, lng2) {
	var lat_dist = func_to_radians(scope, lat1 - lat2);
	var lng_dist = func_to_radians(scope, lng1 - lng2);

	var sin_lat = Math.sin(lat_dist / 2);
	var sin_lng = Math.sin(lng_dist / 2);

	var a = sin_lat * sin_lat + Math.cos(func_to_radians(scope, lat1)) * Math.cos(func_to_radians(scope, lat2)) * sin_lng * sin_lng;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	// DEBUG
	// console.log('lat1', lat1, 'lat2', lat2)
	// console.log('lng1', lng1, 'lng2', lng2)
	// console.log('lat_dist', lat_dist)
	// console.log('lng_dist', lng_dist)
	// console.log('sin_lat', sin_lat)
	// console.log('sin_lng', sin_lng)
	// console.log('a', a)
	// console.log('c', c)

	return AVERAGE_RADIUS_OF_EARTH_KM * c;
}

exports.default = {
	geom: {
		distance: func_distance,
		to_radians: func_to_radians
	}
};


},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _index = require('../../../../../bower_components/llang/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fact(x) {
	if (x <= 0) {
		return 0;
	}
	if (x > 100) {
		return 0;
	}

	var i,
	    result = 1;
	for (i = 1; i <= x; i++) {
		result = result * i;
	}
	return result;
}

function choose(n, k) {
	return fact(n) / (fact(k) * fact(n - k));
}

exports.default = {
	feat1: {
		const456: 456,
		propositional_calculus: function propositional_calculus(scope, formula_str, values) {
			return _index2.default.evaluate(formula_str, values);
		},
		pascal_fact: function pascal_fact(scope, x) {
			return fact(x);
		},
		pascal_triangle: function pascal_triangle(scope, lines) {
			if (lines < 2) {
				lines = 2;
			}
			if (lines > 10) {
				lines = 10;
			}

			/*
   	(n,k) = n!/k!(n-k)!
   	
   				(0,0)
   				1
   			(1,0)	(1,1)
   			1		1
   		(2,0)	(2,1)	(2,2)
   		1		2		1
   	(3,0)	(3,1)	(3,2)	(3,3)
   	1		3		3		1
   	...
   */
			var triangle = [[1], [1, 1]];
			var line = undefined;
			var n = 2,
			    k = 0;
			for (; n <= lines; n++) {
				line = [1];
				for (k = 1; k < n; k++) {
					line.push(choose(n, k));
				}
				line.push(1);
				triangle.push(line);
			}
			return triangle;
		}
	}
};


},{"../../../../../bower_components/llang/index":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function cleanString(str) {
	return str.replace(/[^\w\s]|_/g, ' ').replace(/\s+/g, ' ').toLowerCase();
}

function extractSubstr(str, regexp) {
	return cleanString(str).match(regexp) || [];
}

function getWordsByNonWhiteSpace(str) {
	return extractSubstr(str, /\S+/g);
}

function getWordsByWordBoundaries(str) {
	return extractSubstr(str, /\b[a-z\d]+\b/g);
}

function wordMap(str) {
	return getWordsByWordBoundaries(str).reduce(function (map, word) {
		map[word] = (map[word] || 0) + 1;
		return map;
	}, {});
}

function mapToTuples(map) {
	return Object.keys(map).map(function (key) {
		return [key, map[key]];
	});
}

function mapToSortedTuples(map, sortFn, sortOrder) {
	return mapToTuples(map).sort(function (a, b) {
		return sortFn.call(undefined, a, b, sortOrder);
	});
}

function countWords(str) {
	return getWordsByWordBoundaries(str).length;
}

function wordFrequency(str) {
	return mapToSortedTuples(wordMap(str), function (a, b, order) {
		if (b[1] > a[1]) {
			return order[1] * -1;
		} else if (a[1] > b[1]) {
			return order[1] * 1;
		} else {
			return order[0] * (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
		}
	}, [1, -1]);
}

function printTuples(tuples) {
	return tuples.map(function (tuple) {
		return padStr(tuple[0], ' ', 12, 1) + ' -> ' + tuple[1];
	}).join('\n');
}

function padStr(str, ch, width, dir) {
	return (width <= str.length ? str : padStr(dir < 0 ? ch + str : str + ch, ch, width, dir)).substr(0, width);
}

exports.default = {
	string_features: {
		chars: function chars(scope, v) {
			var vtype = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (vtype != 'string') {
				return [];
			}
			return Array.from(v);
		},
		chars_count: function chars_count(scope, v) {
			var vtype = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (vtype != 'string') {
				return 0;
			}
			return v.length;
		},
		chars_frequency: function chars_frequency(scope, v) {
			var vtype = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (vtype != 'string') {
				return [];
			}
			var f = function f(map, c) {
				map[c] = (map[c] || 0) + 1;
				return map;
			};
			var map = Array.from(v).reduce(f, {});

			return Object.keys(map).map(function (key) {
				return [key, map[key]];
			});
		},
		words: function words(scope, v) {
			var vtype = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (vtype != 'string') {
				return [];
			}
			return getWordsByWordBoundaries(v);
		},
		words_count: function words_count(scope, v) {
			var vtype = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (vtype != 'string') {
				return 0;
			}
			return countWords(v);
		},
		words_frequency: function words_frequency(scope, v) {
			var vtype = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (vtype != 'string') {
				return [];
			}
			return wordFrequency(v);
		}
	}
};


},{}],"mathjs_features":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feature_distance = require('./feature_distance');

var _feature_distance2 = _interopRequireDefault(_feature_distance);

var _features_ = require('./features_1');

var _features_2 = _interopRequireDefault(_features_);

var _features_3 = require('./features_2');

var _features_4 = _interopRequireDefault(_features_3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var features = Object.assign({}, _feature_distance2.default, _features_2.default, _features_4.default);

// console.log('features', features)

exports.default = features;


},{"./feature_distance":3,"./features_1":4,"./features_2":5}]},{},["mathjs_features"]);
