
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import GeoPoint from './geopoint'


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geoprojection'



/**
 * @file GeoProjection class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class GeoProjection
{
	/**
	 * Create an instance of GeoPoint.
	 * 
	 * @param {GeoSpace} arg_space          - GeoSpace instance.
	 * @param {GeoPlan}  arg_plan           - projection plan.
	 * @param {GeoLine}  arg_direction      - projection direction.
	 * @param {Function} arg_projection_fn  - projection custom function.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_plan, arg_direction, arg_projection_fn)
	{
		this.is_geoprojection = true

		// SET SPACE
		this._space = undefined
		if ( T.isObject(arg_space) && arg_space.is_geospace)
		{
			this._space = arg_space
		}

		// SET PLAN
		this._plan = undefined
		if ( T.isObject(arg_plan) && arg_plan.is_geoplan)
		{
			this._plan = arg_plan
		}

		// SET DIRECTION
		this._direction = undefined
		if ( T.isObject(arg_direction) && arg_direction.is_geobipoint)
		{
			this._direction = arg_direction
		}

		// SET FUNCTION
		this._projection_fn = undefined
		if ( T.isFunction(arg_projection_fn) )
		{
			this._projection_fn = arg_projection_fn
		}
	}



	/**
	 * Is projection valid ?
	 * 
	 * @returns {boolean}
	 */
	is_valid()
	{
		return this._space && this._plan && this._direction && this._projection_fn
	}



	/**
	 * Project a multi-dimenstional position to a 2d plan.
	 * 
	 * @param {GeoPoint} arg_position - instance position in given GeoSpace.
	 * 
	 * @returns {PixelPoint}
	 */
	project(arg_position)
	{
		if (! this.is_valid())
		{
			return undefined
		}

		if ( Array.isArray(arg_position) )
		{
			arg_position = new GeoPoint(arg_position)
		}

		return this._projection_fn.project(arg_position, this._space, this._plan, this._direction)
	}
}
