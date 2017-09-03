
// NPM IMPORTS
import _ from 'lodash'

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


	get(arg_shape_name)
	{
		return this._shapes[arg_shape_name]
	}


	shapes()
	{
		return this._shapes
	}
	
	

	/**
	 * Create a new shape from a configuration.
	 * 
	 * @param {object} arg_config - shape configuration plain object.
	 * 
	 * returns {object} - created shape. 
	 */
	create(arg_shape_config)
	{
		console.log(context + ':create:shape cfg:', arg_shape_config)
		
		// GET TYPE
		const type = arg_shape_config.type
		if ( ! T.isNotEmptyString(type) )
		{
			console.error(context + ':create:bad type for shape config=', arg_shape_config)
			return undefined
		}

		// GET NAME
		this._shapes_counter++
		const name = T.isNotEmptyString(arg_shape_config.name) ? arg_shape_config.name : 'shape-' + this._shapes_counter

		// GET POSITION AND COLOR
		const position = T.isObject(arg_shape_config.position) ? arg_shape_config.position : { x:0, y:0}
		const velocity = T.isObject(arg_shape_config.velocity) ? arg_shape_config.velocity : { vx:0, vy:0}
		const color = arg_shape_config.color

		arg_shape_config.styles = {}
		arg_shape_config.styles.fillStyle   = T.isNotEmptyString(arg_shape_config.fill_color) ? arg_shape_config.fill_color : (color ? color : false)
		arg_shape_config.styles.strokeStyle = T.isNotEmptyString(arg_shape_config.line_color) ? arg_shape_config.line_color : (color ? color : false)
		arg_shape_config.styles.lineWidth   = T.isNumber(arg_shape_config.line_width) ? arg_shape_config.line_width : 1

		// PREPARE SHAPE CONFIGURATION
		const shape_cfg = {
			// BODY
			hidden: false,

			x: position.x,
			y: position.y,
			
			vx: velocity.vx,
			vy: velocity.vy,
			
			treatment:arg_shape_config.is_static ? 'static' : 'dynamic',
			
			mass:arg_shape_config.mass,

			// body restitution. How "bouncy" is it?
			restitution: arg_shape_config.restitution,

			// what is its coefficient of friction with another surface with COF = 1? (default=0.8)
			cof: arg_shape_config.friction,

			// what is the view object (mixed) that should be used when rendering?
			view: null,

			// the vector offsetting the geometry from its center of mass
			offset: Physics.vector(0,0),

			styles:arg_shape_config.styles
		}

		// LOOKUP TYPE CLASS
		console.log(context + ':create:type=[%s] position=[%o] color=[%s]:config', type, position, color, arg_shape_config)
		switch( type.toLocaleLowerCase() ) {
			case 'pendulum': {
				const shape = new Pendulum(this._world, undefined, [0,0], color, arg_shape_config)
				shape.draw()
				this._shapes[name] = shape
				return shape
			}

			case 'circle': {
				shape_cfg.radius = T.isNumber(arg_shape_config.radius) && arg_shape_config.radius > 0 ? arg_shape_config.radius : 10

				const shape = window.Physics.body('circle', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}

			case 'point': {
				const shape = window.Physics.body('point', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}
			
			case 'rectangle': {
				shape_cfg.width  = T.isNumber(arg_shape_config.width)  && arg_shape_config.width  > 0 ? arg_shape_config.width  : 10
				shape_cfg.height = T.isNumber(arg_shape_config.height) && arg_shape_config.height > 0 ? arg_shape_config.height : 10

				const shape = window.Physics.body('rectangle', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}
			
			case 'compound': {
				const cfg_children = T.isArray(arg_shape_config.children) ? arg_shape_config.children : []
				shape_cfg.children = []
				_.forEach(arg_shape_config.children,
					(child_item)=>{
						if ( T.isNotEmptyString(child_item) )
						{
							const child = this.get(child_item)
							if (child)
							{
								shape_cfg.children.push(child)
								return
							}
						}
						if ( T.isObject(child_item) )
						{
							const child = this.create(child_item)
							if (child)
							{
								shape_cfg.children.push(child)
								return
							}
						}
					}
				)

				const shape = window.Physics.body('compound', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}

			case 'convex-polygon': {
				shape_cfg.vertices = T.isArray(arg_shape_config.vertices) ? arg_shape_config.vertices  : []

				const shape = window.Physics.body('convex-polygon', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}
			
			case 'button-start': {
				const size = 14
				shape_cfg.vertices  = [
					{x:shape_cfg.x, y:shape_cfg.y},
					{x:shape_cfg.x, y:shape_cfg.y + size},
					{x:shape_cfg.x + size, y:shape_cfg.y + size/2}
				]

				const shape = window.Physics.body('convex-polygon', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}
			
			case 'button-reset': {
				shape_cfg.radius  = 7

				const shape = window.Physics.body('circle', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}
			
			case 'button-stop': {
				shape_cfg.width  = 14
				shape_cfg.height = 14

				const shape = window.Physics.body('rectangle', shape_cfg)
				this._world.add(shape)
				this._shapes[name] = shape
				return shape
			}
		}

		return undefined
	}
}
