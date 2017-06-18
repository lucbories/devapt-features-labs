
// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
// import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


// const has_window = new Function('try {return this===window;}catch(e){ return false;}')
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const plugin_name = 'Labs' 
const context = plugin_name + '/rendering_function/terminal_algebrite'



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
	const terminal_id = settings.id
	const terminal_props = { id:terminal_id/*, className:'terminal'*/ }
	const terminal_tag = h('div', terminal_props, undefined)
	rendering_result.add_vtree(terminal_id, terminal_tag)
	
	// UPDATE RENDERING RESULT
	rendering_result.add_body_scripts_urls(
		[
			{
				id:'js-terminal',
				src:'plugins/' + plugin_name + '/jquery.terminal.js',
				required:['js-jquery']
			},
			{
				id:'js-mousewheel',
				src:'plugins/' + plugin_name + '/jquery.mousewheel.js',
				required:['js-jquery']
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
				id:'css-terminal',
				href:'plugins/' + plugin_name + '/jquery.terminal.css'
			}
		]
	)

	return rendering_result
}
