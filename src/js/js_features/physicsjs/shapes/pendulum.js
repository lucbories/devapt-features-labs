
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

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
	color:"...",
	style:{},
	mass:1,
	friction:0.3
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
	color:"...",
	style:{},
	mass:1,
	friction:0.3,
	linkLength:100,
	linkSource:"origin"
}


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
 *					color:"...",
 * 					style:{},
 * 					mass:1,
 * 					friction:0.3
 * 				},
 * 				shapes:{
 * 					ball1:{
 * 						type:"circle",
 * 						position:{
 * 							x:200,
 * 							y:150
 * 						},
 * 						is_static:false,
 * 						color:"...",
 * 						style:{},
 * 						mass:1,
 * 						friction:0.3,
 * 						linkStiffness:0.3,
 * 						linkLength:100,
 * 						linkSource:"origin"
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
		this.is_physicsjs_shapes_pendulum = true

		this._color = arg_color // '#f06'
		this._world = arg_world

		this._shapes = undefined
		this._config = undefined
		this._load(arg_config)
	}


	
	_load(arg_config)
	{
		this._shapes = {}
		this._config = {
			origin:undefined,
			shapes:{},
			links:[]
		}
		const origin = T.isObject(arg_config) && T.isObject(arg_config.origin) ? _.cloneDeep(arg_config.origin) : undefined
		const shapes = T.isObject(arg_config) && T.isObject(arg_config.shapes) ? _.cloneDeep(arg_config.shapes) : undefined

		this._load_origin(origin)

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
	}



	_load_origin(arg_origin_config)
	{
		const config = arg_origin_config ? _.merge(arg_origin_config, default_origin) : _.cloneDeep(default_origin)
		this._config.origin = config

		assert( T.isNotEmptyString(this._config.origin.type),  context + ':_load_origin: bad type')

		assert( T.isObject(this._config.origin.position),      context + ':_load_origin: bad position')
		assert( T.isNumber(this._config.origin.position.x),    context + ':_load_origin: bad position.x')
		assert( T.isNumber(this._config.origin.position.y),    context + ':_load_origin: bad position.y')

		assert( T.isObject(this._config.origin.velocity),      context + ':_load_origin: bad velocity')
		assert( T.isNumber(this._config.origin.velocity.vx),   context + ':_load_origin: bad velocity.vx')
		assert( T.isNumber(this._config.origin.velocity.vy),   context + ':_load_origin: bad velocity.vy')

		assert( T.isBoolean(this._config.origin.is_static),    context + ':_load_origin: bad is_static')
		assert( T.isNotEmptyString(this._config.origin.color), context + ':_load_origin: bad color')
		assert( T.isObject(this._config.origin.style),         context + ':_load_origin: bad style')
		assert( T.isNumber(this._config.origin.mass),          context + ':_load_origin: bad mass')
		assert( T.isNumber(this._config.origin.friction),      context + ':_load_origin: bad friction')

		this._config.origin.name = 'origin'
		this.create(this._config.origin)
	}
	
	
	
	_load_shape(arg_shape_config, arg_shape_name)
	{
		assert( T.isObject(arg_shape_config),        context + ':_load_shape: bad shape config')
		assert( T.isNotEmptyString(arg_shape_name),  context + ':_load_shape: bad shape name')

		const config = arg_shape_config ? _.merge(arg_shape_config, default_shape) : _.cloneDeep(default_shape)

		assert( T.isNotEmptyString(config.type),  context + ':_load_shape: bad type')

		assert( T.isObject(config.position),      context + ':_load_shape: bad position')
		assert( T.isNumber(config.position.x),    context + ':_load_shape: bad position.x')
		assert( T.isNumber(config.position.y),    context + ':_load_shape: bad position.y')
		
		assert( T.isObject(config.velocity),      context + ':_load_shape: bad velocity')
		assert( T.isNumber(config.velocity.vx),   context + ':_load_shape: bad velocity.vx')
		assert( T.isNumber(config.velocity.vy),   context + ':_load_shape: bad velocity.vy')

		assert( T.isBoolean(config.is_static),    context + ':_load_shape: bad is_static')
		assert( T.isNotEmptyString(config.color), context + ':_load_shape: bad color')
		assert( T.isObject(config.style),         context + ':_load_shape: bad style')
		assert( T.isNumber(config.mass),          context + ':_load_shape: bad mass')
		assert( T.isNumber(config.friction),      context + ':_load_shape: bad friction')
		assert( T.isNumber(config.linkLength),    context + ':_load_shape: bad link length')
		assert( T.isNumber(config.linkStiffness), context + ':_load_shape: bad link stiffness')
		assert( T.isNotEmptyString(config.linkSource),  context + ':_load_shape: bad linked source')

		this._config.shapes[arg_shape_name] = config
		this._config.links.push([config.linkSource, arg_shape_name, config.linkStiffness, config.linkLength])
	}



	_load_links()
	{
		const verlet_constraints_config = {
			iterations: 1
		}
		const rigid_constraints = window.Physics.behavior('verlet-constraints', verlet_constraints_config)

		_.forEach(this._config.links,
			(link_record)=>{
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

				rigid_constraints.distanceConstraint(source, target, stiffness, length)
				this._world.add(rigidConstraints)
			}
		)
	}


	get(arg_shape_name)
	{
		return this._shapes[arg_shape_name]
	}


	create(arg_shape_config)
	{
		// GET TYPE
		const type = arg_shape_cfg.type
		if ( ! T.isNotEmptyString(type) )
		{
			return undefined
		}
		
		// LOOKUP TYPE CLASS
		switch( type.toLocaleLowerCase() ) {
			case 'circle': {
				const cfg_radius = T.isNumber(arg_shape_cfg.radius) && arg_shape_cfg.radius > 0 ? arg_shape_cfg.radius : 10
				// console.log(context + ':process_scene_item:circle radius=[%d] color=[%s]:', radius, color, position)

				const shape = window.Physics.body('circle', {
					// BODY
					hidden: false,
					x: arg_shape_config.position.x,
					y: arg_shape_config.position.y,
					
					vx: arg_shape_config.velocity.vx,
					vy: arg_shape_config.velocity.vy,
					
					treatment:arg_shape_config.is_static,
					
					mass:arg_shape_config.mass,

					// body restitution. How "bouncy" is it?
					restitution: 1.0,

					// what is its coefficient of friction with another surface with COF = 1? (default=0.8)
					cof: 0.1,

					// what is the view object (mixed) that should be used when rendering?
					view: null,

					// the vector offsetting the geometry from its center of mass
					offset: Physics.vector(0,0),

					// CIRCLE
					radius: cfg_radius
				});
				this._world.add(shape)

				this._shapes[name] = shape
				return shape
			}
		}
	}


/*
	draw()
	{
		console.log(context + ':draw')

		// const pos_h = this.pos_h()
		// const pos_v = this.pos_v()
		// const diameter_h = this.domain_h().range_to_screen(2 * this._radius)
		// const diameter_v = this.domain_v().range_to_screen(2 * this._radius)
		// const diameter = Math.min(diameter_h, diameter_v)

		// this._shape = this.space().svg()
		// .circle(diameter)
		// .move(pos_h, pos_v)
		// // .fill('none')

		// if (this._color)
		// {
		// 	this._shape.fill(this._color)
		// }

		const anchor_ball1 = 150
		const ball1_ball2 = 150
		const colors = [
			'#b58900',
			'#cb4b16',
			'#dc322f',
			'#d33682',
			'#6c71c4',
			'#268bd2',
			'#2aa198',
			'#859900'
		]
		var rigidConstraints = window.Physics.behavior('verlet-constraints', {
			iterations: 1
		})

		this._covered_points = []
		// this._covered_points.push( { x:450, y:50} )


		var anchor = window.Physics.body('circle', {
			// BODY
			// is the body hidden (not to be rendered)?
			hidden: false,
			x: 400, // x-coordinate
			y: 320, // y-coordinate
			vx: 0, // velocity in x-direction
			vy: 0, // velocity in y-direction
			// is the body `dynamic`, `kinematic` or `static`?
    		// http://www.box2d.org/manual.html#_Toc258082973
			treatment:'static',
			mass:1.0,
			// body restitution. How "bouncy" is it?
			restitution: 1.0,
			// what is its coefficient of friction with another surface with COF = 1? (default=0.8)
			cof: 0.1,
			// what is the view object (mixed) that should be used when rendering?
			view: null,
			// the vector offsetting the geometry from its center of mass
			offset: Physics.vector(0,0),
			// CIRCLE
			radius: 5
		});
		this._world.add(anchor)

		const perimeter = window.Physics.body('circle', {
			// BODY
			// is the body hidden (not to be rendered)?
			hidden: false,
			x: anchor.state.pos.x, // x-coordinate
			y: anchor.state.pos.y, // y-coordinate
			vx: 0, // velocity in x-direction
			vy: 0, // velocity in y-direction
			// is the body `dynamic`, `kinematic` or `static`?
    		// http://www.box2d.org/manual.html#_Toc258082973
			treatment:'static',
			mass:1.0,
			// body restitution. How "bouncy" is it?
			restitution: 1.0,
			// what is its coefficient of friction with another surface with COF = 1? (default=0.8)
			cof: 0.1,
			// what is the view object (mixed) that should be used when rendering?
			view: null,
			// the vector offsetting the geometry from its center of mass
			offset: Physics.vector(0,0),
			// CIRCLE
			radius: anchor_ball1 + ball1_ball2,
			styles: {
				fillStyle: colors[5],
				angleIndicator: false
			}
		});
		this._world.add(perimeter)

		var ball1 = window.Physics.body('circle', {
			cof: 0.2,
			x: anchor.state.pos.x, // x-coordinate
			y: anchor.state.pos.y + anchor_ball1, // y-coordinate
			vx: 0.2, // velocity in x-direction
			vy: 0.01, // velocity in y-direction
			radius: 20,
			styles: {
				fillStyle: colors[0],
				angleIndicator: false
			}
		});
		this._world.add(ball1)

		rigidConstraints.distanceConstraint(anchor, ball1, 0.3, anchor_ball1)
		this._world.add(rigidConstraints)


		var ball2 = window.Physics.body('circle', {
			cof: 0.2,
			x: anchor.state.pos.x + ball1_ball2, // x-coordinate
			y: anchor.state.pos.y + anchor_ball1 + ball1_ball2 / 2, // y-coordinate
			vx: 0.2, // velocity in x-direction
			vy: 0.01, // velocity in y-direction
			radius: 20,
			styles: {
				fillStyle: colors[1],
				angleIndicator:false //  r === 30 ? 'rgba(0,0,0,0.6)' : 
			}
		});
		this._world.add(ball2)

		rigidConstraints.distanceConstraint(ball1, ball2, 0.3, ball1_ball2)
		this._world.add(rigidConstraints)

		
		var gravity = window.Physics.behavior('constant-acceleration', {
			acc: { x : 0, y: 0.0004 } // this is the default
		});
		this._world.add( gravity )

		// later... flip the world upside down!
		// gravity.setAcceleration({ x: 0, y: -0.0004 });

		const self = this
		const style = {
			fillStyle: false,
			strokeStyle: colors[3],
			lineWidth: 1,
			globalAlpha:1,
			angleIndicator: false
		}
		const on_render_fn = (data)=>{
			// console.log('on_render_fn', data)
			const constraints = rigidConstraints.getConstraints().distanceConstraints
			let c = undefined

			for (let i = 0, l = constraints.length; i < l; ++i )
			{
				c = constraints[ i ];
				// console.log('on_render_fn i=%d c', i, c)
				self._world._renderer.drawLine(c.bodyA.state.pos, c.bodyB.state.pos, 'rgba(100, 100, 100, 0.5)');
			}

			// DRAW BALL 2 PATH
			if ( anchor.state.pos.dist(ball2.state.pos) <= anchor_ball1 + ball1_ball2 + 5)
			{
				this._covered_points.push( { x:ball2.state.pos.x, y:ball2.state.pos.y } )
			}
			
			// console.log('on_render_fn points=', this._covered_points)
			// self._world._renderer.drawPolygon(this._covered_points, style)
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
			// scratch.done()
		}
		this._world.on('render', Physics.scratchpad(on_render_scratch_fn))
		// this._world.on('render', on_render_fn)

		this._world.on(
			{
				'interact:poke': function(arg_pos) {
					const pos_vector = new window.Physics.vector(arg_pos.x, arg_pos.y)
					if ( anchor.state.pos.dist(pos_vector) > anchor_ball1 + ball1_ball2)
					{
						const angle = pos_vector.angle(anchor.state.pos)
						console.log('interact:angle=%d', angle, angle)
						pos_vector.x = anchor.state.pos.x + Math.cos(angle) * (anchor_ball1 + ball1_ball2)
						pos_vector.y = anchor.state.pos.y + Math.sin(angle) * (anchor_ball1 + ball1_ball2)
					}
					ball2.state.pos = pos_vector
					self._covered_points = [ { x:ball2.state.pos.x, y:ball2.state.pos.y } ]
				}
			}
		)

		return this
	}*/
}
