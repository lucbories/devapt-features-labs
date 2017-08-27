
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Range from './range'


const plugin_name = 'Labs' 
const context = plugin_name + '/drawing/domain'




/**
 * @file Domain class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->px_size():number - get display zone size.
 * 		->px_size(v):this  - set display zone size.
 * 
 * 		->(v):number - get display zone height.
 * 		->(v):number - set display zone height.
 * 
 */
export default class Domain extends Range
{
	/**
	 * Create an instance of a Domain.
	 * 
	 * @param {string} arg_name   - domain name.
	 * @param {number} arg_index  - domain index.
	 * @param {number} arg_px_size- display zone size (pixels).
	 * @param {number} arg_start  - range start value.
	 * @param {number} arg_end    - range end value.
	 * @param {number} arg_step   - range step value.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_index, arg_px_size, arg_start, arg_end, arg_step)
	{
		super(arg_start, arg_end, arg_step)

		this.is_drawing_domain = true

		this._name = arg_name
		this._index = arg_index
		this._px_size  = T.isNumber(arg_px_size)  ? arg_px_size  : 100
	}


	name()
	{
		return this._name
	}


	index()
	{
		return this._index
	}


	px_size(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._px_size = arg_value
			return this
		}

		return this._px_size
	}


	range_to_screen(arg_value)
	{
		/*
			Example:
				width = 500
				range start = 0
				range end = 100

				v=0   => x=0
				v=100 => x=500
				v=50  => x=500*50/100=250
				v=10  => x=500*10/100=50
		*/
		return (this._px_size * arg_value) / (this._end - this._start)
	}


	screen_to_range(arg_value)
	{
		/*
			Example:
				width = 500
				range start = 0
				range end = 100

				x=0   => v=(0+100*0)/500=0
				x=500 => v=(0+100*500)/500=100
				x=250 => v=(0+100*250)/500=50
				x=50  => v=(0+100*50)/500=10
		*/
		return (this._start + (this._end - this._start) * arg_value) / this._px_size
	}
}
