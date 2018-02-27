
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import LineArrow from './line_arrow'
import GeoPoint from '../../geometry/geopoint';


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shapes/axis'

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
		super(arg_space, arg_owner, arg_pos_orig, arg_color, false, true, arg_width, 5, 5, [100,100], undefined)
		
		this.type = 'axis'
		this.is_svg_axis = true

		this._line_length = undefined
		this._line_angle = undefined

		this._domain = arg_domain == 'x' ? 'x' : 'y'
		this._width = arg_width ? arg_width : 1
		this._dashes = '' // '5,5'
		
		this.color = arg_color ? arg_color : 'blue'

		const domain = this._domain == 'x' ? arg_space.domain_x() : arg_space.domain_y()
		const start = domain.start()
		const end   = domain.end()

		if (this._domain == 'x')
		{
			this.add_point( new GeoPoint([start, 0, 0, 0]) ) // Point at 1
			this.add_point( new GeoPoint([end,   0, 0, 0]) ) // Point at 2
			// this._line_end_position = new GeoPoint([end, 0])
		} else {
			this.add_point( new GeoPoint([0, start, 0, 0]) ) // Point at 1
			this.add_point( new GeoPoint([0, end,   0, 0]) ) // Point at 2
			// this._line_end_position = new GeoPoint([0, end])
		}
	}



	_draw_self()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		super._draw_self()
		
		const domain = this._domain == 'x' ? this.geo_space().domain_x() : this.geo_space().domain_y()
		// const start = domain.start()
		// const step  = domain.step()
		// const end   = domain.end()
		
		if (this._domain == 'x')
		{
			// const pixel = this.project_position( new Position([start, 0, 0, 0]) )
			const h1 = this.h(1)
			const v1 = this.v(1)
			const r1 = this.svg_space().svg().rect(2, 4).move(h1, v1 - 2)
			this._shape.add(r1)
		} else {
			// const pixel = this.project_position( new Position([0, start, 0, 0]) )
			const h1 = this.h(1)
			const v1 = this.v(1)
			const r1 = this.svg_space().svg().rect(4, 2).move(h1 - 2, v1 - 2)
			this._shape.add(r1)
		}

		if (this.color && this._width)
		{
			this._shape.stroke({ color:this.color, width:this._width, dasharray: this._dashes })
		}

		return this
	}
}