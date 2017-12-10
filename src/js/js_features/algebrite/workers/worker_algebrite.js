
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
 * 	OUTPUT: { id:integer, result:{ node:Object, str:String }, error:string|null }
 * 
 */
self.addEventListener('message',
	function(event)
	{
		if (! event || ! event.data)
		{
			console.warn(context + ':on message:bad event.data')
			return
		}

		var request = event.data
		var request_str = null
		var result_node = null
		var result_str = null
		var err = null
		var node = undefined
		var code = undefined

		if (! request.data || ! request.id)
		{
			console.warn(context + ':on message:bad request.data or request.id:request=', request)
			return
		}

		try {
			// GET RESULT STRING
			request_str = JSON.parse(request.data) + ''
			result_str = self.window.Algebrite.run(request_str)
		}
		catch (e) {
			console.warn(context + ':on message:eval error=', e.toString())
			err = e
		}

		// BUILD RESPONSE
		var response = {
			id: request.id,
			result: {
				node:undefined,
				str: result_str
			},
			error: err
		}

		// SEND RESPONSE
		self.postMessage( JSON.stringify(response) )
	},
	false
)

