
// NPM IMPORTS
import _ from 'lodash'

// DEVAPT CORE COMMON IMPORTS
// import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import WebWorker from 'devapt-core-browser/dist/js/base/web_worker'

// PLUGIN IMPORTS
import Terminal from '../../terminal/components/terminal'


const plugin_name = 'Labs' 
const context = plugin_name + '/terminal_mathjs'
const MODE_NUMERICAL  = 'numerical'
const MODE_ALGEBRICAL = 'algebrical'
const MODE_PLOT       = 'plot'
const MODE_PLOT2D     = 'plot2d'
const MODE_PLOT3D     = 'plot3d'
const MODE_PLOT4D     = 'plot4d'
const MODE_DRAW2D     = 'draw2d'
const MODE_DRAW3D     = 'draw3d'
const MODE_DRAW4D     = 'draw4d'
const LIMIT_SPACES_IN_EXPRESSION = 20


export default class TerminalMathJS extends Terminal
{
	/**
	 * Create an instance of TerminalMathJS.
	 * @extends Terminal
	 * 
	 * 	API:
	 *      ->load()
	 *      ->eval(arg_expression):object - Evaluate a string expression.
	 *		->init_terminal():nothing - Init Terminal command handler.
	 * 		->init():nothing - Init component when assets are loaded.
	 * 
	 * @param {object} arg_runtime     - client runtime.
	 * @param {object} arg_state       - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{	
		super(arg_runtime, arg_state, arg_log_context ? arg_log_context : context)

		this.is_terminal_mathjs = true
		
		const app_name = this.get_runtime().get_session_credentials().get_app()	
		const name = this.get_name() ? this.get_name() : 'mathjs_terminal'
		const default_worker_url ='/' + app_name + '/plugins/' + plugin_name + '/'

		const state_workers = this.get_state_value('workers', {})
		const default_workers = {
			'numerical':{
				name:'MathJS',
				url:default_worker_url + 'worker_mathjs.js'
			},
			'algebrical':{
				name:'MathJS',
				url:default_worker_url + 'worker_mathjs.js'
			}
		}

		const state_worker_url = arg_state.worker_url ? arg_state.worker_url + '' : undefined

		const mathjs_worker_name = name + '_mathjs_worker'
		const worker_url = state_worker_url ? state_worker_url.replace('{{application}}', app_name).replace('{{plugin}}', plugin_name) : default_worker_url
		
		this._workers = []
		this._worker = new WebWorker(name + '_worker', worker_url)
		this._workers.push( this._worker )

		this.add_assets_dependancy('js-mathjs')
		this.add_assets_dependancy('js-d3')

		this._set_mode(MODE_NUMERICAL)
		// this.enable_trace()
	}



	/**
	 * Switch terminal mode: Numeric, algebric, plot.
	 * 
	 * @param {string} 	arg_new_mode - terminal new mode.
	 * 
	 * @returns {boolean} - new mode is valid
	 */
	switch_mode(arg_new_mode)
	{
		// TODO: set component Redux state

		// CONVERT STATE
		const new_mode = arg_new_mode + ''
		switch(new_mode.toLocaleLowerCase())
		{
			case 'n':
			case 'num':
			case 'numerical':
				this._set_mode(MODE_NUMERICAL)
				return true
			case 'a':
			case 'alg':
			case 'algebrical':
				this._set_mode(MODE_ALGEBRICAL)
				return true
			case 'p':
			case 'plot':
				this._set_mode(MODE_PLOT)
				return true
			case 'p2d':
			case 'plot2d':
				this._set_mode(MODE_PLOT2D)
				return true
			case 'p3d':
			case 'plot3d':
				this._set_mode(MODE_PLOT3D)
				return true
			case 'p4d':
			case 'plot4d':
				this._set_mode(MODE_PLOT4D)
				return true
			case 'd':
			case 'draw':
			case 'd2d':
			case 'draw2d':
				this._set_mode(MODE_DRAW2D)
				return true
			case 'd3d':
			case 'draw3d':
				this._set_mode(MODE_DRAW3D)
				return true
			case 'd4d':
			case 'draw4d':
				this._set_mode(MODE_DRAW4D)
				return true
		}

		return false
	}



