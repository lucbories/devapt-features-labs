// NPM IMPORTS
// import assert from 'assert'
const Devapt = require('devapt').default

// BROWSER IMPORTS
const Component = Devapt.Component


const plugin_name = 'Labs' 
const context = plugin_name + '/terminal'



export default class Terminal extends Component
{
	/**
	 * Create an instance of Terminal.
	 * @extends Component
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

		this.is_terminal = true
		
		this.add_assets_dependancy(['js-terminal'])
		
		// this.enable_trace()
	}
	
	
	
	/**
	 * Load and apply a component configuration.
	 * 
	 * @param {Immutable.Map|undefined} arg_state - component state to load (optional).
	 * 
	 * @returns {nothing} 
	 */
	load(arg_state)
	{
		this.enter_group('load')

		if (this._is_loaded)
		{
			// console.info(context + ':load:already loaded component ' + this.get_name())
			this.leave_group('load:already loaded')
			return
		}

		super.load(arg_state)

		this.init()

		this.leave_group('load')
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
		return { value:arg_expression }
	}

	

	/**
	 * Init Terminal command handler.
	 * 
	 * @returns {nothing}
	 */
	init_terminal()
	{
		this.enter_group('init_terminal')

		// GET DOM ELEMENTS
		const history_id = this.get_state_value('history_id')
		const prompt = this.get_state_value('prompt', '>')
		const history_jqo = history_id ? $('#' + history_id) : undefined
		const input_jqo = $('#' + this.get_dom_id())
		const name = this.get_name()
		const self = this

		// TERMINAL COMMAND CALLBACK
		var commands_cb = function(command)
		{
			// DISPLAY COMMAND
			var terminal_out_cmd_jqo = $('<pre>')
			terminal_out_cmd_jqo.addClass('terminal_out_cmd')
			var str_cmd = '>' + command
			terminal_out_cmd_jqo.text(str_cmd)
			terminal_out_cmd_jqo.css('color', 'black')
			
			// DISPLAY RESULT
			var terminal_out_result_jqo = $('<pre>')
			terminal_out_result_jqo.addClass('terminal_out_result')
			var str_result = ''

			// EVALUATE EXPRESSION
			var result = self.eval(command)
			if (result.error)
			{
				str_result = result.error + ' [' + result.value + ']'
				terminal_out_result_jqo.css('color', 'red')
			} else {
				str_result = result.value
				terminal_out_result_jqo.css('color', 'green')
			}
			terminal_out_result_jqo.text(str_result)

			if (history_jqo)
			{
				history_jqo.prepend(terminal_out_result_jqo)
				history_jqo.prepend(terminal_out_cmd_jqo)
			}
		}

		var cmd = input_jqo.cmd(
			{
				greetings: false,
				prompt:prompt,
				name:name,
				//height:50,
				enabled:false,
				commands:commands_cb
			}
		)
		input_jqo.css('background-color', 'steelblue')
		input_jqo.css('height', '30px')
		input_jqo.css('padding-top', '10px')

		input_jqo.click(
			()=>{
				var enabled = $('.cmd.enabled')
				if (enabled && enabled.length > 0)
				{
					enabled.data('cmd').disable()
				}
				cmd.enable()
			}
		)

		input_jqo.focusout(
			()=>{
				var enabled = $('.cmd.enabled')
				if (enabled && enabled.length > 0)
				{
					enabled.data('cmd').disable()
				}
			}
		)

		this.leave_group('init_terminal')
	}

	

	/**
	 * Init component when assets are loaded.
	 * 
	 * @returns {nothing}
	 */
	init()
	{
		this.enter_group('init')

		// const assets_promises = []
		// this._assets_scripts.forEach(
		// 	(asset_id)=>{
		// 		assets_promises.push( window.devapt().asset_promise(asset_id) )
		// 	}
		// )
		// console.log(context + ':init:%s:assets:', this.get_name(), this._assets_scripts)

		// Promise.all(assets_promises)

		this.get_assets_promise()
		.then( ()=>this.init_terminal() )
		.catch( (error)=>console.error(error) )

		this.leave_group('init')
	}
}
