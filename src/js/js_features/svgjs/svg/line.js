
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Drawable from './drawable'
import Position from '../../../base/position'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/line'

const DEFAULT_RADIUS = 1



/**
 * @file Drawing line class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Line extends Drawable
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {Space}        arg_space    - drawing space.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_pos_begin- shape position begin.
	 * @param {array|Vector} arg_pos_end - shape position end.
	 * @param {string}		 arg_color    - shape color.
	 * @param {number}       arg_width    - shape width in pixels.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_space, arg_owner, arg_pos_begin, arg_pos_end, arg_color=undefined, arg_width)
	{
		super(arg_space, arg_owner, arg_pos_begin, 'line')

		this.is_svg_line = true

		this._pos_end = new Position([0,0])
		
		if ( T.isArray(arg_pos_end) || this._is_vector(arg_pos_end) )
		{
			this._pos_end.values(arg_pos_end)
		}

		this.color = arg_color ? arg_color : 'blue'
		this._width = arg_width ? arg_width : 1
	}



	draw()
	{
		// DO NOT RENDER	
		if (this.color == 'none')
		{
			return
		}

		const pos_begin_h = this.pos_h()
		const pos_begin_v = this.pos_v()
		const pos_end_h = this.pos_h(this._pos_end.x())
		const pos_end_v = this.pos_v(this._pos_end.y())
		
		this._shape = this.space().svg().line(pos_begin_h, pos_begin_v, pos_end_h, pos_end_v)

		if (this.color && this._width)
		{
			this._shape.stroke({ color:this.color, width:this._width })
		}

		return this
	}
}
/*
ngon: function(settings) {
    settings = settings || {}

    var i, a, x, y
      , points  = []
      , defaults = SVG.shapes.defaults
      , edges   = typeof settings.edges  == 'number' ? settings.edges  : defaults.edges 
      , radius  = typeof settings.radius == 'number' ? settings.radius : defaults.radius
      , degrees = 360 / edges

    for (i = 0; i < edges; i++) {
      a = i * degrees - 90
      x = radius + radius * Math.cos(a * Math.PI / 180)
      y = radius + radius * Math.sin(a * Math.PI / 180)

      points.push([x, y])
    }

    return new SVG.PointArray(points)
  }

  star: function(settings) {
    settings = settings || {}

    var i, a, x, y
      , points  = []
      , defaults = SVG.shapes.defaults
      , spikes  = typeof settings.spikes == 'number' ? settings.spikes : defaults.spikes
      , inner   = typeof settings.inner  == 'number' ? settings.inner  : defaults.inner 
      , outer   = typeof settings.outer  == 'number' ? settings.outer  : defaults.outer 
      , degrees = 360 / spikes

    for (i = 0; i < spikes; i++) {
      a = i * degrees + 90
      x = outer + inner * Math.cos(a * Math.PI / 180)
      y = outer + inner * Math.sin(a * Math.PI / 180)

      points.push([x, y])

      a += degrees / 2
      x = outer + outer * Math.cos(a * Math.PI / 180)
      y = outer + outer * Math.sin(a * Math.PI / 180)

      points.push([x, y])
    }

    return new SVG.PointArray(points)
  }
*/