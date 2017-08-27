
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS
import Canvas from '../../../base/components/canvas'
import Factory from '../shapes/factory'
// import PhysicsJS from '../../../../../bower_components/PhysicsJS/dist/physicsjs-fill'


const plugin_name = 'Labs' 
const context = plugin_name + '/canvas_physicsjs'



export default class CanvasPhysicsJS extends Canvas
{
	/**
	 * Create an instance.
	 * 
	 * 	API:
	 *      ->...
	 * 
	 * @param {object} arg_runtime     - client runtime.
	 * @param {object} arg_state       - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{	
		super(arg_runtime, arg_state, arg_log_context ? arg_log_context : context)

		this.is_canvas = true
		
		this.add_assets_dependancy('js-physicsjs')

		this._world = undefined
		this._factory = undefined

		// this.enable_trace()
	}
	


	/**
	 * Prepare drawing space.
	 * 
	 * @param {string} 	arg_dom_id - DOM element id.
	 * @param {number} arg_width - DOM element width.
	 * @param {number} arg_height - DOM element height.
	 * @param {object} arg_space - drawing space configuration.
	 * @param {object} arg_scene - drawing shapes.
	 * 
	 * @returns {nothing}
	 */
	prepare_space(arg_dom_id, arg_width, arg_height, arg_space, arg_scene)
	{
		super.prepare_space(arg_dom_id, arg_width, arg_height, arg_space, arg_scene)
		
		const world_config = {
			// set the timestep
			timestep: 1000.0 / 160,

			// maximum number of iterations per step
			maxIPF: 16,
			
			// set the integrator (may also be set with world.add())
			integrator: 'verlet'
		}

		window.Physics(world_config,
			(world)=>{
				this._world = world
			}
		)

		const renderer_config = {
			el: arg_dom_id,
			autoResize : false,
			width: arg_width,
			height: arg_height,
			debug:true,
			meta: false, // don't display meta data
			styles: {
				// set colors for the circle bodies
				'circle' : {
					strokeStyle: '#351024',
					lineWidth: 1,
					fillStyle: '#d33682',
					angleIndicator: '#351024'
				}
			}
		}

		const renderer = window.Physics.renderer('canvas', renderer_config)

		// add the renderer
		this._world.add( renderer )

		// render on each step
		this._world.on('step',
			()=>{
				this._world.render();
			}
		)

		// bounds of the window
		const viewportBounds = window.Physics.aabb(0, 0, arg_width, arg_height)
		
		// constrain objects to these bounds
		// add things to the world
		this._world.add(
			[
				Physics.behavior('interactive', { el: renderer.container }),
				Physics.behavior('constant-acceleration')
				,Physics.behavior('body-impulse-response')
				,Physics.behavior('sweep-prune')
				,Physics.behavior('edge-collision-detection', {
					aabb: viewportBounds,
					restitution: 0.99,
					cof: 0.99
				})
			]
		)

		this._factory = new Factory(this._world)
	}
	


	/**
	 * Process drawing item.
	 * 
	 * @param {object} arg_scene_item - scene item to draw.
	 * 
	 * @returns {nothing}
	 */
	process_scene_item(arg_scene_item)
	{
		super.process_scene_item(arg_scene_item)
		
		const shape = this.create(arg_scene_item)
		console.log(context + ':process_scene_item:shape', shape)
		
		shape && shape.draw()

		// this._factory.create(arg_scene_item)
/*
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
		var rigidConstraints = Physics.behavior('verlet-constraints', {
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
		)*/
	}
	


	/**
	 * Finish drawing space.
	 * 
	 * @returns {nothing}
	 */
	finish_space()
	{
		console.log(context + ':finish_space')
		
		this._world.render()

		// subscribe to ticker to advance the simulation
		window.Physics.util.ticker.on(
			(time, dt)=>{
			this._world.step(time)
		})

		// start the ticker
		window.Physics.util.ticker.start()
	}


	create(arg_config)
	{
		return this._factory ? this._factory.create(arg_config) : undefined
	}
}
