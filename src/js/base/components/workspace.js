
// NPM IMPORTS
import _ from 'lodash'

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS
import Component from 'devapt-core-browser/dist/js/base/component'

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/workspace'


/**
 * @file Labs workspace, contains labs, authors, sources, features
 * 
 * @author Luc BORIES
 * @license Apache-2.0 
 * 
 * @example
 * 	API:
 * 		PROJECTS or SOURCES or FEATURES authors
 * 		Author record: {
 * 			name:string,
 * 			description:string, (optional)
 * 			github:string url, (optional)
 * 			tweeter:string url, (optional)
 * 			linkedin:string url, (optional)
 * 			site:string url (optional)
 * 		}
 *      ->get_authors():object - get map of authors ids/records (plain object).
 * 		->get_author(author_id:string):object - get author record (plain object).
 * 		->set_author(author_id, author record): nothing - populate authors map with a record.
 * 		->unset_author(author_id):nothing - remove an author from the map.
 * 
 * 		Dependencies projects
 * 		Project record: {
 * 			name:string,
 * 			author:string|object,
 * 			description:string, (optional)
 * 			github:string url, (optional)
 * 			tweeter:string url, (optional)
 * 			site:string url (optional),
 * 			license:string
 * 		}
 *      ->get_projects():object - get map of projects ids/records (plain object).
 * 		->get_project(project_id:string):object - get project record (plain object).
 * 		->set_project(project_id, project record): nothing - populate projects map with a record.
 * 		->unset_project(project_id):nothing - remove a project from the map.
 * 
 * 		Documentation sources
 * 		Source record: {
 * 			name:string,
 * 			author:string|object, (optional)
 * 			description:string, (optional)
 * 			site:string url (optional),
 * 			license:string (optional)
 * 		}
 *      ->get_sources():object - get map of sources ids/records (plain object).
 * 		->get_source(source_id:string):object - get source record (plain object).
 * 		->set_source(source_id, project record): nothing - populate sources map with a record.
 * 		->unset_source(source_id):nothing - remove a source from the map.
 * 		
 * 		Labs features
 * 		Feature record: {
 * 			name:string,
 * 			author:string|object,
 * 			projects:object,
 * 			description:string, (optional)
 * 			site:string url (optional),
 * 			license:string (optional)
 * 		}
 * 		->get_features():object - map of features ids/feature record.
 * 		->get_feature(feature_id:string):object - get a Feature instance.
 * 		->set_feature(feature_id:string, feature object or instance:Feature):nothing - populate features map.
 * 		->unset_feature(feature_id):nothing - remove a feature from the map.
 */
export default class Workspace extends Component
{
	/**
	 * Create an instance of Component.
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

		this._is_initialized = false

		// this.enable_trace()

		this._authors  = {}
		this._projects = {}
		this._sources  = {}
		this._features = {}

		this.init()

		console.log(context + ':constructor:authors',  this._authors)
		console.log(context + ':constructor:projects', this._projects)
		console.log(context + ':constructor:sources',  this._sources)
		console.log(context + ':constructor:features', this._features)
	}
	


	handle_items_change(arg_path, arg_previous_value, arg_new_value)
	{
		this.enter_group('handle_items_change')

		

		this.leave_group('handle_items_change')
	}

	
	init()
	{
		this.enter_group('init')

		// REGISTER AUTHORS
		const authors = this.get_state_js('authors', undefined)
		if ( T.isObject(authors) )
		{
			this._authors = authors
		}

		// REGISTER SOURCES
		const sources = this.get_state_js('sources', undefined)
		if ( T.isObject(sources) )
		{
			this._sources = sources
		}
		_.forEach(this._authors,
			(item, key)=>{
				if ( ! T.isObject(item) )
				{
					return
				}
				if ( T.isString(item.author) && ! (item.author in this._authors) )
				{
					this.warn('init:missing author:' + item.author)
				}
				else if ( T.isObject(item.author) && T.isString(item.author.id) && ! (item.author.id in this._authors) )
				{
					this.set_author(item.author.id, item.author)
				}
			}
		)

		// REGISTER PROJECTS
		const projects = this.get_state_js('projects', undefined)
		if ( T.isObject(projects) )
		{
			this._projects = projects
		}
		_.forEach(this._projects,
			(item, key)=>{
				if ( ! T.isObject(item) )
				{
					return
				}
				if ( T.isString(item.author) && ! (item.author in this._authors) )
				{
					this.warn('init:missing author:' + item.author)
				}
				else if ( T.isObject(item.author) && T.isString(item.author.id) && ! (item.author.id in this._authors) )
				{
					this.set_author(item.author.id, item.author)
				}
			}
		)

		// REGISTER FEATURES
		const features = this.get_state_js('features', undefined)
		if ( T.isObject(features) )
		{
			this._features = features
		}
		_.forEach(this._features,
			(item, key)=>{
				if ( ! T.isObject(item) )
				{
					return
				}
				
				// UDPATE AUTHORS
				if ( T.isString(item.author) && ! (item.author in this._authors) )
				{
					this.warn('init:missing author:' + item.author)
				}
				else if ( T.isObject(item.author) && T.isString(item.author.id) && ! (item.author.id in this._authors) )
				{
					this.set_author(item.author.id, item.author)
				}

				// UPDATE PROJECTS
				if ( T.isObject(item.projects) )
				{
					_.forEach(item.projects,
						(project, project_id)=>{
							if ( T.isString(project) && ! (project in this._projects) )
							{
								this.warn('init:missing project:' + project)
							}
							else if ( T.isObject(project) && T.isString(project_id) && ! (project_id in this._projects) )
							{
								this.set_project(project_id, project)
							}
						}
					)
				}
			}
		)

		this.leave_group('init')
	}



	/**
	 * Get all authors.
	 * 
	 * @returns {object} - plain object map.
	 */
	get_authors()
	{
		return this._authors
	}

	/**
	 * Get an author record.
	 * 
	 * @param{string} arg_id - id string.
	 * 
	 * @returns {object} - plain object record.
	 */
	get_author(arg_id)
	{
		return this._authors[arg_id]
	}

	/**
	 * Populate  map.
	 * 
	 * @param{string} arg_id - id string.
	 * @param{object} arg_record - record object.
	 * 
	 * @returns {object} - plain object record.
	 */
	set_author(arg_id, arg_record)
	{
		return this._authors[arg_id]
	}

	

	/**
	 * Get all projects.
	 * 
	 * @returns {object} - plain object map.
	 */
	get_projects()
	{
		return this._projects
	}

	/**
	 * Get a project record.
	 * 
	 * @param{string} arg_id - id string.
	 * 
	 * @returns {object} - plain object record.
	 */
	get_project(arg_id)
	{
		return this._projects[arg_id]
	}

	

	/**
	 * Get all sources.
	 * 
	 * @returns {object} - plain object map.
	 */
	get_sources()
	{
		return this._sources
	}

	/**
	 * Get a source record.
	 * 
	 * @param{string} arg_id - id string.
	 * 
	 * @returns {object} - plain object record.
	 */
	get_source(arg_id)
	{
		return this._sources[arg_id]
	}

	

	/**
	 * Get all features.
	 * 
	 * @returns {object} - plain object map.
	 */
	get_features()
	{
		return this._features
	}

	/**
	 * Get a feature record.
	 * 
	 * @param{string} arg_id - id string.
	 * 
	 * @returns {object} - plain object record.
	 */
	get_feature(arg_id)
	{
		return this._features[arg_id]
	}
}
