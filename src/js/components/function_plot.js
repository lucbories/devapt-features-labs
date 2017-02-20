// NPM IMPORTS
import assert from 'assert'
const Devapt = require('devapt').default
const T = Devapt.T
const Component = Devapt.Component

// BROWSER IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/plotter'



export default class FunctionPlot extends Component
{
	/**
	 * Create an instance of FunctionPlot.
	 * @extends Component
	 * 
	 * 	API:
	 *      ->...
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

		this.is_terminal_mathjs_plot = true
		
		this.add_assets_dependancy('js-mathjs')
		this.add_assets_dependancy('js-d3')
		// this.add_assets_dependancy('js-function-plot')
		this.add_assets_dependancy('js-algebrite')

		this._plot_fn_type = 'linear'		// linear|parametric|implicit|polar|points|vector
		this._plot_sampler = 'builtIn'		// interval|builtIn (builtIn should only be used when graphType is polyline|scatter)
		this._plot_graph_type = 'polyline'	// interval|polyline|scatter
		this._plot_samples = 1000
		
		this._range_x_1 = undefined
		this._range_x_2 = undefined
		this._range_y_1 = undefined
		this._range_y_2 = undefined

		this._functions = []

		// this.enable_trace()
	}


	load()
	{
		super.load()

		this.get_assets_promise()
		.then(
			()=>{
				window.math.config(
					{
						number: 'number',
						precision: 20
					}
				)
				
				const scripts = [{id:'js-function-plot', src:'plugins/' + plugin_name + '/function-plot.js'}]
				window.devapt().ui()._ui_rendering.process_rendering_result_scripts_urls(document.head, scripts, undefined)

				window.devapt().asset_promise('js-function-plot')
				.then(
					()=>{
						const plot_options = {
							target:'#' + this.get_dom_id(),
							data:[]
						}
						this.update_options_with_state(plot_options)

						window.functionPlot(plot_options)
					}
				)
			}
		)
		.catch(
			(reason)=>{
				this.error(reason)
			}
		)

		
		this._plot_fn_type = this.get_state_value('plot_type', 'linear')		// linear|parametric|implicit|polar|points|vector
		this._plot_sampler = this.get_state_value('plot_engine', 'builtIn')		 // interval|builtIn (builtIn should only be used when graphType is polyline|scatter)
		this._plot_graph_type = this.get_state_value('plot_method', 'polyline')	// interval|polyline|scatter
		this._plot_samples = this.get_state_value('plot_samples', 1000)
		
		this._range_x_1 = this.get_state_value('plot_range_x_1', undefined)
		this._range_x_2 = this.get_state_value('plot_range_x_2', undefined)
		this._range_y_1 = this.get_state_value('plot_range_y_1', undefined)
		this._range_y_2 = this.get_state_value('plot_range_y_2', undefined)

		this._derivative = this.get_state_value('derivative', undefined)
	}



	/**
	 * Update plot options with state attributes.
	 * 
	 * @param {object} arg_options - plot options plain object.
	 *  
	 * @returns {object} - given plot options plain object.
	 */
	update_options_with_state(arg_options)
	{
		const plot_options = arg_options

		const plot_width  = this.get_state_value('plot_width', undefined)
		const plot_height = this.get_state_value('plot_height', undefined)

		const plot_zoom   = this.get_state_value('plot_zoom', true)
		const plot_grid   = this.get_state_value('plot_grid', true)

		const label       = this.get_state_value('label', undefined)
		const plot_title  = this.get_state_value('plot_title', label)

		// SET GRAPH WIDTH
		if ( T.isString(plot_width) )
		{
			try {
				plot_options.width = parseInt(plot_width)
			}
			catch(e){e}
		}
		if ( T.isNumber(plot_width) )
		{
			plot_options.width = plot_width
		}

		// SET GRAPH HEIGHT
		if ( T.isString(plot_height) )
		{
			try {
				plot_options.height = parseInt(plot_height)
			}
			catch(e){e}
		}
		if ( T.isNumber(plot_height) )
		{
			plot_options.height = plot_height
		}

		// SET GRAPH TITLE
		if ( T.isString(plot_title) || T.isNumber(plot_title) )
		{
			plot_options.title = plot_title
		}

		// SET GRAPH ZOOM ON/OFF
		if ( (T.isString(plot_zoom) && plot_zoom == 'false') || (T.isBoolean(plot_zoom) && ! plot_zoom) )
		{
			plot_options.disableZoom = true
		}

		// SET GRAPH GRID ON/OFF
		if ( T.isString(plot_grid) )
		{
			plot_options.grid = plot_grid == 'false' ? false : true
		}
		if ( T.isBoolean(plot_grid) )
		{
			plot_options.grid = plot_grid
		}

		return plot_options
	}



