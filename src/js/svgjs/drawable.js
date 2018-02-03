
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Geometricable from './geometricable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/drawable'



/**
 * @file Drawiable base item class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->owner():Drawable - get drawable owner.
 * 		->type():string - get drawable type.
 * 
 */
export default class Drawable extends Geometricable
{
	/**
	 * Create an instance of Drawable.
	 * 
	 * @param {SvgSpace} arg_space    - drawable space instance.
	 * @param {Drawable} arg_owner    - drawable owner instance.
	 * @param {GeoPoint} arg_position - geometric position.
	 * @param {string}   arg_type     - svg shape type name.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_type)
	{
		super(arg_space ? arg_space._geospace : undefined, arg_position)
		this.is_svg_drawable = true

		// console.log(context + ':constructor:type:', arg_type)
		// console.log(context + ':constructor:position:', arg_position)

		this._svg_space = arg_space
		this._owner = arg_owner
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
		this._children = []

		// PUBLIC PROPERTIES
		this.type = arg_type
		this.color = undefined
		this.fill = false
		this.line_width = 1
		this.background_color = 'white'
	}

	svg_shape()
	{
		return this._svg_shape
	}

	svg_space()
	{
		return this._svg_space
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
	 * Get all Projectable children instances.
	 * 
	 * @returns {array}
	*/
	children()
	{
		return this._children
	}



	/**
	 * Add a children element.
	 * 
	 * @param {Projectable} value - Projectable instance.
	 * 
	 * @returns {this} - for chainable calls.
	 */
	add_child(value)
	{
		if ( T.isObject(value) && value.is_svg_projectable )
		{
			this._children.push(value)
		}
		return this
	}



	/**
	 * Project positions and all children positions.
	 * 
	 * @returns {nothing}
	 */
	project()
	{
		this._geo_items.forEach(
			(geopos, index)=>{
				this._pixelpositions[index] = this.svg_space().project(geopos)
			}
		)

		this._children.forEach(
			(child)=>{
				child.project()
			}
		)
	}



	/**
	 * Get horizontal projected position coordinate.
	 * 
	 * @param {integer} arg_index - position index (optional).
	 * 
	 * @returns {Number}
	 */
	h(arg_index=0)
	{
		return this._pixelpositions[arg_index].h()
	}



	/**
	 * Get vertical projected position coordinate.
	 * 
	 * @param {integer} arg_index - position index (optional).
	 * 
	 * @returns {Number}
	 */
	v(arg_index=0)
	{
		return this._pixelpositions[arg_index].v()
	}
}