
const plugin_name = 'Labs'
const DRAW_FEATURE_NAME = 'draw'
const DRAW_FEATURE_FUNC_NAME = 'func_draw'
const context = plugin_name + '/' + DRAW_FEATURE_NAME + '/' + DRAW_FEATURE_FUNC_NAME

const DRAW_FACTORY_FUNC_NAME = 'func_draw_factory'

// require("@babel/polyfill")


/**
 * Draw feature.
 * Request string is:
 *   - itemname = itemtype(args)
 * 
 * @param {FeaturedTerminal} arg_terminal_feature - featured terminal.
 * @param {object}		   arg_request  - request object.
 * 
 * @returns {object} - response { id, result:{ value:any, str:string, error:string|null } }.
 * 
 * @example
 *   >c1=circle(45, 20, 12)
 *   >c1=circle(p0 , 12)
 *   >c1=circle(p0 , c2.radius)
 *   >p0=Point(45, 20)
 *   >p0=Point(45, 20, red, cross, 3)
 *   >p0=Point(45, 20, blue, circle)
 *   >p0=Point(45, 20, blue, disk)
 *   >circle(50, 50, 20)
 * 
 */
 const func_draw = (arg_terminal_feature, arg_request)=>{

	var request = arg_request
	var request_str = null
	var result_str = null
	var err = null


	// BUILD RESPONSE
	var response = {
		id: request.id ? request.id : undefined,
		result: {
			value:undefined,
			str: undefined,
			error: undefined
		}
	}

	// CHECK TERMINAL
	if (! arg_terminal_feature || ! arg_terminal_feature.is_terminal_feature)
	{
		console.warn(context + ':bad terminal')
		response.result.error = context + ':bad terminal'
		return response
	}

	// CHECK REQUEST
	if (! request.data || ! request.id)
	{
		console.warn(context + ':bad request.data or request.id:request=', request)
		response.result.error = context + ':bad request.data or request.id'
		return response
	}
	response.id = request.id

	// PROCESS REQUEST
	try {
		// GET RESULT STRING
		request_str = request.data
		func_draw_process_request(arg_terminal_feature, request_str, response)
	}
	catch (e) {
		console.warn(context + ':eval error=', e.toString())
		response.result.error = e.toString()
	}

	return response
}


// REGISTER
if (! window.devapt().func_features)
{
	window.devapt().func_features = {}
}
window.devapt().func_features[DRAW_FEATURE_FUNC_NAME] = func_draw


const resolver = window.devapt().ui().get_rendering_class_resolver()
const SvgFactory = resolver('SvgFactory')
const SvgSpace = resolver('SvgSpace')
let draw_session_scope = undefined


const shapes_map = {
	'space':'space',
	'plotf':'plotf',
	'circle':'circle',
	'cir':'circle',
	'rectangle':'rectangle',
	'rect':'rectangle',
	'square':'square',
	'sqr':'square',
	'point':'point',
	'p':'point',
	'line':'line',
	'l':'line',
	'grid':'grid',
	'g':'grid',
	'polygon':'polygon',
	'pol':'polygon',
	'star':'star',
	's':'star'
}


/**
 * Process request.
 * @private
 */
