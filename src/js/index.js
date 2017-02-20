import RenderingPlugin from './rendering_plugin'

const has_window = new Function('try {return this===window;}catch(e){ return false;}')

const plugin_name = 'Foundation-6'

const on_dom_loaded = function(arg_callback)
{ 
	if (document.readyState != 'loading')
	{
		console.log(plugin_name + ':document is loaded')
		arg_callback()
	} else {
		console.log(plugin_name + ':document is not loaded')

		// Mozilla, Opera, Webkit, IE9+
		if (document.addEventListener)
		{
			document.addEventListener('DOMContentLoaded', arg_callback, false)
		}
	}
}

if (has_window())
{
	const register_cb = ()=>{
		console.log(plugin_name + ':register_cb:check if devapt is loaded')

		if (window && window.devapt)
		{
			const devapt = window.devapt()
			if (devapt && devapt.ui)
			{
				console.log(plugin_name + ':register_cb:registering')
				window.devapt().ui().register_rendering_plugin(RenderingPlugin)
				return
			}
		}

		setTimeout(register_cb, 100)
	}

	on_dom_loaded(register_cb)
}

export default RenderingPlugin