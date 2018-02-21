
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Pixel      from '../../base/pixelpoint'
import PixelBox   from '../../base/pixelbox'
import Vector     from '../../math/vector'
import GeoPoint   from '../../geometry/geopoint'
import GeoDomain  from '../../geometry/geodomain'
import GeoSpace   from '../../geometry/geospace'
import GeoPlan    from '../../geometry/geoplan'
import GeoLine    from '../../geometry/geoline'
import GeoProjection  from '../../geometry/geoprojection'
import projection_fn_euclidian from '../../geometry/projection_fn_2dto2d_euclidian'
import Axis       from './axis'
import Drawable   from '../drawable'


const plugin_name = 'Labs' 
const context = plugin_name + '/svgjs/shape/space'

const DEFAULT_DOMAINS_SIZE  = 500
const DEFAULT_DOMAINS_START = 0
const DEFAULT_DOMAINS_END   = 10
const DEFAULT_DOMAINS_STEP  = 1



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
 * DOMAINS EXAMPLE
 * [
 * 	{
 * 		"name":"d0",
 * 		"start":0,
 * 		"end":10,
 * 		"step":1
 * 	},
 * 	{
 * 		"name":"d1",
 * 		"start":0,
 * 		"end":10,
 * 		"step":1
 * 	}
 * ]
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
		super._svg_space = this

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
		
		// BUILD GEOMETRIC ITEMS
		this._geospace       = new GeoSpace(arg_domains_settings, this._pixelbox)
		this._proj_plan      = new GeoPlan(new GeoPoint([0,0,0,0]), new GeoPoint([0,1,0,0]), new GeoPoint([1,0,0]))
		this._proj_direction = new GeoLine(new GeoPoint([1,0,1,0]), new GeoPoint([1,0,0,0]))
		this._proj_fn        = projection_fn_euclidian
		this._geoprojection  = this.create_projection(this._geospace, this._proj_plan, this._proj_direction, this._proj_fn)

		// BUILD DRAWING SETTINGS
		this._shape = this._svg.group()
		// this._svg_shape = this._svg.group()
		this._drawing_settings = arg_drawing_settings
		if ( T.isString(this._drawing_settings.background_color) )
		{
			this.background(this._drawing_settings.background_color)
		}
		if ( T.isObject(this._drawing_settings.axis) )
		{
			// TODO
		}


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
		return this._geospace.domains()
	}


	/**
	 * Get X domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */
	domain_x()
	{
		return this._geospace.domain_x()
	}

	
	/**
	 * Get Y domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */
	domain_y()
	{
		return this._geospace.domain_y()
	}

	
	/**
	 * Get Z domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */

	domain_z()
	{
		return this._geospace.domain_z()
	}

	
	/**
	 * Get T domain if it exists or undefined.
	 * 
	 * @returns {Domain|undefined}
	 */
	domain_t()
	{
		return this._geospace.domain_t()
	}


	/**
	 * Create GeoProjection instance.
	 * 
	 * @param {GeoSpace}    arg_space 
	 * @param {GeoTriPoint} arg_plan 
	 * @param {GeoBiPoint}  arg_direction 
	 * @param {Function}    arg_projection_fn 
	 * 
	 * @returns {GeoProjection}
	 */
	create_projection(arg_space, arg_plan, arg_direction, arg_projection_fn)
	{
		const space_is_valid     = T.isObject(arg_space) && arg_space.is_geospace
		const plan_is_valid      = T.isObject(arg_plan) && arg_plan.is_geotripoint
		const direction_is_valid = T.isObject(arg_direction) && arg_direction.is_geobipoint
		const fn_is_valid        = T.isFunction(arg_projection_fn)
		
		// if (space_is_valid && plan_is_valid && direction_is_valid && fn_is_valid)
		if (space_is_valid && fn_is_valid)
		{
			return new GeoProjection(arg_space, arg_plan, arg_direction, arg_projection_fn)
		}

		return undefined
	}



	/**
	 * Project a multi-dimenstional position to a 2d Pixel.
	 * 
	 * @param {Array|Vector|GeoPoint} arg_position       - multi-dimenstional position to project.
	 * @param {boolean}               arg_without_boxing - true for no pixel boxing.
	 * @param {SvgSpace}              arg_space          - SvgSpace instance to use for projection.
	 * 
	 * @returns {PixelPoint}
	 */
	project(arg_position, arg_without_boxing=false, arg_space=this)
	{
		if ( Array.isArray(arg_position) )
		{
			arg_position = new GeoPoint(arg_position)
		}

		if (arg_space._geoprojection)
		{
			const projected_pos = arg_space._geoprojection.project(arg_position)

			if (arg_without_boxing)
			{
				return projected_pos
			}

			return this._pixelbox.get_boxed_pixel(projected_pos)
		}

		return undefined
	}



	project_x(arg_position_x, arg_space=this)
	{
		const tmp_position = new GeoPoint([arg_position_x, 0])
		return this.project(tmp_position, false, arg_space).h()
	}

	project_y(arg_position_y, arg_space=this)
	{
		const tmp_position = new GeoPoint([arg_position_y, 0])
		return this.project(tmp_position, false, arg_space).v()
	}

	range_to_screen_h(arg_position_x, arg_space=this)
	{
		const tmp_position = new GeoPoint([arg_position_x, 0])
		return this.project(tmp_position, true, arg_space).h()
	}
	
	range_to_screen_v(arg_position_y, arg_space=this)
	{
		const tmp_position = new GeoPoint([0, arg_position_y])
		return this.project(tmp_position, true, arg_space).v()
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
		this._svg_shape.add(background)
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
		this._svg_shape.add(axis.svg_shape())
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
		return new GeoPoint(positions)
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

		return new GeoPoint(positions)
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

		return new GeoPoint(positions)
	}


	// _set_domains(arg_domains)
	// {
	// 	if (! T.isNotEmptyArray(arg_domains))
	// 	{
	// 		return
	// 	}

	// 	let index, start, end, step, name, domain
	// 	arg_domains.forEach(
	// 		(domain_cfg, i)=>{
	// 			index   = T.isNumber(domain_cfg.index)   ? domain_cfg.index   : i
	// 			start   = T.isNumber(domain_cfg.start)   ? domain_cfg.start   : DEFAULT_DOMAINS_START
	// 			end     = T.isNumber(domain_cfg.end)     ? domain_cfg.end     : DEFAULT_DOMAINS_END
	// 			step    = T.isNumber(domain_cfg.step)    ? domain_cfg.step    : DEFAULT_DOMAINS_STEP
	// 			name    = T.isNotEmptyString(domain_cfg.name) ? domain_cfg.name  : 'domains[' + i +']'

	// 			domain = new GeoDomain(name, index, start, end, step)
	// 			this._domains.push(domain)
	// 			this._domains_by_index[index] = domain
	// 			this._domains_by_name[name] = domain
	// 		}
	// 	)
	// }
}