function func_draw_process_request(arg_terminal_feature, arg_request_str='', arg_response)
{
	arg_response.result.value = undefined
	arg_response.result.str = undefined

	const EXPR_FEATURE_FUNC_NAME = 'func_expression'
	const func_draw_factory = window.devapt().func_features[DRAW_FACTORY_FUNC_NAME]
	const func_expr_process = window.devapt().func_features[EXPR_FEATURE_FUNC_NAME]

	const terminal = func_draw_get_terminal(arg_terminal_feature)
	draw_session_scope = draw_session_scope ? draw_session_scope : func_draw_get_scope(terminal)
	if (! terminal || ! draw_session_scope)
	{
		arg_response.result.error = 'terminal or scope not found'
		return undefined
	}

	Object.keys(shapes_map).forEach(
		(shape_alias)=>{
			draw_session_scope._svg_space[shape_alias] = func_draw_factory(arg_terminal_feature, shapes_map, 'rootspace', draw_session_scope, shapes_map[shape_alias], draw_session_scope._svg_space)
			draw_session_scope._svg_space.add_method(shape_alias)
		}
	)

	// TEST IF ASSIGN EXPRESSION
	let assign_name = undefined
	const lexer_assign = new RegExp(/^\s*([a-zA-Z]{1}[a-zA-Z0-9_]*)?\s*=(.*){1}\s*/)
	const parts = lexer_assign.exec(arg_request_str)
	if ( Array.isArray(parts) && parts.length > 2 )
	{
		assign_name = parts[1]
		arg_request_str = parts[2]
		console.log('func_draw_process_request:assign_name=' + assign_name + ' arg_request_str=' + arg_request_str)
	}
	assign_name = assign_name ? assign_name : 'S' + draw_session_scope._svg_factory.count()
	
	Object.keys(shapes_map).forEach(
		(shape_type)=>{
			if (shape_type in draw_session_scope) return

			const factory_fn = func_draw_factory(arg_terminal_feature, shapes_map, assign_name, draw_session_scope, shapes_map[shape_type], draw_session_scope._svg_space)

			draw_session_scope[shape_type] = factory_fn
		}
	)


	// EVAL EXPRESSION
	const eval_result = func_expr_process(draw_session_scope, arg_request_str)
	console.log('func_draw_process_request:eval_result=', eval_result)

	// PROCESS EVAL ERRORS
	let error_msg = undefined
	if (eval_result.exception)
	{
		error_msg = 'bad request string:[' + arg_request_str + ']\n evaluated with exception [' + eval_result.exception.toString() + ']\n'
	}
	if (eval_result.errors.length > 0)
	{
		error_msg = error_msg ? error_msg : ''
		error_msg += 'with errors:\n'
		eval_result.errors.forEach(
			(error)=>{
				arg_response.error += 'error:[' + error + ']'
			}
		)
	}
	if (eval_result.value && eval_result.value.error)
	{
		error_msg = error_msg ? error_msg : ''
		error_msg += 'factory error:[' + eval_result.value.error + ']'
	}
	if (error_msg)
	{
		arg_response.result.error = error_msg
		
		return arg_response
	}

	// PROCESS EVAL OUTPUT
	let output_msg = arg_response.result.str ? arg_response.result.str : ''
	if (eval_result.value && eval_result.value.message)
	{
		output_msg += '\n' +  eval_result.value.message
	}


	// 	if (! arg_response.result.value)
	// 	{
	// 		arg_response.result.value = (eval_result && eval_result.value && eval_result.value.result && eval_result.value.result.value) ? eval_result.value.result.value : eval_result.value
	// 	}
	// }
	if (assign_name)
	{
		if (eval_result.value && eval_result.value.value)
		{
			draw_session_scope[assign_name] = eval_result.value.value
		} else {
			draw_session_scope[assign_name] = eval_result.value
		}
	}

	return arg_response
}



/**
 * @private
 */
function func_draw_get_terminal(arg_terminal_feature)
{
	const has_valid_terminal = arg_terminal_feature && arg_terminal_feature.is_terminal_feature
		&& arg_terminal_feature.get_terminal() && arg_terminal_feature.get_terminal().is_featured_terminal
	
	return has_valid_terminal ? arg_terminal_feature.get_terminal() : undefined
}



/**
 * @private
 */
function func_draw_get_scope(arg_terminal)
{
	if (arg_terminal)
	{
		const terminal_session_scope = arg_terminal.get_feature_scope(DRAW_FEATURE_NAME)
		if (! terminal_session_scope._stack)
		{
			terminal_session_scope._stack = []
		}

		if (! terminal_session_scope._svg)
		{
			const parent_id = arg_terminal.get_canvas_id()
			const parent_element = document.getElementById(parent_id)
			terminal_session_scope._svg = SVG(parent_id).size(parent_element.offsetWidth, parent_element.offsetHeight)
		}
		if (! terminal_session_scope._svg_space)
		{
			const svg_canavs_viewbox = terminal_session_scope._svg.viewbox()
			const canvas_width = svg_canavs_viewbox.width
			const canvas_height = svg_canavs_viewbox.height
			const domains = [
				{
					index:0,
					start:0,
					end:canvas_width - 1,
					step:10,
					name:'x'
				},
				{
					index:1,
					start:0,
					end:canvas_height - 1,
					step:10,
					name:'y'
				}
			]
			const pixelbox_settings = undefined
			terminal_session_scope._svg_space = new SvgSpace(terminal_session_scope._svg, domains, pixelbox_settings)
			terminal_session_scope._svg_factory = new SvgFactory(terminal_session_scope._svg_space)
			terminal_session_scope._svg_factory.set('rootspace', terminal_session_scope._svg_space)
			terminal_session_scope['rootspace'] = terminal_session_scope._svg_space
			terminal_session_scope['rs'] = terminal_session_scope._svg_space
		}
		return terminal_session_scope
	}
	return undefined
}
