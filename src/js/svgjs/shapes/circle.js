
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'
import SvgPoint from './point'
import SvgSpace from './space'
import GeoPoint from '../../geometry/geopoint'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shapes/circle'

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

		const point0degree = [this.x() + this.radius, this.y(), 0, 0]
		const point90degree = [this.x(), this.y() + this.radius, 0, 0]
		this.add_point( new GeoPoint(point0degree) ) // Point at 1
		this.add_point( new GeoPoint(point90degree) ) // Point at 2

		this._svg_center = undefined

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
		const pos_h = this.h(0)
		const pos_v = this.v(0)
		const radius_h = this.h(1) - pos_h
		const radius_v = this.v(2) - pos_v

		if (radius_h != radius_v)
		{
			this._shape = this.svg_space().svg()
			.ellipse(2*radius_h, 2*radius_v)
			.center(pos_h, pos_v)
		} else {
			const diameter = 2 * radius_h
			this._shape = this.svg_space().svg()
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

		const point = new SvgPoint(this.svg_space(), this, new GeoPosition([x, y, 0, 0]), arg_color, arg_render, arg_size)
		point.project()
		point.draw()

		this.add_child(point)

		return point
	}


	center(arg_color='red', arg_render='xcross', arg_size=5)
	{
		if (this._svg_center)
		{
			return this._svg_center
		}

		// TODO TAKE DIMENSIONS FROM CIRCLE (x,y) or (y,z) or (x,t) or...
		const x = this.x()
		const y = this.y()

		this._svg_center = new SvgPoint(this.svg_space(), this, new GeoPosition([x, y, 0, 0]), arg_color, arg_render, arg_size)
		this._svg_center.project()
		this._svg_center.draw()
		
		this.add_child(this._svg_center)

		return this._svg_center
	}


	ray(arg_degrees_angle, arg_length, arg_color='red', arg_render='xcross', arg_size=5, arg_line_color='red', arg_line_width=1)
	{
		if (! this._svg_center)
		{
			this.center(arg_color, arg_render, arg_size)
		}

		// TODO TAKE DIMENSIONS FROM CIRCLE (x,y) or (y,z) or (x,t) or...
		const radian_angle = arg_degrees_angle * Math.PI / 180
		const x = this.x() + Math.cos(radian_angle) * arg_length
		const y = this.y() + Math.sin(radian_angle) * arg_length

		const point = new SvgPoint(this.svg_space(), this, new GeoPosition([x, y, 0, 0]), arg_color, arg_render, arg_size)
		point.project()
		point.draw()

		this.add_child(point)

		const line = this._svg_center.line(point, arg_line_color, arg_line_width)
		line.project()
		line.draw()
		
		this.add_child(line)
		
		return line
	}
}
