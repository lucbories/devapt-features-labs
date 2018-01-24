
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
import Axis from './axis'
import Project_2dTo2d_euclide from './project_2dto2d_euclide'


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
	 * @param {SVG.Element} arg_svg_canvas        - canvas element.
	 * @param {array}       arg_domains_settings  - dimensions domains configurations array.
	 * @param {object}      arg_pixelbox_settings - space PixelBox instance settings (optional)
	 * @param {object}      arg_drawing_settings  - space drawing settings (optional)
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_svg_canvas, arg_domains_settings, arg_pixelbox_settings=undefined, arg_drawing_settings={})
	{
		super(undefined, undefined, new Vector([0,0,0,0]), 'space')
		super._space = this

		/**
		 * Class type flag
		 * @type {boolean}
		 */
		this.is_svg_space = true

		// BUILD SVG
		this._svg = arg_svg_canvas

		// BUILD PIXEL BOX
		const svg_canavs_viewbox = this._svg.viewbox()
		const box_settings = {
			origin_h:0,
			origin_v:0,
			margin_h:0,
			margin_v:0,
			padding_h:5,
			padding_v:5,
			width:svg_canavs_viewbox.width,
			height:svg_canavs_viewbox.height
		}
		this._pixelbox = new PixelBox(arg_pixelbox_settings ? arg_pixelbox_settings : box_settings)
		
		// BUILD DOMAINS
		this._domains = []
		this._domains_by_index = {}
		this._domains_by_name = {}
		this._set_domains(arg_domains_settings)

		// BUILD DRAWING SETTINGS
		this._shape = this._svg.group()
		this._drawing_settings = arg_drawing_settings
		if ( T.isString(this._drawing_settings.background_color) )
		{
			this.background(this._drawing_settings.background_color)
		}
		if ( T.isObject(this._drawing_settings.axis) )
		{
			// TODO
		}

		// INIT TRANSFORMATIONS
		// const scales = new Vector()
		// this._scales = scales.init(1, this._domains.length)
		// const rotate

		this._axis = {}

		// PUBLIC METHODS
		this.add_method('background')
		this.add_method('grid')
		this.add_method('axis')
		this.add_method('axis_h')
		this.add_method('axis_v')
	}


	/**
	 * Get SVG canvas element instance.
	 * 
	 * @returns {object}
	 */
	svg()
	{
		return this._svg
	}


	/**
	 * Get space PixelBox instance.
	 * 
	 * @returns {PixelBox}
	 */
	pixelbox()
	{
		return this._pixelbox
	}

	
	/**
	 * Get all space domains array.
	 * 
	 * @returns {array}
	 */

	domains()
	{
		return this._domains
	}


	/**
	 * Get X domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */
	domain_x()
	{
		return ('x' in this._domains_by_name) ? this._domains_by_name['x'] : undefined
	}

	
	/**
	 * Get Y domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */
	domain_y()
	{
		return ('y' in this._domains_by_name) ? this._domains_by_name['y'] : undefined
	}

	
	/**
	 * Get Z domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */

	domain_z()
	{
		return ('z' in this._domains_by_name) ? this._domains_by_name['z'] : undefined
	}

	
	/**
	 * Get T domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */
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
	 * @param {Array|Postion} arg_position - multi-dimenstional position to project.
	 * 
	 * @returns {Pixel}
	 */
	project(arg_position, arg_without_boxing=false, arg_space=this)
	{
		if ( Array.isArray(arg_position) )
		{
			arg_position = new Position(arg_position)
		}
		if (arg_space._domains.length <= 2)
		{
			if (arg_without_boxing)
			{
				return Project_2dTo2d_euclide.project_without_boxing(arg_position, arg_space)
			}
			return Project_2dTo2d_euclide.project(arg_position, arg_space)
		}

		return undefined
	}

	project_x(arg_position_x, arg_space=this)
	{
		const tmp_position = new Position([arg_position_x, 0])
		return Project_2dTo2d_euclide.project(tmp_position, arg_space).h()
	}

	project_y(arg_position_y, arg_space=this)
	{
		const tmp_position = new Position([arg_position_y, 0])
		return Project_2dTo2d_euclide.project(tmp_position, arg_space).v()
	}

	range_to_screen_h(arg_position_x, arg_space=this)
	{
		const tmp_position = new Position([arg_position_x, 0])
		return Project_2dTo2d_euclide.project_without_boxing(tmp_position, arg_space, 0, true).h()
	}
	
	range_to_screen_v(arg_position_y, arg_space=this)
	{
		const tmp_position = new Position([0, arg_position_y])
		return Project_2dTo2d_euclide.project_without_boxing(tmp_position, arg_space, 0, true).v()
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
		const pixelbox = this._pixelbox.get_usable()
		const background = this._svg
			.rect(pixelbox.width, pixelbox.height)
			.move(pixelbox.top_left.h, pixelbox.top_left.v)
			.fill(arg_color)
		this._shape.add(background)
		return background
	}


	axis(arg_domain_name, arg_color='#fff', arg_width=1)
	{
		const position = this.get_origin_position()
		const domain  = arg_domain_name == 'x' ? this.domain_x() : this.domain_y()
		const start   = domain.start()
		const end     = domain.end()

		position.value(domain.index(), domain.start())

		const axis = new Axis(this, this, position, arg_domain_name, arg_color, arg_width)
		axis.draw()
		this._shape.add(axis.svg_shape())
		this._axis[arg_domain_name] = axis

		return axis
	}


	get_origin_position()
	{
		const positions = []
		const count = this._domains.length
		let i = 0
		for(i ; i < count ; i++)
		{
			positions.push(0)
		}
		return new Position(positions)
	}


	get_start_position()
	{
		const positions = []
		const count = this._domains.length
		let i = 0

		for(i ; i < count ; i++)
		{
			const domain = this._domains_by_index[i]
			positions.push(domain.start())
		}

		return new Position(positions)
	}


	get_end_position()
	{
		const positions = []
		const count = this._domains.length
		let i = 0

		for(i ; i < count ; i++)
		{
			const domain = this._domains_by_index[i]
			positions.push(domain.end())
		}

		return new Position(positions)
	}


	_set_domains(arg_domains)
	{
		if (! T.isNotEmptyArray(arg_domains))
		{
			return
		}

		let index, start, end, step, name, domain
		arg_domains.forEach(
			(domain_cfg, i)=>{
				index   = T.isNumber(domain_cfg.index)   ? domain_cfg.index   : i
				start   = T.isNumber(domain_cfg.start)   ? domain_cfg.start   : DEFAULT_DOMAINS_START
				end     = T.isNumber(domain_cfg.end)     ? domain_cfg.end     : DEFAULT_DOMAINS_END
				step    = T.isNumber(domain_cfg.step)    ? domain_cfg.step    : DEFAULT_DOMAINS_STEP
				name    = T.isNotEmptyString(domain_cfg.name) ? domain_cfg.name  : 'domains[' + i +']'

				domain = new Domain(name, index, start, end, step)
				this._domains.push(domain)
				this._domains_by_index[index] = domain
				this._domains_by_name[name] = domain
			}
		)
	}
}
