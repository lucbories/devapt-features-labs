
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
// import Vector from '../math/vector'


const plugin_name = 'Labs' 
const context = plugin_name + '/base/scope'



/**
 * @file Scope class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Scope
{
	/**
	 * Create an instance of Position.
	 * 
	 * @param {string} arg_scope_name - scope name.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_scope_name)
	{
		this.is_scope = true

		this.name = arg_scope_name
		this._private_map = {}
		this._public_map = {}
	}




	/**
	 * Get a read only map of all private items.
	 * 
	 * @returns {object} - returns an items map object.
	 */
	get_private_items()
	{
		return this._private_map
	}
	



	/**
	 * Get a read only map of all public items.
	 * 
	 * @returns {object} - returns an items map object.
	 */
	get_public_items()
	{
		return this._public_map
	}


	
	/**
	 * Set one public item (add or update).
	 * 
	 * @param {string} arg_name  - item name.
	 * @param {any}    arg_value - item value.
	 * 
	 * @returns {nothing}
	 */
	set_public_item(arg_name, arg_value)
	{
		if ( T.isNotEmptyString(arg_name) )
		{
			this._public_map[arg_name] = arg_value
		}
	}


	
	/**
	 * Init one public item (add if item not exist, do nothing if item exists).
	 * 
	 * @param {string} arg_name  - item name.
	 * @param {any}    arg_value - item value.
	 * 
	 * @returns {nothing}
	 */
	init_public_item(arg_name, arg_value)
	{
		if ( T.isNotEmptyString(arg_name) && (! arg_name in this._public_map) )
		{
			this._public_map[arg_name] = arg_value
		}
	}


	
	/**
	 * Remove one public item.
	 * 
	 * @param {string} arg_name  - item name.
	 * 
	 * @returns {nothing}
	 */
	remove_public_item(arg_name)
	{
		if ( T.isNotEmptyString(arg_name) )
		{
			delete this._public_map[arg_name]
		}
	}


	
	/**
	 * Get one public item.
	 * 
	 * @param {string} arg_name  - item name.
	 * 
	 * @returns {any}
	 */
	get_public_item(arg_name)
	{
		if ( T.isNotEmptyString(arg_name) )
		{
			return this._public_map[arg_name]
		}
		
		return undefined
	}


	
	/**
	 * Set one private item (add or update).
	 * 
	 * @param {string} arg_name  - item name.
	 * @param {any}    arg_value - item value.
	 * 
	 * @returns {nothing}
	 */
	set_private_item(arg_name, arg_value)
	{
		if ( T.isNotEmptyString(arg_name) )
		{
			this._private_map[arg_name] = arg_value
		}
	}


	
	/**
	 * Init one private item (add if item not exist, do nothing if item exists).
	 * 
	 * @param {string} arg_name  - item name.
	 * @param {any}    arg_value - item value.
	 * 
	 * @returns {nothing}
	 */
	init_private_item(arg_name, arg_value)
	{
		if ( T.isNotEmptyString(arg_name) && (! arg_name in this._private_map) )
		{
			this._private_map[arg_name] = arg_value
		}
	}


	
	/**
	 * Remove one private item.
	 * 
	 * @param {string} arg_name  - item name.
	 * 
	 * @returns {nothing}
	 */
	remove_private_item(arg_name)
	{
		if ( T.isNotEmptyString(arg_name) )
		{
			delete this._private_map[arg_name]
		}
	}


	
	/**
	 * Get one private item.
	 * 
	 * @param {string} arg_name  - item name.
	 * 
	 * @returns {any}
	 */
	get_private_item(arg_name)
	{
		if ( T.isNotEmptyString(arg_name) )
		{
			return this._private_map[arg_name]
		}
		
		return undefined
	}
}
