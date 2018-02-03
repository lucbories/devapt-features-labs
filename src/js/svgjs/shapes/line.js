
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'
import GeoPoint from '../../geometry/geopoint'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shapes/line'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing line class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Line extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_pos_begin- shape position begin.
	 * @param {array|Vector} arg_pos_end - shape position end.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_width    - shape width in pixels.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_pos_begin, arg_pos_end, arg_color=undefined, arg_width)
	{
		super(arg_space, arg_owner, arg_pos_begin, 'line')

		this.is_svg_line = true

		this.add_point( new GeoPoint(arg_pos_end) ) // End geoPoint at 1

		this.color = arg_color ? arg_color : 'blue'
		this._width = arg_width ? arg_width : 1
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		const pos_begin_h = this.h(0)
		const pos_begin_v = this.v(0)
		const pos_end_h = this.h(1)
		const pos_end_v = this.v(1)
		
		this._shape = this.svg_space().svg().line(pos_begin_h, pos_begin_v, pos_end_h, pos_end_v)

		if (this.color && this._width)
		{
			this._shape.stroke({ color:this.color, width:this._width })
		}

		return this
	}
}