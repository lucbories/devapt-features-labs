// NPM IMPORTS
// import assert from 'assert'
const Devapt = require('devapt').default

// BROWSER IMPORTS
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
		
		this._parser = undefined
		this.add_assets_dependancy('js-mathjs')
		
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
		// INIT PARSER
		if (! this._parser)
		{
			if (this.init_parser)
			{
				this.init_parser()
			} else {
				if (math && math.parser)
				{
					this._parser = math.parser()
				}
			}
		}
		if (! this._parser)
		{
			return { error:'Bad config, no parser to evaluate function', value:'' }
		}

		let result_str = undefined
		try {
			const res = this._parser.eval(arg_expression)
			result_str = math.format(res, { precision: 14 })
			var unRoundedStr = math.format(res)
			if (unRoundedStr.length - result_str.length > 4)
			{
				return { error:'This result contains a round-off error which is hidden from the output. The unrounded result is:', value:unRoundedStr }
			}
		}
		catch (err) {
			result_str = err.toString();
			return { error:result_str }
		}

		return { value:result_str }
	}
}
