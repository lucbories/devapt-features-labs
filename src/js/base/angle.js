
// NPM IMPORTS

// DEVAPT CORE COMMON IMPORTS
import T from 'devapt-core-common/dist/js/utils/types'

// DEVAPT CORE BROWSER IMPORTS

// PLUGIN IMPORTS


const plugin_name = 'Labs' 
const context = plugin_name + '/drawing/angle'

const DEFAULT_ANGLE_UNIT = 'degree'
const DEFAULT_ANGLE_VALUE = 0


/**
 * @file Angle class.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 * 
 * @example
 * 	API
 * 		->unit():string - get angle unit.
 * 		->value(v, unit):Angle - set angle value.
 * 
 */
export default class Angle
{
	/**
	 * Create an instance of Vector.
	 * 
	 * @returns {nothing}
	 */
	constructor(value, unit)
	{
		this.is_drawing_angle = true

		this._unit = undefined
		this._value = undefined

		this._set_value(value, unit)
	}


	unit(unit)
	{
		if (unit)
		{
			this._set_unit(unit)
			return this
		}

		return this._unit
	}


	value(value)
	{
		if (value)
		{
			this._set_value(value)
			return this
		}

		return this._value
	}


	_set_unit(unit)
	{
		if ( ! T.isString(unit) )
		{
			unit = DEFAULT_ANGLE_UNIT
		}

		switch( unit.toLocalLowerCase() ) {
			case 'deg':
			case 'degree':
				this._update_value(this._unit, 'degree')
				this._unit = 'degree'
				break
			case 'rad':
			case 'radian':
				this._update_value(this._unit, 'radian')
				this._unit = 'radian'
				break
		}
	}


	_set_value(value)
	{
		if ( T.isNumber(value) )
		{
			this._value = value
			return
		}

		if ( T.isString(value) )
		{
			switch(value) {
				case 'PI':
					this._value = Math.PI
					break
				case '2PI':
					this._value = 2 * Math.PI
					break
				case '3PI':
					this._value = 3 * Math.PI
					break
				case '4PI':
					this._value = 4 * Math.PI
					break
				case '2xPI':
					this._value = 2 * Math.PI
					break
				case '3xPI':
					this._value = 3 * Math.PI
					break
				case '4xPI':
					this._value = 4 * Math.PI
					break
				case 'PI/2':
					this._value = Math.PI / 2
					break
				case 'PI/3':
					this._value = Math.PI / 3
					break
				case 'PI/4':
					this._value = Math.PI / 4
					break
				case 'PI/5':
					this._value = Math.PI / 5
					break
				case 'PI/6':
					this._value = Math.PI / 6
					break
				case 'PI/7':
					this._value = Math.PI / 7
					break
				case 'PI/8':
					this._value = Math.PI / 8
					break
				case 'PI/9':
					this._value = Math.PI / 9
					break
				case 'PI/10':
					this._value = Math.PI / 10
					break
				case 'PI/11':
					this._value = Math.PI / 11
					break
				case 'PI/12':
					this._value = Math.PI / 1
					break
			}
		}
	}


	_update_value(old_unit, new_unit)
	{
		if ( ! T.isString(old_unit) || ! T.isString (new_unit) )
		{
			return
		}

		if (old_unit == new_unit)
		{
			return
		}

		switch(new_unit) {
			case 'degree':
				if (old_unit == 'radian')
				{
					this._value = 180 * this._value / Math.PI
				}
				break
			case 'radian':
				if (old_unit == 'degree')
				{
					this._value = Math.PI * this._value / 180
				}
				break
		}
	}
}
