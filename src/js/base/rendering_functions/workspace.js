
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
	label:undefined,
	
	about:undefined,    // ABOUT (OPTIONAL)
	features:undefined, // FEATURES LIST (OPTIONAL)
	sources:undefined,  // SOURCES LIST (OPTIONAL)
	projects:undefined, // PROJECTS LIST (OPTIONAL)
}


// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined,

	main_view:undefined, // MAIN WORKSPACE VIEW

	about:undefined,    // ABOUT (OPTIONAL)
	features:undefined, // FEATURES LIST (OPTIONAL)
	sources:undefined,  // SOURCES LIST (OPTIONAL)
	projects:undefined, // PROJECTS LIST (OPTIONAL)
}



/**
 * Workspace rendering with given state, produce a rendering result.
 * 
 * 	UI:
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
	const window_tf_resolver  = has_window() ? window.devapt().ui().get_rendering_function_resolver() : undefined
	const context_tf_resolver = rendering_context && rendering_context.resolver && T.isFunction(rendering_context.resolver.find_rendering_function) ? rendering_context.resolver : undefined
	const rf_resolver = window_tf_resolver ? window_tf_resolver : (v)=>{ return context_tf_resolver.find_rendering_function(v) }
	const hbox = T.isFunction(rf_resolver) ? rf_resolver('hbox') : DefaultRenderingPlugin.find_rendering_function('hbox')

	// GET SETTINGS ATTRIBUTES
	const main_view = settings.main_view

	// GET STATE ATTRIBUTES
	const label    = T.isNotEmptyString(state.label) ? state.label: undefined
	const authors  = T.isObject(state.authors)  ? state.authors  : {}
	const sources  = T.isObject(state.sources)  ? state.sources  : {}
	const projects = T.isObject(state.projects) ? state.projects : {}
	const features = T.isObject(state.features) ? state.features : {}

	// BUILD ABOUT
	const about_descr = {
		type:'workspace_about',
		settings: T.isObject(settings.about) ? settings.about : {},
		state:    T.isObject(state.about)    ? state.about    : { texts:[] }
	}

	// BUILD MANUALS
	const manuals_descr = {
		type:'workspace_manuals',
		settings: T.isObject(settings.manuals) ? settings.manuals : {},
		state:    T.isObject(state.manuals)    ? state.manuals    : {}
	}
	
	// BUILD SOURCES
	const sources_descr = {
		type:'workspace_sources',
		settings: T.isObject(settings.sources) ? settings.sources : {},
		state:    T.isObject(state.sources)    ? state.sources    : {}
	}
	
	// BUILD PROJECTS
	const projects_descr = {
		type:'workspace_projects',
		settings: T.isObject(settings.projects) ? settings.projects : {},
		state:    T.isObject(state.projects)    ? state.projects    : {}
	}

	// BUILD RIGHT TAG
	const settings_vbox_right = T.isObject(settings.vbox_right) ? settings.vbox_right : {}
	const right_descr = settings_vbox_right
	right_descr.type = 'vbox'
	right_descr.settings = T.isObject(settings_vbox_right.settings) ? settings_vbox_right.settings : {}
	right_descr.settings.id = settings.id + '_vbox_right'
	right_descr.settings.style = T.isNotEmptyString(settings_vbox_right.style) ? settings_vbox_right.style : ''
	right_descr.settings.class = T.isNotEmptyString(settings_vbox_right.class) ? settings_vbox_right.class : ''
	right_descr.state = T.isObject(state.vbox_right) ? state.vbox_right : {}
	right_descr.state.items = [about_descr, manuals_descr, sources_descr, projects_descr]

	// DEBUG
	console.log(context + ':main_view=', main_view)
	console.log(context + ':right_descr=', right_descr)

	// BUILD HBOX TAG
	const hbox_main_settings = settings.hbox ? settings.hbox : {}
	hbox_main_settings.id = settings.id + '_hbox'
	hbox_main_settings.sizes = ['small-6 large-8', 'small-6 large-4']

	const hbox_main_state = {}
	hbox_main_state.items = [main_view, right_descr]

	hbox(hbox_main_settings, hbox_main_state, rendering_context, rendering_result)

	const hbox_main_vnode = rendering_result.get_vtree(hbox_main_settings.id)
	delete rendering_result.vtrees[hbox_main_settings.id]

	// BUILD DIV TAG
	const div_tag = h('div', { id:settings.id, className:settings.class, style:settings.style }, [hbox_main_vnode])
	rendering_result.add_vtree(settings.id, div_tag)

	return rendering_result
}
