
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'
import Point from './point'
import Space from './space'


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
		this.color = arg_color
		this.fill = arg_fill
		this.line_width = 1

		this._center = undefined

		this.add_method('point')
		this.add_method('center')
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
		const radius_h = this.space().range_to_screen_h(this.radius)
		const radius_v = this.space().range_to_screen_v(this.radius)

		if (radius_h != radius_v)
		{
			this._shape = this.space().svg()
			.ellipse(2*radius_h, 2*radius_v)
			.center(pos_h, pos_v)
		} else {
			const diameter = 2 * radius_h
			this._shape = this.space().svg()
			.circle(diameter)
			.center(pos_h, pos_v)
		}
		
		this.draw_color()

		return this
	}


	point(arg_degrees_angle, arg_color='red', arg_render='xcross', arg_size=5)
	{
		// TODO TAKE DIMENSIONS FROM CIRCLE (x,y) or (y,z) or (x,t) or...
		const radian_angle = arg_degrees_angle * Math.PI / 180
		const x = this.x() + Math.cos(radian_angle) * this.radius
		const y = this.y() + Math.sin(radian_angle) * this.radius

		const point = new Point(this._space, this, [x, y], arg_color, arg_render, arg_size)
		point.draw()

		this._children.push(point)

		return point
	}


	center(arg_color='red', arg_render='xcross', arg_size=5)
	{
		if (this._center)
		{
			return this._center
		}

		// TODO TAKE DIMENSIONS FROM CIRCLE (x,y) or (y,z) or (x,t) or...
		const x = this.x()
		const y = this.y()

		this._center = new Point(this._space, this, [x, y], arg_color, arg_render, arg_size)
		this._center.draw()
		
		this.add_child(this._center)

		return this._center
	}


	ray(arg_degrees_angle, arg_length, arg_color='red', arg_render='xcross', arg_size=5, arg_line_color='red', arg_line_width=1)
	{
		if (! this._center)
		{
			this.center(arg_color, arg_render, arg_size)
		}

		// TODO TAKE DIMENSIONS FROM CIRCLE (x,y) or (y,z) or (x,t) or...
		const radian_angle = arg_degrees_angle * Math.PI / 180
		const x = this.x() + Math.cos(radian_angle) * arg_length
		const y = this.y() + Math.sin(radian_angle) * arg_length

		const point = new Point(this._space, this, [x, y], arg_color, arg_render, arg_size)
		point.draw()

		this._children.push(point)

		const line = this._center.line(point, arg_line_color, arg_line_width)
		
		this._children.push(line)
		
		return line
	}
}
