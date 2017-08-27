
// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'

// PLUGIN IMPORT
import plugin_name from '../../plugin_name'

const has_window = new Function('try {return this===window;}catch(e){ return false;}')
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')
const context = plugin_name + '/rendering_function/workspace_sources'



// DEFAULT STATE
const default_state = {}


// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Workspace Sources rendering with given state, produce a rendering result.
 * 
 * 	UI for Workspace:
 * 		HBox container
 * 			Component: main workspace item
 * 			Accordion container
 * 				About component
 * 				Manuals component
 * 					x Feature manual component
 * 				Sources container
 * 					x Source component
 * 				Projects container
 * 					x Project component
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
	// const rf_resolver = has_window() ? window.devapt().ui().get_rendering_function_resolver() : (rendering_context && rendering_context.resolver ? rendering_context.resolver : undefined)
	// const hbox = rf_resolver ? rf_resolver('hbox') : DefaultRenderingPlugin.find_rendering_function('hbox')

	// GET SETTINGS
	// const p_tag   = T.isNotEmptyString(settings.tag)   ? settings.tag   : 'p'
	// const p_class = T.isNotEmptyString(settings.class) ? settings.class : undefined
	// const p_style = T.isNotEmptyString(settings.style) ? settings.style : undefined
	// const p_obj = { id:null }
	// if (p_class)
	// {
	// 	p_obj.className = p_class
	// }
	// if (p_style)
	// {
	// 	p_obj.style = p_style
	// }

	const texts_p = []
	// if( T.isArray(state.texts) )
	// {
	// 	state.texts.forEach(
	// 		(text, index)=>{
	// 			p_obj.id = settings.id + '_p_' + index
	// 			const p = h(p_tag, p_obj, text)
	// 			texts_p.push(p)
	// 		}
	// 	)
	// }

	// BUILD DIV TAG
	const div_tag = h('div', { id:settings.id, className:settings.class, style:settings.style }, texts_p)
	rendering_result.add_vtree(settings.id, div_tag)

	return rendering_result
}
