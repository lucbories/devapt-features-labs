
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'


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
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_radius)
	{
		super(arg_space, arg_owner, arg_position, 'circle')

		this.is_svg_circle = true

		this._radius = arg_radius
		this._color = arg_color // '#f06'
	}



	draw()
	{
		const pos_h = this.pos_h()
		const pos_v = this.pos_v()
		const diameter_h = this.domain_h().range_to_screen(2 * this._radius)
		const diameter_v = this.domain_v().range_to_screen(2 * this._radius)
		const diameter = Math.min(diameter_h, diameter_v)

		this._shape = this.space().svg()
		.circle(diameter)
		.move(pos_h, pos_v)
		// .fill('none')

		if (this._color)
		{
			this._shape.fill(this._color)
		}

		return this
	}


	point(arg_degrees_angle, arg_color='red')
	{
		const radian_angle = arg_degrees_angle * Math.PI / 180
		const pos_h = this.pos_h() + this.domain_h().range_to_screen( Math.cos(radian_angle) * this._radius)
		const pos_v = this.pos_v() + this.domain_v().range_to_screen( Math.sin(radian_angle) * this._radius)

		return this.space().svg().point(pos_h, pos_v).fill(arg_color)
	}
}
