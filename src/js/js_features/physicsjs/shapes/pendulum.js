
// NPM IMPORTS
import _ from "lodash"
import assert from "assert"

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import Factory from './factory'

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/physicsjs/shapes/pendulum'


const default_origin = {
	type:"circle",

	position:{
		x:200,
		y:50
	},

	velocity:{
		vx:0,
		vy:0
	},

	is_static:true,

	line_color:"#351024",
	line_width:1,
	fill_color:"#351024",

	style:{},

	mass:1,
	friction:0.3,
	restitution:1
}

const default_pendant = {
	type:"circle",

	position:{
		x:200,
		y:150
	},

	velocity:{
		vx:0,
		vy:0
	},

	is_static:false,

	line_color:"#351024",
	line_width:1,
	fill_color:"#351024",

	style:{},

	mass:1,
	friction:0.3,
	restitution:1,

	link_length:100,
	link_source:"origin",
	link_stiffness:0.5
}


/*
'#b58900',
'#cb4b16',
'#dc322f',
'#d33682',
'#6c71c4',
'#268bd2',
'#2aa198',
'#859900'
*/


/**
 * @file Pendulum drawing class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	Configuration:{
 * 			settings:{
 * 				origin:{
 * 					type:"circle",
 * 					position:{
 * 						x:200,
 * 						y:50
 * 					},
 * 					is_static:true,
 *					line_color:"..." or false,
 *                  line_width:1,
 *					fill_color:"..." or false,
 * 					style:{},
 * 					mass:1,
 * 					friction:0.3,
 *                  restitution:1
 * 				},
 * 				shapes:{
 * 					ball1:{
 * 						type:"circle",
 * 						position:{
 * 							x:200,
 * 							y:150
 * 						},
 * 						is_static:false,
 *					    line_color:"..." or false,
 *                      line_width:1,
 *					    fill_color:"..." or false,
 * 						style:{},
 * 						mass:1,
 * 						friction:0.3,
 *                      restitution:1,
 * 						link_stiffness:0.3,
 * 						link_length:100,
 * 						link_source:"origin"
 * 					}
 * 				}
 * 			}
 * 		}
 * 
 */
