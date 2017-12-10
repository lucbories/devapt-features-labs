// NPM IMPORTS
import assert from 'assert'
import path from 'path'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import RenderingPlugin        from 'devapt-core-common/dist/js/plugins/rendering_plugin'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'

// PLUGIN IMPORTS

// BASE FEATURE
import lab_fn                from './base/rendering_functions/lab'
import workspace_fn          from './base/rendering_functions/workspace'
import workspace_about_fn    from './base/rendering_functions/workspace_about'
import workspace_manuals_fn  from './base/rendering_functions/workspace_manuals'
import workspace_sources_fn  from './base/rendering_functions/workspace_sources'
import workspace_projects_fn from './base/rendering_functions/workspace_projects'
import Canvas                from './base/components/canvas'
// import Lab                   from './base/components/lab'
import Workspace             from './base/components/workspace'

// TERMINAL FEATURE
import Terminal                from './js_features/terminal/components/terminal'
import FeaturedTerminal        from './js_features/terminal/components/featured_terminal'
import terminal_fn             from './js_features/terminal/rendering_functions/terminal'
import terminal_workspace_fn   from './js_features/terminal/rendering_functions/terminal_workspace'

// ALGEBRITE FEATURE
import TerminalAlgebrite       from './js_features/algebrite/components/terminal_algebrite'
import terminal_algebrite_fn   from './js_features/algebrite/rendering_functions/terminal_algebrite'

// MATHJS FEATURE
import TerminalMathJS          from './js_features/mathjs/components/terminal_mathjs'
import terminal_mathjs_fn      from './js_features/mathjs/rendering_functions/terminal_mathjs'
import terminal_mathjs_plot_fn from './js_features/mathjs/rendering_functions/terminal_mathjs_plot'

// FUNCTION PLOT FEATURE
import FunctionPlot            from './js_features/function_plot/components/function_plot'
import function_plot_fn        from './js_features/function_plot/rendering_functions/function_plot'

// MATH PRETTY FEATURE
import MathPretty              from './js_features/math_pretty/components/math_pretty'

// PHYSICSJS FEATURE
import CanvasPhysicsJS         from './js_features/physicsjs/components/canvas_physicsjs'

// MATTERJS FEATURE
import CanvasMatterJS          from './js_features/matterjs/components/canvas_matterjs'

// SVGJS FEATURE
import CanvasSvgJS             from './js_features/svgjs/components/canvas_svgjs'


const plugin_name = 'Labs' 
const context = 'labs/rendering_plugin'



