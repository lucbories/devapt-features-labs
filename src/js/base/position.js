
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Vector from './vector'


const plugin_name = 'Labs' 
const context = plugin_name + '/drawing/position'



/**
 * @file Position class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->x(v):number - get|set position x value.
 * 		->y(v):number - get|set position y value.
 * 		->z(v):number - get|set position z value.
 * 		->t(v):number - get|set position t value.
 */
export default class Angle extends Vector
{
	/**
	 * Create an instance of Position.
	 * 
	 * @param {array|Vector|Position} arg_position_value - position value.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_position_value)
	{
		super(arg_position_value)

		this.is_drawing_position = true
	}


	x(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(0, arg_value)
			return this
		}

		return this._get_value(0, 0)
	}


	y(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(0, arg_value)
			return this
		}

		return this._get_value(0, 0)
	}


	z(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(0, arg_value)
			return this
		}

		return this._get_value(0, 0)
	}


	t(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(0, arg_value)
			return this
		}

		return this._get_value(0, 0)
	}
}