export default class PhysicsJSPendulum
{
	/**
	 * Create a shape instance.
	 * 
	 * @param {PhysicsJS}    arg_world    - PhysicsJS instance.
	 * @param {Drawable}     arg_owner    - parent shape (or undefined for top Space).
	 * @param {array|Vector} arg_position - shape position.
	 * @param {string}		 arg_color    - shape color.
	 * @param {object}       arg_config   - shape configuration.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_world, arg_owner, arg_position, arg_color=undefined, arg_config)
	{
		// console.log(context + ':constructor')

		this.is_physicsjs_shapes_pendulum = true

		this._color = arg_color // '#f06'
		this._world = arg_world

		// this._shapes = undefined
		this._config = undefined
		this._pendulum_length = 0

		this._factory = new Factory(this._world)

		this._load(arg_config)
	}


	
	_load(arg_config)
	{
		// console.log(context + ':_load:config=', arg_config)
		
		// CHECK CONFIG
		if ( ! T.isObject(arg_config) || ! T.isObject(arg_config.state) )
		{
			console.error(context + ':_load:bad config object')
			return
		}

		// this._shapes = {}
		this._config = {
			origin:undefined,
			shapes:{},
			links:[]
		}
		const origin = T.isObject(arg_config.state.origin) ? _.cloneDeep(arg_config.state.origin) : undefined
		const shapes = T.isObject(arg_config.state.shapes) ? _.cloneDeep(arg_config.state.shapes) : undefined

		this._config.origin = origin
		this._load_shape(origin, 'origin')

		let shapes_count = 0
		_.forEach(shapes,
			(shape, shape_name)=>{
				if ( this._load_shape(shape, shape_name) )
				{
					shapes_count++
				}
			}
		)
		assert(shapes_count > 0, context + ':_load:no loaded shape')

		this._load_links()
	}
	
	
	
	_load_shape(arg_shape_config, arg_shape_name)
	{
		console.log(context + ':_load_shape:name=%s config=%o', arg_shape_name, arg_shape_config)

		assert( T.isObject(arg_shape_config),        context + ':_load_shape: bad shape config')
		assert( T.isNotEmptyString(arg_shape_name),  context + ':_load_shape: bad shape name')

		const config = arg_shape_config ? _.merge({}, default_pendant, arg_shape_config) : _.cloneDeep(default_pendant)
		console.log(context + ':_load_shape:name=%s merged=%o', arg_shape_name, config)

		assert( T.isNotEmptyString(config.type),  context + ':_load_shape: bad type')

		assert( T.isObject(config.position),      context + ':_load_shape: bad position')
		assert( T.isNumber(config.position.x),    context + ':_load_shape: bad position.x')
		assert( T.isNumber(config.position.y),    context + ':_load_shape: bad position.y')
		
		assert( T.isObject(config.velocity),      context + ':_load_shape: bad velocity')
		assert( T.isNumber(config.velocity.vx),   context + ':_load_shape: bad velocity.vx')
		assert( T.isNumber(config.velocity.vy),   context + ':_load_shape: bad velocity.vy')

		assert( T.isBoolean(config.is_static),    context + ':_load_shape: bad is_static')

		// assert( T.isNotEmptyString(config.line_color), context + ':_load_shape: bad line color')
		// assert( T.isNotEmptyString(config.fill_color), context + ':_load_shape: bad fill color')
		assert( T.isNumber(config.line_width),    context + ':_load_shape: bad line width')

		assert( T.isObject(config.style),         context + ':_load_shape: bad style')
		assert( T.isNumber(config.mass),          context + ':_load_shape: bad mass')
		assert( T.isNumber(config.friction),      context + ':_load_shape: bad friction')
		assert( T.isNumber(config.restitution),   context + ':_load_shape: bad restitution')

		// assert( T.isNumber(config.link_length),    context + ':_load_shape: bad link length')
		// assert( T.isNumber(config.link_stiffness), context + ':_load_shape: bad link stiffness')
		// assert( T.isNotEmptyString(config.link_source),  context + ':_load_shape: bad linked source')

		config.style.fillStyle   = T.isNotEmptyString(config.fill_color) ? arg_shape_config.fill_color : false
		config.style.strokeStyle = T.isNotEmptyString(config.line_color) ? arg_shape_config.line_color : false
		config.style.lineWidth   = arg_shape_config.line_width

		config.name = arg_shape_name
		this._config.shapes[arg_shape_name] = config
		this.create(config)

		if ( T.isNumber(config.link_length) && T.isNumber(config.link_stiffness) && T.isNotEmptyString(config.link_source) )
		{
			this._config.links.push([config.link_source, arg_shape_name, config.link_stiffness, config.link_length])
		}

		return true
	}



	_load_links()
	{
		// console.log(context + ':_load_links')

		const verlet_constraints_config = {
			iterations: 1
		}
		this._rigid_constraints = window.Physics.behavior('verlet-constraints', verlet_constraints_config)

		this._config._sources = {}
		_.forEach(this._config.links,
			(link_record)=>{
				// console.log(context + ':_load_links:record=', link_record)

				if (! T.isArray(link_record) || link_record.length != 4)
				{
					return
				}
				const source_name = link_record[0]
				const target_name = link_record[1]
				const stiffness = link_record[2]
				const length = link_record[3]

				const source = this.get(source_name)
				const target = this.get(target_name)
				assert( T.isObject(source), context + ':_load_links: bad source for name [' + source_name + ']')
				assert( T.isObject(target), context + ':_load_links: bad target for name [' + target_name + ']')

				this._config._sources[target_name] = source_name

				this._rigid_constraints.distanceConstraint(source, target, stiffness, length)
				this._world.add(this._rigid_constraints)
			}
		)
	}



	get(arg_shape_name)
	{
		return this._factory.get(arg_shape_name)
		// return this._shapes[arg_shape_name]
	}


	/**
	 * origin->A->B->C
	 * 
	 */
	get_length(arg_src_name, arg_dest_name)
	{
		// console.log(context + ':get_length:src=%s dst=%s length=%d', arg_src_name, arg_dest_name, 0)

		if (arg_src_name == arg_dest_name)
		{
			return 0
		}

		let accumulator = 0
		let dest_name = arg_dest_name
		let dest_src_name = this._config._sources[dest_name]
		
		// console.log(context + ':get_length:dst=%s dst src=%s', dest_name, dest_src_name)

		while (dest_src_name && dest_name != dest_src_name)
		{

			const src = this._config.shapes[dest_name]
			// console.log(context + ':get_length:dst src=%o', src)

			const length = src && src.link_length ? src.link_length : 0
			accumulator += length

			dest_name = dest_src_name
			dest_src_name = this._config._sources[dest_src_name]
			// console.log(context + ':get_length:dst=%s dst src=%s length=%d', dest_name, dest_src_name, accumulator)
		}

		// console.log(context + ':get_length:src=%s dst=%s length=%d', arg_src_name, arg_dest_name, accumulator)
		return accumulator
	}



