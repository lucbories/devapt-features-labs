// NPM IMPORTS
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'
const Devapt = require('devapt').default

// DEVAPT IMPORTS
const has_window = new Function('try {return this===window;}catch(e){ return false;}')
const T = Devapt.T
const DefaultRenderingPlugin = Devapt.DefaultRenderingPlugin
const rendering_normalize = DefaultRenderingPlugin.find_rendering_function('rendering_normalize')


const plugin_name = 'Labs' 
const context = plugin_name + '/rendering_function/lab'



// DEFAULT STATE
const default_state = {
	label:undefined,
	workspaces:[]
}


// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Lab rendering with given state, produce a rendering result.
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
	const tabs = rf_resolver ? rf_resolver('tabs') : DefaultRenderingPlugin.find_rendering_function('tabs')

	// GET STATE ATTRIBUTES
	const workspaces_names = T.isArray(state.workspaces) ? state.workspaces : []
	state.items = T.isArray(state.items) ? state.items : []
	workspaces_names.forEach(
		(workspace_item)=>{
			if ( T.isNotEmptyString(workspace_item) )
			{
				state.items.push( { title:workspace_item, content:workspace_item } )
				return
			}
			if ( T.isObject(workspace_item) && T.isNotEmptyString(workspace_item.title) && T.isNotEmptyString(workspace_item.content) )
			{
				state.items.push( { title:workspace_item.title, content:workspace_item.content } )
				return
			}
		}
	)

	// BUILD TABS TAG
	const tabs_settings = settings.tabs ? settings.tabs : {}
	tabs_settings.id = settings.id + '_tabs'
	tabs(tabs_settings, state, rendering_context, rendering_result)
	const tabs_vnode = rendering_result.get_vtree(tabs_settings.id)

	// BUILD DIV TAG
	const div_props = { id:settings.id }
	if ( T.isString(settings.class) )
	{
		div_props.className = settings.class
	}
	if ( T.isString(settings.style) )
	{
		div_props.style = settings.style
	}
	const div_tag = h('div', div_props, [tabs_vnode])
	rendering_result.add_vtree(settings.id, div_tag)

	return rendering_result
}
