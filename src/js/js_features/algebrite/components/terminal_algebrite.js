
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
// import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import WorkerCommand from 'devapt-core-browser/dist/js/commands/worker_command'

// PLUGIN IMPORTS
import Terminal from '../../terminal/components/terminal'


const plugin_name = 'Labs' 
const context = plugin_name + '/terminal_algebrite'



export default class TerminalAlgebrite extends Terminal
{
	/**
	 * Create an instance of TerminalAlgebrite.
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

		/**
		 * Class type flag.
		 * @type {boolean}
		 */
		this.is_terminal_algebrite = true
		
		this.add_assets_dependancy('js-algebrite')

		// this.enable_trace()
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
		let result_str = undefined
		try {
			// WORKER TEST
			const worker_cfg = {
				type:'algebrite',
				name:'algebrite cmd',
				script_url:'/labs_assets/plugins/' + plugin_name + '/worker_algebrite.js',
				script_operands:[arg_expression]
			}
			const runtime = window.devapt().runtime()
			const cmd = new WorkerCommand(runtime, worker_cfg, context + ':eval')
			cmd.do().then(
				(result)=>{
					console.log(context + ':eval:WorkerCommand result for [%s]=', arg_expression, result)
				}
			)
			.catch(
				(error)=>{
					console.log(context + ':eval:WorkerCommand error for [%s]=', arg_expression, error)
				}
			)

			// ALGEBRITE
			result_str = window.Algebrite.eval(arg_expression)
		}
		catch (err) {
			result_str = err.toString()
			return Promise.resolve( { error:result_str } )
		}

		return Promise.resolve( { value:result_str } )
	}
}
