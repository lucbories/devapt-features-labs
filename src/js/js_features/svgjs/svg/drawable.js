
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Methodeable from '../../../base/methodeable'
import Position from '../../../base/position'
import Pixel from '../../../base/pixel'


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
export default class Drawable extends Methodeable
{
	/**
	 * Create an instance of Drawable.
	 * 
	 * @returns {nothing}
	 */
	constructor(space, owner, position, type)
	{
		super()
		this.is_svg_drawable = true

		console.log(context + ':constructor:type:', type)
		console.log(context + ':constructor:position:', position)

		this._space = space
		this._owner = owner
		this._position = new Position(position)
		this._position_pixel = type != 'space' ? this.project(this._position) : undefined

		this._children = []
		this._shape = undefined
		this._methods = {
			x:true,
			y:true,
			z:true,
			t:true,
			h:true,
			v:true,
			move:true
		}

		// PUBLIC PROPERTIES
		this.type = type
		this.color = undefined
		this.fill = false
		this.line_width = 1
		this.background_color = 'white'
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



	position(arg_postion)
	{
		if (arg_postion !== undefined)
		{
			if ( T.isArray(arg_postion) || this._is_vector(arg_postion) )
			{
				this._position.values(arg_postion)
				this._position_pixel = this._space.project(this._position)
			}
			
			return this
		}

		return this._position
	}


	project(arg_position)
	{
		if ( T.isArray(arg_position) || this._is_vector(arg_position) )
		{
			return this._space.project(arg_position)
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


	/**
	 * Move shape at given position.
	 * 
	 * @param {Position} arg_position 
	 * 
	 * @returns {Drawable} - this
	 */
	move(arg_position)
	{
		this._position.values(arg_position)
		this._position_pixel = this.project(this._position)
		
		if (this._shape)
		{
			this._shape.move(pixel.h(), pixel.v())
		}

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
