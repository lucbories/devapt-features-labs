
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'
import Point from './point'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/circle'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing circle class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Circle extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_radius   - shape radius.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_radius, arg_fill = false)
	{
		super(arg_space, arg_owner, arg_position, 'circle')

		this.is_svg_circle = true

		this.radius = arg_radius
		this.color = arg_color // '#f06'
		this.fill = arg_fill
		this.line_width = 1

		this.add_method('point')
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		// RENDER
		const pos_h = this.h()
		const pos_v = this.v()
		const diameter_h = this.space().project_x(2 * this.radius)
		const diameter_v = this.space().project_y(2 * this.radius)
		const diameter = Math.min(diameter_h, diameter_v)

		this._shape = this.space().svg()
		.circle(diameter)
		.center(pos_h, pos_v)

		this.draw_color()

		return this
	}


	point(arg_degrees_angle, arg_color='red', arg_render='xcross', arg_size=5)
	{
		const radian_angle = arg_degrees_angle * Math.PI / 180
		const pos_h = this.h() + this.space().project_x( Math.cos(radian_angle) * this.radius)
		const pos_v = this.v() - this.space().project_y( Math.sin(radian_angle) * this.radius)

		const point = new Point(this._space, this, [pos_h, pos_v], arg_color, arg_render, arg_size)
		point.draw()
		return point
	}
}
