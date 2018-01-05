
const plugin_name = 'Labs'
const DRAW_FEATURE_NAME = 'help'
const DRAW_FEATURE_FUNC_NAME = 'func_help'
const context = plugin_name + '/' + DRAW_FEATURE_NAME + '/' + DRAW_FEATURE_FUNC_NAME


/**
 * Admin feature.
 * 
 * @param {FeaturedTerminal} arg_terminal_feature - featured terminal.
 * @param {object}           arg_request  - request object.
 * 
 * @returns {object} - response { id, result:{ value:any, str:string, error:string|null } }.
 */
 const func_help = (arg_terminal_feature, arg_request)=>{

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
        func_help_process_request(arg_terminal_feature, request_str, response)
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
window.devapt().func_features[DRAW_FEATURE_FUNC_NAME] = func_help



/**
 * Process request.
 * @private
 */
function func_help_process_request(arg_terminal_feature, arg_request_str='', arg_response)
{
    var parts = arg_request_str ? arg_request_str.split(' ') : []
    if ( ! Array.isArray(parts) || parts.length == 0 )
    {
        arg_response.error = 'bad request string'
        return arg_response
    }

    var cmd = parts[0]
    const opd1 = parts.length > 1 ? parts[1] : undefined
    const opd2 = parts.length > 2 ? parts[2] : undefined
    const opd3 = parts.length > 3 ? parts[3] : undefined
    switch( cmd.toLocaleLowerCase() ) {
        case 'li':
        case 'list': {
            func_help_cmd_list(arg_terminal_feature, arg_response, cmd, opd1, opd2, opd3)
            return arg_response
        }

        case '?': {
            func_help_cmd_help(arg_terminal_feature, arg_response, cmd, opd1, opd2, opd3)
            return arg_response
        }

        case 'al':
        case 'aliases': {
            func_help_cmd_aliases(arg_terminal_feature, arg_response, cmd, opd1, opd2, opd3)
            return arg_response
        }
    }

    arg_response.error = 'unknow command :[' + cmd + ']'
    return arg_response
}



/**
 * Function of the List command.
 * @private
 * 
 * @param {object} arg_response 
 * @param {string} cmd 
 * @param {any}    opd1 
 * @param {any}    opd2 
 * @param {any}    opd3 
 * 
 * @returns {nothing}
 */
function func_help_cmd_list(arg_terminal_feature, arg_response, cmd, opd1, opd2, opd3)
{
    arg_response.result.value = []
    if ( arg_terminal_feature && arg_terminal_feature.is_terminal_feature && arg_terminal_feature._terminal)
    {
        arg_response.result.value = Object.keys( arg_terminal_feature._terminal.get_features() )
        arg_response.result.str = arg_response.result.value.toString()
    }
}



/**
 * Function of the Help command.
 * @private
 * 
 * @param {object} arg_response 
 * @param {string} cmd 
 * @param {any}    opd1 
 * @param {any}    opd2 
 * @param {any}    opd3 
 * 
 * @returns {nothing}
 */
function func_help_cmd_help(arg_terminal_feature, arg_response, cmd, opd1, opd2, opd3)
{
    arg_response.result.value = []
    if ( arg_terminal_feature && arg_terminal_feature.is_terminal_feature && arg_terminal_feature._terminal)
    {
        const features = arg_terminal_feature._terminal.get_features()
        const aliases = arg_terminal_feature._terminal.get_aliases()

        // SEARCH FEATURE NAME
        let feature_name = arg_terminal_feature._terminal.get_mode()
        let topic = undefined
        if (opd1 in features)
        {
            feature_name = opd1
            topic = opd2
        }
        else if (opd1 in aliases)
        {
            feature_name = aliases[opd].get_name()
            topic = opd2
        }
        if (! feature_name)
        {
            arg_response.result.value = features
            arg_response.result.str = 'type help feature with features is one of [' + features.join(',') + ']'
            arg_response.result.error = undefined
            return arg_response
        }

        // GET FEATURE INSTANCE
        const feature = (feature_name in features) ? features[feature_name] : undefined
        if (! feature)
        {
            arg_response.result.error = 'no feature found [' + feature_name + '] for command :[' + cmd + ']'
            return arg_response
        }

        // GET FEATURE COMMAND
        if (topic)
        {
            const command = feature.get_command(topic)
            if (command)
            {
                arg_response.result.value =  command
                arg_response.result.str =  func_help_format_command(command)
                return arg_response
            }
        }

        // GET COMMANDS
        const commands = feature.get_commands()
        arg_response.result.value =  commands
        arg_response.result.str =  func_help_format_commands(commands)
    }
}



function func_help_format_commands(arg_commands)
{
    let str = ''
    let cmd = undefined
    let examples = undefined
    let usage = undefined
    Object.keys(arg_commands).forEach(
        (cmd_name)=>{
            cmd = arg_commands[cmd_name]
            examples = (cmd.examples ? cmd.examples.toString() : '-')
            usage = (cmd.usage ? cmd.usage : examples)
            str += '[' + cmd_name.padEnd(15) + ']: usage:' + usage + '\n'
        }
    )
    return str
}



function func_help_format_command(arg_command)
{
    let str = 'Command [' + arg_command.name + ']\n'
    str += '  domain: ' + (arg_command.domain ? arg_command.domain : 'no domain') + '\n'
    str += '  usage: ' + arg_command.usage + '\n'
    str += '  description: ' + arg_command.description + '\n'
    str += '  operands: \n'
    if ( arg_command.operands && arg_command.operands.length > 0 )
    {
        const opds = arg_command.operands
        opds.forEach(
            (opd, index)=>{
                str += '    ' + index + ':' + opd.name + ' of type ' + opd.type + '\n'
            }
        )
    }
    str += '  returns: ' + arg_command.returns + '\n'
    str += '  examples:\n'
    if ( arg_command.examples && arg_command.examples.length > 0 )
    {
        const examples = arg_command.examples
        examples.forEach(
            (example, index)=>{
                str += '    ' + example.command + ' => ' + example.result + '\n'
                if ( example.description && example.description.length > 0 )
                {
                    str += '  decsription:' + example.description + '\n'
                }
                str += '____________________________________\n'
            }
        )
    }
    
    return str
}



/**
 * Function of the Aliases command.
 * @private
 * 
 * @param {object} arg_response 
 * @param {string} cmd 
 * @param {any}    opd1 
 * @param {any}    opd2 
 * @param {any}    opd3 
 * 
 * @returns {nothing}
 */
function func_help_cmd_aliases(arg_terminal_feature, arg_response, cmd, opd1, opd2, opd3)
{
    arg_response.result.value = []
    if ( arg_terminal_feature && arg_terminal_feature.is_terminal_feature && arg_terminal_feature._terminal)
    {
        const features = arg_terminal_feature._terminal.get_features()

        const feature_name = opd1 ? opd1 : arg_terminal_feature._terminal.get_mode()
        if (! feature_name)
        {
            arg_response.result.error = 'no selected feature for command :[' + cmd + ']'
            return arg_response
        }

        const feature = (feature_name in features) ? features[feature_name] : undefined
        if (! feature)
        {
            arg_response.result.error = 'no feature [' + feature_name + '] for command :[' + cmd + ']'
            return arg_response
        }

        const aliases = feature.get_aliases()
        console.log(context + ':eval aliases=', aliases)

        // arg_response.result.value = JSON.stringify(aliases)
        arg_response.result.value = aliases
        arg_response.result.str = func_help_format_aliases(aliases)
    }
}

function func_help_format_aliases(arg_aliases)
{
    let str = ''
    arg_aliases.forEach(
        (alias)=>{
            str += alias + '\n'
        }
    )
    return str
}