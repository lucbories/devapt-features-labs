
const plugin_name = 'Labs'
const EXPR_FEATURE_NAME = 'expression'
const EXPR_FEATURE_FUNC_NAME = 'func_expression'
const context = plugin_name + '/' + EXPR_FEATURE_NAME + '/' + EXPR_FEATURE_FUNC_NAME


/**
 * Expression feature.
 * Request string is:
 *   - itemname = itemtype(args)
 * 
 * @param {FeaturedTerminal} arg_terminal_feature - featured terminal.
 * @param {object}		     arg_request  - request object.
 * 
 * @returns {object} - response { id, result:{ value:any, str:string, error:string|null } }.
 * 
 * @example
 *   >c1=circle(45, 20, 12)
 *   >c1=circle(p0 , 12)
 *   >c1=circle(p0 , c2.radius)
 *   >p0=Point(45, 20)
 *   >p0=Point(45, 20, red, cross)
 *   >p0=Point(45, 20, blue, circle)
 *   >p0=Point(45, 20, blue, disk)
 *   >circle(50, 50, 20)
 * 
 */


// REGISTER
if (! window.devapt().func_features)
{
	window.devapt().func_features = {}
}
window.devapt().func_features[EXPR_FEATURE_FUNC_NAME] = func_expr_process



/**
 * Process request.
 * @private
 */
function func_expr_process(arg_scope, arg_expr_str='')
{
	const result = {
		expr:arg_expr_str,
		scope:arg_scope,
		errors:[],
		value:undefined,
		exception:undefined
	}
	const jsep = window.jsep
	const parse_tree = jsep( arg_expr_str)

	try {
		result.value = func_expr_eval(arg_scope, parse_tree, result.errors)
	}
	catch(e) {
		result.exception = e
	}

	return result
}



/**
 * Process request.
 * @private
 */
function func_expr_eval(arg_scope={}, arg_expr_tree={ type:undefined}, arg_errors=[] )
{
	const context = 'func_expr_eval:'

	// console.log('func_expr_eval:scope=', arg_scope)
	// console.log('func_expr_eval:arg_expr_tree=', arg_expr_tree)
	// console.log('func_expr_eval:arg_errors=', arg_errors)

	switch(arg_expr_tree.type) {
		case 'Literal':             return arg_expr_tree.value
		case 'Identifier':          return arg_expr_tree.name
		case 'BinaryExpression':{
			try{
				const op = arg_expr_tree.operator
				const left_tree   = arg_expr_tree.left
				const right_tree  = arg_expr_tree.right
				const left_value  = func_expr_eval(arg_scope, left_tree, arg_errors)
				const right_value = func_expr_eval(arg_scope, right_tree, arg_errors)
				switch(op){
					case '+': return left_value + right_value
					case '-': return left_value - right_value
					case '*': return left_value * right_value
					case '/': return left_value / right_value
				}
			} catch(e){
				arg_errors.push('BinaryExpression:failure [' + e + '] for op=' + op + ' left=[' + left_value + '] right=[' + right_value + ']')
				return undefined
			}
		}
		case 'UnnaryExpression':{
			try{
				const op = arg_expr_tree.operator
				const left_tree   = arg_expr_tree.left
				const left_value  = func_expr_eval(arg_scope, left_tree, arg_errors)
				switch(op){
					case '+': return left_value
					case '-': return - left_value
					case '!': return ! left_value
				}
			} catch(e){
				arg_errors.push('UnaryExpression:failure [' + e + '] for op=' + op + ' left=[' + left_value + ']')
				return undefined
			}
		}
		case 'MemberExpression': {
			const obj_name = func_expr_eval(arg_scope, arg_expr_tree.object)
			const att_name = func_expr_eval(arg_scope, arg_expr_tree.property)
			if (! obj_name || ! att_name)
			{
				arg_errors.push('MemberExpression:bad object/attribute name')
				return undefined
			}
			const obj = arg_scope[obj_name]
			if (! obj)
			{
				arg_errors.push('MemberExpression:object not found in scope or bad object:[' + obj_name + ']')
				return undefined
			}
			if (att_name.length > 0 && att_name[0] == '_')
			{
				arg_errors.push('MemberExpression:object method is private:[' + obj_name + '].[' + att_name + ']')
				return undefined
			}
			if (! (att_name in obj) )
			{
				arg_errors.push('MemberExpression:attribute not found')
				return undefined
			}
			return obj[att_name]
		}
		case 'CallExpression':{
			const callee = arg_expr_tree.callee
			const opds = arg_expr_tree.arguments
			// console.log('func_expr_eval:CallExpression:opds=', opds)

			// EVAL OPERANDS
			const opds_results = []
			if (opds && opds.length > 0)
			{
				opds.forEach(
					(opd, index)=>{
						// console.log('func_expr_eval:CallExpression:opd=', opd)
						const opd_result = func_expr_eval(arg_scope, opd, arg_errors)
						// console.log('func_expr_eval:CallExpression:opd_result=', opd_result)
						opds_results.push(opd_result)
					}
				)
			}
			// console.log(context + 'CallExpression:opds_results=', opds_results)

			// EVAL FUNCTION
			if (callee.type == 'Identifier')
			{
				const func_name = callee.name
				const func_call = arg_scope[func_name]
				if (! func_call)
				{
					arg_errors.push('CallExpression:function not found in scope or bad function:[' + func_name + ']')
					return undefined
				}

				if (opds_results.length == 0)
				{
					// console.log(context + 'CallExpression:func_call=', func_call)
					return func_call(null)
				}
				
				// console.log(context + 'CallExpression:func_call=', func_call, opds_results)
				return func_call.call(null, ...opds_results)
			}

			// EVAL METHOD
			if (callee.type == 'MemberExpression')
			{
				const object_name = callee.object.name
				const method_name = callee.property.name

				if (method_name.length > 0 && method_name[0] == '_')
				{
					arg_errors.push('CallExpression:object method is private:[' + object_name + '].[' + method_name + ']')
					return undefined
				}
				const object_instance = arg_scope[object_name]
				if (! object_instance)
				{
					arg_errors.push('CallExpression:method object not found in scope or bad object:[' + object_name + ']')
					return undefined
				}

				// const object_method = object_instance[method_name] || object_instance.prototype[method_name]
				const object_method = object_instance.get_method(method_name)
				if (! object_method)
				{
					arg_errors.push('CallExpression:method not found in object or bad method:[' + object_name + '].[' + method_name + ']')
					return undefined
				}

				if (opds_results.length == 0)
				{
					return object_method.apply(object_instance)
				}
				
				// const operands = [object_instance].concat(opds_results)
				// return object_method.apply(...operands)
				return object_method.apply(object_instance, opds_results)
				// switch(opds_results.length) {
				// 	case 0: return object_instance.prototype[object_method]()
				// 	case 1: return object_instance.prototype[object_method](opds_results[0])
				// 	case 2: return object_instance.prototype[object_method](opds_results[0],opds_results[1])
				// }
				// return object_instance[object_method](...opds_results)
			}
		}
	}

	return undefined
}
