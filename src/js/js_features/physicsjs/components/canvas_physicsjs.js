
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
		this._gravity = undefined

		// this.enable_trace()
	}
	
	

	/**
	 * Create a new shape from a configuration using a hidden factory.
	 * 
	 * @param {object} arg_config - shape configuration plain object.
	 * 
	 * returns {object} - created shape. 
	 */
	create(arg_config)
	{
		if (this._factory)
		{
			return this._factory.create(arg_config)
		}
		return undefined
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
		
		// CONFIGURE WORLD
		const cfg_timestep = T.isNumber(arg_space.steps) ? arg_space.steps : 10
		const cfg_max_iterations_per_step = T.isNumber(arg_space.step_iterations) ? arg_space.step_iterations : 4

		const world_config = {
			timestep:cfg_timestep,
			maxIPF:cfg_max_iterations_per_step,
			
			// set the integrator (may also be set with world.add())
			integrator: 'verlet',

			// is sleeping disabled?
			sleepDisabled: false,

			// speed at which bodies wake up
			sleepSpeedLimit: 0.1,

			// variance in position below which bodies fall asleep
			sleepVarianceLimit: 2,

			// time (ms) before sleepy bodies fall asleep
			sleepTimeLimit: 500
		}

		window.Physics(world_config,
			(world)=>{
				this._world = world
			}
		)


		// CONFIGURE WORLD RENDERER
		const cfg_styles = T.isNumber(arg_space.styles) ? arg_space.styles : {}

		const renderer_config = {
			el: arg_dom_id,
			autoResize : false,
			width: arg_width,
			height: arg_height,
			debug:false,
			meta: false,
			styles: cfg_styles
		}

		const renderer = window.Physics.renderer('canvas', renderer_config)
		this._world.add( renderer )
		this._world.on('step',
			()=>{
				this._world.render();
			}
		)

		// bounds of the window
		const viewportBounds = window.Physics.aabb(0, 0, arg_width, arg_height)
		

		// CONFIGURE WORLD BEHAVIORS
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


		// CONFIGURE GRAVITY
		const pixels_per_meter = T.isNumber(arg_space.pixels_per_meter) ? arg_space.pixels_per_meter : 41
		this.update_gravity(arg_space.gratity, pixels_per_meter)

		
		// CREATE SHAPES FACTORY
		this._factory = new Factory(this._world)
	}

	
	
	/**
	 * Update gravity.
	 * 
	 * PhysicsJS help:
	 * 
	 *	Jasper gives the units as 0.0004 px/ms/ms (or px/ms^2). Knowing the units makes this conversion pretty straightforward using unit cancellation. First we convert that figure to px/s^2:
	 *
	 *	0.0004 px/ms^2 * 1000 ms/s * 1000 ms/s = 400 px/s^2
	 *
	 *	Since we know that gravity on Earth is ~9.8 m/s^2, this means that the default value is simulating a scale of:
	 *
	 *	400 px/s^2 * (1/9.8) s^2/m ~= 41 px/m
	 *
	 *	So with the default setting, PhysicsJS is simulating a world where a meter is 41 pixels long.
	 *
	 *	If we use your example where "a 180 centimetres person is 50 pixels tall", then we are converting to a scale of:
	 *
	 *	50px / 0.180m ~= 278px/m
	 *
	 *	Convert this back to px/ms^2 with an acceleration of 9.8 m/s^2 and you get:
	 *
	 *	278 px/m * 9.8 m/s^2 * (1/1000) s/ms * (1/1000) s/ms ~= 0.00272 px/ms^2
	 *
	 *	So, to simulate a world where a 180cm person is 50px tall, you'd use 0.00272 for the PhysicsJS y-acceleration parameter.
	 *
	 *	For 41 pixels per meter:
	 *	Earth:    g=9.807 m/s²		=> 9.807*41 px/s² = 402.087 px/s² = 0,000402087 px/ms²
	 *	Moon:     g=1.623 m/s²
	 *	Mars:     g=3.722 m/s²
	 *	Venus:    g=8.858 m/s²
	 *	Mercury:  g=3.697 m/s²
	 *	Sun:      g=273.614 m/s²
	 *	Jupiter:  g=25.885 m/s²
	 *	Saturn:   g=11.171 m/s²
	 *	Uranus:   g=8.995 m/s²
	 *	Neptune:  g=11.257 m/s²
	 *	Pluto:    g=0.583 m/s²
	 *
	 * @param {number|string} arg_gravity_cfg - gravity planet or gravity simulation value.
	 * @param {number} arg_pixels_per_meter - count of pixels per number.
	 * 
	 * @return {nothing}
	 */
	update_gravity(arg_gravity_cfg, arg_pixels_per_meter=41)
	{
		if ( T.isNotEmptyString(arg_gravity_cfg) )
		{
			const pixels_per_meter = T.isNumber(arg_pixels_per_meter) ? arg_pixels_per_meter : 41

			switch(arg_gravity_cfg.toLocaleLowerCase()) {
				case 'earth':   arg_gravity_cfg = 9.807*pixels_per_meter/1000/1000; break // 0.0004
				case 'moon':    arg_gravity_cfg = 1.623*pixels_per_meter/1000/1000; break
				case 'mars':    arg_gravity_cfg = 3.722*pixels_per_meter/1000/1000; break
				case 'venus':   arg_gravity_cfg = 8.858*pixels_per_meter/1000/1000; break
				case 'sun':     arg_gravity_cfg = 273.614*pixels_per_meter/1000/1000; break
				case 'jupiter': arg_gravity_cfg = 25.885*pixels_per_meter/1000/1000; break
				case 'saturn':  arg_gravity_cfg = 11.171*pixels_per_meter/1000/1000; break
				case 'uranus':  arg_gravity_cfg = 8.995*pixels_per_meter/1000/1000; break
				case 'neptune': arg_gravity_cfg = 11.257*pixels_per_meter/1000/1000; break
				case 'pluto':   arg_gravity_cfg = 0.583*pixels_per_meter/1000/1000; break
			}
		}
		const cfg_gratity_y = T.isNumber(arg_gravity_cfg) ? arg_gravity_cfg : 0.0004
		
		if (! this._gravity)
		{
			this._gravity = window.Physics.behavior('constant-acceleration',
				{
					acc: { x : 0, y: cfg_gratity_y }
				}
			)
			this._world.add( this._gravity )
			return
		}

		this._gravity.setAcceleration( { x : 0, y: cfg_gratity_y } )
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
		// console.log(context + ':process_scene_item:shape', shape)
		
		shape && shape.draw()
	}
	


	/**
	 * Finish drawing space.
	 * 
	 * @returns {nothing}
	 */
	finish_space()
	{
		// console.log(context + ':finish_space')
		
		this.render_buttons()

		this._world.render()

		// subscribe to ticker to advance the simulation
		const step = 50 // MINIMAL INTERVAL BETWEEN TWO STEPS
		let previous = 0
		window.Physics.util.ticker.on(
			(time, dt)=>{
				if (time - previous > step)
				{
					this._world.step(time)
					previous = time
				}
			}
		)

		// start the ticker
		window.Physics.util.ticker.start()
	}
	


	/**
	 * Render animation buttons.
	 * 
	 * @returns {nothing}
	 */
	render_buttons()
	{
		console.log(context + ':render_buttons')

		let scene_item = {
			type:'button-start',
			name:'button_animation_start',
			position:{
				x:10,
				y:10
			},
			velocity:{
				vx:0,
				vy:0
			},
			is_static:true,
			color:null,
			fill_color:'blue',
			line_color:'red',
			line_width:2
		}
		const button_start = this.create(scene_item)
		button_start && button_start.draw && button_start.draw()


		scene_item = {
			type:'button-stop',
			name:'button_animation_stop',
			position:{
				x:40,
				y:10
			},
			velocity:{
				vx:0,
				vy:0
			},
			is_static:true,
			color:null,
			fill_color:'blue',
			line_color:'red',
			line_width:2
		}
		const button_stop = this.create(scene_item)
		button_stop && button_stop.draw && button_stop.draw()


		scene_item = {
			type:'button-reset',
			name:'button_animation_reset',
			position:{
				x:70,
				y:10
			},
			velocity:{
				vx:0,
				vy:0
			},
			is_static:true,
			color:null,
			fill_color:'blue',
			line_color:'red',
			line_width:2
		}
		const button_reset = this.create(scene_item)
		button_reset && button_reset.draw && button_reset.draw()
		
		const poke_fn = function(arg_pos) {
			// BUTTONS
			// if (arg_pos.x < 100 && arg_pos.y < 30)
			// {
			// 	console.log('release on buttons')
				if (arg_pos.body && arg_pos.body.uid == button_start.uid)
				{
					arg_pos.body.state.pos.x = 10
					arg_pos.body.state.pos.y = 10
					self.start()
					return
				}
				if (arg_pos.body && arg_pos.body.uid == button_stop.uid)
				{
					arg_pos.body.state.pos.x = 40
					arg_pos.body.state.pos.y = 10
					self.stop()
					return
				}
				if (arg_pos.body && arg_pos.body.uid == button_reset.uid)
				{
					arg_pos.body.state.pos.x = 70
					arg_pos.body.state.pos.y = 10
					console.log('grab on button reset')
					return
				}
				// return
			// }
		}
		const self = this
		this._world.on(
			{
				'interact:grab': poke_fn,
				'interact:poke': poke_fn,
				'interact:move': poke_fn,
				'interact:release': function(arg_pos) {
					// BUTTONS
					// if (arg_pos.x < 100 && arg_pos.y < 30)
					// {
						console.log('release on buttons')
						if (arg_pos.body && arg_pos.body.uid == button_start.uid)
						{
							arg_pos.body.state.pos.x = 10
							arg_pos.body.state.pos.y = 10
							self.start()
							return
						}
						if (arg_pos.body && arg_pos.body.uid == button_stop.uid)
						{
							arg_pos.body.state.pos.x = 40
							arg_pos.body.state.pos.y = 10
							self.stop()
							return
						}
						if (arg_pos.body && arg_pos.body.uid == button_reset.uid)
						{
							arg_pos.body.state.pos.x = 70
							arg_pos.body.state.pos.y = 10
							console.log('release on button reset')
							return
						}
					// }
				}
			}
		)
	}
	


	/**
	 * Animation start.
	 * 
	 * @returns {nothing}
	 */
	start()
	{
		console.log(context + ':animation start')
		window.Physics.util.ticker.start()
	}
	


	/**
	 * Animation stop.
	 * 
	 * @returns {nothing}
	 */
	stop()
	{
		console.log(context + ':animation stop')
		window.Physics.util.ticker.stop()
	}
}
