
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Pixel from './pixel'


const plugin_name = 'Labs' 
const context = plugin_name + '/base/pixelbox'

const DEFAULT_ORIGIN_H  = 0
const DEFAULT_ORIGIN_V  = 0
const DEFAULT_WIDTH     = 100
const DEFAULT_HEIGHT    = 100
const DEFAULT_PADDING_H = 5
const DEFAULT_PADDING_V = 5
const DEFAULT_MARGIN_H  = 0
const DEFAULT_MARGIN_V  = 0



/**
 * @file PixelBox class.
 * 
 * A PixelBox encapsulate a drawing zone into a canvas.
 * A Pixel has two coordinate, horizontal (0 at left, >0 at right) and vertical (0 at top, >0 at bottom). 
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class PixelBox
{
	/**
	 * Create an instance of PixelBox.
	 * 
	 * @param {object} arg_box_settings - pixel box settings.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_box_settings={})
	{
		this.is_pixelbox = true

		this._origin_h = this.get_number(arg_box_settings.origin_h, DEFAULT_ORIGIN_H)
		this._origin_v = this.get_number(arg_box_settings.origin_v, DEFAULT_ORIGIN_V)

		this._width  = this.get_number(arg_box_settings.width, DEFAULT_WIDTH)
		this._height = this.get_number(arg_box_settings.height, DEFAULT_HEIGHT)

		this._padding_h_left   = this.get_number(arg_box_settings.padding_h, DEFAULT_PADDING_H)
		this._padding_v_top    = this.get_number(arg_box_settings.padding_v, DEFAULT_PADDING_V)
		this._padding_h_right  = this.get_number(arg_box_settings.padding_h, DEFAULT_PADDING_H)
		this._padding_v_bottom = this.get_number(arg_box_settings.padding_v, DEFAULT_PADDING_V)

		this._margin_h_left    = this.get_number(arg_box_settings.margin_h, DEFAULT_MARGIN_H)
		this._margin_v_top     = this.get_number(arg_box_settings.margin_v, DEFAULT_MARGIN_V)
		this._margin_h_right   = this.get_number(arg_box_settings.margin_h, DEFAULT_MARGIN_H)
		this._margin_v_bottom  = this.get_number(arg_box_settings.margin_v, DEFAULT_MARGIN_V)

		this._usable_width  = this._width  - this._padding_h_left - this._padding_h_right
		this._usable_height = this._height - this._padding_v_top  - this._padding_v_bottom

		this._limit_right  = this._origin_h + this._margin_h_left + this._padding_h_left + this._usable_width
		this._limit_bottom = this._origin_v + this._margin_v_top  + this._padding_v_top  + this._usable_height
		this._limit_left   = this._origin_h + this._margin_h_left + this._padding_h_left
		this._limit_top    = this._origin_v + this._margin_v_top + this._padding_v_top

		this._usable = {
			width:this._usable_width,
			height:this._usable_height,
			top_left:    { h:this._limit_left,  v:this._limit_top },
			top_right:   { h:this._limit_right, v:this._limit_top },
			bottom_left: { h:this._limit_left,  v:this._limit_bottom },
			bottom_right:{ h:this._limit_right, v:this._limit_bottom }
		}
	}



	/**
	 * Get usable zone for drawing.
	 * 
	 * @returns {object} - { width, height, top_left, top_right, bottom_left, bottom_right }
	 */
	get_usable()
	{
		return this._usable
	}



	/**
	 * Get a box bounded horizontal value.
	 * 
	 * @param {number} arg_h - pixel horizontal coordonate.
	 * 
	 * @returns {number} - horizontal coordonate.
	 */
	get_boxed_h(arg_h, arg_map_to_limit=false)
	{
		const h = this.get_number(arg_h, 0)

		const h2 = this._limit_left + (h > 0 ? h : 0)
		
		if (h2 < this._limit_left)
		{
			return arg_map_to_limit ? this._limit_left : undefined
		}

		if (h2 > this._limit_right)
		{
			return arg_map_to_limit ? this._limit_right : undefined
		}
		return h2
	}



	/**
	 * Get a box bounded vertical value.
	 * 
	 * @param {number} arg_v - pixel vertical coordonate.
	 * 
	 * @returns {number} - vertical coordonate.
	 */
	get_boxed_v(arg_v, arg_map_to_limit=false)
	{
		const v = this.get_number(arg_v, 0)

		const v2 = this._limit_bottom - (v > 0 ? v : 0)
		
		if (v2 < this._limit_top)
		{
			return arg_map_to_limit ? this._limit_top : undefined
		}

		if (v2 > this._limit_bottom)
		{
			return arg_map_to_limit ? this._limit_bottom : undefined
		}
		return v2
	}



	/**
	 * Get a box bounded pixel.
	 * 
	 * @param {Pixel} arg_pixel - pixel instance.
	 * 
	 * @returns {Pixel} - same pixel value with or without update.
	 */
	get_boxed_pixel(arg_pixel, arg_map_to_limit=false)
	{
		const h = arg_pixel.h()
		const v = arg_pixel.v()

		const h2 = this.get_boxed_h(h)
		const v2 = this.get_boxed_v(v)

		if (h2 && v2)
		{
			arg_pixel.h(h2)
			arg_pixel.v(v2)
		}

		return arg_pixel
	}



	/**
	 * Get an integer value.
	 * 
	 * @param {number|string} arg_value 
	 * @param {number} arg_default 
	 * 
	 * @returns {number}
	 */
	get_number(arg_value, arg_default=0)
	{
		if ( T.isNumber(arg_value) )
		{
			return arg_value
		}

		if ( T.isString(arg_value) )
		{
			try{
				return parseInt(arg_value)
			}
			catch(e) {}
		}
		
		return arg_default
	}
}
