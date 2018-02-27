
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from '../drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/car'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing car class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Car extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_width    - shape width.
	 * @param {number}       arg_height   - shape height.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_width, arg_height)
	{
		super(arg_space, arg_owner, arg_position, 'car')

		this.is_svg_rectangle = true

		this._width = arg_width
		this._height = arg_height
		this.color = arg_color
	}



	_draw_self()
	{
		const pos_h = this.h()
		const pos_v = this.v()
		console.log(context + ':draw:pos_h=%d', pos_h)
		console.log(context + ':draw:pos_v=%d', pos_v)

		const size_h = this.svg_space().project_x(this._width)
		const size_v = this.svg_space().project_y(this._height)
		console.log(context + ':draw:width=%d', this._width)
		console.log(context + ':draw:height=%d', this._height)
		console.log(context + ':draw:size_h=%d', size_h)
		console.log(context + ':draw:size_v=%d', size_v)

		// DRAW SHAPE OF SIZE x:1-100 y:1-100

		const shape_1 = this.svg_space().svg()
		.rect(60, 30)
		.move(20, 0)
		.fill('blue')
		
		const shape_2 = this.svg_space().svg()
		.rect(100, 20)
		.move(0, 30)
		.fill('red')
		
		const shape_3 = this.svg_space().svg()
		.circle(20)
		.move(15, 40)
		.fill('grey')
		
		const shape_4 = this.svg_space().svg()
		.circle(20)
		.move(65, 40)
		.fill('grey')

		if (this.color)
		{
			shape_1.fill(this.color)
			shape_2.fill(this.color)
		}

		// BUILD
		this._shape = this.svg_space().svg().group()
		this._shape.add(shape_1)
		this._shape.add(shape_2)
		this._shape.add(shape_3)
		this._shape.add(shape_4)
		
		// SCALE
		const scale = Math.max(size_v, size_h)/100
		console.log(context + ':draw:scale=%d', scale)

		this._shape.move(pos_h, pos_v).scale(scale)

		// ANIMATE
		const rot_point_h = this.svg_space().project_x(50)*scale
		const rot_point_v = this.svg_space().project_y(40)*scale
		this._shape.move(0, pos_v)
		// .rotate(25, rot_point_h, rot_point_v)
		.rotate(25)
		.animate({duration:3000, delay:'1s', ease:'-'})
		.move(pos_h + size_h*0.8, pos_v)
		.afterAll(
			()=>{
				this._shape.move(0, pos_v)
			}
		).loop(3)

		this._shape.mouseover( ()=>{ this._shape.pause() } )
		this._shape.mouseout( ()=>{ this._shape.play() } )

		return this
	}
}
