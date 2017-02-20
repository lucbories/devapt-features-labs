// NPM IMPORTS
import assert from 'assert'
const Devapt = require('devapt').default
const T = Devapt.T
const Component = Devapt.Component

// BROWSER IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/math_pretty'



export default class MathPretty extends Component
{
	/**
	 * Create an instance of MathPretty.
	 * @extends Component
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

		this.is_terminal_mathjs_plot = true
		
		this.add_assets_dependancy('js-mathjs')
		this.add_assets_dependancy('js-katex')
		// this.add_assets_dependancy('css-katex')

		// this.enable_trace()
	}



	load()
	{
		super.load()

		this.get_assets_promise()
		.then(
			()=>{
				window.math.config(
					{
						number: 'number',
						precision: 20
					}
				)
				const expr = this.get_state_value('expression', undefined)
				if ( T.isNotEmptyString(expr) )
				{
					console.log(context + ':%s:load:expression=[%s]', this.get_name(), expr)
					this.transform(expr)
				}
			}
		)
	}
	


	/**
	 * Process a math expression string and render a pretty math output.
	 * 
	 * @param {string} arg_expression - math expression string.
	 * 
	 * @returns {nothing}
	 */
	process(arg_operands)
	{
		// console.log(context + ':%s:process:opds=', this.get_name(), arg_operands)
		
		let expr = this.get_state_value('expression', undefined)
		let prefix = this.get_state_value('prefix', undefined)
		let suffix = this.get_state_value('suffix', undefined)

		// GET VALUES FROM OPERANDS
		if ( T.isNotEmptyString(arg_operands.expr_input_id) )
		{
			// console.log(context + ':%s:process:input id=', this.get_name(), arg_operands.expr_input_id)
			const input_jqo = $('#' + arg_operands.expr_input_id)

			expr = input_jqo && input_jqo.length > 0 ? input_jqo.val() : undefined
		}
		if ( T.isNotEmptyString(arg_operands.prefix) )
		{
			// console.log(context + ':%s:process:prefix=', this.get_name(), arg_operands.prefix)
			prefix = arg_operands.prefix
		}
		if ( T.isNotEmptyString(arg_operands.suffix) )
		{
			// console.log(context + ':%s:process:suffix=', this.get_name(), arg_operands.suffix)
			suffix = arg_operands.suffix
		}

		if ( T.isNotEmptyString(expr) )
		{
			// console.log(context + ':%s:process:expression=[%s]', this.get_name(), expr)
			this.transform_math(expr, prefix, suffix)
		}
	}

	


	/**
	 * Process a tex/latex expression string and render a pretty output.
	 * 
	 * @param {string} arg_expression - math expression string.
	 * 
	 * @returns {nothing}
	 */
	transform(arg_expression, arg_latex_prefix='', arg_latex_suffix='')
	{
		console.log(context + ':%s:transform:expr=[%s],prefix=[%s],suffix=[%s]', this.get_name(), arg_expression, arg_latex_prefix, arg_latex_suffix)
		

		// GET LATEX OUTPUT
		let latex = arg_latex_prefix + arg_expression + arg_latex_suffix
		try {
			const pretty_elem = this.get_dom_element()
			
			window.katex.render(latex, pretty_elem)
		}
		catch (err) {
			console.warn(context + ':transform:latex: for ' + this.get_name() + ':error=[' + err.toString() + '] latex=[%s] parsed node=', latex, parsed_node)
			return
		}
	}

	


	/**
	 * Process a math expression string and render a pretty math output.
	 * 
	 * @param {string} arg_expression - math expression string.
	 * 
	 * @returns {nothing}
	 */
	transform_math(arg_expression, arg_latex_prefix='', arg_latex_suffix='')
	{
		console.log(context + ':%s:transform:expr=[%s],prefix=[%s],suffix=[%s]', this.get_name(), arg_expression, arg_latex_prefix, arg_latex_suffix)
		
		// CHECK MATH LIBRARY
		if ( ! window.math || ! window.math.parser )
		{
			console.warn(context + ':transform: for ' + this.get_name() + ':no math parser')
			return
		}

		// GET OPTION FOR PARENTHESIS: KEEP / AUTO / ALL
		const parenthesis_state = this.get_state_value('parenthesis', 'keep')
		const parenthesis = ['keep', 'auto', 'all'].indexOf(parenthesis_state) > -1 ? parenthesis_state : 'keep'

		// GET OPTION FOR MULTIPLICATION: HIDE / SHOW
		const implicit_mult_state = this.get_state_value('parenthesis', 'hide')
		const implicit_mult = ['hide', 'show'].indexOf(implicit_mult_state) > -1 ? implicit_mult_state : 'hide'

		// PARSE EXPRESSION
		let parsed_node = undefined
		try {
			parsed_node = window.math.parse(arg_expression)
		}
		catch (err) {
			console.warn(context + ':transform_math:parse: for ' + this.get_name() + ':error=[' + err.toString() + '] expr=[%s] parsed node=', arg_expression, parsed_node)
			return
		}

		// GET LATEX OUTPUT
		
		let latex = undefined
		try {
			latex = parsed_node ? parsed_node.toTex({parenthesis: parenthesis, implicit: implicit_mult}) : ''
			
			this.transform(latex, arg_latex_prefix, arg_latex_suffix)
		}
		catch (err) {
			console.warn(context + ':transform_math:latex: for ' + this.get_name() + ':error=[' + err.toString() + '] latex=[%s] parsed node=', latex, parsed_node)
			return
		}
	}
}
