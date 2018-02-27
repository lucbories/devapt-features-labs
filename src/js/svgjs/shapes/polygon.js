
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/polygon'

const DEFAULT_EDGES = 5
const DEFAULT_RADIUS = 50



/**
 * @file Drawing polygon class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Polygon extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_edges    - shape edges count.
	 * @param {number}       arg_radius   - shape radius.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_edges, arg_radius)
	{
		super(arg_space, arg_owner, arg_position, 'polygon')

		this.is_svg_polygon = true

		this._edges  = typeof arg_edges  == 'number' ? arg_edges  : DEFAULT_EDGES
		this._radius = typeof arg_radius == 'number' ? arg_radius : DEFAULT_RADIUS
		this.color   = arg_color
	}



	_draw_self()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		const pos_h = this.h()
		const pos_v = this.v()
		
		const radius_h = this.svg_space().range_to_screen_h(this._radius)
		const radius_v = this.svg_space().range_to_screen_v(this._radius)
		const radius   = Math.min(radius_h, radius_v)

		const edges   = typeof this._edges  == 'number' ? this._edges  : DEFAULT_EDGES
		
		
		let i, a, x, y
		const points  = []
		const degrees = 360 / edges
	
		for (i = 0; i < edges; i++)
		{
			a = i * degrees - 90
			x = radius + radius * Math.cos(a * Math.PI / 180)
			y = radius + radius * Math.sin(a * Math.PI / 180)
	
			points.push([x, y])
		}
		
		this._shape = this.svg_space().svg()
		.polygon(new SVG.PointArray(points))
		.center(pos_h, pos_v)
		
		this.draw_color()

		return this
	}
}