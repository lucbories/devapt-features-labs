
const plugin_name = 'Labs'
const DRAW_FEATURE_NAME = 'draw'
const DRAW_FEATURE_FUNC_NAME = 'func_draw'
const context = plugin_name + '/' + DRAW_FEATURE_NAME + '/' + DRAW_FEATURE_FUNC_NAME


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



/**
 * Process request.
 * @private
 */
function func_draw_process_request(arg_terminal_feature, arg_request_str='', arg_response)
{
	arg_response.result.value = undefined
	arg_response.result.str = undefined

	const EXPR_FEATURE_FUNC_NAME = 'func_expression'
	const func_expr_process = window.devapt().func_features[EXPR_FEATURE_FUNC_NAME]

	const terminal = func_draw_get_terminal(arg_terminal_feature)
	const scope = func_draw_get_scope(terminal)
	if (! terminal || ! scope)
	{
		arg_response.result.error = 'terminal or scope not found'
		return
	}

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
	assign_name = assign_name ? assign_name : 'S' + scope.svg_factory.count()

	const enhanced_scope = Object.assign({}, scope)
	
	enhanced_scope.circle = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_circle(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.cir = enhanced_scope.circle
	
	enhanced_scope.rectangle = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_rect(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.rect = enhanced_scope.rectangle
	
	enhanced_scope.square = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_square(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.sqr = enhanced_scope.square
	
	enhanced_scope.point = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_point(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.p = enhanced_scope.point
	
	enhanced_scope.line = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_line(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.l = enhanced_scope.line
	
	enhanced_scope.axis = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_axis(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.a = enhanced_scope.axis
	
	enhanced_scope.grid = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_grid(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.g = enhanced_scope.grid
	
	enhanced_scope.polygon = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_polygon(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.pol = enhanced_scope.polygon
	
	enhanced_scope.star = (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{ return func_draw_star(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10) }
	enhanced_scope.s = enhanced_scope.star

	const eval_result = func_expr_process(enhanced_scope, arg_request_str)
	console.log('func_draw_process_request:eval_result=', eval_result)

	if (! eval_result.exception)
	{
		if (! arg_response.result.str)
		{
			arg_response.result.str = (eval_result.value.result && eval_result.value.result.str) ? eval_result.value.result.str + '' : eval_result.value + ''
		}
		if (! arg_response.result.value)
		{
			arg_response.result.value = (eval_result.value.result && eval_result.value.result.value) ? eval_result.value.result.value : eval_result.value
		}
	}
	if (assign_name)
	{
		scope[assign_name] = arg_response.result.value
	}
	
	if (eval_result.errors.length == 0)
	{
		return arg_response
	}

	arg_response.error = 'bad request string:[' + arg_request_str + ']'
	return arg_response
}


function func_draw_circle(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.circle:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'draw:circle x=' + opd1 + ' y=' + opd2 + ' r=' + opd3 + ' c=' + opd4

	scope.svg_factory.create({ type:'circle', name:assign_name, position:[opd1, opd2], radius:opd3, color:opd4 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_rect(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.rectangle:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'func_draw:rectangle x=' + opd1 + ' y=' + opd2 + ' w=' + opd3 + ' h=' + opd4 + ' c=' + opd5

	scope.svg_factory.create({ type:'rect', name:assign_name, position:[opd1, opd2], width:opd3, height:opd4, color:opd5 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_square(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.square:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	return func_draw_rect(arg_response, assign_name, scope, opd1, opd2, opd3, opd3, opd4, opd5, opd6, opd7, opd8, opd9)
}

function func_draw_point(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.point:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'func_draw:point x=' + opd1 + ' y=' + opd2 + ' c=' + opd3 + ' r=' + opd4 + ' s=' + opd5

	scope.svg_factory.create({ type:'point', name:assign_name, position:[opd1, opd2], color:opd3, render:opd4, size:opd5 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_line(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.line:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'func_draw:line x1=' + opd1 + ' y1=' + opd2 + ' x2=' + opd3 + ' y2=' + opd4 + ' c=' + opd5 + ' w=' + opd6

	scope.svg_factory.create({ type:'line', name:assign_name, position:[opd1, opd2], position_end:[opd3, opd4], color:opd5, width:opd6 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_axis(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.axis:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'func_draw:axis origin.x=' + opd1 + ' origin.y=' + opd2 + ' domain=' + opd3 + ' c=' + opd4 + ' w=' + opd5

	scope.svg_factory.create({ type:'axis', name:assign_name, position:[opd1, opd2], domain:opd3, color:opd4, width:opd5 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_grid(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.grid:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'func_draw:grid x=' + opd1 + ' y=' + opd2 + ' w=' + opd3 + ' h=' + opd4 + ' c=' + opd5

	scope.svg_factory.create({ type:'grid', name:assign_name, position:[opd1, opd2], width:opd3, height:opd4, color:opd5 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_polygon(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.polygon:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'draw:polygon x=' + opd1 + ' y=' + opd2 + ' c=' + opd3 + ' e=' + opd4 + ' r=' + opd5

	scope.svg_factory.create({ type:'polygon', name:assign_name, position:[opd1, opd2], color:opd3, edges:opd4, radius:opd5 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
}

function func_draw_star(arg_response, assign_name, scope, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
{
	console.log('func_draw:enhanced_scope.star:opd1,..opd10', opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)
	
	arg_response.result.str = 'draw:star x=' + opd1 + ' y=' + opd2 + ' c=' + opd3 + ' s=' + opd4 + ' i=' + opd5 + ' o=' + opd6

	scope.svg_factory.create({ type:'star', name:assign_name, position:[opd1, opd2], color:opd3, spikes:opd4, inner:opd5, outer:opd6 })
	
	arg_response.result.value = scope.svg_factory.get(assign_name)
	return arg_response.result.value
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
		const scope = arg_terminal.get_feature_scope(DRAW_FEATURE_NAME)
		if (! scope.stack)
		{
			scope.stack = []
		}
		if (! scope.shapes)
		{
			scope.shapes = {}
		}

		const canvas_id = arg_terminal.get_canvas_id()
		if (! scope.svg_space)
		{
			const canvas_width = 300
			const canvas_height = 200
			const domains = [
				{
					index:0,
					size:canvas_width,
					start:0,
					end:canvas_width - 1,
					step:1,
					name:'x'
				},
				{
					index:1,
					size:canvas_height,
					start:0,
					end:canvas_height - 1,
					step:1,
					name:'y'
				}
			]
			scope.svg_space = new SvgSpace(canvas_id, domains, canvas_width, canvas_height)
			scope.svg_factory = new SvgFactory(scope.svg_space)
		}
		// if (! scope._svg)
		// {
		// 	console.log(context + ':func_draw_get_scope:create scope')
		// 	scope._svg = SVG(canvas_id).size(300, 200)
		// 	scope._shapes = []
		// }
		return scope
	}
	return undefined
}
