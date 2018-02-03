
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import GeoPoint from './geopoint'
import GeoTriPoint from './geotripoint';


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geoplan'



/**
 * @file GeoPlan class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->p1():GeoPoint - get position 1.
 * 		->p2():GeoPoint - get position 2.
 * 		->p3():GeoPoint - get position 3.
 */
export default class GeoPlan extends GeoTriPoint
{
	/**
	 * Create an instance of GeoPlan with three points.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point_1 - position 1.
	 * @param {array|Vector|GeoPoint} arg_point_2 - position 2.
	 * @param {array|Vector|GeoPoint} arg_point_3 - position 3.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_point_1, arg_point_2, arg_point_3)
	{
		super(arg_point_1, arg_point_2, arg_point_3)

		this.is_geoplan = true
	}
}
