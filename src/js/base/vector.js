
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/drawing/vector'




/**
 * @file Vector class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->size():number - get vector size.
 * 		->size(v):this - set vector size (schrink or expand).
 * 
 * 		->values():array - get vector values.
 * 		->values(v):this - set vector values.
 * 
 *      ->value(index):number  - gett value at index.
 *      ->value(index, v):this - set value at index.
 * 
 */
export default class Vector
{
	/**
	 * Create an instance of Vector.
	 * 
	 * @param {array|Vector} arg_values - vector values.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_values)
	{
		this.is_drawing_vector = true

		this._items = undefined
		
		this.values(arg_values)
	}


	size(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			if (arg_value < this._items.length)
			{
				let i
				for(i = arg_value + 1 ; i < this._items.length ; i++)
				{
					delete this._items[i]
				}
			}
			else if (arg_value > this._items.length)
			{
				let i
				for(i = this._items.length ; i < arg_value ; i++)
				{
					this._items.push(0)
				}
			}
			return this
		}

		return this._items.length
	}

	
	value(arg_index, arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._set_value(arg_index, arg_value)
			return this
		}

		return this._get_value(arg_index)
	}


	values(arg_values)
	{
		console.log(context + ':values:', arg_values)

		if ( T.isObject(arg_values) && arg_values.is_drawing_vector )
		{
			this._set_values( arg_values.values() )
			return this
		}

		if ( T.isArray(arg_values) )
		{
			this._set_values(arg_values)
			return this
		}

		return this._items
	}


	_set_values(values)
	{
		if ( T.isArray(values) && values.length > 1 )
		{
			this._items = values
		}
	}



	_get_value(arg_index)
	{
		if ( T.isNumber(arg_index) && arg_index >= 0 && arg_index < this._items.length)
		{
			return this._items[arg_index]
		}
	}


	_set_value(arg_index, arg_value)
	{
		if ( T.isNumber(arg_index) && T.isNumber(arg_value) && arg_index >= 0)
		{
			if (arg_index < this._items.length)
			{
				this._items[arg_index] = arg_value
			}
			else if (arg_index == this._items.length)
			{
				this._items.push(arg_value)
			}
		}
	}
}
