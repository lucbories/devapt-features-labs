
/*


https://dzone.com/articles/scala-calculating-distance-between-two-locations

class DistanceCalculatorImpl extends DistanceCalcular {
    private val AVERAGE_RADIUS_OF_EARTH_KM = 6371
    override def calculateDistanceInKilometer(userLocation: Location, warehouseLocation: Location): Int = {
        val latDistance = Math.toRadians(userLocation.lat - warehouseLocation.lat)
        val lngDistance = Math.toRadians(userLocation.lon - warehouseLocation.lon)
        val sinLat = Math.sin(latDistance / 2)
        val sinLng = Math.sin(lngDistance / 2)
        val a = sinLat * sinLat +
        (Math.cos(Math.toRadians(userLocation.lat)) *
            Math.cos(Math.toRadians(warehouseLocation.lat)) *
            sinLng * sinLng)
        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        
		(AVERAGE_RADIUS_OF_EARTH_KM * c).toInt
    }
}
new DistanceCalculatorImpl().calculateDistanceInKilometer(Location(10, 20), Location(40, 20))
=>3335
http://www.nhc.noaa.gov/gccalc.shtml


Law of Haversines
\operatorname {hav} (c)=\operatorname {hav} (a-b)+\sin(a)\sin(b)\,\operatorname {hav} (C).

Haversine Formula
For any two points on a sphere, the haversine of the central angle between them is given by:

{\displaystyle \operatorname {hav} \left({\frac {d}{r}}\right)=\operatorname {hav} (\varphi _{2}-\varphi _{1})+\cos(\varphi _{1})\cos(\varphi _{2})\operatorname {hav} (\lambda _{2}-\lambda _{1})}
Where

hav is the haversine function: 
\operatorname {hav} (\theta )=\sin ^{2}\left({\frac {\theta }{2}}\right)={\frac {1-\cos(\theta )}{2}}
d is the distance between the two points (along a great circle of the sphere; see spherical distance).
r is the radius of the sphere.
φ1, φ2: latitude of point 1 and latitude of point 2, in radians.
λ1, λ2: longitude of point 1 and longitude of point 2, in radians.
*/


var AVERAGE_RADIUS_OF_EARTH_KM = 6371

function func_to_radians(scope, angle)
{
	return (angle / 180.0) * Math.PI
}

function func_distance(scope, lat1, lng1, lat2, lng2)
{
	var lat_dist = func_to_radians(scope, lat1 - lat2)
	var lng_dist = func_to_radians(scope, lng1 - lng2)

	var sin_lat = Math.sin(lat_dist / 2)
	var sin_lng = Math.sin(lng_dist / 2)

	var a = sin_lat * sin_lat + ( Math.cos( func_to_radians(scope, lat1)) * Math.cos( func_to_radians(scope, lat2) ) * sin_lng * sin_lng)
	var c = 2* Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) )

	// DEBUG
	// console.log('lat1', lat1, 'lat2', lat2)
	// console.log('lng1', lng1, 'lng2', lng2)
	// console.log('lat_dist', lat_dist)
	// console.log('lng_dist', lng_dist)
	// console.log('sin_lat', sin_lat)
	// console.log('sin_lng', sin_lng)
	// console.log('a', a)
	// console.log('c', c)

	return AVERAGE_RADIUS_OF_EARTH_KM * c
}

export default {
	geom:{
		distance:func_distance,
		to_radians:func_to_radians
	}
}
