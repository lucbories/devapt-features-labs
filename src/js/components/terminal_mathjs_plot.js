// NPM IMPORTS
// import assert from 'assert'
const Devapt = require('devapt').default
const T = Devapt.T

// BROWSER IMPORTS
import TerminalMathJS from './terminal_mathjs'


const plugin_name = 'Labs' 
const context = plugin_name + '/terminal_mathjs_plot'



export default class TerminalMathJSPlot extends TerminalMathJS
{
	/**
	 * Create an instance of TerminalMathJSPlot.
	 * @extends TerminalMathJS
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

		this.is_terminal_mathjs_plot = true
		
		this.add_assets_dependancy('js-d3')
		// this.add_assets_dependancy('js-function-plot-d3')

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

				// window.devapt().asset_promise('js-function-plot')
				// .then(
				// 	()=>{
				// 		const plot_options = {
				// 			target:'#' + this.get_dom_id(),
				// 			data:[]
				// 		}
				// 		window.functionPlot(plot_options)
				// 	}
				// )
			}
		)
		.catch(
			(reason)=>{
				this.error(reason)
			}
		)
	}



	/**
	 * Init MathJS parser.
	 *
	 * @returns {nothing}
	 */
	init_parser()
	{
		this.enter_group('init_parser')

		const plot_id = this.get_state_value('plot_id')
		this.debug('plot_id', plot_id)

		const line2d = (arg_fn, arg_samples, arg_x_range1, arg_x_range2, arg_y_range1, arg_y_range2)=>{
			var functionPlot = window.functionPlot
			try {
				const plot_options = {
					target: '#' + plot_id,
					data: [
						{
							fn: arg_fn,
							sampler: 'builtIn',
							graphType: 'scatter'
						}
					]
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

				functionPlot(plot_options)

				return 'success'
			}
			catch (err) {
				return 'error:' + err
			}
		}

		const polar2d = (arg_fn, arg_samples, arg_x_range1, arg_x_range2, arg_y_range1, arg_y_range2)=>{
			var functionPlot = window.functionPlot
			try {
				const plot_options = {
					target: '#' + plot_id,
					data: [
						{
							r: arg_fn,
							fnType: 'polar', // linear|parametric|implicit|polar|points|vector
							sampler: 'builtIn', // interval|builtIn (builtIn should only be used when graphType is polyline|scatter)
							graphType: 'scatter', // interval|polyline|scatter
							color:'red',
							closed:true
						}
					]
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

				functionPlot(plot_options)

				return 'success'
			}
			catch (err) {
				return 'error:' + err
			}
		}

		const zero2d = (arg_fn, arg_samples)=>{
			var functionPlot = window.functionPlot
			try {
				const plot_options = {
					target: '#' + plot_id,
					data: [
						{
							fn: arg_fn,
							fnType: 'implicit',
							// sampler: 'builtIn', // NOT SUPPORTED
							graphType: 'interval'
						}
					]
				}

				// SET POINTS NUMBER FOR INTERVAL
				if ( T.isNumber(arg_samples) )
				{
					plot_options.nSamples = arg_samples
				}

				functionPlot(plot_options)

				return 'success'
			}
			catch (err) {
				return 'error:' + err
			}
		}

		const param2d = (arg_fn1, arg_fn2, arg_samples, arg_range1, arg_range2)=>{
			var functionPlot = window.functionPlot
			try {
				const plot_options = {
					target: '#' + plot_id,
					data: [
						{
							x: arg_fn1,
							y: arg_fn2,
							// range:[arg_range1, arg_range2],
							// nSamples:arg_samples,
							fnType: 'parametric',
							// sampler: 'builtIn',
							graphType: 'scatter' // interval NOT SUPPORTED
						}
					]
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

				functionPlot(plot_options)

				return 'success'
			}
			catch (err) {
				return 'error:' + err
			}
		}

		if (math && math.parser)
		{
			this.debug('set math with default type=number and precision=20')
			math.config({
				number: 'number',
				precision: 20
			})

			this.debug('define functions:plot,polar,param...')
			math.import(
				{
					plot:line2d,
					line2d:line2d,
					polar2d:polar2d,
					polar:polar2d,
					zero:zero2d,
					zero2d:zero2d,
					param:param2d,
					param2d:param2d,
				}
			)
			this._parser = math.parser()
		}

		this.leave_group('init_parser')
	}
}
