
// PLUGIN
const plugin_name = 'Labs' 
const context = plugin_name + '/workers/worker_mathjs'

// WORKER IMPORTS
self.importScripts('mathjs.js')
self.importScripts(	'mathjs_features.js')


// CREATE MATHJS PARSER
var mathjs_cfg_1 = {
	number: 'number',
	precision: 14,
	epsilon: 1e-20
}
// var mathjs_cfg_2 = {
// 	number: 'BigNumber',
// 	precision: 128,
// 	epsilon: 1e-127
// }
var global_worker_scope = {
	scope_item1:4
}
self.math.config(mathjs_cfg_1)
// var parser = self.math.parser()

// IMPORTS FEATURES
var feature = {
	scope:function(){
		var keys = Object.keys(global_worker_scope)
		var value = undefined
		var str = 'Scope:\n'
		keys.forEach(
			function(key)
			{
				value = global_worker_scope[key]
				value = (typeof value == 'function') ? 'function' : value + ''
				str += 'key=[' + key + '] value=[' + value + ']\n'
			}
		)
		return str
	}
}
self.math.import(feature, { wrap:true, override:true, silent:false } )

self.mathjs_features = self.require('mathjs_features').default
var features_names = Object.keys(self.mathjs_features)
var feature_items = undefined
var feature_items_names = undefined

features_names.forEach(
	function(feature_name)
	{
		feature_items = self.mathjs_features[feature_name]

		feature_items_names = Object.keys(feature_items)
		feature_items_names.forEach(
			function(item_name)
			{
				var feature_item = feature_items[item_name]
				// console.log('item_name=[%s]:', item_name, feature_item)

				if ( typeof feature_item == 'function' )
				{
					feature_item.transform = function(opd1, opd2, opd3, opd4)
					{
						return self.mathjs_features[feature_name][item_name](global_worker_scope, opd1, opd2, opd3, opd4)
					}
				}

				feature_items[item_name] = feature_item
				feature_item = undefined
			}
		)

		self.math.import(feature_items, { wrap:true, override:true, silent:false } )
	}
)



/**
 * MathJS web worker message handler.
 * 
 * @example
 * 	INPUT:  { id:integer, data:Object }
 * 	OUTPUT: { id:integer, result:{ value:Node, str:String, error:string|null } }
 * 
 */
self.addEventListener('message',
	function(event)
	{
		// BUILD RESPONSE
		var response = {
			id: null,
			result: {
				value:null,
				str: null,
				error: null
			}
		}

		// CHECK INPUTS
		if (! event || ! event.data)
		{
			console.warn(context + ':on message:bad event.data')
			response.result.error = 'bad event.data'
			return response
		}

		var request = event.data
		var request_str = null
		var result_node = null
		var result_str = null
		var node = undefined
		var code = undefined
		var scope = undefined

		// CHECK REQUEST
		if (! request.data || ! request.id)
		{
			console.warn(context + ':on message:bad request.data or request.id:request=', request)
			response.result.error = 'bad request.data or request.id'
			return response
		}
		response.id = request.id
		request.data = JSON.parse(request.data)
		if (! request.data.expr || ! request.data.scope)
		{
			console.warn(context + ':on message:bad request.data.expr or request.data.scope:request=', request)
			response.result.error = 'bad request.data.expr or request.data.scope'
			return response
		}

		try {
			// GET RESULT NODE
			scope = Object.assign({}, request.data.scope, global_worker_scope)
			request_str = request.data.expr + ''
			node = self.math.parse(request_str, scope)
			code = node.compile()
			result_node = code.eval(scope)

			// GET RESULT STRING
			result_str = self.math.format(result_node, { precision: 14 })

			// CHECK ROUND-OFF ERROR
			const unRoundedStr = self.math.format(result_node)
			if (unRoundedStr.length - result_str.length > 4)
			{
				result_str = 'Round-off error,  unrounded result:' + unRoundedStr
			}

			response.result.value = result_node
			response.result.str = result_str
		}
		catch (e) {
			console.warn(context + ':on message:eval error=', e.toString())
			response.result.error = e.toString()
		}


		// SEND RESPONSE
		self.postMessage( JSON.stringify(response) )
	},
	false
)