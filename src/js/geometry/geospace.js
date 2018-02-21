
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import GeoPoint  from './geopoint'
import GeoItem   from './geoitem'
import GeoDomain from './geodomain'



const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geospace'



/**
 * @file GeoSpace class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class GeoSpace
{
	/**
	 * Create an instance of GeoSpace.
	 * 
	 * @param {array} arg_domains - dimensions domains configurations array.
	 * @param {PixelBox} arg_pixelbox - bounding pixel box.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_domains, arg_pixelbox)
	{
		this.is_geospace = true
		
		// BUILD DOMAINS
		this._domains = []
		this._domains_by_index = {}
		this._domains_by_name = {}
		this._set_domains(arg_domains)

		this._pixelbox = arg_pixelbox
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

	rotate()
	{
	}

	translate()
	{
	}

	scale()
	{
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

				domain = new GeoDomain(name, index, start, end, step)
				this._domains.push(domain)
				this._domains_by_index[index] = domain
				this._domains_by_name[name] = domain
			}
		)
	}
}
