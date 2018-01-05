
const plugin_name = 'Labs' 
const context = plugin_name + '/workers/worker_algebrite'

// WORKER IMPORTS
self.window = {}
self.importScripts('algebrite.js')


/**
 * Algebrite web worker message handler.
 * 
 * @example
 * 	INPUT:  { id:integer, data:Object }
 * 	OUTPUT: { id:integer, result:{ node:Object, str:String, error:string|null } }
 * 
 */
self.addEventListener('message',
	function(event)
	{
		// BUILD RESPONSE
		var response = {
			id: request.id,
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
			response.result.error = context + ':bad event.data'
			return response
		}

		var request = event.data
		var request_str = null
		var result_str = null

		// CHECK REQUEST
		if (! request.data || ! request.id)
		{
			console.warn(context + ':on message:bad request.data or request.id:request=', request)
			response.result.error = context + ':bad request.data or request.id'
			return response
		}
		response.id = request.id

		try {
			// GET RESULT STRING
			request_str = JSON.parse(request.data) + ''
			result_str = self.window.Algebrite.run(request_str)
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