	/**
	 * Clear functions array.
	 *
	 * @returns {nothing}
	 */
	clear_functions()
	{
		this.enter_group('clear_functions')

		this._functions = []
		const svg = this.get_dom_element().firstChild
		this.get_dom_element().removeChild(svg)
		
		const plot_options = {
			target:'#' + this.get_dom_id(),
			data:[]
		}
		this.update_options_with_state(plot_options)
		window.functionPlot(plot_options)

		// console.log(context + ':clear_functions:functions=', this._functions)

		this.leave_group('clear_functions')
	}



	/**
	 * Process plot of functions.
	 *
	 * @returns {nothing}
	 */
	process()
	{
		this.enter_group('process')
		
		this.get_assets_promise()
		.then(
			()=>{
				this.process_self()
			}
		)

		this.leave_group('process')
	}


	/**
	 * Process plot of functions.
	 *
	 * @returns {nothing}
	 */
	process_self()
	{
		this.enter_group('process_self')

		const inputs_id = this.get_state_value('plot_inputs_selectors')
		this.debug('inputs_id', inputs_id)
		assert( T.isNotEmptyArray(inputs_id), context + ':process:bad inputs array', inputs_id)

		const input_1_jqo = inputs_id.length > 0 ? $('#' + inputs_id[0]) : undefined
		const input_2_jqo = inputs_id.length > 1 ? $('#' + inputs_id[1]) : undefined
		// console.log('inputs_id[0]', inputs_id[0])
		// console.log('input_1_jqo', input_1_jqo)

		const input_1_str = inputs_id.length > 0 ? input_1_jqo.val() : undefined
		const input_2_str = inputs_id.length > 1 ? input_2_jqo.val() : undefined
		// console.log('input_1_str', input_1_str)
		// console.log('input_2_str', input_2_str)
		
		if ( ! T.isNotEmptyString(input_1_str) )
		{
			this.leave_group('process:empty function')
			return
		}

		switch(this._plot_fn_type) {
			case 'linear':
				this._functions.push(input_1_str)
				this.line2d(this.get_dom_id(), this._functions, this._plot_samples, this._range_x_1, this._range_x_2, this._range_y_1, this._range_y_2)
				break
			case 'parametric':
				if ( ! T.isNotEmptyString(input_2_str) )
				{
					this.leave_group('process:empty function')
					return
				}
				this._functions.push( {x:input_1_str, y:input_2_str} )
				this.param2d(this.get_dom_id(), this._functions, this._plot_samples, this._range_x_1, this._range_x_2, this._range_y_1, this._range_y_2)
				break
			case 'polar':
				this._functions.push(input_1_str)
				this.polar2d(this.get_dom_id(), this._functions, this._plot_samples, this._range_x_1, this._range_x_2, this._range_y_1, this._range_y_2)
				break
			case 'implicit':
				this._functions.push(input_1_str)
				this.implicit2d(this.get_dom_id(), this._functions, this._plot_samples, this._range_x_1, this._range_x_2, this._range_y_1, this._range_y_2)
				break
		}

		this.leave_group('process_self')
	}


	line2d(arg_plot_id, arg_fn, arg_samples, arg_x_range1, arg_x_range2, arg_y_range1, arg_y_range2)
	{
		const functionPlot = window.functionPlot
		try {
			if ( T.isString(arg_fn) )
			{
				arg_fn = [arg_fn]
			}

			// SET FUNCTIONS RECORDS
			const functions = []
			arg_fn.forEach(
				(fn)=>{
					const fn_config = {
						fn:fn,
						fnType:'linear',
						sampler:this._plot_sampler,
						graphType:this._plot_graph_type
					}
					if (this._derivative == 'true')
					{
						try {
							const d_fn = window.Algebrite.run('d(' + fn + ')')
							fn_config.derivative = {
								fn: d_fn,
								updateOnMouseMove: true
							}
						} catch(e){}
					}
					functions.push(fn_config)
					
				}
			)

			// SET PLOT SETTINGS
			const plot_options = {
				target:'#' + arg_plot_id,
				data:functions
			}

			// SET POINTS NUMBER FOR INTERVAL
			if ( T.isNumber(arg_samples) )
			{
				plot_options.nSamples = arg_samples
			}

			// SET X RANGE
			if ( T.isNumber(arg_x_range1) && T.isNumber(arg_x_range2) )
			{
				plot_options.xAxis = { domain:[arg_x_range1, arg_x_range2] }
			}

			// SET Y RANGE
			if ( T.isNumber(arg_y_range1) && T.isNumber(arg_y_range2) )
			{
				plot_options.yAxis = { domain:[arg_y_range1, arg_y_range2] }
			}

			this.update_options_with_state(plot_options)
			functionPlot(plot_options)

			return 'success'
		}
		catch (err) {
			return 'error:' + err
		}
	}

