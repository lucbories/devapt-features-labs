
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'
import Position from '../../../base/position'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/line_arrow'

const DEFAULT_LINE_WIDTH = 1
const DEFAULT_ARROW_H = 10
const DEFAULT_ARROW_V = 10



/**
 * @file Drawing a line with an arrow.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class LineArrow extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {boolean}      arg_arrow_start - shape has an arrow at start point.
	 * @param {boolean}      arg_arrow_end   - shape has an arrow at end point.
	 * @param {number}       arg_line_width   - shape .
	 * @param {number}       arg_arrow_h   - shape .
	 * @param {number}       arg_arrow_v   - shape .
	 * @param {number}       arg_length_or_position   - shape .
	 * @param {number}       arg_angle_or_nothing   - shape .
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_color=undefined, arg_arrow_start, arg_arrow_end, arg_line_width, arg_arrow_h, arg_arrow_v, arg_length_or_position, arg_angle_or_nothing)
	{
		super(arg_space, arg_owner, arg_position, 'linearrow')

		this.is_svg_linearrow = true

		this.color = arg_color

		this._line_length = T.isNumber(arg_length_or_position) ? arg_length_or_position : undefined
		this._line_angle = T.isNumber(arg_angle_or_nothing) ? arg_angle_or_nothing : undefined
		
		this._line_end_position = this._line_length ? undefined : arg_length_or_position

		this._arrow_start = T.isBoolean(arg_arrow_start) ? arg_arrow_start : false
		this._arrow_end   = T.isBoolean(arg_arrow_end) ? arg_arrow_end : false

		this._line_width  = T.isNumber(arg_line_width) ? arg_line_width : DEFAULT_LINE_WIDTH

		this._arrow_h  = T.isNumber(arg_arrow_h) ? arg_arrow_h : DEFAULT_ARROW_H
		this._arrow_v  = T.isNumber(arg_arrow_v) ? arg_arrow_v : DEFAULT_ARROW_V

		this._init_done = false
	}


	_init_end()
	{
		this._init_done = true

		// BUILD END PIXEL WITH ANGLE AND LENGTH
		if ( T.isNumber(this._line_length) && T.isNumber(this._line_angle) )
		{
			// CONVERT DEGREES TO RADIAN
			const degrees_angle = this._line_angle
			this._line_angle = degrees_angle * Math.PI / 180
			console.log(context + ':draw:degrees_angle= this._line_angle=', degrees_angle, this._line_angle)

			// O=angle(AB,AC) and angle(AB,BC)=PI/2 radian
			// AC = line length
			// cos(O) = AB/AC 
			// sin(O) = BC/AC
			const end_x = this.x() + Math.cos(this._line_angle) * this._line_length // AB=cos(O) * AC
			const end_y = this.y() - Math.sin(this._line_angle) * this._line_length // BC=sin(O) * AC

			this._line_end_position = new Position([end_x, end_y])
			this._line_end_pixel = this.project(this._line_end_position)
		}
		
		// BUILD END PIXEL WITH A POSITION
		else {
			// END POSITION IS AN ARRAY
			if ( T.isArray(this._line_end_position) && this._line_end_position.length == 2 )
			{
				if (T.isNumber(this._line_end_position[0]) && T.isNumber(this._line_end_position[1]) )
				{
					this._line_end_position = new Position(this._line_end_position)
				}
			}

			// END POSITION IS A VECTOR
			if ( T.isObject(this._line_end_position) && this._line_end_position.is_vector)
			{
				this._line_end_pixel = this.project(this._line_end_position)
			}
		}
	}


	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		if (! this._init_done )
		{
			this._init_end()
		}
		
		// START PIXEL
		const start_h = this.h()
		const start_v = this.v()
		if ( ! T.isNumber(start_h) || ! T.isNumber(start_v) )
		{
			return
		}

		// END PIXEL
		const end_h = this._line_end_pixel.h()
		const end_v = this._line_end_pixel.v()
		if ( ! T.isNumber(end_h) || ! T.isNumber(end_v) )
		{
			return
		}

		const options = {
			width:this._line_width,
			color:this.color ? this.color : 'black'/*,
			linecap:'round'*/
		}

		console.log(context + ':draw:line_arrow:start_h=%d start_v=%d end_h=%d end_v=%d', start_h, start_v, end_h, end_v)
		const line = this.space().svg()
		.line(start_h, start_v, end_h, end_v)
		.stroke(options)
		
		const angle = Math.atan2(end_v - start_v, end_h - start_h)
		const arrow_width_h = this._arrow_h
		const arrow_width_v = this._arrow_v

		const to_h_1 = end_h - arrow_width_h * Math.cos(angle-Math.PI/6)
		const to_v_1 = end_v - arrow_width_v * Math.sin(angle-Math.PI/6)
		const to_h_2 = end_h - arrow_width_h * Math.cos(angle+Math.PI/6)
		const to_v_2 = end_v - arrow_width_v * Math.sin(angle+Math.PI/6)
		
		const arrow_1 = this.space().svg()
		.line(end_h, end_v, to_h_1, to_v_1)
		.stroke(options)

		const arrow_2 = this.space().svg()
		.line(end_h, end_v, to_h_2, to_v_2)
		.stroke(options)

		
		this._shape = this.space().svg().group()
		this._shape.add(line)
		this._shape.add(arrow_1)
		this._shape.add(arrow_2)

		return this
	}
}