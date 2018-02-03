
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'
import GeoPoint from '../../geometry/GeoPoint'
import Line from './line'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shapes/point'

const DEFAULT_RENDER = 'circle'
const DEFAULT_SIZE = 2
const DEFAULT_COLOR = 'red'



/**
 * @file Drawing point class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Point extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {SvgSpace}     arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {string}       arg_render   - shape rendering:cross, xcross, circle, disk, point.
	 * @param {number}       arg_size     - shape rendering size.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=DEFAULT_COLOR, arg_render=DEFAULT_RENDER, arg_size=DEFAULT_SIZE)
	{
		super(arg_space, arg_owner, new GeoPoint(arg_position), 'point')

		this.is_svg_point = true

		this.color  = arg_color
		this.render = arg_render
		this.size   = arg_size

		this.add_method('line')
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

		const svg = this.svg_space().svg()

		const options = {
			width:this.size,
			color:this.color ? this.color : 'blue'/*,
			linecap:'round'*/
		}

		switch (this.render) {
			case 'square':
				this._shape = svg
				.rect(2*this.size, 2*this.size)
				.move(pos_h - this.size, pos_v - size_v)
				.fill('none')
				this.draw_color()
				break
			case 'cross':
				this._shape = svg.group()
				this._shape.add( svg.line(pos_h - this.size, pos_v, pos_h + this.size, pos_v) )
				this._shape.add( svg.line(pos_h, pos_v - this.size, pos_h, pos_v + this.size) )
				this.draw_color()
				break
			case 'xcross':
				this._shape = svg.group()
				this._shape.add( svg.line(pos_h - this.size, pos_v - this.size, pos_h + this.size, pos_v + this.size) )
				this._shape.add( svg.line(pos_h - this.size, pos_v + this.size, pos_h + this.size, pos_v - this.size) )
				this.draw_color()
				break
			case 'point':
				this._shape = svg.point(pos_h, pos_v).fill(this.color)
				break
			case 'disk':
				this._shape = svg.circle(2*this.size).fill(this.color)
				this._shape.move(pos_h, pos_v)
				break
			case 'circle':
			default:{
				this._shape = svg.circle(2*this.size).fill('none').stroke(options)
				this._shape.center(pos_h, pos_v)
				break
			}
		}

		return this
	}



	/**
	 * Draw a line from this point to given point or shape.
	 * 
	 * @param {GeoPoint|Drawable} arg_position 
	 * @param {string} arg_color 
	 * @param {integer} arg_width 
	 */
	line(arg_position, arg_color='blue', arg_width=1)
	{
		if ( T.isArray(arg_position) )
		{
			arg_position = new GeoPoint(arg_position)
		}
		else if ( T.isObject(arg_position) && arg_position.is_svg_drawable )
		{
			arg_position = arg_position.position()
		}

		return new Line(this.svg_space(), this, this.position(), arg_position, arg_color, arg_width).draw()
	}
}