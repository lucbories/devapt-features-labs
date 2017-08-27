function cleanString(str) {
	return str.replace(/[^\w\s]|_/g, ' ')
		.replace(/\s+/g, ' ')
		.toLowerCase()
}
	
function extractSubstr(str, regexp) {
	return cleanString(str).match(regexp) || []
}

function getWordsByNonWhiteSpace(str) {
	return extractSubstr(str, /\S+/g)
}

function getWordsByWordBoundaries(str) {
	return extractSubstr(str, /\b[a-z\d]+\b/g)
}

function wordMap(str) {
	return getWordsByWordBoundaries(str).reduce(function(map, word) {
		map[word] = (map[word] || 0) + 1
		return map
	}, {})
}

function mapToTuples(map) {
	return Object.keys(map).map(function(key) {
		return [ key, map[key] ]
	})
}

function mapToSortedTuples(map, sortFn, sortOrder) {
	return mapToTuples(map).sort(function(a, b) {
		return sortFn.call(undefined, a, b, sortOrder)
	})
}

function countWords(str) {
	return getWordsByWordBoundaries(str).length
}

function wordFrequency(str) {
	return mapToSortedTuples(wordMap(str), function(a, b, order) {
		if (b[1] > a[1]) {
			return order[1] * -1
		} else if (a[1] > b[1]) {
			return order[1] * 1
		} else {
			return order[0] * (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0))
		}
	}, [1, -1])
}

function printTuples(tuples) {
	return tuples.map(function(tuple) {
		return padStr(tuple[0], ' ', 12, 1) + ' -> ' + tuple[1]
	}).join('\n')
}

function padStr(str, ch, width, dir) { 
	return (width <= str.length ? str : padStr(dir < 0 ? ch + str : str + ch, ch, width, dir)).substr(0, width)
}


export default {
	string_features:{
		chars:function(scope, v)
		{
			var vtype = typeof v
			if (vtype != 'string')
			{
				return []
			}
			return Array.from(v)
		},
		chars_count:function(scope, v)
		{
			var vtype = typeof v
			if (vtype != 'string')
			{
				return 0
			}
			return v.length
		},
		chars_frequency:function(scope, v)
		{
			var vtype = typeof v
			if (vtype != 'string')
			{
				return []
			}
			var f = function(map, c) {
				map[c] = (map[c] || 0) + 1
				return map
			}
			var map = Array.from(v).reduce(f, {})
			
			return Object.keys(map).map(
				function(key) {
					return [ key, map[key] ]
				}
			)
		},
		words:function(scope, v) {
			var vtype = typeof v
			if (vtype != 'string')
			{
				return []
			}
			return getWordsByWordBoundaries(v)
		},
		words_count:function(scope, v) {
			var vtype = typeof v
			if (vtype != 'string')
			{
				return 0
			}
			return countWords(v)
		},
		words_frequency:function(scope, v) {
			var vtype = typeof v
			if (vtype != 'string')
			{
				return []
			}
			return wordFrequency(v)
		}
	}
}