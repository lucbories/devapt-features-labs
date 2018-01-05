
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
		this._children = []
		this._shape = undefined
		this._methods = {
			x:true,
			y:true,
			pos_h:true,
			pos_v:true,
			move:true
		}

		this.type = type
		this.color = undefined
		this.fill = false
		this.line_width = 1
		this.background_color = 'white'
	}


	add_method(arg_method_name)
	{
		this._methods[arg_method_name] = true
	}


	has_method(arg_method_name)
	{
		return arg_method_name in this._methods
	}


	get_method(arg_method_name)
	{
		return (arg_method_name in this) ? this[arg_method_name] : ( (arg_method_name in this.prototype) ? this.prototype[arg_method_name] : undefined)
	}


	get_methods_names()
	{
		return Object.keys(this._methods)
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
		return this.type
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

	pos_h(arg_value=undefined)
	{
		const value = arg_value != undefined ? arg_value : this.h()
		return this._space._pad_h + this.domain_h().range_to_screen(value)
	}

	pos_v(arg_value=undefined)
	{
		const value = arg_value != undefined ? arg_value : this.v()
		const bottom = this.domain_v().range_to_screen( this.domain_v().size() )
		return this._space._pad_v + bottom - this.domain_v().range_to_screen(value)
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


	draw_color()
	{
		if (this.color)
		{
			if (this.fill)
			{
				this._shape.fill({ color:this.color, opacity:1 })
			} else {
				this._shape.fill({ color:this.background_color, opacity:0.1 })
				const options = {
					width:this.line_width,
					color:this.color ? this.color : 'blue'/*,
					linecap:'round'*/
				}
				this._shape.stroke(options)
			}
		}
	}


	move(arg_x, arg_y, arg_z)
	{
		const pos_h = this.domain_h().range_to_screen(arg_x)
		const pos_v = this.domain_v().range_to_screen(arg_y)
		this.position([arg_x, arg_y])
		
		if (this._shape)
		{
			this._shape.move(pos_h, pos_v)
		}

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
