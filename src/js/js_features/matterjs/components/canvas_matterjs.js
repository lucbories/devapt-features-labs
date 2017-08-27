
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Canvas from '../../../base/components/canvas'
// import MatterJS from '../../../../../bower_components/Matter/build/matter.js'


const plugin_name = 'Labs' 
const context = plugin_name + '/canvas_matterjs'



export default class CanvasMatterJS extends Canvas
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
		
		this.add_assets_dependancy('js-matterjs')

		this._world = undefined

		// this.enable_trace()
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
		super.prepare_space(arg_dom_id, arg_width, arg_height, arg_space, arg_scene)
		
		const world_config = {
			// set the timestep
			timestep: 1000.0 / 160,

			// maximum number of iterations per step
			maxIPF: 16,
			
			// set the integrator (may also be set with world.add())
			integrator: 'verlet'
		}

		PhysicsJS(world_config,
			(world)=>{
				this._world = world
			}
		)
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
		super.process_scene_item(arg_scene_item)
		
		// this._factory.create(arg_scene_item)
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
