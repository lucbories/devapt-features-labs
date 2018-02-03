
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
// import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geoitem'



/**
 * @file GeoItem class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class GeoItem
{
	/**
	 * Create an instance of GeoItem.
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
		this.is_geoitem = true
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
	 * Get position at given index.
	 * 
	 * @param {integer} arg_index - coordinate index.
	 * 
	 * @returns {GeoPoint} - position point at index.
	 */
	get_point(arg_index)
	{
		arg_index = T.isInteger(arg_index) && arg_index >= 0 ? arg_index : 0
		const points = this.get_points()

		return arg_index < points.length ? points[arg_index] : undefined
	}



	/**
	 * Set position values at index.
	 * 
	 * @param {integer} arg_index - coordinate index.
	 * @param {array|Vector|GeoPoint} arg_values - position values.
	 * 
	 * @returns {this} - this instance.
	 */
	set_point(arg_index, arg_values)
	{
		if ( T.isInteger(arg_index) && arg_index >= 0 )
		{
			const points = this.get_points()
			if (arg_index < points.length)
			{
				const point = points[arg_index]
				
				if ( T.isObject(arg_values) && arg_values.is_geopoint )
				{
					point.values(arg_values.values())
					return this
				}

				if ( T.isObject(arg_values) && arg_values.is_vector )
				{
					point.values(arg_values)
					return this
				}
		
				if ( T.isArray(arg_values) )
				{
					point.values(arg_values)
					return this
				}
			}
		}
		
		return this
	}
}
