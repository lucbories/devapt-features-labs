import llang from '../../../bower_components/llang/index'

function fact(x)
{
	if (x <= 0)
	{
		return 0
	}
	if (x > 100)
	{
		return 0
	}

	var i, result=1
	for(i = 1; i<=x ; i++)
	{
		result = result * i
	}
	return result
}

function choose(n,k)
{
	return fact(n) / ( fact(k)*fact(n-k) )
}

export default {
	feat1:{
		const456:456,
		propositional_calculus:function(scope, formula_str, values) {
			return llang.evaluate(formula_str, values)
		},
		pascal_fact:function(scope, x) { return fact(x) },
		pascal_triangle:function(scope, lines)
		{
			if (lines < 2)
			{
				lines = 2
			}
			if (lines > 10)
			{
				lines = 10
			}
			
			/*
				(n,k) = n!/k!(n-k)!
				
							(0,0)
							1
						(1,0)	(1,1)
						1		1
					(2,0)	(2,1)	(2,2)
					1		2		1
				(3,0)	(3,1)	(3,2)	(3,3)
				1		3		3		1
				...
			*/
			var triangle = [[1], [1, 1]]
			var line = undefined
			var n = 2, k = 0
			for( ; n <= lines ; n++)
			{
				line = [1]
				for(k=1 ; k < n ; k++)
				{
					line.push( choose(n,k) )
				}
				line.push(1)
				triangle.push(line)
			}
			return triangle
		}
	}
}
