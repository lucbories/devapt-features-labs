
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Circle from './circle'
import Ellipse from './ellipse'
import Rectangle from './rectangle'
import Car from './car'
import LineArrow from './line_arrow'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/factory'



/**
 * @file Drawing car class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Factory
{
	/**
	 * Create a shapes factory.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space)
	{
		this.is_svg_factory = true

		this._space = arg_space
		this._shapes = {}
		this._shapes_counter = 0
	}


	space()
	{
		return this._space
	}


	svg()
	{
		return this.space().svg()
	}


	shapes()
	{
		return this._shapes
	}



	create(arg_shape_cfg)
	{
		console.log(context + ':create:shape cfg:', arg_shape_cfg)
		
		// GET TYPE
		const type = arg_shape_cfg.type
		if ( ! T.isNotEmptyString(type) )
		{
			return
		}

		// GET NAME
		this._shapes_counter++
		const name = T.isNotEmptyString(arg_shape_cfg.name) ? arg_shape_cfg.name : 'shape-' + this._shapes_counter

		// GET POSITION AND COLOR
		const position = T.isArray(arg_shape_cfg.position) && arg_shape_cfg.position.length >= 2 ? arg_shape_cfg.position : [0,0,0]
		const color = arg_shape_cfg.color

		// LOOKUP TYPE CLASS
		switch(type.toLocaleLowerCase()) {
			case 'circle':
			case 'cir': {
				const radius = T.isNumber(arg_shape_cfg.radius) && arg_shape_cfg.radius > 0 ? arg_shape_cfg.radius : 100
				console.log(context + ':process_scene_item:circle radius=[%d] color=[%s]:', radius, color, position)

				const shape = new Circle(this._space, this._space, position, color, radius)
				shape.draw()
				this._shapes[name] = shape
				break
			}

			case 'ellipse':
			case 'ell': {
				const width  = T.isNumber(arg_shape_cfg.width)  && arg_shape_cfg.width  > 0 ? arg_shape_cfg.width  : 100
				const height = T.isNumber(arg_shape_cfg.height) && arg_shape_cfg.height > 0 ? arg_shape_cfg.height : 100
				console.log(context + ':process_scene_item:ellipse width=[%d] height=[%d] color=[%s]:', width, height, color, position)

				const shape = new Ellipse(this._space, this._space, position, color, width, height)
				shape.draw()
				this._shapes[name] = shape
				break
			}

			case 'rectangle':
			case 'rect': {
				const width  = T.isNumber(arg_shape_cfg.width)  && arg_shape_cfg.width  > 0 ? arg_shape_cfg.width  : 100
				const height = T.isNumber(arg_shape_cfg.height) && arg_shape_cfg.height > 0 ? arg_shape_cfg.height : 100
				console.log(context + ':process_scene_item:rectangle width=[%d] height=[%d] color=[%s]:', width, height, color, position)

				const shape = new Rectangle(this._space, this._space, position, color, width, height)
				shape.draw()
				this._shapes[name] = shape
				break
			}

			case 'car': {
				const width  = T.isNumber(arg_shape_cfg.width)  && arg_shape_cfg.width  > 0 ? arg_shape_cfg.width  : 100
				const height = T.isNumber(arg_shape_cfg.height) && arg_shape_cfg.height > 0 ? arg_shape_cfg.height : 100
				console.log(context + ':process_scene_item:car width=[%d] height=[%d] color=[%s]:', width, height, color, position)

				const shape = new Car(this._space, this._space, position, color, width, height)
				shape.draw()
				this._shapes[name] = shape
				break
			}

			case 'arrow':
			case 'line_arrow': {
				const arrow_start = T.isBoolean(arg_shape_cfg.has_arrow_start) ? arg_shape_cfg.has_arrow_start  : false
				const arrow_end   = T.isBoolean(arg_shape_cfg.has_arrow_end)   ? arg_shape_cfg.has_arrow_end    : true

				const line_width  = T.isNumber(arg_shape_cfg.line_width)  && arg_shape_cfg.line_width  > 0 ? arg_shape_cfg.line_width  : 1

				const arrow_h = T.isNumber(arg_shape_cfg.arrow_h)  && arg_shape_cfg.arrow_h  > 0 ? arg_shape_cfg.arrow_h  : 10
				const arrow_v = T.isNumber(arg_shape_cfg.arrow_v)  && arg_shape_cfg.arrow_v  > 0 ? arg_shape_cfg.arrow_v  : 10

				const length  = T.isNumber(arg_shape_cfg.length) && arg_shape_cfg.length > 0 ? arg_shape_cfg.length : undefined
				const angle   = T.isNumber(arg_shape_cfg.angle)  && arg_shape_cfg.angle >= 0 ? arg_shape_cfg.angle  : undefined

				const end = T.isNotEmptyArray(arg_shape_cfg.end) ? arg_shape_cfg.end : undefined

				console.log(context + ':process_scene_item:line arrow line_width=[%d] length=[%d] angle=[%d] end=[%s] color=[%s]:', line_width, length, angle, end, color, position)

				const shape = new LineArrow(this._space, this._space, position, color, arrow_start, arrow_end, line_width, arrow_h, arrow_v, (end ? end : length), angle)
				shape.draw()
				this._shapes[name] = shape
				break
			}
		}

		return this
	}
}
