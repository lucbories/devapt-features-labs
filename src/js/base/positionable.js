
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Methodeable from '../../../base/methodeable'
import Position from '../../../base/position'
import Pixel from '../../../base/pixel'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/positionable'

// const DEFAULT_POSITION = [0,0,0,0]



/**
 * @file Positionable base item class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Positionable extends Methodeable
{
	/**
	 * Create an instance of Drawable.
	 * 
	 * @returns {nothing}
	 */
	constructor(space, position)
	{
		super()
		this.is_svg_positionable = true

		// console.log(context + ':constructor:type:', type)
		// console.log(context + ':constructor:position:', position)

		this._space = space
		this._position = new Position(position)
	}


	space()
	{
		return this._space
	}



	position(arg_postion)
	{
		if (arg_postion !== undefined)
		{
			if ( T.isArray(arg_postion) || this._is_vector(arg_postion) )
			{
				this._position.values(arg_postion)
			}
			
			return this
		}

		return this._position
	}

	x()
	{
		return this._position.value(0)
	}

	y()
	{
		return this._position.value(1)
	}

	z()
	{
		return this._position.value(2)
	}

	t()
	{
		return this._position.value(3)
	}


	/**
	 * Move shape at given position.
	 * 
	 * @param {Position} arg_position 
	 * 
	 * @returns {Drawable} - this
	 */
	move(arg_position, arg_opd2)
	{
		if ( T.isNumber(arg_position) && T.isNumber(arg_opd2) )
		{
			arg_position = [arg_position, arg_opd2]
		}
		this._position.values(arg_position)
		this._position_pixel = this.project(this._position, this._space)
		
		if (this._shape)
		{
			const h = this._position_pixel.h()
			const v = this._position_pixel.v()

			console.log(context + ':move:x=[%d] y=[%d] h=[%d] v=[%d]', arg_position[0], arg_position[1], h, v, this._shape)
			
			this._shape.x(h).y(v)
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
