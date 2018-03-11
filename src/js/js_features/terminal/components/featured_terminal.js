
// NPM IMPORTS
import _ from 'lodash'

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// PLUGIN IMPORTS
import Scope from '../../../base/scope'
import Terminal from './terminal'
import TerminalFeature from './terminal_feature'


const plugin_name = 'Labs' 
const context = plugin_name + '/featured_terminal'
const LIMIT_SPACES_IN_EXPRESSION = 20


export default class FeaturedTerminal extends Terminal
{
	/**
	 * Create an instance of FeaturedTerminal.
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
		
		this._workers = []
		this._features = {}
		this._features_scopes = {}
		this._features_shared_scope = new Scope('shared')
		this._features_shared_scope.is_shared = true
		this._aliases = {}
		this._mode = undefined
		this._default_feature_name = undefined

		if ( ! T.isObject( window.devapt().func_features ) )
		{
			window.devapt().func_features = {}
		}
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
		const runtime = this.get_runtime()

		this._default_feature_name = this.get_state_value('default_feature', undefined)
		const required_features_view = this.get_state_value('required_features', [])
		const features_view = this.get_state_value('features', {})

		const all_features_app  = runtime.get_state_store().get_state().get('features', {}).toJS()
		const required_features_app = {}
		required_features_view.forEach(
			(feature_name)=>{
				if (feature_name in all_features_app)
				{
					required_features_app[feature_name] = all_features_app[feature_name]
				}
			}
		)

		const features_config = _.merge(features_view, required_features_app)

		// DEBUG
		// console.log(context + ':load_features:features_view', features_view)
		// console.log(context + ':load_features:features_app', features_app)
		// console.log(context + ':load_features:features_config', features_config)

		let assets = []
		this._aliases = {}
		_.forEach(features_config,
			(feature_config, feature_key)=>{
				feature_config.name = feature_config.name ? feature_config.name : feature_key
				const feature_name = feature_config.name
				const feature_type = feature_config.type + ''
				this.info('load feature:[' + feature_name + '] of type [' + feature_type + ']')

				if (feature_type.toLocaleLowerCase() != 'terminal')
				{
					return
				}

				feature_config.terminal = this

				const log_context = context + ':load_features:terminal=[' + this.get_name() + ']:feature=[' + feature_name + ']'
				const feature = new TerminalFeature(runtime, feature_config, log_context)
				if (! feature.is_valid())
				{
					console.error(log_context + ':feature is not valid')
					return
				}

				const feature_assets = feature.get_assets()
				if ( T.isNotEmptyArray(feature_assets) )
				{
					assets = _.concat(feature_assets, assets)
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
				this._features_scopes[feature_name] = this._features_shared_scope ? this._features_shared_scope : new Scope(feature_name)
			}
		)

		// LOAD FEATURES ASSETS
		const log_context = context + ':load_features:terminal=[' + this.get_name() + ']:loading assets'
		const credentials = runtime.get_session_credentials()
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
			runtime.ui_rendering().process_rendering_result_scripts_urls(document.body, assets_urls.js, credentials)
			_.forEach(assets_urls.js,
				(asset)=>{
					this.add_assets_dependancy(asset.id)
				}
			)
		}

		if ( T.isNotEmptyArray(assets_urls.css) )
		{
			runtime.ui_rendering().process_rendering_result_styles_urls(document.head, assets_urls.css, credentials)
			_.forEach(assets_urls.css,
				(asset)=>{
					this.add_assets_dependancy(asset.id)
				}
			)
		}
	}



	/**
	 * Init Terminal command handler.
	 * 
	 * @returns {nothing}
	 */
	init_terminal()
	{
		this.enter_group('init_terminal')
		super.init_terminal()

		// EXECUTE INIT SCRIPT
		const script = this.get_state_value('script', [])
		let promise = Promise.resolve()
		T.isArray(script) && script.forEach(
			(line)=>{
				promise = promise.then( ()=>this.eval(line) )
			}
		)

		this.enter_group('init_terminal')
	}



	/**
	 * Has a shared scope for features?
	 * @returns {boolean}
	 */
	has_shared_scope()
	{
		return this._features_shared_scope && this._features_shared_scope.is_shared
	}



	/**
	 * Get shared scope for features.
	 * @returns {Scope}
	 */
	get_shared_scope()
	{
		return this._features_shared_scope
	}

	

