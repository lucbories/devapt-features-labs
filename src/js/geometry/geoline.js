
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import GeoPoint from './geopoint'
import GeoBiPoint from './geobipoint';


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geoline'



/**
 * @file GeoLine class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->p1():GeoPoint - get position 1.
 * 		->p2():GeoPoint - get position 2.
 */
export default class GeoLine extends GeoBiPoint
{
	/**
	 * Create an instance of GeoLine with two points.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point_1 - position 1.
	 * @param {array|Vector|GeoPoint} arg_point_2 - position 2.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_point_1, arg_point_2)
	{
		super(arg_point_1, arg_point_2)

		this.is_geoline = true
	}
}
