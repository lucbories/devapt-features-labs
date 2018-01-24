
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'


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
		const size_h = this.space().range_to_screen_h(this._width)
		const size_v = this.space().range_to_screen_v(this._height)

		this._shape = this.space().svg()
		.ellipse(size_h, size_v)
		.center(pos_h, pos_v)

		if (this.color)
		{
			this._shape.fill(this.color)
		}

		return this
	}
}
