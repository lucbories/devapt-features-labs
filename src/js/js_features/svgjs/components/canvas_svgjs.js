
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Canvas from '../../../base/components/canvas'
import SvgFactory from '../svg/factory'
import Space from '../svg/space'


const plugin_name = 'Labs' 
const context = plugin_name + '/canvas_svgjs'



export default class CanvasSvgJS extends Canvas
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

		this.is_canvas_svgjs = true
		
		this.add_assets_dependancy('js-svgjs')

		this._space = undefined
		this._factory = undefined

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
		
		this._space = new Space(arg_dom_id, arg_width, arg_height, arg_space.domains)
		this._space.draw()
		this._space.background()
		this._space.axis_center_h()
		this._space.axis_center_v()

		this._factory = new SvgFactory(this._space)
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
		
		this._factory.create(arg_scene_item)
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
