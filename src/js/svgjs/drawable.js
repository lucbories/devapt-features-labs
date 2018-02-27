
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

		// this._svg_shape = undefined
		this._svg_space = arg_space
		this._owner = undefined
		this.owner(arg_owner)
		this._shape = undefined
		this._shape_owner_added = false
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
		return this._shape
		// return this._svg_shape
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

	_set_svg_owner()
	{
		if (! this._shape_owner_added && this._shape && this._owner && this._owner._shape && this._owner._shape.type == 'g')
		{
			this._owner._shape.add(this._shape)
			this._shape_owner_added = true
		}
	}


	_draw_self()
	{
		return this
	}


	draw()
	{
		// TO IMPLEMENT IN SUB CLASSES
		const promise = this._draw_self()
		if (promise && promise.then)
		{
			promise.then(
				()=>{
					this._set_svg_owner()
				}
			)
		} else {
			this._set_svg_owner()
		}
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
			value._set_svg_owner()
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
				const cur_pixelpos = this._pixelpositions[index]
				const new_pixelpos = this.svg_space().project_position(geopos)
				if (! cur_pixelpos)
				{
					this._pixelpositions[index] = new_pixelpos
				} else {
					cur_pixelpos.h(new_pixelpos.h())
					cur_pixelpos.v(new_pixelpos.v())
				}
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