	/**
	 * Set terminal mode: Numeric, algebric, plot.
	 * @private
	 * 
	 * @param {string} 	arg_checked_mode - terminal new mode, checked value.
	 * 
	 * @returns {nothing}
	 */
	_set_mode(arg_checked_mode)
	{
		this._mode = arg_checked_mode
	}



	/**
	 * Get terminal mode: Numerical, algebrical, plot.
	 * @private
	 * 
	 * @returns {string}
	 */
	_get_mode()
	{
		return this._mode
	}



	/**
	 * Process graphical 2d operations.
	 * 
	 * @param {string}   arg_expression - request expression.
	 * @param {function} arg_resolve    - promise resolve callback.
	 * @param {function} arg_reject     - promise reject callback.
	 * 
	 * @return {nothing|number|array|string|Promise}
	 */
	process_plot2d_request(arg_expression, arg_resolve, arg_reject)
	{
		console.log(context + ':process_plot2d_request:expr=[' + arg_expression + ']')

		// ...

		arg_resolve()
	}



	/**
	 * Process graphical 3d operations.
	 * 
	 * @param {string}   arg_expression - request expression.
	 * @param {function} arg_resolve    - promise resolve callback.
	 * @param {function} arg_reject     - promise reject callback.
	 * 
	 * @return {nothing|number|array|string|Promise}
	 */
	process_plot3d_request(arg_expression, arg_resolve, arg_reject)
	{
		console.log(context + ':process_plot3d_request:expr=[' + arg_expression + ']')

		// ...

		arg_resolve()
	}

	

	/**
	 * Process MathJS operations.
	 * 
	 * @param {string}   arg_expression - request expression.
	 * @param {function} arg_resolve    - promise resolve callback.
	 * @param {function} arg_reject     - promise reject callback.
	 * 
	 * @return {nothing|number|array|string|Promise}
	 */
	process_mathjs_request(arg_expression, arg_resolve, arg_reject)
	{
		const response_promise = this._worker.submit_request(arg_expression)
		
		return response_promise
		.then(
			(mathjs_result)=>{
				console.log(context + ':eval:expression=[%s] mathjs_result=', arg_expression, mathjs_result)

				const result_str = mathjs_result.str

				console.log(context + ':eval:expression=[%s] result_str=', arg_expression, result_str)
				arg_resolve(result_str)
			}
		)
		.catch(
			(error)=>{
				console.log(context + ':eval:expression=[%s] error=', arg_expression, error)
				arg_reject(error)
			}
		)
	}



	/**
	 * Evaluate a string expression.
	 * 
	 * @param {string} arg_expression - expression to evaluate.
	 * 
	 * @returns {Promise} - eval result promise of: { error:'', value:'' } on failure or { value:'' } on success.
	 */
	eval(arg_expression)
	{
		const mode_expression = arg_expression + ''
		const split_spaces = mode_expression.split('space', LIMIT_SPACES_IN_EXPRESSION)
		const switch_mode = split_spaces.length > 0 ? this.switch_mode(split_spaces[0]) : false
		const expression = switch_mode ? split_spaces.slice(1).join(' ') : expression
		const mode = this._get_mode()

		// SET MODE METHOD NAME
		let method_name = undefined
		switch(mode) {
			case MODE_ALGEBRICAL:
				method_name = 'process_algebrite_request'
				break
			case MODE_NUMERICAL:
				method_name = 'process_mathjs_request'
				break
			case MODE_PLOT:
			case MODE_PLOT2D:
				// PROCESS 2D REQUEST (DOM OPERATIONS ARE FORBIDDEN INTO WEB WORKER)
				method_name = 'process_plot2d_request'
				break
			case MODE_PLOT3D:
				// PROCESS 3D REQUEST (DOM OPERATIONS ARE FORBIDDEN INTO WEB WORKER)
				method_name = 'process_plot3d_request'
				break
			case MODE_PLOT4D:
			case MODE_DRAW2D:
			case MODE_DRAW3D:
				break
		}

		// EXECUTE TASK
		if (method_name && (method_name in this) )
		{
			const fn_task = (resolve, reject)=>{
				this[method_name](arg_expression, resolve, reject)
			}
			const task_promise = new Promise(fn_task)
			.then(
				(result)=>{ return { value:result ? result : 'done' } }
			)
			.catch(
				(e)=>{ return { error:e, value:'error' } }
			)
			return task_promise
		}
	}
}
