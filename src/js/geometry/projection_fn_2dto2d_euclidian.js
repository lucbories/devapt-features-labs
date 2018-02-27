
// PLUGIN IMPORT
import PixelPoint from '../base/pixelpoint'



/*
    Mapping explanation:
    
    range_start	range_end	pixel_width		ratio	pixel_start	pixel_end	pixel_range_0	pixel_range_50
    0			99			1000			10		0			1000		0				500
    50			100			1000			20		0			1000		-1000			0
    -50			50			1000			10		0			1000		500				1000

*/
/**
 * Project a position to a plan through a line.
 * @param {GeoPoint} arg_position - position point instance.
 * @param {GeoSpace} arg_space    - contextual space.
 * @param {Gepla} arg_plan        - target plan.
 * @param {GeoLine} arg_direction - projection line.
 * 
 * @returns {PixelPoint}
 */
const project_2dto2d_euclide=(arg_position, arg_space, arg_plan, arg_direction)=>{
    
    const h1 = range_to_screen_h(arg_position.x(), arg_space)
    const v1 = range_to_screen_v(arg_position.y(), arg_space)
 
    return new PixelPoint(h1, v1)
}



function range_to_screen_h(arg_position_x, arg_space, arg_default=0, arg_from_zero=false)
{
    const domaine_x = arg_space.domain_x()
    if (! domaine_x) return arg_default

    /*
        Mapping of x between A and B into h between C and D:
            h = (x-A)*|CD|/|AB| + C
    */
    const c = 0 // done with arg_space.pixelbox().get_boxed_h(h, true)
    const ab = Math.abs(domaine_x.end() - domaine_x.start()) + (domaine_x.start() <= 0 ? 1 : 0)
    const cd = arg_space.pixelbox()._usable_width
    const x_a = arg_position_x - (arg_from_zero ? 0 : domaine_x.start())
    const h = x_a * cd / ab + c

    console.log('project_2dto2d_euclide:range_to_screen_h:x=[%d] c=[%d] ab=[%d] cd=[%d] x_a=[%d] h=[%d]', arg_position_x, c, ab, cd, x_a, h)

    return h
}



function range_to_screen_v(arg_position_y, arg_space, arg_default=0, arg_from_zero=false)
{
    const domaine_y = arg_space.domain_y()
    if (! domaine_y) return arg_default

    /*
        Mapping of y between A and B into v between C and D:
            v = (y-A)*|CD|/|AB| + C
    */
    const c = 0 // done with arg_space.pixelbox().get_boxed_v(v, true)
    const ab = Math.abs(domaine_y.end() - domaine_y.start()) + (domaine_y.start() <= 0 ? 1 : 0)
    const cd = arg_space.pixelbox()._usable_height
    const y_a = arg_position_y - (arg_from_zero ? 0 :domaine_y.start())
    const v = y_a * cd / ab + c

    console.log('project_2dto2d_euclide:range_to_screen_v:y=[%d] c=[%d] ab=[%d] cd=[%d] y_a=[%d] v=[%d]', arg_position_y, c, ab, cd, y_a, v)

    return v
}


export default project_2dto2d_euclide
