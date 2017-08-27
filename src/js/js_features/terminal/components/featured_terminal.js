
// NPM IMPORTS
import _ from 'lodash'

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import WebWorker from 'devapt-core-browser/dist/js/base/web_worker'

// PLUGIN IMPORTS
import Terminal from './terminal'
import TerminalFeature from './terminal_feature'


const plugin_name = 'Labs' 
const context = plugin_name + '/featured_terminal'
const LIMIT_SPACES_IN_EXPRESSION = 20


export default class TerminalMathJS extends Terminal
{
	/**
	 * Create an instance of TerminalMathJS.
	 * @extends Terminal
	 * 
	 * 	API:
	 *      ->load()
	 *      ->eval(arg_expression):object - Evaluate a string expression.
	 *		->init_terminal():nothing - Init Terminal command handler.
	 * 		->init():nothing - Init component when assets are loaded.
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

		this.is_featured_terminal = true
		
		this._features = {}
		this._aliases = {}
		this._mode = undefined
		this.load_features()

		// this.enable_trace()
	}



	/**
	 * Load terminal features.
	 * 
	 * @returns {nothing}
	 */
	load_features()
	{
		const features_config = this.get_setting_js('features', {})
		const runtime = this.get_runtime()

		let assets = []
		this._aliases = {}
		_.forEach(features_config,
			(feature_config, feature_key)=>{
				const feature_name = feature_config && feature_config.name ? feature_config.name + '' : feature_key + ''
				const log_context = context + ':load_features:terminal=[' + this.get_name() + ']:feature=[' + feature_name + ']'
				const feature = new TerminalFeature(runtime, feature_name, log_context)
				if (! feature.is_valid())
				{
					console.error(log_context + ':feature is not valid')
					return
				}

				const feature_assets = feature.get_assets()
				if ( T.isNotEmptyArray(feature_assets) )
				{
					assets = _.merge(feature_assets, assets)
				}
				
				const feature_aliases = feature.get_aliases()
				if ( T.isNotEmptyArray(feature_aliases) )
				{
					_.forEach(feature_aliases,
						(alias)=>{
							this._aliases[alias] = feature
						}
					)
				}

				this._features[feature_name] = feature
			}
		)

		// LOAD FEATURES ASSETS
		const log_context = context + ':load_features:terminal=[' + this.get_name() + ']:loading assets'
		const credentials = this._component._runtime.get_session_credentials()
		const assets_urls = {
			'js':[],
			'css':[]
		}
		_.forEach(assets,
			(asset)=>{
				if ( T.isNotEmptyString(asset) )
				{
					this.add_assets_dependancy(asset)
				} 
				else if ( T.isObject(asset) && T.isNotEmptyString(asset.id) && T.isNotEmptyString(asset.type) && T.isNotEmptyString(asset.url) )
				{
					if (asset.type in assets_urls)
					{
						assets_urls[asset.type].push( { id:asset.id, src:asset.url } )
					} else {
						console.warning(log_context + ':bad features asset type=[' + asset.type + '] id=[' + assets.id + ']')
					}
				} else {
					console.warning(log_context + ':bad features asset=[' + asset + '] assets=[' + assets.toString() + ']')
				}
			}
		)

		if ( T.isNotEmptyArray(assets_urls.js) )
		{
			this.get_runtime().ui_rendering().process_rendering_result_scripts_urls(document.body, assets_urls.js, credentials)
			_.forEach(assets_urls.js,
				(asset)=>{
					this.add_assets_dependancy(asset.id)
				}
			)
		}

		if ( T.isNotEmptyArray(assets_urls.css) )
		{
			this.get_runtime().ui_rendering().process_rendering_result_styles_urls(document.head, assets_urls.css, credentials)
			_.forEach(assets_urls.css,
				(asset)=>{
					this.add_assets_dependancy(asset.id)
				}
			)
		}
	}



