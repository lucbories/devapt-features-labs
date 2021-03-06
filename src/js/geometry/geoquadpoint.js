
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import GeoPoint from './geopoint'
import GeoItem from './geoitem'


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geoquadpoint'



/**
 * @file GeoQuadPoint class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->p1():GeoPoint - get position 1.
 * 		->p2():GeoPoint - get position 2.
 * 		->p3():GeoPoint - get position 3.
 * 		->p4():GeoPoint - get position 4.
 */
export default class GeoQuadPoint extends GeoItem
{
	/**
	 * Create an instance of GeoQuadPoint with three points.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point_1 - position 1.
	 * @param {array|Vector|GeoPoint} arg_point_2 - position 2.
	 * @param {array|Vector|GeoPoint} arg_point_3 - position 3.
	 * @param {array|Vector|GeoPoint} arg_point_4 - position 4.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_point_1, arg_point_2, arg_point_3, arg_point_4)
	{
		super()

		this.is_geoquadpoint = true

		this._point_1 = new GeoPoint(arg_point_1)
		this._point_2 = new GeoPoint(arg_point_2)
		this._point_3 = new GeoPoint(arg_point_3)
		this._point_4 = new GeoPoint(arg_point_4)
	}



	/**
	 * Get all points.
	 * 
	 * @returns {array} - GeoPoint array.
	 */
	get_points()
	{
		return [this._point_1, this._point_2, this._point_3]
	}



	/**
	 * Get position 1.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point - position 1 (optional).
	 * 
	 * @returns {GeoPoint|This} - position point or this instance.
	 */
	p1(arg_point)
	{
		return arg_point ? this.set_point(0, arg_point) : this.get_point(0)
	}



	/**
	 * Get position 2.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point - position 2 (optional).
	 * 
	 * @returns {GeoPoint|This} - position point or this instance.
	 */
	p2(arg_point)
	{
		return arg_point ? this.set_point(1, arg_point) : this.get_point(1)
	}



	/**
	 * Get position 3.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point - position 3 (optional).
	 * 
	 * @returns {GeoPoint|This} - position point or this instance.
	 */
	p3(arg_point)
	{
		return arg_point ? this.set_point(2, arg_point) : this.get_point(2)
	}



	/**
	 * Get position 4.
	 * 
	 * @param {array|Vector|GeoPoint} arg_point - position 4 (optional).
	 * 
	 * @returns {GeoPoint|This} - position point or this instance.
	 */
	p4(arg_point)
	{
		return arg_point ? this.set_point(3, arg_point) : this.get_point(3)
	}
}
