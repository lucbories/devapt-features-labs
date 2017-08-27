
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Pendulum from './pendulum'


const plugin_name = 'Labs' 
const context = plugin_name + '/physicsjs/shapes/factory'



/**
 * @file Drawing factory.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 */
export default class Factory
{
	/**
	 * Create a shapes factory.
	 * 
	 * @param {Space} arg_space - drawing space.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_world)
	{
		this.is_physicsjs_shapes_factory = true

		this._world = arg_world
		this._shapes = {}
		this._shapes_counter = 0
	}


	factory_context()
	{
		return this._factory_context
	}


	shapes()
	{
		return this._shapes
	}



	create(arg_shape_cfg)
	{
		console.log(context + ':create:shape cfg:', arg_shape_cfg)
		
		// GET TYPE
		const type = arg_shape_cfg.type
		if ( ! T.isNotEmptyString(type) )
		{
			return
		}

		// GET NAME
		this._shapes_counter++
		const name = T.isNotEmptyString(arg_shape_cfg.name) ? arg_shape_cfg.name : 'shape-' + this._shapes_counter

		// GET POSITION AND COLOR
		const position = T.isArray(arg_shape_cfg.position) && arg_shape_cfg.position.length >= 2 ? arg_shape_cfg.position : [0,0,0]
		const color = arg_shape_cfg.color

		// LOOKUP TYPE CLASS
		switch( type.toLocaleLowerCase() ) {
			case 'pendulum': {
				// const radius = T.isNumber(arg_shape_cfg.radius) && arg_shape_cfg.radius > 0 ? arg_shape_cfg.radius : 100
				// console.log(context + ':process_scene_item:circle radius=[%d] color=[%s]:', radius, color, position)

				const shape = new Pendulum(this._world, undefined, position, color, arg_shape_cfg)
				shape.draw()
				this._shapes[name] = shape
				return shape
			}
		}

		return this
	}
}
