
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Position from '../../../base/position'
import Vector from '../../../base/vector'
import Domain from '../../../base/domain'
import Drawable from './drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svg/space'

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
 * @file Drawing space class.
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
	constructor(arg_dom_id, arg_px_width, arg_px_height, arg_domains_cfgs)
	{
		super(undefined, undefined, new Vector([0,0,0]), 'space')
		super._space = this

		this.is_svg_space = true

		this._dom_id = arg_dom_id
		this._width = arg_px_width
		this._height = arg_px_height
		this._viewbox = undefined
		this._pad_h = 5
		this._pad_v = 5

		this._domains = []
		this._domains_by_index = {}
		this._domains_by_name = {}

		this._svg = SVG(this._dom_id).size(this._width + 2*this._pad_h, this._height + 2*this._pad_v)

		this._set_domains(arg_domains_cfgs)
	}


	svg()
	{
		return this._svg
	}

	
	draw()
	{
		const width = this._width
		const height = this._height

		this._viewbox = this._svg.viewbox(0, 0, width + 2*this._pad_h, height + 2*this._pad_v)

		return this
	}


	background(arg_color='#dde3e1')
	{
		return this._svg
		.rect(this._width, this._height)
		.fill(arg_color)
	}


	axis_center_h(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		return this._svg
		.line(this._width/2, 0, this._width/2, this._height)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	axis_center_v(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		return this._svg
		.line(0, this._height/2, this._width, this._height/2)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	axis_h(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		const posh = this.domain_h().range_to_screen(0)

		return this._svg
		.line(posh, 0, posh, this._height)
		.stroke({ width: arg_width, color: arg_color, dasharray: arg_dashes })
	}


	axis_v(arg_color='#fff', arg_width=5, arg_dashes='5,5')
	{
		const posv = this.domain_v().range_to_screen(0)

		return this._svg
		.line(0, posv, this._width, posv)
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
