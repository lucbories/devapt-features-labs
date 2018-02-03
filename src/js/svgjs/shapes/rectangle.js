
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'
import GeoPoint from '../../geometry/geopoint'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shapes/rectangle'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing rectangle class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Rectangle extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_width    - shape width.
	 * @param {number}       arg_height   - shape height.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_width, arg_height)
	{
		super(arg_space, arg_owner, arg_position, 'rectangle')

		this.is_svg_rectangle = true

		this._width = arg_width
		this._height = arg_height
		this.color = arg_color
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		const pos_h = this.h()
		const pos_v = this.v()
		const size_h = this.svg_space().range_to_screen_h(this._width, this.svg_space())
		const size_v = this.svg_space().range_to_screen_v(this._height, this.svg_space())

		this._shape = this.svg_space().svg()
		.rect(size_h, size_v)
		.move(pos_h, pos_v - size_v)

		if (this.color)
		{
			this._shape.fill(this.color)
		}

		return this
	}
}