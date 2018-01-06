
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Pixel from '../../../base/pixel'
import PixelBox from '../../../base/pixelbox'
import Position from '../../../base/position'
import Vector from '../../../base/vector'
import Domain from '../../../base/domain'
import Drawable from './drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/base/space'

const DEFAULT_DOMAINS_SIZE  = 500
const DEFAULT_DOMAINS_START = 0
const DEFAULT_DOMAINS_END   = 10
const DEFAULT_DOMAINS_STEP  = 1
/*
DOMAINS EXAMPLE
[
	{
		"name":"d0",
		"start":0,
		"end":10,
		"step":1
	},
	{
		"name":"d1",
		"start":0,
		"end":10,
		"step":1
	}
]
*/


/**
 * @file Space class.
 * 
 * Map a multidimensional position ([x,y,z,t] for example) onto a PixelBox (part of the screen).
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->owner():Drawable - get drawable owner (INHERITED).
 * 		->children():Drawable array - get drawable children (INHERITED).
 * 		->type():string - get drawable type (INHERITED).
 * 
 * 
 *      ->zoom():Zoom - get zoom object.
 *      ->zoom(value):this - update zoom object.
 *      ->zoom_in(step):this - update zoom object.
 *      ->zoom_out(step):this - update zoom object.
 * 
 * 		->translate(Vector pos, Vector tr):this - translate shape.
 * 		->rotate(Vector pos, Angle angle):this - rotate shape.
 * 
 */
export default class Space extends Drawable
{
	/**
	 * Create an instance of Space.
	 * 
	 * @param {string} arg_dom_id - dom container id.
	 * @param {number} arg_px_width - dom container width.
	 * @param {number} arg_px_height - dom container height.
	 * @param {array} arg_domains - dimensions domains configurations array.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_dom_id, arg_domains, arg_px_width=undefined, arg_px_height=undefined)
	{
		super(undefined, undefined, new Vector([0,0,0]), 'space')
		super._space = this

		this.is_svg_space = true

		// BUILD SVG
		this._dom_id = arg_dom_id
		this._svg = SVG(this._dom_id)
		if ( T.isNumber(arg_px_width) && T.isNumber(arg_px_height) )
		{
			this._svg.size(arg_px_width, arg_px_height)
		}
		this._svg_viewbox = this._svg.viewbox()

		// BUILD PIXEL BOX
		const box_settings = {
			origin_h:0,
			origin_v:0,
			margin_h:0,
			margin_v:0,
			padding_h:5,
			padding_v:5,
			width:this._svg_viewbox.width,
			height:this._svg_viewbox.height
		}
		this._pixelbox = new PixelBox(box_settings)
		
		// BUILD DOMAINS
		this._domains = []
		this._domains_by_index = {}
		this._domains_by_name = {}
		this._set_domains(arg_domains)

		// INIT TRANSFORMATIONS
		const scales = new Vector()
		this._scales = scales.init(1, this._domains.length)
		// const rotate
	}


	svg()
	{
		return this._svg
	}


	pixelbox()
	{
		return this._pixelbox
	}

	domain_x()
	{
		return ('x' in this._domains_by_name) ? this._domains_by_name['x'] : undefined
	}

	domain_y()
	{
		return ('y' in this._domains_by_name) ? this._domains_by_name['y'] : undefined
	}

	domain_z()
	{
		return ('z' in this._domains_by_name) ? this._domains_by_name['z'] : undefined
	}

	domain_t()
	{
		return ('t' in this._domains_by_name) ? this._domains_by_name['t'] : undefined
	}


	/*

		Projection N dimensions to 2 dimensions
		Position->Pixel ratios
		Boxing filter
	*/
	
	/**
	 * Project a multi-dimenstional position to a 2d Pixel.
	 * 
	 * @param {Postion} arg_position - multi-dimenstional position to project.
	 * 
	 * @returns {Pixel}
	 */
	project(arg_position)
	{
		if (this._domains.length <= 2)
		{
			return this.project_2d(arg_position)
		}

		return undefined
	}


	project_2d(arg_position)
	{
		const h = this.project_x(arg_position.x())
		const v = this.project_y(arg_position.y())
		return new Pixel(h, v)
	}


	project_x(arg_position_x)
	{
		const domaine_x = this.domain_x()
		const h = domaine_x ? domaine_x.range_to_screen( arg_position_x ) : 0

		return this._pixelbox.get_boxed_h(h)
	}


	project_y(arg_position_y)
	{
		const domaine_y = this.domain_y()
		const v = domaine_y ? domaine_y.range_to_screen( arg_position_y ) : 0

		return  this._pixelbox.get_boxed_v(v)
	}


	rotate()
	{
	}

	translate()
	{
	}

	scale()
	{
	}


	background(arg_color='#dde3e1')
	{
		return this._svg
		.rect(this._pixelbox.get_usable().width, this._pixelbox.get_usable().height)
		.fill(arg_color)
	}


	axis_center_h(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		return this._svg
		.line(this._pixelbox.get_usable().width/2, 0, this._pixelbox.get_usable().width/2, this._pixelbox.get_usable().height)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	axis_center_v(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		return this._svg
		.line(0, this._pixelbox.get_usable().height/2, this._pixelbox.get_usable().width, this._pixelbox.get_usable().height/2)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	axis_h(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		const posh = this.project_x(0)

		return this._svg
		.line(posh, 0, posh, this._pixelbox.get_usable().height)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	axis_v(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		const posv = this.project_y(0)

		return this._svg
		.line(0, posv, this._pixelbox.get_usable().width, posv)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	_set_domains(arg_domains)
	{
		if (! T.isNotEmptyArray(arg_domains))
		{
			return
		}

		let index, size, start, end, step, name, domain
		arg_domains.forEach(
			(domain_cfg, i)=>{
				index = T.isNumber(domain_cfg.index) ? domain_cfg.index : i
				size  = T.isNumber(domain_cfg.size)  ? domain_cfg.size  : DEFAULT_DOMAINS_SIZE
				start = T.isNumber(domain_cfg.start) ? domain_cfg.start : DEFAULT_DOMAINS_START
				end   = T.isNumber(domain_cfg.end)   ? domain_cfg.end   : DEFAULT_DOMAINS_END
				step  = T.isNumber(domain_cfg.step)  ? domain_cfg.step  : DEFAULT_DOMAINS_STEP
				name  = T.isNotEmptyString(domain_cfg.name) ? domain_cfg.name  : 'domains[' + i +']'

				domain = new Domain(name, index, size, start, end, step)
				this._domains.push(domain)
				this._domains_by_index[index] = domain
				this._domains_by_name[name] = domain
			}
		)
	}
}
