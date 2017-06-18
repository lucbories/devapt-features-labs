
// NPM IMPORTS
import h from 'virtual-dom/h'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'


const has_window = new Function('try {return this===window;}catch(e){ return false;}')
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
	const hbox = rf_resolver ? rf_resolver('hbox') : DefaultRenderingPlugin.find_rendering_function('hbox')

	// BUILD VBOX LEFT TAG
	const vbox_left_descr = T.isObject(settings.vbox_left) ? settings.vbox_left : {}
	vbox_left_descr.type = 'vbox'
	vbox_left_descr.settings = T.isObject(settings.vbox_left.settings) ? settings.vbox_left.settings : {}
	vbox_left_descr.settings.id = settings.id + '_vbox_left'
	vbox_left_descr.settings.style = 'margin-left:15px;'
	vbox_left_descr.state = T.isObject(state.vbox_left) ? state.vbox_left : { items:[] }

	// BUILD VBOX RIGHT TAG
	const vbox_right_descr = T.isObject(settings.vbox_right) ? settings.vbox_right : {}
	vbox_right_descr.type = 'vbox'
	vbox_right_descr.settings = T.isObject(settings.vbox_right.settings) ? settings.vbox_right.settings : {}
	vbox_right_descr.settings.id = settings.id + '_vbox_right'
	vbox_right_descr.state = T.isObject(state.vbox_right) ? state.vbox_right : { items:[] }

	// DEBUG
	console.log(context + ':vbox_left_descr=', vbox_left_descr)
	console.log(context + ':vbox_right_descr=', vbox_right_descr)

	// BUILD HBOX TAG
	const hbox_main_settings = settings.hbox ? settings.hbox : {}
	hbox_main_settings.id = settings.id + '_hbox'
	hbox_main_settings.sizes = ['small-6 large-8', 'small-6 large-4']
	const hbox_main_state = {}
	hbox_main_state.items = [vbox_left_descr, vbox_right_descr]
	hbox(hbox_main_settings, hbox_main_state, rendering_context, rendering_result)
	const hbox_main_vnode = rendering_result.get_vtree(hbox_main_settings.id)
	delete rendering_result.vtrees[hbox_main_settings.id]

	// BUILD DIV TAG
	const div_tag = h('div', { id:settings.id, className:settings.class, style:settings.style }, [hbox_main_vnode])
	rendering_result.add_vtree(settings.id, div_tag)

	return rendering_result
}
