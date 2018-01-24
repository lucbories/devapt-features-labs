// NPM IMPORTS
import path from 'path'

// COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import WebWorker from 'devapt-core-browser/dist/js/base/web_worker'

// BROWSER IMPORTS
import Feature from 'devapt-core-browser/dist/js/base/feature'


const plugin_name = 'Labs' 
const context = plugin_name + '/terminal_feature'



/**
 * @file Terminal stateless Feature class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->eval(expression):Promise - evaluate a string expression and returns
 *           an object {
 *               error:string : failure message,
 *               value:string : success message
 *           }
 * 		->get_name():string - get command name (INHERITED).
 * 		->get_type():string - get command type (INHERITED).
 * 		->get_settings():object - get instance type (INHERITED).
 * 		->is_valid():boolean - check if instance is valid (settings...) (INHERITED, SUBCLASSED).
 * 
 * 		->get_about():string|object - get about doc content (INHERITED).
 * 		->get_help():string|object - get about doc content (INHERITED).
 * 		->get_refdoc():string|object - get about doc content (INHERITED).
 * 
 * 		->get_aliases():array - get feature aliases strings array.
 * 		->get_worker_url():string - get worker file url string.
 * 		->get_func_name():string - get processing function file url string.
 * 		->get_assets():array - array of assets id strings or assets definition (id, url) objects.
 */
export default class TerminalFeature extends Feature
{
	/**
	 * Creates an instance of Feature, do not use directly but in a sub class.
	 * 
	 * A TerminalFeature configuration is a simple object with this common attributes:
	 * 		- name:string    - command unique name.
	 * 		- type:string    - type of commnand from command factory known types list (example: display).
	 * 
	 * 		- about:string   - string or doc object: { 'topicA':{ 'topicA1':'...' }, 'topicB':'...' }.
	 * 		- help:string    - string or doc object: { 'topicA':{ 'topicA1':'...' }, 'topicB':'...' }.
	 * 		- refdoc:string  - string or doc object: { 'topicA':{ 'topicA1':'...' }, 'topicB':'...' }.
	 * 
	 * 		- aliases        - feature aliases strings array (optional).
	 * 		- worker_url     - worker file url string (only one of worker_url or func_name).
	 * 		- func_name      - processing function name (only one of worker_url or func_name).
	 * 		- assets         - assets depandencies array (optional).
	 * 
	 * @param {object}           arg_runtime     - runtime.
	 * @param {object}           arg_settings    - instance settings.
	 * @param {string|undefined} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_settings, log_context)
		
		this.is_terminal_feature = true

		const worker_url = this.get_worker_url()
		const func_name = this.get_func_name()
		const name = this.get_name()

		this._request_counter = 0
		this._worker = undefined
		this._func_name = undefined
		this._terminal = arg_settings.terminal
		this._commands_names = arg_settings.commands ? Object.keys(arg_settings.commands) : [] 

		if ( T.isNotEmptyString(worker_url) )
		{
			this._worker = new WebWorker(name + '_worker', worker_url)
		}

		if ( T.isNotEmptyString(func_name) )
		{
			this._func_name = func_name
		}
	}



	/**
	 * Evaluate a string expression.
	 * 
	 * @param {string} arg_expression - expression to evaluate.
	 * @param {object} arg_scope - eval scope.
	 * 
	 * @returns {Promise} - eval result promise of: { error:'', value:'' } on failure or { value:'' } on success.
	 */
	eval(arg_expression, arg_scope)
	{
		// EXECUTE WEB WORKER
		if (this._worker)
		{
			const request = { expr:arg_expression, scope:arg_scope }
			// const response_promise = this._worker.submit_request(JSON.stringify(request))
			const response_promise = this._worker.submit_request(request)
			
			return response_promise
			.then(
				(worker_result)=>{
					console.log(context + ':eval worker:expression=[%s] worker_result=', arg_expression, worker_result)

					const result_str = worker_result.str

					console.log(context + ':eval worker:expression=[%s] result_str=', arg_expression, result_str)
					return { str:result_str, value:worker_result.value, error:worker_result.error }
				}
			)
			.catch(
				(e)=>{
					console.log(context + ':eval worker:expression=[%s] error=', arg_expression, e)
					return { str:undefined, value:undefined, error:e.toString() }
				}
			)
		}

		
		// EXECUTE METHOD
		if (this._func_name && T.isObject(window.devapt().func_features) && T.isFunction( window.devapt().func_features[this._func_name] ) )
		{
			const func_cb = (resolve, reject)=>{
				++this._request_counter
				const result = window.devapt().func_features[this._func_name](this, { data:arg_expression, id:this._request_counter } )
				if (result.error)
				{
					reject(result.error)
					return
				}
				resolve(result)
			}

			return new Promise(func_cb)
			.then(
				(response)=>{
					console.log(context + ':eval func:expression=[%s] response=', arg_expression, response)

					const result = response.result ? response.result : { value:undefined, str:undefined, error:'no result in func response'}
					let value_str = result.str
					if (result.value && ! result.str)
					{
						value_str = result.value + ''
					}
					return { str:value_str, value:result.value, error:result.error }
				}
			)
			.catch(
				(e)=>{
					console.log(context + ':eval func:expression=[%s] error=', arg_expression, e)
					return { error:e, str:'error', value:undefined }
				}
			)
		}


		return Promise.reject('nothing to do')
	}



