
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import GeoPoint from '../../geometry/geopoint'
import Space from './space'
import PlotF from './plotf'
import Circle from './circle'
import Ellipse from './ellipse'
import Rectangle from './rectangle'
import Car from './car'
import Point from './point'
import LineArrow from './line_arrow'
import Line from './line'
import Axis from './axis'
import Polygon from './polygon'
import Star from './star'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shapes/factory'



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


	get(arg_name)
	{
		return this._shapes[arg_name]
	}


	set(arg_name, arg_shape)
	{
		if ( T.isObject(arg_shape) && arg_shape.is_svg_drawable )
		{
			this._shapes[arg_name] = arg_shape
		}
	}


	count()
	{
		return this._shapes_counter
	}


	types()
	{
		return ['cir', 'circle', 'rect', 'rectangle', 'line', 'axis', 'grid', 'ell', 'ellipse', 'p', 'point', 'car', 'arrow', 'line_arrow']
	}



	create(arg_shape_cfg)
	{
		console.log(context + ':create:shape cfg:', arg_shape_cfg)
		
		// GET TYPE
		const type = arg_shape_cfg.type
		if ( ! T.isNotEmptyString(type) )
		{
			return this
		}

		// GET NAME
		this._shapes_counter++
		const name = T.isNotEmptyString(arg_shape_cfg.name) ? arg_shape_cfg.name : 'shape-' + this._shapes_counter

		// GET POSITION AND COLOR
		const position_array = T.isArray(arg_shape_cfg.position) && arg_shape_cfg.position.length >= 2 ? arg_shape_cfg.position : [0,0,0]
		const position = new GeoPoint(position_array)
		const color = arg_shape_cfg.color

		// GET SPACE
		let space = this._space
		if ( T.isObject(arg_shape_cfg) && T.isObject(arg_shape_cfg.space) && arg_shape_cfg.space.is_svg_space)
		{
			space = arg_shape_cfg.space
		}

		// GET OPERANDS
		const position_end = T.isArray(arg_shape_cfg.position_end) && arg_shape_cfg.position_end.length >= 2 ? arg_shape_cfg.position_end : [0,0,0]
		const domain = arg_shape_cfg.domain
		const radius = T.isNumber(arg_shape_cfg.radius) && arg_shape_cfg.radius > 0 ? arg_shape_cfg.radius : 50
		const edges  = T.isNumber(arg_shape_cfg.edges)  && arg_shape_cfg.edges  > 0 ? arg_shape_cfg.edges  : 5
		const width  = T.isNumber(arg_shape_cfg.width)  && arg_shape_cfg.width  > 0 ? arg_shape_cfg.width  : 100
		const height = T.isNumber(arg_shape_cfg.height) && arg_shape_cfg.height > 0 ? arg_shape_cfg.height : 100
		const render = T.isNotEmptyString(arg_shape_cfg.render) ? arg_shape_cfg.render : undefined
		const size   = T.isNumber(arg_shape_cfg.size)   && arg_shape_cfg.size   > 0 ? arg_shape_cfg.size : undefined
		const inner  = T.isNumber(arg_shape_cfg.inner)  && arg_shape_cfg.inner  > 0 ? arg_shape_cfg.inner : 50
		const outer  = T.isNumber(arg_shape_cfg.outer)  && arg_shape_cfg.outer  > 0 ? arg_shape_cfg.outer : 50
		const spikes = T.isNumber(arg_shape_cfg.spikes) && arg_shape_cfg.spikes > 0 ? arg_shape_cfg.spikes : 5
		const plot_fn= T.isFunction(arg_shape_cfg.plot_fn) ? arg_shape_cfg.plot_fn : undefined
		
		let shape = undefined

		// LOOKUP TYPE CLASS
		switch(type.toLocaleLowerCase()) {
			case 'space': {
				console.log(context + ':create:space width=[%d] height=[%d] color=[%s]:', width, height, color, position_array)

				const position_pixel = space.project_position(position)
				const domains_settings = T.isArray(arg_shape_cfg.domains) ? arg_shape_cfg.domains : []
				const pixelbox_settings = {
					origin_h:position_pixel.h(),
					origin_v:position_pixel.v(),
					margin_h: T.isNumber(arg_shape_cfg.margin_h)  ? arg_shape_cfg.margin_h  : 0,
					margin_v: T.isNumber(arg_shape_cfg.margin_v)  ? arg_shape_cfg.margin_v  : 0,
					padding_h:T.isNumber(arg_shape_cfg.padding_h) ? arg_shape_cfg.padding_h : 5,
					padding_v:T.isNumber(arg_shape_cfg.padding_v) ? arg_shape_cfg.padding_v : 5,
					width:    T.isNumber(arg_shape_cfg.width)     ? arg_shape_cfg.width     : 100,
					height:   T.isNumber(arg_shape_cfg.height)    ? arg_shape_cfg.height    : 100
				}
				const space_settings = {
					background_color:color,
					grid:{ step_h:10, step_v:20, color:'green', size:3, format:'circle' },
					axis:{
						x:{ color:'red',  size:2 },
						y:{ color:'blue', size:1 }
					}
				}
				shape = new Space(space.svg(), domains_settings, pixelbox_settings, space_settings)
				shape._svg_space = space
				break
			}
			case 'plotf': {
				console.log(context + ':create:plotf color=[%s]:', color, position_array)
				shape = new PlotF(space, space, position, plot_fn, color, render, size)
				break
			}
			case 'circle':
			case 'cir': {
				console.log(context + ':create:circle radius=[%d] color=[%s]:', radius, color, position_array)
				shape = new Circle(space, space, position, color, radius)
				break
			}

			case 'p':
			case 'point': {
				console.log(context + ':create:point size=[%d] color=[%s] render=[%s]:', size, color, position_array, render)
				shape = new Point(space, space, position, color, render, size)
				break
			}

			case 'ellipse':
			case 'ell': {
				console.log(context + ':create:ellipse width=[%d] height=[%d] color=[%s]:', width, height, color, position_array)
				shape = new Ellipse(space, space, position, color, width, height)
				break
			}

			case 'rectangle':
			case 'rect': {
				console.log(context + ':create:rectangle width=[%d] height=[%d] color=[%s]:', width, height, color, position_array)
				shape = new Rectangle(space, space, position, color, width, height)
				break
			}

			case 'line': {
				console.log(context + ':create:line width=[%d] color=[%s]:', width, color, position_array, position_end)
				shape = new Line(space, space, position, position_end, color, width)
				break
			}

			case 'axis': {
				console.log(context + ':create:line domain=[%s] color=[%s] width=[%d]:', domain, color, width, position_array)
				shape = new Axis(space, space, position, domain, color, width)
				break
			}

			case 'polygon':
			case 'pol': {
				console.log(context + ':create:polygon edges=[%d] radius=[%d] color=[%s]:', edges, radius, color, position_array)
				shape = new Polygon(space, space, position, color, edges, radius)
				break
			}

			case 'star': {
				console.log(context + ':create:star spikes=[%d] inner=[%d] outer=[%d] color=[%s]:', spikes, inner, outer, color, position_array)
				shape = new Star(space, space, position, color, spikes, inner, outer)
				break
			}

			case 'car': {
				console.log(context + ':create:car width=[%d] height=[%d] color=[%s]:', width, height, color, position_array)

				shape = new Car(space, space, position, color, width, height)
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

				const position_end = T.isNotEmptyArray(arg_shape_cfg.end) ? arg_shape_cfg.end : undefined

				console.log(context + ':create:line arrow line_width=[%d] length=[%d] angle=[%d] end=[%s] color=[%s]:', line_width, length, angle, end, color, position_array)

				shape = new LineArrow(space, space, position, position_end, length, angle, color, arrow_start, arrow_end, line_width, arrow_h, arrow_v)
				break
			}
		}

		if (shape)
		{
			this._shapes[name] = shape
			shape.name = name
			shape.project()
			const result = shape.draw()
			// if (result.then)
			// {
			// 	result.then(
			// 		()=>{ space.svg_shape().add(shape.svg_shape()) }
			// 	)
			// } else {
			// 	space.svg_shape().add(shape.svg_shape())
			// }
		}

		return this
	}
}
