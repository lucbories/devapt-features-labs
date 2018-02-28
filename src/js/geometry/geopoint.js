
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Vector from '../math/vector'
import GeoItem from './geoitem';


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geopoint'



/**
 * @file GeoPoint class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API extends GeoItem
 *      ->vector():Vector - get coordinates vector.
 * 
 *      ->vector():Vector - get coordinate vector.
 * 
 *      ->size():number - get coordinate vector size.
 *      ->size(size):this - set coordinate vector size.
 * 
 *      ->values():array - get vector coordinates values array.
 *      ->values(values):this - set vector coordinates values array.
 * 
 *      ->value(index):number - get coordinate value at index.
 *      ->value(index, value) - set coordinate value at index.
 * 
 * 		->x():number - get position x value.
 * 		->y():number - get position y value.
 * 		->z():number - get position z value.
 * 		->t():number - get position t value.
 * 
 * 		->x(v):this - set position x value.
 * 		->y(v):this - set position y value.
 * 		->z(v):this - set position z value.
 * 		->t(v):this - set position t value.
 */
export default class GeoPoint extends GeoItem
{
	/**
	 * Create an instance of GeoPoint.
	 * 
	 * @param {array|Vector|GeoPoint} arg_position_value - position value.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_position_value)
	{
		super()

		this.is_geopoint = true
		
		let values = (T.isArray(arg_position_value) || this._is_vector(arg_position_value)) ? arg_position_value : [0,0,0,0]
		values = (T.isObject(arg_position_value) && arg_position_value.is_geopoint) ? arg_position_value.values() : arg_position_value
		
		this._vector = new Vector(values)
	}



	/**
	 * Get all points.
	 * 
	 * @returns {array} - GeoPoint array.
	 */
	get_points()
	{
		return []
	}



	/**
	 * Get vector.
	 * 
	 * @returns {Vector}
	 */
	vector()
	{
		return this._vector
	}



	/**
	 * Get/set vector size.
	 * 
	 * @param {Number|nothing} arg_size - vector size (optional).
	 * 
	 * @returns {Number|This}
	 */
	size(arg_size)
	{
		return this._vector.size(arg_size)
	}



	/**
	 * Get/set vector values.
	 * 
	 * @param {array|nothing} arg_values - vector values (optional).
	 * 
	 * @returns {array|This}
	 */
	values(arg_values)
	{
		return this._vector.values(arg_values)
	}



	/**
	 * Add vector values.
	 * 
	 * @param {array} arg_values - vector values.
	 * 
	 * @returns {This}
	 */
	add_values(arg_values)
	{
		if ( ! T.isNotEmptyArray(arg_values) )
		{
			console.warn(context + ':add_values:bad given array:', arg_values)
			return
		}
		if (arg_values.length != this._vector.values.length)
		{
			console.warn(context + ':add_values:no same vectors length:arg_values,this.values:', arg_values, this._vector.values)
			return
		}

		let index = 0
		for(value of arg_values)
		{
			const this_value = this._vector.value(index)
			this._vector.value(index, this_value + value)
		}
		
		return this
	}



	/**
	 * Get/set vector item.
	 * 
	 * @param {Number} arg_index - vector index.
	 * @param {Number|nothing} arg_value- vector value (optional).
	 * 
	 * @returns {Number|This}
	 */
	value(arg_index, arg_value)
	{
		return this._vector.value(arg_index, arg_value)
	}



	/**
	 * Get X position number (vector index is 0).
	 * 
	 * @param {Number|Nothing} arg_value - x position value (optional).
	 * 
	 * @returns {Number|This} - x position value or this instance.
	 */
	x(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._vector._set_value(0, arg_value)
			return this
		}

		return this._vector._get_value(0, 0)
	}



	/**
	 * Get Y position number (vector index is 1).
	 * 
	 * @param {Number|Nothing} arg_value - y position value (optional).
	 * 
	 * @returns {Number|This} - y position value or this instance.
	 */
	y(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._vector._set_value(1, arg_value)
			return this
		}

		return this._vector._get_value(1, 0)
	}



	/**
	 * Get Z position number (vector index is 2).
	 * 
	 * @param {Number|Nothing} arg_value - z position value (optional).
	 * 
	 * @returns {Number|This} - z position value or this instance.
	 */
	z(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(2, arg_value)
			return this
		}

		return this._vector._get_value(2, 0)
	}



	/**
	 * Get T position number (vector index is 3).
	 * 
	 * @param {Number|Nothing} arg_value - t position value (optional).
	 * 
	 * @returns {Number|This} - t position value or this instance.
	 */
	t(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(3, arg_value)
			return this
		}

		return this._vector._get_value(3, 0)
	}



	/**
	 * Test if operand is a Vector instance.
	 * @private
	 * 
	 * @param {any} arg_value 
	 * 
	 * @returns {boolean}
	 */
	_is_vector(arg_value)
	{
		return T.isObject(arg_value) && arg_value.is_vector
	}
}
