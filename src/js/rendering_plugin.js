// NPM IMPORTS
import assert from 'assert'
import path from 'path'

// DEVAPT CORE COMMON IMPORTS
import T                      from 'devapt-core-common/dist/js/utils/types'
import RenderingPlugin        from 'devapt-core-common/dist/js/plugins/rendering_plugin'
import DefaultRenderingPlugin from 'devapt-core-common/dist/js/default_plugins/rendering_default_plugin'

// PLUGIN IMPORTS
// RENDERING FUNCTIONS
import lab_fn from './rendering_functions/lab'
import workspace_fn from './rendering_functions/workspace'
import terminal_workspace_fn from './rendering_functions/terminal_workspace'
import terminal_fn from './rendering_functions/terminal'
import terminal_algebrite_fn from './rendering_functions/terminal_algebrite'
import terminal_mathjs_fn from './rendering_functions/terminal_mathjs'
import terminal_mathjs_plot_fn from './rendering_functions/terminal_mathjs_plot'
import function_plot_fn from './rendering_functions/function_plot'

// COMPONENTS
import MathPretty from './components/math_pretty'
import Terminal from './components/terminal'
import TerminalAlgebrite from './components/terminal_algebrite'
import TerminalMathJS from './components/terminal_mathjs'
import TerminalMathJSPlot from './components/terminal_mathjs_plot'
import FunctionPlot from './components/function_plot'


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
		this.add_public_asset('js', '/' + plugin_name + '/devapt-browser.js.map', path.join(__dirname, devapt_browser_dir, 'js/build/devapt-core-browser.js.map') )

		const dist_dir = __dirname + '/../../dist/'
		this.add_public_asset('js', '/' + plugin_name + '/devapt-features-labs.js', path.join(dist_dir, 'devapt-features-labs.js') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_mathjs.js',        path.join(dist_dir, 'js/workers',  'worker_mathjs.js') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_mathjs.js.map',    path.join(dist_dir, 'js/workers',  'worker_mathjs.js.map') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_algebrite.js',     path.join(dist_dir, 'js/workers',  'worker_algebrite.js') )
		this.add_public_asset('js', '/' + plugin_name + '/worker_algebrite.js.map', path.join(dist_dir, 'js/workers',  'worker_algebrite.js.map') )
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
			case 'math_pretty':				return new MathPretty(arg_name, arg_settings, arg_state)
			case 'terminal':				return new Terminal(arg_name, arg_settings, arg_state)
			case 'terminal_mathjs':			return new TerminalMathJS(arg_name, arg_settings, arg_state)
			case 'terminal_mathjs_plot':	return new TerminalMathJSPlot(arg_name, arg_settings, arg_state)
			case 'terminal_algebrite':		return new TerminalAlgebrite(arg_name, arg_settings, arg_state)
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
			case 'math_pretty':				return MathPretty
			case 'terminal':				return Terminal
			case 'terminal_mathjs':			return TerminalMathJS
			case 'terminal_mathjs_plot':	return TerminalMathJSPlot
			case 'terminal_algebrite':		return TerminalAlgebrite
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
			case 'math_pretty':
			case 'terminal':
			case 'terminal_mathjs':
			case 'terminal_mathjs_plot':
			case 'terminal_algebrite':
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
			case 'math_pretty':				return DefaultRenderingPlugin.find_rendering_function('component')
			case 'terminal':				return terminal_fn
			case 'terminal_algebrite':		return terminal_algebrite_fn
			case 'terminal_mathjs':			return terminal_mathjs_fn
			case 'terminal_mathjs_plot':	return terminal_mathjs_plot_fn
			case 'function_plot':			return function_plot_fn
			case 'workspace':				return workspace_fn
			case 'terminal_workspace':		return terminal_workspace_fn
		}

		// console.log(context + ':find_rendering_function:type not found for [%s]', arg_type)
		return undefined
	}
}
