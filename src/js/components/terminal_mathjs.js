
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
// import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import WebWorker from 'devapt-core-browser/dist/js/base/web_worker'

// PLUGIN IMPORTS
import Terminal from './terminal'


const plugin_name = 'Labs' 
const context = plugin_name + '/terminal_mathjs'



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
		
		const name = this.get_name() ? this.get_name() : 'mathjs_terminal'
		const worker_url = arg_state.worker_url ? arg_state.worker_url : '/labs_assets/plugins/' + plugin_name + '/worker_mathjs.js'
		this._worker = new WebWorker(name + '_worker', worker_url)

		this.add_assets_dependancy('js-mathjs')

		// this.enable_trace()
	}



	/**
	 * Process graphical 2d operations.
	 * 
	 * @param {string}   arg_expression - request expression.
	 * @param {function} arg_resolve    - promise resolve callback.
	 * @param {function} arg_reject     - promise reject callback.
	 */
	process_2d_request(arg_expression, arg_resolve, arg_reject)
	{
		console.log(context + ':process_2d_request:expr=[' + arg_expression + ']')

		// ...

		arg_resolve()
	}



	/**
	 * Process graphical 3d operations.
	 * 
	 * @param {string}   arg_expression - request expression.
	 * @param {function} arg_resolve    - promise resolve callback.
	 * @param {function} arg_reject     - promise reject callback.
	 */
	process_3d_request(arg_expression, arg_resolve, arg_reject)
	{
		console.log(context + ':process_3d_request:expr=[' + arg_expression + ']')

		// ...

		arg_resolve()
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
		const g2d_prefix = '2d.'
		const g3d_prefix = '3d.'

		// PROCESS 2D REQUEST (DOM OPERATIONS ARE FORBIDDEN INTO WEB WORKER)
		if (arg_expression.startsWith(g2d_prefix))
		{
			const g2d_task = (resolve, reject)=>{
				this.process_2d_request(arg_expression, resolve, reject)
			}
			const g2d_promise = new Promise(g2d_task)
			.then(
				()=>{ return { value:'done' } }
			)
			.catch(
				(e)=>{ return { error:e, value:'error' } }
			)
			return g2d_promise
		}

		// PROCESS 3D REQUEST (DOM OPERATIONS ARE FORBIDDEN INTO WEB WORKER)
		if (arg_expression.startsWith(g3d_prefix))
		{
			const g3d_task = (resolve, reject)=>{
				this.process_3d_request(arg_expression, resolve, reject)
			}
			const g3d_promise = new Promise(g3d_task)
			.then(
				()=>{ return { value:'done' } }
			)
			.catch(
				(e)=>{ return { error:e, value:'error' } }
			)
			return g3d_promise
		}

		// PROCESS MATHJS OPERATIONS
		const response_promise = this._worker.submit_request(arg_expression)
		
		return response_promise
		.then(
			(mathjs_result)=>{
				console.log(context + ':eval:mathjs_result=', mathjs_result)
				
				const result_str = mathjs_result.str

				console.log(context + ':eval:result_str=', result_str)
				return { value:result_str }
			}
		)
		.catch(
			(e)=>{ return { error:e, value:'error' } }
		)
	}
}
