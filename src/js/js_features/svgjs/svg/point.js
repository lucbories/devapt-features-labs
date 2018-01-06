
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/point'

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
	 * @param {Space}        arg_space    - drawing space.
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
		super(arg_space, arg_owner, arg_position, 'point')

		this.is_svg_point = true

		this.color  = arg_color
		this.render = arg_render
		this.size   = arg_size
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

		const size_h = this.space().project_x(this.size)
		const size_v = this.space().project_y(this.size)
		const size = Math.min(size_h, size_v)

		const svg = this.space().svg()

		const options = {
			width:this.size,
			color:this.color ? this.color : 'blue'/*,
			linecap:'round'*/
		}

		switch (this.render) {
			case 'square':
				this._shape = svg
				.rect(2*size_h, 2*size_v)
				.move(pos_h - size_h, pos_v - size_v)
				.fill('none')
				this.draw_color()
				break
			case 'cross':
				this._shape = svg.group()
				this._shape.add( svg.line(pos_h - size, pos_v, pos_h + size, pos_v) )
				this._shape.add( svg.line(pos_h, pos_v - size, pos_h, pos_v + size) )
				this.draw_color()
				break
			case 'xcross':
				this._shape = svg.group()
				this._shape.add( svg.line(pos_h - size, pos_v - size, pos_h + size, pos_v + size) )
				this._shape.add( svg.line(pos_h - size, pos_v + size, pos_h + size, pos_v - size) )
				this.draw_color()
				break
			case 'point':
				this._shape = svg.point(pos_h, pos_v).fill(this.color)
				break
			case 'disk':
				this._shape = svg.circle(2*size).fill(this.color)
				this._shape.move(pos_h, pos_v)
				break
			case 'circle':
			default:{
				this._shape = svg.circle(2*size).fill('none').stroke(options)
				this._shape.center(pos_h, pos_v)
				break
			}
		}

		return this
	}
}