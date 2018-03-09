
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/base/methodeable'



/**
 * @file Methodeable base class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Methodeable
{
	/**
	 * Create an instance of Drawable.
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
		this.is_methodeable = true

		this._methods = {}
	}


	add_method(arg_method_name)
	{
		this._methods[arg_method_name] = true
	}


	has_method(arg_method_name)
	{
		return arg_method_name in this._methods
	}


	get_method(arg_method_name)
	{
		return (arg_method_name in this._methods) && this._methods[arg_method_name] && (arg_method_name in this) ? this[arg_method_name] : ( (arg_method_name in this.prototype) ? this.prototype[arg_method_name] : undefined)
	}


	get_methods_names()
	{
		return Object.keys(this._methods)
	}
}
