// NPM IMPORTS
// import assert from 'assert'
// import _ from 'lodash'
// import h from 'virtual-dom/h'
const Devapt = require('devapt').default

// DEVAPT IMPORTS
const has_window = new Function('try {return this===window;}catch(e){ return false;}')
const T = Devapt.T
const DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')


const plugin_name = 'Labs' 
const context = plugin_name + '/rendering_function/workspace'



// DEFAULT STATE
const default_state = {
	label:undefined
}


// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Workspace rendering with given state, produce a rendering result.
 * 
 * @param {object}          arg_settings          - rendering item settings.
 * @param {object}          arg_state             - component state.
 * @param {object}          arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result  - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings={}, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	// const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined

	// RENDERING FUNCTIONS RESOLUTION
	const rf_resolver = has_window() ? window.devapt().ui().get_rendering_function_resolver() : undefined
	const workspace = rf_resolver ? rf_resolver('workspace') : DefaultRenderingPlugin.find_rendering_function('workspace')
	// const terminal  = rf_resolver ? rf_resolver('terminal')  : DefaultRenderingPlugin.find_rendering_function('terminal')

	// BUILD VBOX LEFT TAG
	state.vbox_left = T.isObject(state.vbox_left) ? state.vbox_left : {}
	state.vbox_left.items = T.isArray(state.vbox_left.items) ? state.vbox_left.items : []
	state.vbox_left.items.push({ view:settings.id + '_vbox_left_graphs' })
	state.vbox_left.items.push({ view:settings.id + '_vbox_left_terminal' })
	state.vbox_left.items.push({ view:settings.id + '_vbox_left_history' })
	
	settings.vbox_left = T.isObject(settings.vbox_left) ? settings.vbox_left : {}
	settings.vbox_left.children = {}
	settings.vbox_left.children[settings.id + '_vbox_left_graphs'] = {
		type:'container',
		settings:{ id:settings.id + '_vbox_left_graphs', class:'test', style:'min-height:30%;' },
		state:{},
		children:{}
	}

	// settings.vbox_left.children[settings.id + '_vbox_left_terminal'] = {
	// 	type:'terminal',
	// 	settings:{
	// 		id:settings.id + '_vbox_left_terminal'
	// 	},
	// 	state:{},
	// 	children:{}
	// }

	// const terminal_name = settings.id + '_vbox_left_terminal'
	// const terminal_settings = { id:terminal_name }
	// const terminal_state = {}
	// terminal(terminal_settings, terminal_state, rendering_context, rendering_result)

	settings.vbox_left.children[settings.id + '_vbox_left_history'] = {
		type:'container',
		settings:{
			id:settings.id + '_vbox_left_history',
			class:'test',
			style:'min-height:30%;max-height:50%;overflow:scroll;'
		},
		state:{},
		children:{}
	}

	// BUILD VBOX RIGHT TAG
	state.vbox_right = T.isObject(state.vbox_right) ? state.vbox_right : {}
	state.vbox_right.items = T.isArray(state.vbox_right.items) ? state.vbox_right.items : []
	state.vbox_right.items.push({ view:settings.id + '_vbox_right_scope' })

	settings.vbox_right = T.isObject(settings.vbox_right) ? settings.vbox_right : {}
	settings.vbox_right.children = {}
	settings.vbox_right.children[settings.id + '_vbox_right_scope'] = {
		type:'container',
		settings:{ id:settings.id + '_vbox_right_scope', style:'min-height:80%;' },
		state:{},
		children:{}
	}

	// BUILD WORKSPACE TAG
	workspace(settings, state, rendering_context, rendering_result)

	// UPDATE RENDERING RESULT
	rendering_result.add_body_scripts_urls(
		[
			// {
			// 	id:'js-terminal',
			// 	src:'plugins/' + plugin_name + '/jquery.terminal.js'
			// },
			// {
			// 	id:'js-mousewheel',
			// 	src:'plugins/' + plugin_name + '/jquery.mousewheel.js'
			// },
			{
				id:'js-mathjs',
				src:'plugins/' + plugin_name + '/mathjs.js'
			},
			{
				id:'js-d3',
				src:'plugins/' + plugin_name + '/d3.js'
			},
			{
				id:'js-function-plot',
				src:'plugins/' + plugin_name + '/function-plot.js'
			}
		]
	)

	// rendering_result.add_head_styles_urls(
	// 	[
	// 		{
	// 			id:'css-terminal',
	// 			href:'plugins/' + plugin_name + '/jquery.terminal.css'
	// 		}
	// 	]
	// )

	/*const js_init = `
		window.devapt().on_content_rendered(
			function()
			{
				function line2d(arg_fn)
				{
					var functionPlot = window.functionPlot
					try {
						functionPlot({
							target: "#${settings.id + '_vbox_left_graphs'}",
							data: [
								{
									fn: arg_fn,
									sampler: 'builtIn',
									graphType: 'scatter'
								}
							]
						});

						return 'success'
					}
					catch (err) {
						return 'error:' + err
					}
				}

				function polar2d(arg_fn)
				{
					var functionPlot = window.functionPlot
					try {
						functionPlot({
							target: "#${settings.id + '_vbox_left_graphs'}",
							yAxis: {domain: [-1.897959183, 1.897959183]},
							xAxis: {domain: [-3, 3]},
							data: [
								{
									r: arg_fn,
									fnType: 'polar',
									sampler: 'builtIn',
									graphType: 'scatter'
								}
							]
						});

						return 'success'
					}
					catch (err) {
						return 'error:' + err
					}
				}

				function zero2d(arg_fn)
				{
					var functionPlot = window.functionPlot
					try {
						functionPlot({
							target: "#${settings.id + '_vbox_left_graphs'}",
							data: [
								{
									fn: arg_fn,
									fnType: 'implicit',
									// sampler: 'builtIn', // NOT SUPPORTED
									graphType: 'interval'
								}
							]
						});

						return 'success'
					}
					catch (err) {
						return 'error:' + err
					}
				}

				function param2d(arg_fn1, arg_fn2, arg_range1, arg_range2, arg_samples)
				{
					var functionPlot = window.functionPlot
					try {
						arg_range1 = arg_range1 ? arg_range1 : 0
						arg_range2 = arg_range2 ? arg_range2 : 2*math.PI
						arg_samples = arg_samples ? arg_samples : 100
						functionPlot({
							target: "#${settings.id + '_vbox_left_graphs'}",
							data: [
								{
									x: arg_fn1,
									y: arg_fn2,
									range:[arg_range1, arg_range2],
									nSamples:arg_samples,
									fnType: 'parametric',
									// sampler: 'builtIn',
									graphType: 'scatter' // interval NOT SUPPORTED
								}
							]
						});

						return 'success'
					}
					catch (err) {
						return 'error:' + err
					}
				}

				function load_terminal()
				{
					var parser = undefined
					if (math && math.parser)
					{
// 						math.config({
// 							number: 'number'//, // BigNumber
// //							precision: 20
// 						})
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
						parser = math.parser()
					}
					var eval_mathjs = function(expr)
					{
						var resStr
						var res
						try {
							res = parser.eval(expr);
							resStr = math.format(res, { precision: 14 });
							var unRoundedStr = math.format(res);
							if (unRoundedStr.length - resStr.length > 4) {
								return { error:'This result contains a round-off error which is hidden from the output. The unrounded result is:', value:unRoundedStr }
							}
						}
						catch (err) {
							resStr = err.toString();
							return { error:resStr }
						}

						return { value:resStr }
					}


					var history_jqo = $("#${settings.id + '_vbox_left_history'}")
					var input_jqo = $("#${settings.id + '_vbox_left_terminal'}")
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

						if (parser)
						{
							var result = eval_mathjs(command)
							if (result.error)
							{
								str_result = result.error + ' [' + result.value + ']'
								terminal_out_result_jqo.css('color', 'red')
							} else {
								str_result = result.value
								terminal_out_result_jqo.css('color', 'green')
							}
						} else {
							if (command == 'test') {
								str_result = "you just typed 'test'"
								terminal_out_result_jqo.css('color', 'green')
							} else {
								str_result = "unknow command"
								terminal_out_result_jqo.css('color', 'red')
							}
						}
						terminal_out_result_jqo.text(str_result)

						history_jqo.prepend(terminal_out_result_jqo)
						history_jqo.prepend(terminal_out_cmd_jqo)
					}
					input_jqo.cmd(
						{
							greetings: false,
							prompt:'>',
							name:'test',
							//height:50,
							commands:commands_cb
						}
					)
					input_jqo.css('background-color', 'steelblue')
					input_jqo.css('height', '30px')
					input_jqo.css('padding-top', '10px')
				}

				var scripts = document.getElementsByTagName('script')
				var js_terminal_script = undefined
				var js_mathjs_script = undefined
				var js_d3_script = undefined
				var js_plot_script = undefined
				var i = 0
				for( ; i < scripts.length ; i++)
				{
					var e = scripts[i]
					var id = e.getAttribute('id')
					if (id == 'js-terminal')
					{
						js_terminal_script = e
						continue
					}
					if (id == 'js-mathjs')
					{
						js_mathjs_script = e
						continue
					}
					if (id == 'js-d3')
					{
						js_d3_script = e
						continue
					}
					if (id == 'js-function-plot')
					{
						js_plot_script = e
						continue
					}
				}
				if ( ! js_terminal_script )
				{
					console.error('js-terminal script not found')
					return
				}
				if ( ! js_mathjs_script )
				{
					console.error('js-mathjs script not found')
					return
				}
				if ( ! js_d3_script )
				{
					console.error('js-d3 script not found')
					return
				}
				if ( ! js_plot_script )
				{
					console.error('js-function-plot script not found')
					return
				}
				
				js_terminal_script.onload = function()
				{
					js_mathjs_script.onload = function()
					{
						// js_d3_script.onload = function()
						// {
							// js_plot_script.onload = function()
							// {
								console.log('d3', d3)
								
								load_function_plot()
								console.log('window.functionPlot', window.functionPlot)

									
							// }
						// }
					}
				}
			}
		)`
	
	rendering_result.add_body_scripts_tags(
		[
			{
				id:'js-terminal_workspace-init',
				content:js_init
			}
		]
	)*/

	return rendering_result
}
