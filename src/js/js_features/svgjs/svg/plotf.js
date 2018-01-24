
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Position from '../../../base/position'
import Drawable from './drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/plotf'

const DEFAULT_RENDER = 'circle'
const DEFAULT_SIZE = 2
const DEFAULT_COLOR = 'red'



/**
 * @file Drawing Plot f(x) class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class PlotF extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {function}     arg_function - plot function f(scope)=>{ loops_count:integer, fstep:f(step, scope)=>Position }.
	 * @param {string}		 arg_color    - shape color.
	 * @param {string}       arg_render   - shape rendering:cross, xcross, circle, disk, point.
	 * @param {number}       arg_size     - shape rendering size.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_position, arg_function, arg_color=DEFAULT_COLOR, arg_render=DEFAULT_RENDER, arg_size=DEFAULT_SIZE)
	{
		super(arg_space, arg_owner, arg_position, 'point')

		this.is_svg_point = true

		this._function = T.isFunction(arg_function) ? arg_function : undefined

		this.color  = arg_color
		this.render = arg_render
		this.size   = arg_size
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return this
		}

		// const pos_h = this.h()
		// const pos_v = this.v()
		// const bottom_left_pixel = this.space().pixelbox().get_usable().bottom_left
		const height_pixel = this.space().pixelbox().get_usable().height
		const width_pixel = this.space().pixelbox().get_usable().width
		const top_left_pixel = this.space().pixelbox().get_usable().top_left
		const pos_h = top_left_pixel.h
		const pos_v = top_left_pixel.v
		
		if (! this._function)
		{
			console.warn(context + ':draw:bad function')
			return this
		}

		const f_record = this._function({ x:45 })
		const loops_count = f_record && f_record.loops_count ? Math.floor(f_record.loops_count) : 0
		const f_step = f_record && f_record.fstep ? f_record.fstep : undefined
		const f_scope = f_record && f_record.scope ? f_record.scope : undefined
		
		// console.warn(context + ':draw:function record', f_record, loops_count, f_step, f_scope)

		if (! T.isNumber(loops_count) || ! T.isFunction(f_step) || ! T.isObject(f_scope) )
		{
			console.warn(context + ':draw:bad function record')
			return this
		}

		// LOOP
		const points = new Array(loops_count)

		const add_point = (arg_index, arg_point)=>{
			const position = T.isArray(arg_point) ? new Position(arg_point) : arg_point
			const pixel_point = this.space().project(position, this.space())
			let h = pos_h + pixel_point.h()
			let v = pos_v + height_pixel - pixel_point.v()

			// CHECK h and v
			h = h < pos_h ? pos_h : h
			h = h > pos_h + width_pixel ? pos_h + width_pixel : h
			v = v < pos_v ? pos_v : v
			v = v > pos_v + height_pixel ? pos_v + height_pixel : v
			points[arg_index] = [h, v]
		}

		let f_index = 0
		let point = undefined
		const promises = new Array(loops_count)
		for(f_index ; f_index < loops_count ; f_index++)
		{
			point = f_step(f_index, f_scope)
			const point_index = f_index
			if (point)
			{
				// TODO GENERALIZE TO N DIMENSIONS
				if ( point[0].then && point[1].then )
				{
					const point_promise = Promise.all([point[0], point[1]])
					promises[f_index] = point_promise.then(
						([px, py])=>{
							const x = T.isObject(px) ? px.value : px
							const y = T.isObject(py) ? py.value : py
							add_point(point_index, [x, y] )
						}
					)
					continue
				}
				if (point[0].then)
				{
					promises[f_index] = point[0].then(
						(px)=>{
							const py = point[1]
							const x = T.isObject(px) ? px.value : px
							const y = T.isObject(py) ? py.value : py
							add_point(point_index, [x, y] )
						}
					)
					continue
				}
				if (point[1].then)
				{
					const px = point[0]
					promises[f_index] = point[1].then(
						(py)=>{
							const x = T.isObject(px) ? px.value : px
							const y = T.isObject(py) ? py.value : py
							add_point(point_index, [x, y] )
						}
					)
					continue
				}
				add_point(f_index, point)
			}
		}

		// RENDER
		const svg = this.space().svg()
		const promise = Promise.all(promises).then(
			()=>{
				const svg_points = new SVG.PointArray(points)
				this._shape = svg.polyline(svg_points)
				this.draw_color()
				return this
			}
		)

		return promise
	}
}