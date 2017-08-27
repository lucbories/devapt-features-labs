# Devapt - Features - Labs

## Space

A space is a drawing context for canvas and physics engines.

A space is defined with an array of dimensions domains and a drawing zone definition:
For exampe, this settings define a 2 dimensions space with an
```js
{
	"drawing":{
		"horizontal":{
			"pixels":500
		},
		"vertical":{
			"pixels":500
		}
	},
	"domains":[
		{
			"name":"x",
			"start":1,
			"end":100,
			"step":1
		},
		{
			"name":"y",
			"start":1,
			"end":100,
			"step":1
		}
	],
	"projection":{}
}
```
