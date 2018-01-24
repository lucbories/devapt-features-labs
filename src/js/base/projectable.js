
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Positionable from './positionable'
import Position from '../../../base/position'
import Pixel from '../../../base/pixel'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/projectable'

const DEFAULT_POSITION = [0,0,0]



/**
 * @file Projectable base item class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Projectable extends Positionable
{
	/**
	 * Create an instance of Projectable.
	 * 
	 * @returns {nothing}
	 */
	constructor(space, position)
	{
		super(space, position)
		this.is_svg_projectable = true

		// console.log(context + ':constructor:type:', type)
		// console.log(context + ':constructor:position:', position)

		this._position_pixel = type != 'space' ? this.project(this._position) : undefined

		this._children = []
	}


	children()
	{
		return this._children
	}


	add_child(value)
	{
		if ( T.isObject(value) && value.is_svg_drawable )
		{
			this._children.push(value)
		}
		return this
	}

/*
space4d:GeoSpace4D(Position, Vector, Vector, Vector, Vector)
space3d:GeoSpace3D(Position, Vector, Vector, Vector)
plan:GeoPlan(Position, Vector, Vector)
direction:GeoLine(Position, Vector)
position:GeoPosition(Position)

Geo*
->project(space, plan, direction)
->move_at(position)
->move_by(vector)


svg/chainable:add factory.* methods

physics_space:PhysicsSpace inherits Space
*/
	project(arg_position, arg_space=this._space, arg_plan, arg_direction)
	{
		if ( T.isArray(arg_position) || this._is_vector(arg_position) )
		{
			const without_boxing = false
			return this._space.project(arg_position, without_boxing, arg_space)
		}
		return new Pixel(0, 0)
	}

	h()
	{
		return this._position_pixel.h()
	}

	v()
	{
		return this._position_pixel.v()
	}
}
