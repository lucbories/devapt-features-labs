
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import LineArrow from './line_arrow'
import Position from '../../../base/position'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/axis'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing axis class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Axis extends LineArrow
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_pos_orig - shape origin position.
	 * @param {array|Vector} arg_domain   - axis domain.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_width    - shape width in pixels.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_pos_orig, arg_domain, arg_color=undefined, arg_width)
	{
		// super(arg_space, arg_owner, arg_pos_orig, 'axis')
		super(arg_space, arg_owner, arg_pos_orig, arg_color, false, true, arg_width, 5, 5, 0, 0)
		
		this.type = 'axis'
		this.is_svg_axis = true

		this._domain = arg_domain == 'x' ? 'x' : 'y'
		this._width = arg_width ? arg_width : 1
		this._dashes = '' // '5,5'
		
		this.color = arg_color ? arg_color : 'blue'

		const domain = this._domain == 'x' ? this.domain_x() : this.domain_y()
		const start = domain.start()
		const end   = domain.end()

		const pos_orig_h = this.h()
		const pos_orig_v = this.v()

		const pos_end   = end - start

		this._line_length = undefined
		this._line_angle = undefined
		if (this._domain == 'x')
		{
			this._line_end_position = new Position([pos_end, pos_orig_v])
		} else {
			this._line_end_position = new Position([pos_orig_h, pos_end])
		}
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		super.draw()
		
		const domain = this._domain == 'x' ? this.domain_x() : this.domain_y()
		const start = domain.start()
		const step  = domain.step()
		const end   = domain.end()

		const pixel = this.project( new Position([start, end]) )
		const h_start = pixel.h() + this.h()
		
		
		if (this._domain == 'x')
		{
			const r1 = this.space().svg().rect(2, 4).move(h_start, this.v() - 2)
			this._shape.add(r1)
		} else {
			const r1 = this.space().svg().rect(4, 2).move(this.h() - 2, this.v() - 2)
			this._shape.add(r1)
		}

		if (this.color && this._width)
		{
			this._shape.stroke({ color:this.color, width:this._width, dasharray: this._dashes })
		}

		return this
	}
}