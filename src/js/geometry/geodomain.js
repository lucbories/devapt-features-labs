
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Range from '../math/range'


const plugin_name = 'Labs' 
const context = plugin_name + '/geometry/geodomain'




/**
 * @file GeoDomain class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->...
 * 
 */
export default class GeoDomain extends Range
{
	/**
	 * Create an instance of a Domain.
	 * 
	 * @param {string} arg_name   - domain name.
	 * @param {number} arg_index  - domain index.
	 * @param {number} arg_start  - range start value.
	 * @param {number} arg_end    - range end value.
	 * @param {number} arg_step   - range step value.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_index, arg_start, arg_end, arg_step)
	{
		super(arg_start, arg_end, arg_step)

		this.is_drawing_domain = true

		this._name = arg_name
		this._index = arg_index
	}


	name()
	{
		return this._name
	}


	index()
	{
		return this._index
	}
}
