
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/drawing/range'




/**
 * @file Range class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->size():number - get range size.
 * 		->count():number - get range steps count.
 * 
 * 		->start():number - get range start.
 * 		->start(v):this  - set range start.
 * 
 * 		->end():number - get range end.
 * 		->end(v):this  - set range end.
 * 
 * 		->step():number - get range step.
 * 		->step(v):this  - set range step.
 */
export default class Range
{
	/**
	 * Create an instance of a Range.
	 * 
	 * @param {number} arg_start - range start.
	 * @param {number} arg_end   - range end.
	 * @param {number} arg_step  - range step.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_start, arg_end, arg_step)
	{
		this.is_vector = true

		this._start = undefined
		this._end = undefined
		this._step = undefined

		this.start(arg_start)
		this.end(arg_end)
		this.step(arg_step)
	}


	size()
	{
		return this._end - this._start
	}


	count()
	{
		const size = this._end - this._start
		return size % this._step
	}

	
	start(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._start = arg_value
			return this
		}

		return this._start
	}

	
	end(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._end = arg_value
			return this
		}

		return this._end
	}

	
	step(arg_value)
	{
		if ( T.isNumber(arg_value) )
		{
			this._step = arg_value
			return this
		}

		return this._step
	}
}
