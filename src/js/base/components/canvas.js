
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import Component from 'devapt-core-browser/dist/js/base/component'

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/canvas'



export default class Canvas extends Component
{
	/**
	 * Create an instance.
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

		this.is_canvas = true
		
		// console.log(context + ':constructor:state:', arg_state)

		// this.enable_trace()
	}



	load()
	{
		super.load()

		return this.get_assets_promise()
		.then(
			()=>{
				const space = this.get_state_value('space', undefined)
				const scene = this.get_state_value('scene', undefined)

				// DEBUG
				console.log(context + ':load:space:', space)
				console.log(context + ':load:scene:', scene)

				this.process(space, scene)
			}
		)
	}
		


	/**
	 * Process canvas settings.
	 * 
	 * @param {object} arg_space - .
	 * @param {object} arg_scene - .
	 * 
	 * @returns {nothing}
	 */
	process(arg_space={}, arg_scene={})
	{
		console.log(context + ':process:space:', arg_space)
		console.log(context + ':process:scene:', arg_scene)
		
		// PREPARE DRAWING SPACE
		const width  = arg_space.drawing && arg_space.drawing.horizontal && arg_space.drawing.horizontal.pixels  ? arg_space.drawing.horizontal.pixels  : 500
		const height = arg_space.drawing && arg_space.drawing.vertical   && arg_space.drawing.vertical.pixels    ? arg_space.drawing.vertical.pixels    : 500
		const dom_id = this.get_dom_id()
		console.log(context + ':process:dom_id:', dom_id)

		try{
			this.prepare_space(dom_id, width, height, arg_space, arg_scene)

			// BUILD SCENE
			const scene_keys = Object.keys(arg_scene)
			console.log(context + ':process:scene_keys:', scene_keys)

			scene_keys.forEach(
				(scene_key)=>{
					const shapes = arg_scene[scene_key]
					if ( T.isNotEmptyArray(shapes) )
					{
						shapes.forEach(
							(shape)=>{
								this.process_scene_item(shape)
							}
						)
					}
				}
			)

			this.finish_space()
		}
		catch(e)
		{
			console.error(context + ':process:dom_id:' + dom_id + ':error=' + e.toString())
		}
	}
	


	/**
	 * Prepare drawing space.
	 * 
	 * @param {string} 	arg_dom_id - DOM element id.
	 * @param {number} arg_width - DOM element width.
	 * @param {number} arg_height - DOM element height.
	 * @param {object} arg_space - drawing space configuration.
	 * @param {object} arg_scene - drawing shapes.
	 * 
	 * @returns {nothing}
	 */
	prepare_space(arg_dom_id, arg_width, arg_height, arg_space, arg_scene)
	{
		console.log(context + ':prepare_space:dom id=%s width=%d height=%d, space, scene:', arg_dom_id, arg_width, arg_height, arg_space, arg_scene)
	}
	


	/**
	 * Process drawing item.
	 * 
	 * @param {object} arg_scene_item - scene item to draw.
	 * 
	 * @returns {nothing}
	 */
	process_scene_item(arg_scene_item)
	{
		console.log(context + ':process_scene_item:item:', arg_scene_item)
	}
	


	/**
	 * Finish drawing space.
	 * 
	 * @returns {nothing}
	 */
	finish_space()
	{
		console.log(context + ':finish_space')
	}
}
