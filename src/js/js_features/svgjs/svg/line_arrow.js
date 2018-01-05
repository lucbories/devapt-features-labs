
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'


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

		this._line_end_position_h = undefined
		this._line_end_position_v = undefined

		this._arrow_start = T.isBoolean(arg_arrow_start) ? arg_arrow_start : false
		this._arrow_end   = T.isBoolean(arg_arrow_end) ? arg_arrow_end : false

		this._line_width  = T.isNumber(arg_line_width) ? arg_line_width : DEFAULT_LINE_WIDTH

		this._arrow_h  = T.isNumber(arg_arrow_h) ? arg_arrow_h : DEFAULT_ARROW_H
		this._arrow_v  = T.isNumber(arg_arrow_v) ? arg_arrow_v : DEFAULT_ARROW_V
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		// SCALE
		// const size_h = this.domain_h().range_to_screen(this._width)
		// const size_v = this.domain_v().range_to_screen(this._height)
		// const size = Math.max(size_h, size_v)

		// START POINT
		const pos_h = this.pos_h()
		const pos_v = this.pos_v()

		// END POINT
		let end_h = undefined
		let end_v = undefined
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
			end_h = this.h() + Math.cos(this._line_angle) * this._line_length // AB=cos(O) * AC
			end_v = this.v() - Math.sin(this._line_angle) * this._line_length // BC=sin(O) * AC
		} else {
			if ( T.isArray(this._line_end_position) && this._line_end_position.length == 2 && T.isNumber(this._line_end_position[0])  && T.isNumber(this._line_end_position[1]) )
			{
				if (T.isNumber(this._line_end_position[0]))
				{
					end_h = this._line_end_position[0]
				}
				if (T.isNumber(this._line_end_position[1]))
				{
					end_v = this._line_end_position[1]
				}
			}
			if ( T.isObject(this._line_end_position) && this._line_end_position.is_drawing_vector)
			{
				end_h = this._line_end_position.value(0)
				end_v = this._line_end_position.value(1)
			}
		}
		if ( T.isNumber(end_h) && T.isNumber(end_v) )
		{
			this._line_end_position_h = this.pos_h(end_h)
			this._line_end_position_v = this.pos_v(end_v)
		}
		if ( ! T.isNumber(this._line_end_position_h) || ! T.isNumber(this._line_end_position_v) )
		{
			return
		}


		const options = {
			width:this._line_width,
			color:this.color ? this.color : 'black'/*,
			linecap:'round'*/
		}

		console.log(context + ':draw:line:pos_h=%d pos_v=%d end_h=%d end_v=%d', pos_h, pos_v, this._line_end_position_h, this._line_end_position_v)
		const line = this.space().svg()
		.line(pos_h, pos_v, this._line_end_position_h, this._line_end_position_v)
		.stroke(options)
		
		const angle = Math.atan2(this._line_end_position_v - pos_v, this._line_end_position_h - pos_h)
		const arrow_width_h = this._arrow_h
		const arrow_width_v = this._arrow_v

		const to_h_1 = this._line_end_position_h - arrow_width_h * Math.cos(angle-Math.PI/6)
		const to_v_1 = this._line_end_position_v - arrow_width_v * Math.sin(angle-Math.PI/6)
		const to_h_2 = this._line_end_position_h - arrow_width_h * Math.cos(angle+Math.PI/6)
		const to_v_2 = this._line_end_position_v - arrow_width_v * Math.sin(angle+Math.PI/6)
		
		const arrow_1 = this.space().svg()
		.line(this._line_end_position_h, this._line_end_position_v, to_h_1, to_v_1)
		.stroke(options)

		const arrow_2 = this.space().svg()
		.line(this._line_end_position_h, this._line_end_position_v, to_h_2, to_v_2)
		.stroke(options)

		
		this._shape = this.space().svg().group()
		this._shape.add(line)
		this._shape.add(arrow_1)
		this._shape.add(arrow_2)

		return this
	}

	
}
