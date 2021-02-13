import { FormaBase } from './utils.js'

const Trapezio = (cor,translate,rot,rotStep) => {

    const build = (gl) => FormaBase(
          [
            -3.0, -1.0 , 0.0,
             3.0,  -1.0, 0.0,
             2.0,  1.0, 0.0,
            -2.0,  1.0, 0.0,
          ],
          cor,4,3,4,gl.TRIANGLE_FAN,translate,rot,rotStep
    )

    return build
}

export default Trapezio
