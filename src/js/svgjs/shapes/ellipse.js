
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/ellipse'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing ellipse class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Ellipse extends Drawable
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
		super(arg_space, arg_owner, arg_position, 'circle')

		this.is_svg_ellipse = true

		this._width = arg_width
		this._height = arg_height
		this.color= arg_color

		const point0degree = [this.x() + this._width, this.y(), 0, 0]
		const point90degree = [this.x(), this.y() + this._height, 0, 0]
		this.add_point( new GeoPoint(point45degree) ) // Point at 1
		this.add_point( new GeoPoint(point90degree) ) // Point at 2
	}



	_draw_self()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		const pos_h = this.h(0)
		const pos_v = this.v(0)
		const size_h = this.h(1) - pos_h
		const size_v = this.v(2) - pos_v

		this._shape = this.svg_space().svg()
		.ellipse(size_h, size_v)
		.center(pos_h, pos_v)

		if (this.color)
		{
			this._shape.fill(this.color)
		}

		return this
	}
}