	/**
	 * Expand template URL.
	 * 
	 * @returns {string} - expanded URL.
	 */
	_expand_template_url(arg_url, arg_type='js')
	{
		let str = arg_url + '' // CONVERT TO STRING IF NEEDED

		const app_name = this.get_runtime().get_session_credentials().get_application()
		const feature_name = this.get_name()
		const credentials = this.get_runtime().get_session_credentials()

		str = str.replace('FEATURE_APP', app_name).replace('FEATURE_PLUGIN', plugin_name).replace('FEATURE_NAME', feature_name)
		if (str.indexOf('{{assets_url}}') > -1)
		{
			str = str.replace('{{assets_url}}', '')
			str = this.get_runtime().ui_rendering().get_asset_url(str, arg_type, credentials)
		} else {
			str = str+ '?' + credentials.get_url_part()
		}

		return str
	}



	/**
	 * Get feature aliases.
	 * 
	 * @returns {array}
	 */
	get_aliases()
	{
		return ( T.isObject(this._settings) && T.isArray(this._settings.aliases) ) ? this._settings.aliases : []
	}



	/**
	 * Get feature terminal component instance.
	 * 
	 * @returns {Terminal}
	 */
	get_terminal()
	{
		return this._terminal
	}



	/**
	 * Get Worker instance.
	 * 
	 * @returns {object}
	 */
	get_worker()
	{
		return this._worker
	}



	/**
	 * Get Worker URL.
	 * 
	 * @returns {string}
	 */
	get_worker_url()
	{
		return ( T.isObject(this._settings) && T.isString(this._settings.worker_url) ) ? this._expand_template_url(this._settings.worker_url) : undefined
	}



	/**
	 * Get processing function name.
	 * 
	 * @returns {string}
	 */
	get_func_name()
	{
		return this._settings.func_name
	}



	/**
	 * Get assets (optional).
	 * 
	 * @returns {array}
	 */
	get_assets()
	{
		return ( T.isObject(this._settings) && T.isArray(this._settings.assets) ) ? this._settings.assets : undefined
	}



	/**
	 * Get commands map.
	 * 
	 * @returns {object}
	 */
	get_commands()
	{
		return ( T.isObject(this._settings) && T.isObject(this._settings.commands) ) ? this._settings.commands : undefined
	}



	/**
	 * Test command name.
	 * 
	 * @param {string} arg_name - command name.
	 * 
	 * @returns {boolean}
	 */
	has_command(arg_name)
	{
		return this._commands_names.indexOf(arg_name) > -1
	}



	/**
	 * Get command object.
	 * 
	 * @param {string} arg_name - command name.
	 * 
	 * @returns {object}
	 */
	get_command(arg_name)
	{
		if ( T.isNotEmptyString(arg_name) && arg_name in this._settings.commands )
		{
			const cmd = this._settings.commands[arg_name]
			cmd.name = arg_name
			return cmd
		}
		return undefined
	}



	/**
	 * Check if instance settings is valid.
	 * 
	 * @returns {boolean}
	 */
	is_valid()
	{
		let b = true
		b = b && T.isString( this.get_name() ) && this.get_name() != 'no name'
		b = b && T.isString( this.get_type() ) && this.get_type() != 'no type'
		b = b && T.isString( this.get_about() )
		b = b && T.isString( this.get_help() )
		b = b && T.isString( this.get_refdoc() )
		b = b && ( T.isObject( this.get_worker() ) || T.isNotEmptyString( this.get_func_name() ) )
		return b
	}
}