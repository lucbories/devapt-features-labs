
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Vector from '../math/vector'


const plugin_name = 'Labs' 
const context = plugin_name + '/base/pixel'



/**
 * @file Pixel class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->h(v):number - get|set horizontal value.
 * 		->v(v):number - get|set vertical value.
 */
export default class Pixel
{
	/**
	 * Create an instance of Position.
	 * 
	 * @param {number} arg_pixel_h - pixel horizontal coordonate.
	 * @param {number} arg_pixel_v - pixel vertical coordonate.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_pixel_h, arg_pixel_v)
	{
		this.is_pixel = true

		this._h = 0
		this._v = 0

		this.h(arg_pixel_h)
		this.v(arg_pixel_v)
	}



	/**
	 * Set or get pixel horizontal coordonate.
	 * 
	 * @param {number} arg_value - pixel horizontal coordonate.
	 * 
	 * @returns {number|Pixel} - returns number with setter, returns this for setter.
	 */
	h(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._h = arg_value
			return this
		}

		if ( T.isString(arg_value) )
		{
			try{
				this._h = parseInt(arg_value)
			}
			catch(e) {}
			return this
		}
		
		return this._h
	}


	
	/**
	 * Set or get pixel vertical coordonate.
	 * 
	 * @param {number} arg_value - pixel vertical coordonate.
	 * 
	 * @returns {number|Pixel} - returns number with setter, returns this for setter.
	 */
	v(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._v = arg_value
			return this
		}

		if ( T.isString(arg_value) )
		{
			try{
				this._v = parseInt(arg_value)
			}
			catch(e) {}
			return this
		}
		
		return this._v
	}
}
