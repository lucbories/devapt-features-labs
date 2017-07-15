
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
// import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import Component from 'devapt-core-browser/dist/js/base/component'


const plugin_name = 'Labs' 
const context = plugin_name + '/workspace'



export default class Workspace extends Component
{
	/**
	 * Create an instance of Component.
	 * @extends Component
	 * 
	 * 	API:
	 *      ->prepare_output_space()
	 *      ->process_input_string(arg_input_string)
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

		this._is_initialized = false

		// this.enable_trace()

		this.init()
	}
	
	
	// _update_self(arg_prev_element, arg_new_element)
	// {
	// 	this.enter_group('_update_self')


	// 	this.leave_group('_update_self')
	// }


	handle_items_change(arg_path, arg_previous_value, arg_new_value)
	{
		this.enter_group('handle_items_change')

		

		this.leave_group('handle_items_change')
	}

	
	init()
	{
		this.enter_group('init')


		this.leave_group('init')
	}
}