	polar2d(arg_plot_id, arg_fn, arg_samples, arg_x_range1, arg_x_range2, arg_y_range1, arg_y_range2)
	{
		const functionPlot = window.functionPlot
		try {
			if ( T.isString(arg_fn) )
			{
				arg_fn = [arg_fn]
			}

			// SET FUNCTIONS RECORDS
			const functions = []
			arg_fn.forEach(
				(fn)=>{
					functions.push(
						{
							r:fn,
							fnType:'polar',
							sampler:this._plot_sampler,
							graphType:this._plot_graph_type
						}
					)
				}
			)

			// SET PLOT SETTINGS
			const plot_options = {
				target:'#' + arg_plot_id,
				data:functions
			}

			// SET POINTS NUMBER FOR INTERVAL
			if ( T.isNumber(arg_samples) )
			{
				plot_options.nSamples = arg_samples
			}

			// SET X RANGE
			if ( T.isNumber(arg_x_range1) && T.isNumber(arg_x_range2) )
			{
				plot_options.xAxis = { domain:[arg_x_range1, arg_x_range2] }
			}

			// SET Y RANGE
			if ( T.isNumber(arg_y_range1) && T.isNumber(arg_y_range2) )
			{
				plot_options.yAxis = { domain:[arg_y_range1, arg_y_range2] }
			}
			
			// DEBUG
			// console.log('polar2d:arg_samples', arg_samples)
			// console.log('polar2d:arg_x_range1,2', arg_x_range1, arg_x_range2)
			// console.log('polar2d:arg_y_range1,2', arg_y_range1, arg_y_range2)
			// console.log('polar2d:plot_options', plot_options)
			
			this.update_options_with_state(plot_options)

			functionPlot(plot_options)

			return 'success'
		}
		catch (err) {
			return 'error:' + err
		}
	}


	param2d(arg_plot_id, arg_fn, arg_samples, arg_range1, arg_range2)
	{
		const functionPlot = window.functionPlot
		try {
			if ( T.isObject(arg_fn) )
			{
				arg_fn = [{x:arg_fn.x, y:arg_fn.y}]
			}
			console.log(context + ':%s:param2d:', this.get_name(), arg_fn, arg_samples, arg_range1, arg_range2)
			
			if (! T.isArray(arg_fn) )
			{
				return
			}

			// // SET FUNCTIONS RECORDS
			const functions = []
			arg_fn.forEach(
				(fn)=>{
					functions.push(
						{
							x: fn.x,
							y: fn.y,
							fnType:'parametric',
							sampler:this._plot_sampler,
							graphType:this._plot_graph_type
						}
					)
				}
			)

			// SET PLOT SETTINGS
			const plot_options = {
				target:'#' + arg_plot_id,
				data:functions
			}

			// SET POINTS NUMBER FOR INTERVAL
			if ( T.isNumber(arg_samples) )
			{
				plot_options.nSamples = arg_samples
			}

			// SET RANGE
			if ( T.isNumber(arg_range1) && T.isNumber(arg_range2) )
			{
				plot_options.range = { domain:[arg_range1, arg_range2] }
			}
			
			this.update_options_with_state(plot_options)

			functionPlot(plot_options)

			return 'success'
		}
		catch (err) {
			return 'error:' + err
		}
	}


	implicit2d(arg_plot_id, arg_fn, arg_samples, arg_x_range1, arg_x_range2, arg_y_range1, arg_y_range2)
	{
		const functionPlot = window.functionPlot
		try {
			if ( T.isString(arg_fn) )
			{
				arg_fn = [arg_fn]
			}

			// SET FUNCTIONS RECORDS
			const functions = []
			arg_fn.forEach(
				(fn)=>{
					functions.push(
						{
							fn:fn,
							fnType:'implicit',
							// sampler:this._plot_sampler, // NOT SUPPORTED
							// graphType:this._plot_graph_type
							graphType: 'interval'
						}
					)
				}
			)

			// SET PLOT SETTINGS
			const plot_options = {
				target:'#' + arg_plot_id,
				data:functions
			}

			// SET POINTS NUMBER FOR INTERVAL
			if ( T.isNumber(arg_samples) )
			{
				plot_options.nSamples = arg_samples
			}

			// SET X RANGE
			if ( T.isNumber(arg_x_range1) && T.isNumber(arg_x_range2) )
			{
				plot_options.xAxis = { domain:[arg_x_range1, arg_x_range2] }
			}

			// SET Y RANGE
			if ( T.isNumber(arg_y_range1) && T.isNumber(arg_y_range2) )
			{
				plot_options.yAxis = { domain:[arg_y_range1, arg_y_range2] }
			}
			
			this.update_options_with_state(plot_options)

			functionPlot(plot_options)

			return 'success'
		}
		catch (err) {
			return 'error:' + err
		}
	}



	/**
	 * Resize component.
	 * 
	 * @returns {nothing}
	 */
	resize()
	{
		const dom_elem = this.get_dom_element()
		const width = dom_elem.width
		const height = dom_elem.height

		// this.dispatch_update_state_value_action(['plot_width'], width)
		// this.dispatch_update_state_value_action(['plot_height'], height)

		// SET PLOT SETTINGS
		const plot_options = {
			target:'#' + this.get_dom_id(),
			data:this._functions
		}
			
		this.update_options_with_state(plot_options)
		plot_options.width = width
		plot_options.height = height

		window.functionPlot(plot_options)
	}
}
