// NPM IMPORTS
// import assert from 'assert'
const Devapt = require('devapt').default

// BROWSER IMPORTS
import Terminal from './terminal'


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

		this.is_terminal_algebrite = true
		
		this.add_assets_dependancy('js-algebrite')

		// this.enable_trace()
	}



	/**
	 * Evaluate a string expression.
	 * 
	 * @param {string} arg_expression - expression to evaluate.
	 * 
	 * @returns {object} - eval result: { error:'', value:'' } on failure or { value:'' } on success.
	 */
	eval(arg_expression)
	{
		let result_str = undefined
		try {
			result_str = Algebrite.eval(arg_expression);
		}
		catch (err) {
			result_str = err.toString();
			return { error:result_str }
		}

		return { value:result_str }
	}
}