/**
 * Rendering plugin class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LabsRenderingPlugin extends RenderingPlugin
{
	/**
	 * Create a LabsRenderingPlugin instance.
	 * 
	 * @param {PluginsManager} arg_manager - plugins manager.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_manager)
	{
		super(arg_runtime, arg_manager, plugin_name, '1.0.0')

		// const assets_dir = '../../public/assets'
		const bower_dir = '../../bower_components'

		this.add_public_asset('js', '/' + plugin_name + '/algebrite.js',          path.join(__dirname, bower_dir, 'Algebrite/dist/algebrite.bundle-for-browser.js') )
		this.add_public_asset('js', '/' + plugin_name + '/crossfilter.js',        path.join(__dirname, bower_dir, 'crossfilter2/crossfilter.js') )

		this.add_public_asset('js', '/' + plugin_name + '/svg.js',                path.join(__dirname, bower_dir, 'svg.js/dist/svg.js') )
		this.add_public_asset('js', '/' + plugin_name + '/svg.min.js',            path.join(__dirname, bower_dir, 'svg.js/dist/svg.min.js') )

		this.add_public_asset('js', '/' + plugin_name + '/physicsjs.js',          path.join(__dirname, bower_dir, 'PhysicsJS/dist/physicsjs-full.js') )

		this.add_public_asset('js', '/' + plugin_name + '/matterjs.js',           path.join(__dirname, bower_dir, 'Matter/build/matter.js') )
		this.add_public_asset('js', '/' + plugin_name + '/matterjs.min.js',       path.join(__dirname, bower_dir, 'Matter/build/matter.min.js') )
		
		this.add_public_asset('js', '/' + plugin_name + '/d3.js',                 path.join(__dirname, bower_dir, 'd3-v3.5.17/d3.js') )
		// this.add_public_asset('js', '/' + plugin_name + '/d3.js',                 path.join(__dirname, bower_dir, 'd3-v3.5.5/d3.js') )
		
		this.add_public_asset('js', '/' + plugin_name + '/function-plot.js',      path.join(__dirname, bower_dir, 'function-plot/function-plot@1.17.3.js') )
		// this.add_public_asset('js', '/' + plugin_name + '/function-plot.js',      path.join(__dirname, bower_dir, 'function-plot/dist/function-plot.js') )
		// this.add_public_asset('js', '/' + plugin_name + '/function-plot.js',      path.join(__dirname, bower_dir, 'function-plot-v1.14.0/dist/function-plot.js') )
		
		this.add_public_asset('js', '/' + plugin_name + '/jquery.js',             path.join(__dirname, bower_dir, 'jquery/dist/jquery.js') )
		this.add_public_asset('js', '/' + plugin_name + '/llang.js',              path.join(__dirname, bower_dir, 'llang/llang.js') )
		this.add_public_asset('js', '/' + plugin_name + '/mathjs.js',             path.join(__dirname, bower_dir, 'mathjs/dist/math.js') )
		this.add_public_asset('js', '/' + plugin_name + '/sylvester.js',          path.join(__dirname, bower_dir, 'sylvester/sylvester.js') )
		this.add_public_asset('js', '/' + plugin_name + '/synaptic.js',           path.join(__dirname, bower_dir, 'synaptic/synaptic.js') )
		this.add_public_asset('js', '/' + plugin_name + '/whitestorm.js',         path.join(__dirname, bower_dir, 'whs/build/whitestorm.js') )

		this.add_public_asset('js', '/' + plugin_name + '/katex.js',              path.join(__dirname, bower_dir, 'katex/dist/katex.js') )
		this.add_public_asset('css', '/' + plugin_name + '/katex.css',            path.join(__dirname, bower_dir, 'katex/dist/katex.css') )

		// this.add_public_asset('js', '/' + plugin_name + '/mathjax.js',            path.join(__dirname, bower_dir, 'MathJax-master/MathJax.js') )
		
		this.add_public_asset('js', '/extensions/MathMenu.js',           path.join(__dirname, bower_dir, 'MathJax-master/extensions/MathMenu.js?V2.7.0') )
		this.add_public_asset('js', '/extensions/MathZoom.js',           path.join(__dirname, bower_dir, 'MathJax-master/extensions/MathZoom.js?V2.7.0') )
		
		this.add_public_asset('js', '/' + plugin_name + '/dcjs.js',               path.join(__dirname, bower_dir, 'dcjs/dc.js') )
		this.add_public_asset('css', '/' + plugin_name + '/dcjs.css',             path.join(__dirname, bower_dir, 'dcjs/dc.css') )

		this.add_public_asset('js', '/' + plugin_name + '/jquery.terminal.js',    path.join(__dirname, bower_dir, 'jquery.terminal/js/jquery.terminal.min.js') )
		this.add_public_asset('js', '/' + plugin_name + '/jquery.mousewheel.js',  path.join(__dirname, bower_dir, 'jquery.terminal/js/jquery.mousewheel-min.js') )
		this.add_public_asset('css', '/' + plugin_name + '/jquery.terminal.css',  path.join(__dirname, bower_dir, 'jquery.terminal/css/jquery.terminal.min.css') )

		this.add_public_asset('js', '/' + plugin_name + '/metricsgraphics.js',    path.join(__dirname, bower_dir, 'metrics-graphics/dist/metricsgraphics.js') )
		this.add_public_asset('css', '/' + plugin_name + '/metricsgraphics.css',  path.join(__dirname, bower_dir, 'metrics-graphics/dist/metricsgraphics.css') )

		this.add_public_asset('js', '/' + plugin_name + '/vis.js',                path.join(__dirname, bower_dir, 'vis/dist/vis.js') )
		this.add_public_asset('css', '/' + plugin_name + '/vis.css',              path.join(__dirname, bower_dir, 'vis/dist/vis.css') )
	
		const devapt_browser_dir = '../../node_modules/devapt-core-browser/public'
		this.add_public_asset('js', '/' + plugin_name + '/devapt-browser.js',     path.join(__dirname, devapt_browser_dir, 'js/build/devapt-core-browser.js') )
		this.add_public_asset('js', '/' + plugin_name + '/devapt-core-browser.js.map', path.join(__dirname, devapt_browser_dir, 'js/build/devapt-core-browser.js.map') )

		const dist_dir = __dirname + '/../../dist/'
		this.add_public_asset('js', '/' + plugin_name + '/devapt-features-labs.js', path.join(dist_dir, 'devapt-features-labs.js') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_mathjs.js',        path.join(dist_dir, 'js/js_features/mathjs/workers',   'worker_mathjs.js') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_mathjs.js.map',    path.join(dist_dir, 'js/js_features/mathjs/workers',   'worker_mathjs.js.map') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_algebrite.js',     path.join(dist_dir, 'js/js_features/algebrite/workers', 'worker_algebrite.js') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_algebrite.js.map', path.join(dist_dir, 'js/js_features/algebrite/workers', 'worker_algebrite.js.map') )
		this.add_public_asset('js', '/' + plugin_name + '/mathjs_features.js',      path.join(dist_dir, 'mathjs_features.js') )
		this.add_public_asset('js', '/' + plugin_name + '/mathjs_features.js.map',  path.join(dist_dir, 'mathjs_features.js.map') )

		const fonts = ['KaTeX_AMS-Regular',
			'KaTeX_Caligraphic-Bold',
			'KaTeX_Caligraphic-Regular',
			'KaTeX_Fraktur-Bold',
			'KaTeX_Fraktur-Regular',
			'KaTeX_Main-Bold',
			'KaTeX_Main-Italic',
			'KaTeX_Main-Regular',
			'KaTeX_Math-BoldItalic',
			'KaTeX_Math-Italic',
			'KaTeX_Math-Regular',
			'KaTeX_SansSerif-Bold',
			'KaTeX_SansSerif-Italic',
			'KaTeX_SansSerif-Regular',
			'KaTeX_Script-Regular',
			'KaTeX_Size1-Regular',
			'KaTeX_Size2-Regular',
			'KaTeX_Size3-Regular',
			'KaTeX_Size4-Regular',
			'KaTeX_Typewriter-Regular'
		]
		fonts.forEach(
			(font_name)=>{
				this.add_public_asset('fonts', '/' + plugin_name + '/fonts/' + font_name + '.woff2', path.join(__dirname, bower_dir, 'katex/dist/fonts/' + font_name + '.woff2') )
			}
		)
	}



	/**
	 * Get plugin js asset files for browser loading.
	 * 
	 * @returns {string}
	 */
	get_browser_plugin_file_url()
	{
		return plugin_name + '/devapt-features-labs.js'
	}
	
	
    
	/**
     * Get a feature class.
	 * 
     * @param {string} arg_class_name - feature class name.
	 * 
     * @returns {object} feature class.
     */
	get_feature_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_feature_class:bad class string')
		
		return LabsRenderingPlugin.get_class(arg_class_name)
	}
	
	
	
	/**
	 * Create a resource instance.
	 * 
	 * @param {string} arg_class_name - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings object.
	 * @param {object} arg_state - state object.
	 * 
	 * @returns {Component} - component base class instance.
	 */
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':create:bad class string')
		
		switch(arg_class_name.toLocaleLowerCase())
		{
			case 'workspace':				return new Workspace(arg_name, arg_settings, arg_state)
			// case 'lab':						return new Lab(arg_name, arg_settings, arg_state)
			case 'canvas':					return new Canvas(arg_name, arg_settings, arg_state)
			
			case 'canvas-svgjs':
			case 'canvas_svgjs':			return new CanvasSvgJS(arg_name, arg_settings, arg_state)
			
			case 'canvas-physicsjs':
			case 'canvas_physicsjs':		return new CanvasPhysicsJS(arg_name, arg_settings, arg_state)
			
			case 'canvas-matterjs':
			case 'canvas_matterjs':			return new CanvasMatterJS(arg_name, arg_settings, arg_state)
			
			case 'math-pretty':
			case 'math_pretty':				return new MathPretty(arg_name, arg_settings, arg_state)
			
			case 'terminal':				return new Terminal(arg_name, arg_settings, arg_state)
			
			case 'featured-terminal':
			case 'featured_terminal':		return new FeaturedTerminal(arg_name, arg_settings, arg_state)
			
			case 'terminal-mathjs':
			case 'terminal_mathjs':			return new TerminalMathJS(arg_name, arg_settings, arg_state)
			
			case 'terminal-mathjs-plot':
			case 'terminal_mathjs_plot':	return new TerminalMathJSPlot(arg_name, arg_settings, arg_state)
			
			case 'terminal-algebrite':
			case 'terminal_algebrite':		return new TerminalAlgebrite(arg_name, arg_settings, arg_state)
			
			case 'function-plot':
			case 'function_plot':			return new FunctionPlot(arg_name, arg_settings, arg_state)
		}
		
		// assert(false, context + ':create:bad class name')
		return undefined
	}
	
	
	
	/**
     * Get a feature class.
	 * @static
	 * 
     * @param {string} arg_class_name - feature class name.
	 * 
     * @returns {object} feature class.
	 */
	static get_class(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':get_class:bad class string')
		
		switch(arg_class_name.toLocaleLowerCase())
		{
			// case 'lab':						return Lab
			case 'workspace':				return Workspace
			case 'canvas':					return Canvas

			case 'canvas-svgjs':
			case 'canvas_svgjs':			return CanvasSvgJS

			case 'canvas-physicsjs':
			case 'canvas_physicsjs':		return CanvasPhysicsJS

			case 'canvas-matterjs':
			case 'canvas_matterjs':			return CanvasMatterJS

			case 'math-pretty':
			case 'math_pretty':				return MathPretty

			case 'terminal':				return Terminal

			case 'featured-terminal':
			case 'featured_terminal':		return FeaturedTerminal

			case 'terminal-mathjs':
			case 'terminal_mathjs':			return TerminalMathJS

			case 'terminal-mathjs-plot':
			case 'terminal_mathjs_plot':	return TerminalMathJSPlot

			case 'terminal-algebrite':
			case 'terminal_algebrite':		return TerminalAlgebrite

			case 'function-plot':
			case 'function_plot':			return FunctionPlot
		}
		
		// assert(false, context + ':get_class:bad class name')
		return undefined
	}
	
	
	
	/**
	 * Plugin has class ?
	 * 
	 * @param {string} arg_class_name - class name.
	 * 
	 * @returns {boolean}
	 */
	has(arg_class_name)
	{
		switch(arg_class_name.toLocaleLowerCase())
		{
			// case 'lab':
			case 'workspace':
			case 'canvas':
			case 'canvas-svgjs':
			case 'canvas_svgjs':
			case 'canvas-physicsjs':
			case 'canvas_physicsjs':
			case 'canvas-matterjs':
			case 'canvas_matterjs':
			case 'math-pretty':
			case 'math_pretty':
			case 'terminal':
			case 'featured-terminal':
			case 'featured_terminal':
			case 'terminal-mathjs':
			case 'terminal_mathjs':
			case 'terminal-mathjs_plot':
			case 'terminal_mathjs_plot':
			case 'terminal-algebrite':
			case 'terminal_algebrite':
			case 'function-plot':
			case 'function_plot':
				return true
		}
		
		return false
	}
	

	
	/**
	 * Find a rendering function.
	 * @static
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	static find_rendering_function(arg_type)
	{
		if ( ! T.isNotEmptyString(arg_type) )
		{
			return undefined
		}
		
		switch(arg_type.toLocaleLowerCase())
		{
			case 'lab':						return lab_fn
			case 'workspace':				return workspace_fn

			case 'workspace-about':			return workspace_about_fn
			case 'workspace-manuals':		return workspace_manuals_fn
			case 'workspace-projects':		return workspace_projects_fn
			case 'workspace-sources':		return workspace_sources_fn

			case 'workspace_about':			return workspace_about_fn
			case 'workspace_manuals':		return workspace_manuals_fn
			case 'workspace_projects':		return workspace_projects_fn
			case 'workspace_sources':		return workspace_sources_fn

			case 'canvas':					return DefaultRenderingPlugin.find_rendering_function('canvas')

			case 'math-pretty':				return DefaultRenderingPlugin.find_rendering_function('component')
			case 'math_pretty':				return DefaultRenderingPlugin.find_rendering_function('component')
			
			case 'terminal':				return terminal_fn

			case 'featured-terminal':
			case 'featured_terminal':		return terminal_fn
			
			case 'terminal-algebrite':		return terminal_algebrite_fn
			case 'terminal-mathjs':			return terminal_mathjs_fn
			case 'terminal-mathjs_plot':	return terminal_mathjs_plot_fn
			case 'function-plot':			return function_plot_fn
			case 'terminal-workspace':		return terminal_workspace_fn

			case 'terminal_algebrite':		return terminal_algebrite_fn
			case 'terminal_mathjs':			return terminal_mathjs_fn
			case 'terminal_mathjs_plot':	return terminal_mathjs_plot_fn
			case 'function_plot':			return function_plot_fn
			case 'terminal_workspace':		return terminal_workspace_fn
		}

		// console.log(context + ':find_rendering_function:type not found for [%s]', arg_type)
		return undefined
	}
}
