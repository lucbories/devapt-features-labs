
const plugin_name = 'Labs'
const DRAW_FEATURE_NAME = 'draw'
const DRAW_FEATURE_FUNC_NAME = 'func_draw_factory'
const context = plugin_name + '/' + DRAW_FEATURE_NAME + '/' + DRAW_FEATURE_FUNC_NAME

require("@babel/polyfill")



// REGISTER
if (! window.devapt().func_features)
{
	window.devapt().func_features = {}
}
window.devapt().func_features[DRAW_FEATURE_FUNC_NAME] = func_draw_factory



/**
 * Create a drawable instance.
 * 
 * @param {object} arg_shapes_map    - mapping shape type/alias / shape factory type name.
 * @param {object} arg_assign_name   - shape name.
 * @param {object} arg_session_scope - factory scope.
 * @param {string} arg_shape_type    - shape type.
 * @param {Space} arg_space          - Space instance.
 * 
 * @returns {object} - factory result : { error:null, message:string, value:Drawable, is_shape_factory_result:true }
 */
function func_draw_factory(arg_terminal_feature, arg_shapes_map, arg_assign_name, arg_session_scope, arg_shape_type, arg_space)
{
	if (! arg_session_scope)
	{
		return 'func_draw_factory:scope not found'
	}

	const svg_space = arg_session_scope.get_private_item('svg_space')
	if (! svg_space)
	{
		return 'func_draw_factory:scope svg space not found'
	}

	const svg_factory = arg_session_scope.get_private_item('svg_factory')
	if (! svg_factory)
	{
		return 'func_draw_factory:scope svg factory not found'
	}

	return (opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)=>{

		if (opd1 && ('' + opd1).substr(0, 8) == '##NAME##')
		{
			arg_assign_name = ('' + opd1).substr(8)
			opd1 = opd2
			opd2 = opd3
			opd3 = opd4
			opd4 = opd5
			opd5 = opd6
			opd6 = opd7
			opd7 = opd8
			opd8 = opd9
			opd9 = opd10
			opd10 = undefined
		}
		console.log('func_draw_factory:name=[%s] type=[%s] opd1=[%s],opd2=[%s],opd3=[%s],opd4=[%s],opd5=[%s],opd6=[%s],opd7=[%s],opd8=[%s],opd9=[%s],opd=10[%s]', arg_assign_name, arg_shape_type, opd1, opd2, opd3, opd4, opd5, opd6, opd7, opd8, opd9, opd10)

		let factory_result = {
			is_shape_factory_result:true,
			error:null,
			message:'draw:' + arg_shape_type + ' opd1=' + opd1 + ' opd2=' + opd2 + ' opd3=' + opd3 + ' opd4=' + opd4 + ' opd5=' + opd5 + ' opd6=' + opd6,
			value:null
		}

		switch(arg_shape_type) {
			case 'space':
				const domains_array = []
				if ( Array.isArray(opd6) )
				{
					opd6.forEach(
						(domain)=>{
							if ( Array.isArray(domain) && domain.length == 4 )
							{
								const domain_object = {
									start:domain[0],
									end:domain[1],
									step:domain[2],
									name:domain[3]
								}
								domains_array.push(domain_object)
							}
						}
					)
				}
				svg_factory.create({ type:'space', space:arg_space, name:arg_assign_name, position:[opd1, opd2], width:opd3, height:opd4, color:opd5, domains:domains_array })
				const space = svg_factory.get(arg_assign_name)
				Object.keys(arg_shapes_map).forEach(
					(shape_alias)=>{
						space[shape_alias] = func_draw_factory(arg_terminal_feature, arg_shapes_map, arg_assign_name, arg_session_scope, arg_shapes_map[shape_alias], space)
						space.add_method(shape_alias)
					}
				)
				break
			case 'plotf':
				// GET EVAL FUNCTION
				const eval_feature_name = 'mathjs'
				const eval_feature = arg_terminal_feature.get_terminal().get_feature(eval_feature_name)
				if (! eval_feature)
				{
					factory_result.error = 'eval feature not found for [' + eval_feature_name + ']'
					return factory_result
				}
				async function eval_promise_fn(arg_eval_expr, arg_eval_scope)
				{
					const value = await eval_feature.eval(arg_eval_expr, arg_eval_scope)
					return value
				}

				// GET PLOT CONFIG
				let plot_cfg_fn = undefined
				const plot_type = opd1 ? opd1 : undefined
				const plot_expr = opd2 ? opd2 : undefined
				if ( ! plot_type || ! plot_expr )
				{
					factory_result.error = 'bad plot expression, use "fx=3*x+5" for example'
					return factory_result
				}

				// SWITCH ON PLOT TYPE
				switch(plot_type)
				{
					case 'fx':
						const domain_x = arg_space.domain_x()
						const start = domain_x ? new Number(domain_x.start()) : undefined
						const step  = domain_x ? new Number(domain_x.step())  : undefined
						const end   = domain_x ? new Number(domain_x.end())   : undefined
						if (! start || ! step || ! end || Number.isNaN(start) || Number.isNaN(step) || Number.isNaN(end) )
						{
							factory_result.error = 'x domain not found or bad domain attributes in current space'
							return factory_result
						}
						const steps_count = (end - start) / (step > 0 ? step : 10)
						plot_cfg_fn = (arg_scope)=>{
							const all_scope = Object.assign({}, arg_scope)
							return {
								loops_count:steps_count,
								scope:(arg_scope ? arg_scope : arg_session_scope),
								fstep:(arg_step, arg_scope)=>{
									const position_x = start + arg_step * step
									all_scope.x = position_x
									const position_y = eval_promise_fn(plot_expr, all_scope)
									const position_array = [position_x, position_y]
									return position_array
								}
							}
						}
						break
					default:
						factory_result.error = 'unknow plot type [' + plot_type +'], choose one in [fx]'
						return factory_result
				}

				svg_factory.create({ type:'plotf', space:arg_space, name:arg_assign_name, position:[0, 0], plot_fn:plot_cfg_fn, color:opd3, render:opd4, size:opd5 })
				break
			case 'circle':
				svg_factory.create({ type:'circle', space:arg_space, name:arg_assign_name, position:[opd1, opd2], radius:opd3, color:opd4 })
				break
			case 'rect':
			case 'rectangle':
				svg_factory.create({ type:'rect', space:arg_space, name:arg_assign_name, position:[opd1, opd2], width:opd3, height:opd4, color:opd5 })
				break
			case 'square':
				svg_factory.create({ type:'rect', space:arg_space, name:arg_assign_name, position:[opd1, opd2], width:opd3, height:opd3, color:opd4 })
				break
			case 'point':
				svg_factory.create({ type:'point', space:arg_space, name:arg_assign_name, position:[opd1, opd2], color:opd3, render:opd4, size:opd5 })
				break
			case 'line':
				svg_factory.create({ type:'line', space:arg_space, name:arg_assign_name, position:[opd1, opd2], position_end:[opd3, opd4], color:opd5, width:opd6 })
				break
			case 'axis':
				svg_factory.create({ type:'axis', space:arg_space, name:arg_assign_name, position:[opd1, opd2], domain:opd3, color:opd4, width:opd5 })
				break
			case 'grid':
				svg_factory.create({ type:'grid', space:arg_space, name:arg_assign_name, position:[opd1, opd2], width:opd3, height:opd4, color:opd5 })
				break
			case 'polygon':
				svg_factory.create({ type:'polygon', space:arg_space, name:arg_assign_name, position:[opd1, opd2], color:opd3, edges:opd4, radius:opd5 })
				break
			case 'star':
				svg_factory.create({ type:'star', space:arg_space, name:arg_assign_name, position:[opd1, opd2], color:opd3, spikes:opd4, inner:opd5, outer:opd6 })
				break
		}
		
		factory_result.value = svg_factory.get(arg_assign_name)
		return factory_result
	}
}
