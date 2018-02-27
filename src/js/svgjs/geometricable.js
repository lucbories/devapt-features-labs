
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Methodeable from '../base/methodeable'
import PixelPoint from '../base/pixelpoint'
import GeoPoint from '../geometry/geopoint'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/geometricable'



/**
 * @file Geometricable base item class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Geometricable extends Methodeable
{
	/**
	 * Create an instance of Geometricable.
	 * 
	 * @param {GeoSpace} arg_geospace - geometric space instance.
	 * @param {GeoPoint} arg_geopoint - geometric position into given space instance.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_geospace, arg_geopoint)
	{
		super()

		this.is_geometricable = true

		this._geospace = arg_geospace
		if ( T.isArray(arg_geopoint) )
		{
			console.warn(context + ':geopoint is an array !')
			debugger
		}
		this._geoposition = arg_geopoint
		this._geo_items = [this._geoposition]

		this._pixelposition = new PixelPoint(0, 0)
		this._pixelpositions = [this._pixelposition]
	}



	/**
	 * Get GeoSpace instance.
	 * 
	 * @returns {GeoSpace}
	 */
	geo_space()
	{
		return this._geospace
	}



	/**
	 * Get all geo items.
	 * 
	 * @returns {array}
	 */
	geo_items()
	{
		return this._geo_items
	}



	/**
	 * Register an other GeoPoint.
	 * 
	 * @param {GeoPoint} arg_point - position.
	 * 
	 * @returns {this}
	 */
	add_point(arg_point)
	{
		if ( T.isObject(arg_point) && arg_point.is_geopoint)
		{
			this._geo_items.push(arg_point)
			this._pixelpositions.push(new PixelPoint(0, 0))
		}
	}



	/**
	 * Get or set geometric position.
	 * 
	 * @param {GeoPoint} arg_position - (optional)
	 * 
	 * @returns {GeoPoint|This}
	 */
	position(arg_position=undefined)
	{
		if (arg_position !== undefined)
		{
			if ( T.isArray(arg_position) || this._is_vector(arg_position) )
			{
				this._geoposition.values(arg_position)
			}
			
			return this
		}

		return this._geoposition
	}



	/**
	 * Get or set geometric position for X domain.
	 * 
	 * @param {Number} arg_value - geometric space X domain position (optional).
	 * 
	 * @returns {GeoPoint|This}
	 */
	x(arg_value)
	{
		return this._geoposition.x(arg_value)
	}

	

	/**
	 * Get or set geometric position for Y domain.
	 * 
	 * @param {Number} arg_value - geometric space Y domain position (optional).
	 * 
	 * @returns {GeoPoint|This}
	 */
	y(arg_value)
	{
		return this._geoposition.y(arg_value)
	}

	

	/**
	 * Get or set geometric position for X domain.
	 * 
	 * @param {Number} arg_value - geometric space X domain position (optional).
	 * 
	 * @returns {GeoPoint|This}
	 */
	z(arg_value)
	{
		return this._geoposition.z(arg_value)
	}

	

	/**
	 * Get or set geometric position for T domain.
	 * 
	 * @param {Number} arg_value - geometric space T domain position (optional).
	 * 
	 * @returns {GeoPoint|This}
	 */
	t(arg_value)
	{
		return this._geoposition.t(arg_value)
	}



	/**
	 * Project positions and all children positions.
	 * @abstract
	 * 
	 * @returns {nothing}
	 */
	project()
	{
	}



	/**
	 * Move shape at given position.
	 * 	- this.move(10, 10)
	 *  - this.move( new GeoPoint([0,0]) )
	 *  - this.move( [0,0] )
	 * 
	 * @param {GeoPoint|Number} arg_position 
	 * @param {Number}          arg_opd2 (optional)
	 * 
	 * @returns {This}
	 */
	move(arg_position, arg_opd2)
	{
		if ( T.isNumber(arg_position) && T.isNumber(arg_opd2) )
		{
			arg_position = [arg_position, arg_opd2]
		}
		const prev_h = this._pixelposition.h()
		const prev_v = this._pixelposition.v()
		this._geoposition.values(arg_position)
		this.project()
		
		if (this._shape)
		{
			const h = this._pixelposition.h()
			const v = this._pixelposition.v()

			const dh = h - prev_h
			const dv = v - prev_v

			// DEBUG
			// console.log(context + ':move:x=[%d] y=[%d]', arg_position[0], arg_position[1],  this._shape)
			console.log(context + ':move:dh=[%d] dv=[%d] prev_h=[%d] prev_v=[%d] h=[%d] v=[%d]', dh, dv, prev_h, prev_v, h, v)
			
			this._shape.x(dh).y(dv)
		}

		// MOVE CHILDREN
		this._children.forEach(
			(child)=>child.move(arg_position)
		)

		return this
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