	create(arg_shape_config)
	{
		return this._factory.create(arg_shape_config)
	}



	draw()
	{
		const self = this
		// console.log(context + ':draw:enter')
		

		const style = {
			fillStyle: false,
			strokeStyle: '#dc322f',
			lineWidth: 1,
			globalAlpha:1,
			angleIndicator: false
		}

		const origin_name = 'origin' // TODO
		const target_name = 'ball1' // TODO
		const anchor = this.get(origin_name)
		const target = this.get(target_name)
		
		this._covered_points = []
		self._pendulum_length = this.get_length(origin_name, target_name)

		const on_render_fn = (data)=>{
			// console.log('on_render_fn', data)

			const constraints = self._rigid_constraints.getConstraints().distanceConstraints
			let c = undefined

			for (let i = 0, l = constraints.length; i < l; ++i )
			{
				c = constraints[ i ];
				// console.log('on_render_fn i=%d c', i, c)
				self._world._renderer.drawLine(c.bodyA.state.pos, c.bodyB.state.pos, 'rgba(100, 100, 100, 0.5)');
			}

			// DRAW BALLS PATH
			if ( anchor.state.pos.dist(target.state.pos) <= self._pendulum_length + 5)
			{
				this._covered_points.push( { x:target.state.pos.x, y:target.state.pos.y } )
			}
			
			// DRAW HISTORY PATH
			// console.log('on_render_fn points=', this._covered_points)
			let prev_pos = this._covered_points[0]
			for(let p = 1 ; p < this._covered_points.length ; p++)
			{
				const pos = this._covered_points[p]
				self._world._renderer.drawLine(prev_pos, pos, style)
				prev_pos = pos
			}
		}
		const on_render_scratch_fn = (scratch, data)=>{
			// console.log('on_render_scratch_fn', data)
			on_render_fn(data)
		}
		this._world.on('render', Physics.scratchpad(on_render_scratch_fn))
		// this._world.on('render', on_render_fn)

		this._world.on(
			{
				'interact:poke': function(arg_pos) {
					// BUTTONS
					if (arg_pos.x < 100 && arg_pos.y < 30)
					{
						// console.log('poke on buttons')
						return false
					}
					const pos_vector = new window.Physics.vector(arg_pos.x, arg_pos.y)
					if ( anchor.state.pos.dist(pos_vector) > self._pendulum_length)
					{
						const angle = pos_vector.angle(anchor.state.pos)
						// console.log('interact:angle=%d', angle, angle)

						pos_vector.x = anchor.state.pos.x + Math.cos(angle) * (self._pendulum_length)
						pos_vector.y = anchor.state.pos.y + Math.sin(angle) * (self._pendulum_length)
					}
					target.state.pos = pos_vector
					self._covered_points = [ { x:target.state.pos.x, y:target.state.pos.y } ]
				}
			}
		)

		// console.log(context + ':draw:leave')
	}
}
