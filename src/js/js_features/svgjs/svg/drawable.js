
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Projectable from '../../../base/projectable'
// import Position from '../../../base/position'
// import Pixel from '../../../base/pixel'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/drawable'



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
export default class Drawable extends Projectable
{
	/**
	 * Create an instance of Drawable.
	 * 
	 * @returns {nothing}
	 */
	constructor(space, owner, position, type)
	{
		super(space, position)
		this.is_svg_drawable = true

		// console.log(context + ':constructor:type:', type)
		// console.log(context + ':constructor:position:', position)

		this._owner = owner
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

	svg_shape()
	{
		return this._shape
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