	/**
	 * Switch terminal mode: Numeric, algebric, plot.
	 * 
	 * @param {string} 	arg_new_mode - terminal new mode.
	 * 
	 * @returns {boolean} - new mode is valid
	 */
	switch_mode(arg_new_mode)
	{
		// TODO: set component Redux state

		// CONVERT STATE
		const new_mode = arg_new_mode + ''

		if (new_mode in this._features)
		{
			const feature_name = this._features[new_mode].get_name()
			this._set_mode(feature_name)
			return true
		}
		
		if (new_mode in this._aliases)
		{
			const feature_name = this._aliases[new_mode].get_name()
			this._set_mode(feature_name)
			return true
		}

		return false
	}



	/**
	 * Set terminal mode: Numeric, algebric, plot.
	 * @private
	 * 
	 * @param {string} 	arg_checked_mode - terminal new mode, checked value.
	 * 
	 * @returns {nothing}
	 */
	_set_mode(arg_checked_mode)
	{
		this._mode = arg_checked_mode
	}



	/**
	 * Get terminal mode: Numerical, algebrical, plot.
	 * @private
	 * 
	 * @returns {string}
	 */
	_get_mode()
	{
		return this._mode
	}

	

	/**
	 * Process MathJS operations.
	 * 
	 * @param {string}   arg_expression - request expression.
	 * @param {function} arg_resolve    - promise resolve callback.
	 * @param {function} arg_reject     - promise reject callback.
	 * 
	 * @return {nothing|number|array|string|Promise}
	 */
	process_mathjs_request(arg_expression, arg_resolve, arg_reject)
	{
		const response_promise = this._worker.submit_request(arg_expression)
		
		return response_promise
		.then(
			(mathjs_result)=>{
				console.log(context + ':eval:expression=[%s] mathjs_result=', arg_expression, mathjs_result)

				const result_str = mathjs_result.str

				console.log(context + ':eval:expression=[%s] result_str=', arg_expression, result_str)
				arg_resolve(result_str)
			}
		)
		.catch(
			(error)=>{
				console.log(context + ':eval:expression=[%s] error=', arg_expression, error)
				arg_reject(error)
			}
		)
	}



	/**
	 * Evaluate a string expression.
	 * 
	 * @param {string} arg_expression - expression to evaluate.
	 * 
	 * @returns {Promise} - eval result promise of: { error:'', value:'' } on failure or { value:'' } on success.
	 */
	eval(arg_expression)
	{
		const mode_expression = arg_expression + ''
		const split_spaces = mode_expression.split('space', LIMIT_SPACES_IN_EXPRESSION)
		const switch_mode = split_spaces.length > 0 ? this.switch_mode(split_spaces[0]) : false
		const expression = switch_mode ? split_spaces.slice(1).join(' ') : expression
		const mode = this._get_mode()

		const feature = (mode in this._features) ? this._features[mode] : undefined

		if (! feature)
		{
			console.log(context + ':no feature found')
			return
		}


		
		// SET MODE METHOD NAME
		let method_name = undefined
		switch(mode) {
			case MODE_ALGEBRICAL:
				method_name = 'process_algebrite_request'
				break
			case MODE_NUMERICAL:
				method_name = 'process_mathjs_request'
				break
			case MODE_PLOT:
			case MODE_PLOT2D:
				// PROCESS 2D REQUEST (DOM OPERATIONS ARE FORBIDDEN INTO WEB WORKER)
				method_name = 'process_plot2d_request'
				break
			case MODE_PLOT3D:
				// PROCESS 3D REQUEST (DOM OPERATIONS ARE FORBIDDEN INTO WEB WORKER)
				method_name = 'process_plot3d_request'
				break
			case MODE_PLOT4D:
			case MODE_DRAW2D:
			case MODE_DRAW3D:
				break
		}

		// EXECUTE TASK
		if (method_name && (method_name in this) )
		{
			const fn_task = (resolve, reject)=>{
				this[method_name](arg_expression, resolve, reject)
			}
			const task_promise = new Promise(fn_task)
			.then(
				(result)=>{ return { value:result ? result : 'done' } }
			)
			.catch(
				(e)=>{ return { error:e, value:'error' } }
			)
			return task_promise
		}
	}
}
