
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/star'

const DEFAULT_INNER  = 50
const DEFAULT_OUTER  = 50
const DEFAULT_SPIKES = 5



/**
 * @file Drawing polygon class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Star extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_spikes   - shape spikes count.
	 * @param {number}       arg_inner    - shape inner.
	 * @param {number}       arg_outer    - shape outer.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_spikes, arg_inner, arg_outer)
	{
		super(arg_space, arg_owner, arg_position, 'star')

		this.is_svg_star = true

		this._spikes = typeof arg_spikes == 'number' ? arg_spikes : DEFAULT_SPIKES
		this._inner  = typeof arg_inner  == 'number' ? arg_inner  : DEFAULT_INNER
		this._outer  = typeof arg_outer  == 'number' ? arg_outer  : DEFAULT_OUTER
		this.color   = arg_color
	}



	_draw_self()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		const pos_h = this.h()
		const pos_v = this.v()

		const inner_h = this.svg_space().range_to_screen_h(this._inner)
		const inner_v = this.svg_space().range_to_screen_v(this._inner)
		const inner   = Math.min(inner_h, inner_v)

		const outer_h = this.svg_space().range_to_screen_h(this._outer)
		const outer_v = this.svg_space().range_to_screen_v(this._outer)
		const outer   = Math.min(outer_h, outer_v)

		const spikes   = typeof this._spikes  == 'number' ? this._spikes  : DEFAULT_SPIKES
  
		let i, a, x, y
		const points  = []
		const degrees = 360 / spikes
	
		for (i = 0; i < spikes; i++)
		{
			a = i * degrees + 90
			x = outer + inner * Math.cos(a * Math.PI / 180)
			y = outer + inner * Math.sin(a * Math.PI / 180)
	  
			points.push([x, y])
	  
			a += degrees / 2
			x = outer + outer * Math.cos(a * Math.PI / 180)
			y = outer + outer * Math.sin(a * Math.PI / 180)

			points.push([x, y])
		}
		
		this._shape = this.svg_space().svg()
		.polygon( new SVG.PointArray(points) )
		.center(pos_h, pos_v)
		
		this.draw_color()

		return this
	}
}