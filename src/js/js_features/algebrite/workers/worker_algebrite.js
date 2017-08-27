
const plugin_name = 'Labs' 
const context = plugin_name + '/workers/worker_algebrite'

// WORKER IMPORTS
self.importScripts('plugins/' + plugin_name + '/algebrite.js')

onmessage = function(e)
{
	var operands = e.data

	// DEBUG
	console.log(context + ':onmessage:operands=', operands)

	var result_str = undefined
	var result = undefined

	try {
		result_str = self.Algebrite.eval(operands[0])
		result = { value:result_str }
	}
	catch (err) {
		result_str = err.toString()
		result = { error:result_str }
	}

	postMessage(result)
}
