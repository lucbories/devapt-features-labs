
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Position from '../../../base/position'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/drawable'

const DEFAULT_POSITION = [0,0,0]



/**
 * @file Drawiable base item class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->owner():Drawable - get drawable owner.
 * 		->children():Drawable array - get drawable children.
 * 		->type():string - get drawable type.
 * 
 */
export default class Drawable
{
	/**
	 * Create an instance of Drawable.
	 * 
	 * @returns {nothing}
	 */
	constructor(space, owner, position, type)
	{
		this.is_svg_drawable = true

		console.log(context + ':constructor:type:', type)
		console.log(context + ':constructor:position:', position)

		this._space = space
		this._owner = owner
		this._position = new Position(position)
		this._type = type
		this._children = []
		this._shape = undefined
	}


	space()
	{
		return this._space
	}


	owner(value)
	{
		if ( T.isObject(value) && value.is_svg_drawable )
		{
			this._owner = value
			this._owner.add_child(value)
			return this
		}

		return this._owner
	}


	children()
	{
		return this._children
	}


	add_child(value)
	{
		if ( T.isObject(value) && value.is_drawing_drawable )
		{
			this._children.push(value)
		}
		return this
	}


	type()
	{
		return this._type
	}



	position(value)
	{
		if ( T.isArray(value) || this._is_vector(value) )
		{
			this._position.values(value)
			return this
		}

		return this._position
	}



	domain_h()
	{
		return this._space._domains_by_index[0]
	}

	domain_v()
	{
		return this._space._domains_by_index[1]
	}

	pos_h()
	{
		return this.domain_h().range_to_screen(this.h())
	}

	pos_v()
	{
		return this.domain_v().range_to_screen(this.v())
	}

	h()
	{
		return this._position.value(0)
	}

	v()
	{
		return this._position.value(1)
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


	draw()
	{
		// TO IMPLEMENT IN SUB CLASSES
		return this
	}



	// move(x, y, z)
	// {
	// 	this._children.forEach(
	// 		(child)=>{
	// 			child.move(x, y)
	// 		}
	// 	)
	// }



	// _is_vector(value)
	// {
	// 	return T.isObject(value) && value.is_drawing_vector
	// }


	// _to_array(value, default_value = [])
	// {
	// 	if ( T.isArray(value) )
	// 	{
	// 		return value
	// 	}

	// 	if ( T.isObject(value) && value.is_drawing_vector )
	// 	{
	// 		return value.values()
	// 	}

	// 	return default_value
	// }
}
