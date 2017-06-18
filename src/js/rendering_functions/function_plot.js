
// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


// const has_window = new Function('try {return this===window;}catch(e){ return false;}')
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const plugin_name = 'Labs' 
const context = plugin_name + '/rendering_function/function_plot'



// DEFAULT STATE
const default_state = {
}


// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * MtahJS Terminal rendering with given state, produce a rendering result.
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

	// BUILD TAG
	const terminal_id = settings.id// ? settings.id : 'tag_' + uid()
	const terminal_props = { id:terminal_id, className:'devapt-function-plot' }
	if ( T.isNotEmptyString(settings.style) )
	{
		terminal_props.style = settings.style
	}
	const terminal_tag = h('div', terminal_props, undefined)
	rendering_result.add_vtree(terminal_id, terminal_tag)
	
	// UPDATE RENDERING RESULT
	// rendering_result.add_head_scripts_urls(
	// 	[
	// 		{
	// 			id:'js-d3',
	// 			src:'plugins/' + plugin_name + '/d3.js'
	// 		}
	// 	]
	// )
	rendering_result.add_body_scripts_urls(
		[
			{
				id:'js-d3',
				src:'plugins/' + plugin_name + '/d3.js'
			},
			{
				id:'js-mathjs',
				src:'plugins/' + plugin_name + '/mathjs.js'
			},
			{
				id:'js-function-plot',
				src:'plugins/' + plugin_name + '/function-plot.js',
				required:['js-d3']
			},
			{
				id:'js-katex',
				src:'plugins/' + plugin_name + '/katex.js'
			},
			{
				id:'js-algebrite',
				src:'plugins/' + plugin_name + '/algebrite.js'
			}
		]
	)

	rendering_result.add_head_styles_urls(
		[
			{
				id:'css-katex',
				href:'plugins/' + plugin_name + '/katex.css'
			}
		]
	)

	return rendering_result
}