	/**
	 * Get terminal feature instance.
	 * 
	 * @param {string} 	arg_feature_name - terminal feature name.
	 * 
	 * @returns {TermainalFeature} - terminal feature instance.
	 */
	get_feature(arg_feature_name)
	{
		if (arg_feature_name in this._features)
		{
			return this._features[arg_feature_name]
		}
		
		if (arg_feature_name in this._aliases)
		{
			return this._aliases[arg_feature_name]
		}

		return undefined
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
		// const default_prompt = this.get_state_value('prompt', '>')
		const input_jqo = $('#' + this.get_dom_id())
		const new_prompt = arg_checked_mode + '>'
		const cmd = input_jqo.data('cmd')
		cmd.prompt(new_prompt)
	}



	/**
	 * Get terminal mode: Numerical, algebrical, plot.
	 * 
	 * @returns {string}
	 */
	get_mode()
	{
		return this._mode
	}



	/**
	 * Get terminal features.
	 * 
	 * @returns {string}
	 */
	get_features()
	{
		return this._features
	}



	/**
	 * Get terminal features aliases.
	 * 
	 * @returns {string}
	 */
	get_aliases()
	{
		return this._aliases
	}



	/**
	 * Get terminal feature scope.
	 * 
	 * @param {string} arg_name - feature name.
	 * 
	 * @returns {object} - feature scope/context inside this terminal component.
	 */
	get_feature_scope(arg_name)
	{
		return this._features_scopes[arg_name]
	}



	/**
	 * Get terminal canvas id.
	 * 
	 * @returns {string}
	 */
	get_canvas_id()
	{
		return this.get_state_value('canvas_id', undefined)
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
		// ENABLE DEFAULT FEATURE
		if ( (! this._mode) && this._default_feature_name)
		{
			this.switch_mode(this._default_feature_name)
		}

		const str_expression = arg_expression + ''
		const split_spaces    = str_expression.split(' ', LIMIT_SPACES_IN_EXPRESSION)

		const part0           = split_spaces[0]
		const part1           = split_spaces[1]

		const switch_mode     = split_spaces.length > 0 ? this.switch_mode(part0) : false
		const expression      = switch_mode ? split_spaces.slice(1).join(' ') : arg_expression
		const mode            = this.get_mode()

		let feature = undefined
		if (switch_mode)
		{
			feature = (mode in this._features) ? this._features[mode] : undefined
		}

		if (! feature)
		{
			// SEARCH COMMAND INTO FEATURES
			let cmd = part0
			const lexer_assign = new RegExp(/^\s*([a-zA-Z]{1}[a-zA-Z0-9_]*)?\s*=([a-zA-Z]{1}[a-zA-Z0-9_]*){1}\s*/)
			const lexer_call = new RegExp(/^\s*([a-zA-Z]{1}[a-zA-Z0-9_]*){1}\s*/)
			const lexer_assign_parts = lexer_assign.exec(part0)
			const lexer_call_parts = lexer_call.exec(part0)
			if ( Array.isArray(lexer_assign_parts) && lexer_assign_parts.length > 2 )
			{
				cmd = lexer_assign_parts[2]
			} else if ( Array.isArray(lexer_call_parts) && lexer_call_parts.length > 1 )
			{
				cmd = lexer_call_parts[1]
			}

			_.forEach(this._features,
				(feature_obj, feature_name)=>{
					if (feature) return

					if ( feature_obj.has_command(cmd) )
					{
						feature = feature_obj
					}
				}
			)

			if (! feature)
			{
				if (mode)
				{
					feature = (mode in this._features) ? this._features[mode] : undefined
				}
				if (! feature)
				{
					const error = 'feature not found [' + arg_expression + '] with mode [' + mode + '] and expression ['+ expression + ']'
					console.log(context + ':error')
					return Promise.resolve( { value:undefined, error:error, str:undefined } )
				}
			}
		}

		console.log('feature found [' + feature.get_name() + '] with mode [' + mode + '] and expression ['+ expression + ']')

		if ( T.isNotEmptyString(expression) )
		{
			return feature.eval(expression, this.get_feature_scope(feature.get_name()))
		}

		return Promise.resolve( { value:undefined, error:undefined, str:undefined } )
	}
}
