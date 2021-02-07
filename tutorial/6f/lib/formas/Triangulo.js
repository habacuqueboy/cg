import { FormaBase } from './utils.js'

const Triangulo = (cor,translate,rot,rotAxis,rotStep) => {

    const build = (gl) => FormaBase(
          [
            0.0, 1.0, 0.0,
           -1.0,-1.0, 0.0,
            1.0,-1.0, 0.0,
          ],
          cor,4,3,3,gl.TRIANGLES,translate,rot,rotAxis,rotStep
    )

    return build
}

export default Triangulo
